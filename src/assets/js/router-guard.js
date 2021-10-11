import { router } from '../../router'
import store from '../../store'
import Qs from 'qs'

export const beforeEach = function (to, from, next) {
    next()
}
export const beforeResolve = async function (to, from, next) {
    if (to.query.code) {
        delete to.query.code
        const search = Qs.stringify(to.query)
        if (search) {
            return next(`${ to.path }?${ search }`)
        }
        return next(to.path)
    }
    await next()
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
