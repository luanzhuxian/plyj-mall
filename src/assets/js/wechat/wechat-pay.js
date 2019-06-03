// 微信支付方法
export default function wechatPay ({ appId, timeStamp, nonceStr, packageValue, paySign }) {
  return new Promise((resolve, reject) => {
    try {
      if (window.WeixinJSBridge) {
        window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            appId: appId, // 公众号名称，由商户传入
            timeStamp: timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr: nonceStr, // 随机串
            package: packageValue, //
            signType: 'MD5', // 微信签名方式:
            paySign: paySign // 微信签名
          }, function (res) {
            if (res.err_msg.indexOf('ok') > -1) {
              // 支付成功, 由于后端要等待微信服务器的成功回调，导致后端成功回调晚于前端，所以前端延迟执行
              setTimeout(() => {
                resolve('ok')
              }, 600)
            } else if (res.err_msg.indexOf('cancel') > -1) {
              reject(new Error('取消支付'))
            } else if (res.err_msg.indexOf('fail') > -1) {
              console.dir(res)
              reject(new Error('支付失败: ' + res.err_msg))
            }
          })
      } else {
        reject(new Error('请使用微信浏览器支付'))
      }
    } catch (e) {
      reject(new Error('支付发生错误'))
    }
  })
}
