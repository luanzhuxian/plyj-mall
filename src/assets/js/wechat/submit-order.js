import { getOrderPayData } from '../../../apis/order-manager'
import wechatPay from '../wechat/wechat-pay'
import { setTimeoutSync } from '../util'

export const pay = async CREDENTIAL => {
    await wechatPay(CREDENTIAL)
}
export const requestPayData = async orderBatchNumber => {
    let payData = null
    let requestPayDataCount = 0
    while (!payData && requestPayDataCount < 20) {
        console.warn('第%d次支付请求', requestPayDataCount + 1)
        await setTimeoutSync(500)
        const { result } = await getOrderPayData(orderBatchNumber)
        payData = result
        requestPayDataCount++
    }
    if (payData) return payData
    throw new Error('支付失败')
}
