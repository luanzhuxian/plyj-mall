import { router } from '../../router'
import { isIOS } from './util'
import store from '../../store'

// 小金库相关页面，非helper不能访问
// const notAllowedCoffer = [
//   'Coffers',
//   'WithdrawCash',
//   'WithdrawCashSuccess',
//   'WithdrawList',
//   'WithdrawDetail',
//   'AccumulatedRebate',
//   'RebateList'
// ]
const map = {
    InviteNewcomers: '/yx/',
    Newcomers: '/newcomers/',
    LiveRoom: '/lived/room',
    Product: '/detail/product/'
}

export const beforeEach = function (to, from, next) {
    if (!isIOS()) return next()
    if (!~Object.keys(map).indexOf(to.name)) return next()

    // 苹果手机部分页面分享处理
    const { pathname } = location
    const mallUrl = pathname.split('/')[1]
    for (const [key, val] of Object.entries(map)) {
        if (to.name !== key) continue
        if (!pathname.includes(val)) {
            location.assign(`/${ mallUrl }${ to.fullPath }`)
        } else {
            next()
        }
        break
    }
}
export const beforeResolve = function (to, from, next) {
    next()
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
