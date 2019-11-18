import JsSHE from '../../../../static/lib/crypto'
import { getJSApi } from '../../../apis/base-api'
import { isIOS } from '../util'
// import Cookies from 'js-cookie'
// import qs from 'qs'
const WX = window.wx
// let timer = 0

export default async function share ({ appId, title, desc, imgUrl, link, willHide }) {
  let { result: jsApi } = await getJSApi(appId) // 每次分享时，获取js-api
  // clearInterval(timer)
  return new Promise((resolve, reject) => {
    const config = getConfig(jsApi, appId)
    WX.config(config)
    WX.ready(function () {
      setWechatShare(title, desc, imgUrl, link, willHide)
      resolve('wechat config: ok!')
    })
    WX.error(function (res) {
      reject(res)
    })
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
 * 获取jsapis
 * @param appId {string}
 * @return {Promise<*|string>}
 */
// async function getJsApi (appId) {
//   let jsApi = Cookies.get('jsApi') || ''
//   if (!jsApi) {
//     jsApi = await getJSApi(appId) // 每次分享时，获取js-api
//     Cookies.set('jsApi', jsApi.result, {
//       expires: new Date(Date.now() + 1800000) //  jsapi 缓存30分钟
//     })
//   }
//   return jsApi
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
      // 'menuItem:share:appMessage', // 发送给朋友
      // 'menuItem:share:timeline', // 分享到朋友圈
      ...willHide // 以上是默认隐藏的按钮
    ]
  })
  // 分享到朋友圈
  WX.updateTimelineShareData({
    title: `${title} ${desc}`, // 分享标题
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl + '?x-oss-process=style/thum', // 分享图标
    success: () => {
      console.warn('配置”分享到朋友圈“成功！')
    }
  })
  // 分享给朋友
  WX.updateAppMessageShareData({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl + '?x-oss-process=style/thum', // 分享图标
    success: () => {
      console.warn('配置”分享到朋友“成功！')
    }
  })
}
/**
 * 生成微信分享配置对象
 * @param jsapi {string}
 * @param appId {string}
 * @return {{debug: boolean, jsApiList: string[], signature: *, appId: *, nonceStr: *, timestamp: number}}
 */
function getConfig (jsapi, appId) {
  let nonceStr = randomString()
  let timestamp = Number.parseInt(Date.now() / 1000)
  let url = (isIOS() && window.initialUrl) ? window.initialUrl : location.href
  // let url = location.href
  // let url = disposeUrl()
  let sign = `jsapi_ticket=${jsapi}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
  let signature = new JsSHE(sign, 'TEXT').getHash('SHA-1', 'HEX')
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
  let randomStr = []
  for (let i = 0; i < 16; i++) {
    let index = Number.parseInt(Math.random() * 62)
    randomStr.push(LIB[index])
  }
  return randomStr.join('')
}
