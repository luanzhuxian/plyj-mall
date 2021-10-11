/* eslint-disable */
import JsSHE from '../../../../static/lib/crypto'
import { getJSApi } from '../../../apis/base-api'
import { isIOS } from '../util'

/**
 *  当IOS用户第一次进入页面的时候，把当前页面URL存储起来
 *  之后所有的微信签名都用这个URL去计算
 *  页面刷新的时候要使用replace方法重置这个缓存的链接
 *  安卓还按照正常逻辑计算签名，即每个页面都用当前URL获取一次签名
 */
if (isIOS()) {
    if (sessionStorage.getItem('IOS_FIRST_ENTRY_PAGE')) {
        sessionStorage.removeItem('IOS_FIRST_ENTRY_PAGE')
        location.replace(location.href)
    } else {
        sessionStorage.setItem('IOS_FIRST_ENTRY_PAGE', location.href)
    }
}

const WX = window.wx
const baseHideMenuItems = [
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
    'menuItem:setFont'
]

export const hideMenuItems = (willHide = []) => {
    const menuList = [
        ...baseHideMenuItems,
        ...willHide
    ]
    WX.hideMenuItems({
        menuList
    })
    return menuList
}

/**
 * 生成微信分享配置对象
 * @param jsapi {string}
 * @param appId {string}
 * @param link {string}
 * @return {{debug: boolean, jsApiList: string[], signature: *, appId: *, nonceStr: *, timestamp: number}}
 */
async function getConfig (appId, link) {
    const { result: jsapi } = await getJSApi(appId) // 每次分享时，获取js-api
    const nonceStr = randomString()
    const timestamp = Number.parseInt(Date.now() / 1000)
    link = isIOS() ? sessionStorage.getItem('IOS_FIRST_ENTRY_PAGE') : link
    console.log('href-1: ', link)
    const sign = `jsapi_ticket=${ jsapi }&noncestr=${ nonceStr }&timestamp=${ timestamp }&url=${ link }`
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
    return (Math.random() * 10e17).toString(16)
}

export const wxConfig = async (appId, link) => {
    const config = await getConfig(appId, link)
    return new Promise((resolve, reject) => {
        WX.config(config)
        WX.ready(function () {
            resolve(true)
            console.warn('分享配置成功')
        })
        WX.error(async function (err) {
            reject(err)
            console.warn('分享配置失败')
            console.warn(err)
        })
    })
}

export const share = async ({ appId, title, desc, imgUrl, link = location.href, willHide }) => {
    try {
        await wxConfig(appId, link)
        willHide = !title ? ['menuItem:share:appMessage', 'menuItem:share:timeline'] : willHide
        const hidden = hideMenuItems(willHide)
        // 分享至好友
        if (!hidden.includes('menuItem:share:appMessage')) {
            WX.updateAppMessageShareData({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: `${ imgUrl }?x-oss-process=style/thum`, // 分享图标
                success: function () {
                    console.warn('配置”分享到朋友“成功！')
                },
                fail: function (err) {
                    console.warn(err)
                }
            })
        }
        if (!hidden.includes('menuItem:share:timeline')) {
            // 分享至朋友圈
            WX.updateTimelineShareData({
                title: `${ title }-${ desc }`, // 分享标题
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: `${ imgUrl }?x-oss-process=style/thum`, // 分享图标
                success: function () {
                    console.warn('配置”分享到朋友圈“成功！')
                },
                fail: function (err) {
                    console.warn(err)
                }
            })
        }
    } catch (e) {
    }
}
