import JsSHE from '../../../../static/lib/crypto'
import { getJSApi } from '../../../apis/base-api'
const WX = window.wx
/* eslint-disable */
export default async function scan ({ appId }) {
    try {
        console.log(11111)
        const { result: jsApi } = await getJSApi(appId)
        console.log(2222)
        const nonceStr = randomString()
        console.log(3333)
        const timestamp = Number.parseInt(new Date().getTime() / 1000)
        console.log(4444)
        const sign = `jsapi_ticket=${ jsApi }&noncestr=${ nonceStr }&timestamp=${ timestamp }&url=${ location.href }`
        const signature = new JsSHE(sign, 'TEXT').getHash('SHA-1', 'HEX')
        console.log(5555)
        const config = {
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            // 必填，公众号的唯一标识
            appId,
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
        console.log(6666)
        WX.config(config)
        WX.ready(() => {
            console.warn('扫描配置成功')
        })
        WX.error(err => {
            console.warn('扫描配置失败')
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
