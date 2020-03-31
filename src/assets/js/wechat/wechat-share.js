import JsSHE from '../../../../static/lib/crypto'
import { getJSApi } from '../../../apis/base-api'
// import { isIOS } from '../util'
/* eslint-disable */
// import qs from 'qs'
const WX = window.wx

export default async function share ({ appId, title, desc, imgUrl, link = location.href, willHide }) {
    const { result: jsApi } = await getJSApi(appId) // 每次分享时，获取js-api
    willHide = !title ? ['menuItem:share:appMessage', 'menuItem:share:timeline'] : willHide
    const config = getConfig(jsApi, appId)
    WX.config(config)
    WX.ready(() => {
        setWechatShare(title, desc, imgUrl, link, willHide)
        console.warn('分享配置成功')
    })
    WX.error(res => {
        console.warn('分享配置失败')
        console.error(res)
    })

}

/**
 * 处理url，删除微信加的参数
 * @return {string}
 */
// function disposeUrl () {
//   let href = location.href
//   let query = href.split('?')[1]
//   let { protocol, host, pathname } = location
//   let newUrl = ''
//   let hasWeixin = false
//   query = qs.parse(query)
//   if (query.hasOwnProperty('from') || query.hasOwnProperty('isappinstalled')) {
//     delete query.isappinstalled
//     delete query.from
//     hasWeixin = true
//   }
//   query = qs.stringify(query)
//   if (query) {
//     newUrl = `${protocol}//${host}${pathname}?${query}`
//   } else {
//     newUrl = `${protocol}//${host}${pathname}`
//   }
//   // 如果微信加了自己参数，重新设置浏览器历史记录
//   if (hasWeixin) {
//     history.replaceState({}, document.title, newUrl)
//   }
//   return newUrl
// }

/**
 * 生成微信分享
 * @param title
 * @param desc
 * @param imgUrl
 * @param link
 * @param willHide
 */
function setWechatShare (title, desc, imgUrl, link, willHide = []) {
    // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
    WX.hideMenuItems({
        menuList: [
            'menuItem:editTag',
            'menuItem:delete',
            'menuItem:originPage',
            'menuItem:readMode',
            'menuItem:openWithQQBrowser',
            'menuItem:share:email',
            'menuItem:openWithSafari',
            'menuItem:share:qq',
            'menuItem:share:facebook',
            'menuItem:share:QZone',
            'menuItem:share:weiboApp',
            'menuItem:share:facebook',
            'menuItem:share:QZone',
            'menuItem:favorite',
            'menuItem:setFont',
            ...willHide // 以上是默认隐藏的按钮
        ]
    })

    // 分享到朋友圈
    if (!~willHide.indexOf('menuItem:share:timeline')) {
        WX.updateTimelineShareData({
            title: `${ title } (${ desc })`, // 分享标题
            link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${ imgUrl }?x-oss-process=style/thum`, // 分享图标
            success: () => {
                console.warn('配置”分享到朋友圈“成功！')
            }
        })
    }

    // 分享给朋友
    if (!~willHide.indexOf('menuItem:share:appMessage')) {
        WX.updateAppMessageShareData({
            title, // 分享标题
            desc, // 分享描述
            link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${ imgUrl }?x-oss-process=style/thum`, // 分享图标
            success: () => {
                console.warn('配置”分享到朋友“成功！')
            }
        })
    }
}

/**
 * 生成微信分享配置对象
 * @param jsapi {string}
 * @param appId {string}
 * @return {{debug: boolean, jsApiList: string[], signature: *, appId: *, nonceStr: *, timestamp: number}}
 */
function getConfig (jsapi, appId) {
    const nonceStr = randomString()
    const timestamp = Number.parseInt(Date.now() / 1000)
    const sign = `jsapi_ticket=${ jsapi }&noncestr=${ nonceStr }&timestamp=${ timestamp }&url=${ location.href }`
    const signature = new JsSHE(sign, 'TEXT').getHash('SHA-1', 'HEX')
    return {
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'showMenuItems',
            'hideOptionMenu',
            'showOptionMenu',
            'hideMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'updateAppMessageShareData',
            'updateTimelineShareData'
        ] // 必填，需要使用的JS接口列表
    }
}

// 生成随机字符串
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
