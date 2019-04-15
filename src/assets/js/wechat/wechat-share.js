import JsSHE from '../../../../static/lib/crypto'
import { getJSApi } from '../../../apis/base-api'
import { DelayExec } from '../../../assets/js/util'
const WX = window.wx
let delay = new DelayExec(200)
export default async function share ({ appId, title, desc, imgUrl, link, willHide }) {
  await delay.exec() // 延迟执行，节流执行频率，使频率不能高于每秒5次
  let jsApi = await getJSApi(appId) // 每次分享时，获取js-api
  const config = getConfig(jsApi.result, appId, link)
  WX.config(config)
  return new Promise((resolve, reject) => {
    WX.ready(function () {
      setWechatShare(title, desc, imgUrl, link, willHide)
      resolve('wechat config: ok!')
    })
    WX.error(function (res) {
      reject(res)
    })
  })
}

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
  WX.onMenuShareTimeline({
    title: `${title} ${desc}`, // 分享标题
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success: () => {
      console.warn('分享到朋友圈成功')
    }
  })
  // 分享给朋友
  WX.onMenuShareAppMessage({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    type: 'link',
    dataUrl: '',
    success: () => {
      console.warn('分享到朋友成功')
    }
  })
}
/* 生成微信分享配置对象 */
function getConfig (jsapi, appId, link) {
  let nonceStr = randomString()
  let timestamp = Number.parseInt(new Date().getTime() / 1000)
  let sign = `jsapi_ticket=${jsapi}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${link}`
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
      'showAllNonBaseMenuItem'
    ] // 必填，需要使用的JS接口列表
  }
}
// 生成随机字符串
function randomString () {
  // 48~57 数字， 65~90 大写，  97~122 小写
  const LIB = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  let randomStr = []
  for (let i = 0; i < 16; i++) {
    let index = Number.parseInt(Math.random() * 62)
    randomStr.push(LIB[index])
  }
  return randomStr.join('')
}
