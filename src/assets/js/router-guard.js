import { router } from '../../router'
import store from '../../store'
import share from '../js/wechat/wechat-share'
import qs from 'qs'
// 自定义微信分享，需要自己在页面配置分享信息
const customShare = [
    'Product',
    'Curriculum',
    'LiveRoom',
    'InviteNewcomers',
    'Newcomers',
    'Classify',
    'CoursePackage',
    'SpringPloughing',
    'HappyLottery'
]
// 采取默认分享的路由，不需要自己配置分享信息，会拉取当前商城的一些信息
const shareRoutes = [
    'Home',
    'My',
    'Appointment',
    'DoubleTwelveDay',
    'Activity',
    'BattlefieldReport',
    'EpidemicSignIn',
    'LongmenLottery',
    'LongmenAction',
    'LongmenSignIn',
    'RedPackage',
    'RedPackageDetail'
]
const setShare = to => {
    // const fullUrl = `${ location.origin }/${ mallDomain }${ to.fullPath }`
    // console.log(location.href)
    // console.log(appid)
    // console.log(mallName)
    // console.log(mallDesc)
    // console.log(logoUrl)
    // console.log(fullUrl)
    if (to.name && customShare.indexOf(to.name) === -1) {
        // 如果不是商品详情页面，采用其他分享策略
        if (shareRoutes.indexOf(to.name) === -1) {
            window.wx.hideOptionMenu()
            console.warn('禁止分享')
        } else {
            window.wx.showOptionMenu()
            console.warn('默认分享')
        }
        const {
            appId,
            mallName,
            mallDesc,
            logoUrl
        } = store.state.mallInfo
        if (appId) {
            share({
                appId,
                title: `${ mallName }-${ to.meta.title }`,
                desc: mallDesc,
                imgUrl: logoUrl || 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5CU6yfkSWRHJcwP0BibLpr75V8Qc8bpjmP6FfSto1Mrog/0'
            })
        } else {
            setTimeout(() => {
                setShare(to)
            }, 500)
        }
    } else {
        window.wx.showOptionMenu()
    }
}

export const beforeEach = function (to, from, next) {
    next()
}
export const beforeResolve = async function (to, from, next) {
    if (to.query.code) {
        delete to.query.code
        const search = qs.stringify(to.query)
        if (search) {
            return next(`${ to.path }?${ search }`)
        }
        return next(to.path)
    }
    await next()
    setShare(to)
    if (to.name === 'Home') {
        document.title = sessionStorage.getItem('mallName') || to.meta.title
    } else {
        document.title = to.meta.title || store.state.mallInfo.mallName
    }
    if (window.WeixinJSBridge) {
        window.WeixinJSBridge.call('hideToolbar')
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
