import store from '../../../store'
// 微信支付方法
export default function wechatPay ({ appId, timeStamp, nonceStr, packageValue, paySign, signType }) {
    return new Promise((resolve, reject) => {
        if (store.getters.forbiddenPay) {
            reject(new ResponseError(JSON.stringify({ message: `支付失败` })))
            return
        }
        try {
            if (window.WeixinJSBridge) {
                window.WeixinJSBridge.invoke('getBrandWCPayRequest', {
                    // 公众号名称，由商户传入
                    appId,
                    // 时间戳，自1970年以来的秒数
                    timeStamp,
                    // 随机串
                    nonceStr,
                    package: packageValue,
                    // 微信签名方式:
                    signType,
                    // 微信签名
                    paySign
                }, res => {
                    if (res.err_msg.indexOf('ok') > -1) {
                        // 支付成功, 由于后端要等待微信服务器的成功回调，导致后端成功回调晚于前端，所以前端延迟执行
                        setTimeout(() => {
                            resolve('ok')
                        }, 1000)
                    } else if (res.err_msg.indexOf('cancel') > -1) {
                        reject(new Error('取消支付'))
                    } else if (res.err_msg.indexOf('fail') > -1) {
                        reject(new ResponseError(JSON.stringify({ message: `支付失败: ${ res.err_msg }` })))
                    }
                })
            } else {
                reject(new ResponseError(JSON.stringify({ message: '请使用微信浏览器支付' })))
            }
        } catch (e) {
            reject(new ResponseError(JSON.stringify({ message: '支付发生错误' })))
        }
    })
}
class ResponseError extends Error {
    constructor (message) {
        super(message)
        this.message = message
        this.name = 'ResponseError'
    }
}
