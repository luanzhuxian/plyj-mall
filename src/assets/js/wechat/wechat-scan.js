import JsSHE from '../../../../static/lib/crypto'
import { getJSApi } from '../../../apis/base-api'
export default async function scan () {
    try {
        const { result: jsapi } = await getJSApi()
        const nonceStr = randomString()
        const timestamp = Number.parseInt(new Date().getTime() / 1000)
        const sign = `jsapi_ticket=${ jsapi }&noncestr=${ nonceStr }&timestamp=${ timestamp }&url=${ location.href }`
        const signature = new JsSHE(sign, 'TEXT').getHash('SHA-1', 'HEX')
        const config = {
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            // 必填，公众号的唯一标识(这里使用demo校的appid，因为域名是一样的)
            appId: 'wx1e1748c68e794b4a',
            // 必填，生成签名的时间戳
            timestamp,
            // 必填，生成签名的随机串
            nonceStr,
            // 必填，签名
            signature,
            // 必填，需要使用的JS接口列表
            jsApiList: [
                'scanQRCode'
            ]
        }
        window.wx.config(config)
        window.wx.ready(() => {
            console.warn('wechat config: ok!')
        })
        window.wx.error(err => {
            console.error(err)
        })
    } catch (e) {

    }
}

/**
 * 生成随机字符串
 * @param null
 * @return {string}
 * */
// eslint-disable-next-line func-style
function randomString () {
    // 48~57 数字， 65~90 大写，  97~122 小写
    const LIB = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    const randomStr = []
    for (let i = 0; i < 16; i++) {
        const index = Number.parseInt(Math.random() * 62)
        randomStr.push(LIB[index])
    }
    return randomStr.join('')
}
