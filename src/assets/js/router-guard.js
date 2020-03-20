import { router } from '../../router'
import store from '../../store'
import share from '../js/wechat/wechat-share'
const customShare = [
    'Product',
    'Curriculum',
    'LiveRoom',
    'InviteNewcomers',
    'Newcomers'
]
const shareRoutes = [
    'Home',
    'Classify',
    'My',
    'Appointment',
    'DoubleTwelveDay',
    'Activity',
    'BattlefieldReport',
    'EpidemicSignIn'
]
const setShare = async to => {
    const {
        appid,
        mallName,
        mallDomain,
        mallDesc,
        logoUrl
    } = store.state.mallInfo
    const fullUrl = `${ location.origin }/${ mallDomain }${ to.fullPath }`
    if (to.name && customShare.indexOf(to.name) === -1) {
        // 如果不是商品详情页面，采用其他分享策略
        let willHide = []
        if (shareRoutes.indexOf(to.name) === -1) {
            console.warn('禁止分享')
            willHide = ['menuItem:share:appMessage', 'menuItem:share:timeline']
        } else {
            console.warn('默认分享')
        }
        if (appid) {
            try {
                await share({
                    appId: appid,
                    title: `${ mallName }-${ to.meta.title }`,
                    desc: mallDesc,
                    link: fullUrl,
                    imgUrl: logoUrl || 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5CU6yfkSWRHJcwP0BibLpr75V8Qc8bpjmP6FfSto1Mrog/0',
                    willHide
                })
            } catch (e) {
                // 分享配置错误的时候尝试重新配置，重试3次，如果不行就自动放弃
                const REPEAT_SHARE_COUNT = Number(sessionStorage.getItem('REPEAT_SHARE_COUNT'))
                if (REPEAT_SHARE_COUNT > 0) {
                    sessionStorage.setItem('REPEAT_SHARE_COUNT', '0')
                    return
                }
                sessionStorage.setItem('REPEAT_SHARE_COUNT', REPEAT_SHARE_COUNT + 1)
                location.assign(fullUrl)
            }
        }
    }
}

export const beforeEach = function (to, from, next) {
    next()
}
export const beforeResolve = async function (to, from, next) {
    await next()
    setShare(to)
    if (to.name === 'Home') {
        document.title = sessionStorage.getItem('mallName') || to.meta.title
    } else {
        document.title = to.meta.title || store.state.mallInfo.mallName
    }
}
export const afterEach = function (to, from) {}

// 路由导航出错时的回调
export const onError = function (err) {
    console.error(err)
    if (!navigator.onLine) {
        router.push({ name: 'NetError' })
    }
}
