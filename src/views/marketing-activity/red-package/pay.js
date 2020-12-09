// 福利红包下单
import {
    submitOrder,
    cancleOrderListByBatchNumber
} from '../../../apis/order-manager'
import { requestPayData, pay } from '../../../assets/js/wechat/submit-order'

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
export const wechatPay = async function (CREDENTIAL) {
    // const firstOrder = orderIds[0]
    try {
        if (CREDENTIAL.appId) {
            await pay(CREDENTIAL)
            // this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount } })
        } else {
            // 免费红包 无需支付
            return true
        }
    } catch (error) {
        throw error
    }
}
// 提交福利红包订单，换取批次号
export const submitRedPackageOrder = async ({ activityId, count, helper, userAddress = null }) => {
    let orderBatchNumber = ''
    try {
        const data = {
            source: 9,
            activityId,
            helper,
            userAddress,
            skus: [
                {
                    goodsId: activityId,
                    goodsType: 'RED_ENVELOPE',
                    sku1: activityId,
                    count
                }
            ]
        }
        const { result } = await submitOrder(data)
        orderBatchNumber = result
        const payData = await requestPayData(orderBatchNumber)
        await wechatPay(payData)
    } catch (error) {
        if (orderBatchNumber) handlepayError(orderBatchNumber)
        throw error
    }
}
