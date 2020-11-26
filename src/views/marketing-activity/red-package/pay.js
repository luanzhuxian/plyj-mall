import {
    submitOrder,
    getOrderPayData,
    cancleOrderListByBatchNumber
} from '../../../apis/order-manager'
import { setTimeoutSync } from '../../../assets/js/util'
import wechatPay from '../../../assets/js/wechat/wechat-pay'

// 获取微信支付数据递归次数
let requestPayDataCount = 0

/**
 * 处理支付失败的场景
 * @param {string} orderBatchNumber 支付批次号，支付失败时用来关闭此次订单
 * @returns {Promise<*>}
 */
const handlepayError = async function (orderBatchNumber) {
    try {
        // 只有普通 实体/虚拟/正式课/体验课 + 非活动状态 才可二次支付不必关闭订单，其他支付失败直接关闭订单
        await cancleOrderListByBatchNumber(orderBatchNumber)
    } catch (error) {
        throw error
    }
}

/**
 * 支付
 * @param {object} CREDENTIAL 支付数据
 * @param {array} orderIds 订单Id
 * @param {number} orderCount 订单数量
 * @param {string} orderBatchNumber 支付批次号，支付失败时用来关闭此次订单
 * @param {number} totalAmount 总价格
 * @returns {Promise<*>}
 */
export const pay = async function (CREDENTIAL, orderIds, orderCount, orderBatchNumber, totalAmount) {
    // const firstOrder = orderIds[0]
    try {
        if (CREDENTIAL.appId) {
            return await wechatPay(CREDENTIAL)
            // this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount } })
        } else if (totalAmount === 0) {
            // 免费红包 无需支付
            return true
            // this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount } })
        }
        throw new Error('支付失败')
    } catch (error) {
        await handlepayError(orderBatchNumber)
        throw error
    }
}

/**
 * 获取微信支付数据，用批次号换取支付加密数据
 * @param {string} orderBatchNumber 支付批次号，支付失败时用来关闭此次订单
 * @returns {Promise<*>}
 */
const requestPayData = async function (orderBatchNumber) {
    try {
        // 每500ms请求一次支付数据，如果请求次数超过20次，就终止请求
        // 下次请求的开始时间 =  500ms + 当前请求时间
        if (requestPayDataCount >= 20) {
            requestPayDataCount = 0
            throw new Error('支付失败')
        }
        await setTimeoutSync(500)
        // 如果没有拿到请求数据，再次尝试发起请求
        // 如果有，则发起支付
        const { result: payData } = await getOrderPayData(orderBatchNumber)
        if (!payData) {
            requestPayDataCount++
            return await requestPayData(orderBatchNumber)
        }
        requestPayDataCount = 0
        return {
            payData,
            orderBatchNumber
        }
        // return await pay(payData, payData.orderIds, payData.orderIds.length, orderBatchNumber)
    } catch (error) {
        requestPayDataCount = 0
        await handlepayError(orderBatchNumber)
        throw error
    }
}

// 提交福利红包订单，换取批次号
export const submit = async function (activityId, count) {
    try {
        const data = {
            source: 9,
            activityId,
            skus: [
                {
                    goodsId: activityId,
                    goodsType: 'RED_ENVELOPE',
                    sku1: activityId,
                    count
                }
            ]
        }
        const { result: orderBatchNumber } = await submitOrder(data)
        return await requestPayData(orderBatchNumber)
    } catch (error) {
        throw error
    }
}
