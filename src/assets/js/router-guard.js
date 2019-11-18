import { router } from '../../router'
// import store from '../../store'
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
// const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
// const map = {
//   InviteNewcomers: '/yx/',
//   Newcomers: '/newcomers/',
//   LiveRoom: '/lived/room',
//   Lesson: '/detail/lesson/'
// }

export const beforeEach = function (to, from, next) {
  // console.log('beforeEach', location.pathname, to)
  // if (!isIOS) return next()
  // if (!~Object.keys(map).indexOf(to.name)) return next()
  // const { pathname } = location
  // const mallUrl = pathname.split('/')[1]
  // for (let [key, val] of Object.entries(map)) {
  //   if (to.name !== key) continue
  //   if (!pathname.includes(val)) {
  //     location.assign(`/${mallUrl}${to.fullPath}`)
  //   } else {
  next()
  //   }
  //   break
  // }
}
export const beforeResolve = function (to, from, next) {
  // console.log(store.getters.agentUser)
  // if (!store.getters.agentUser && notAllowedCoffer.indexOf(to.name) > -1) {
  //   next({
  //     path: '/'
  //   })
  // } else {
  next()
  // }
  if (to.name === 'Home') {
    document.title = sessionStorage.getItem('mallName') || to.meta.title
  } else {
    document.title = to.meta.title
  }
}
export const afterEach = function (to, from) {
  // console.log('afterEach', location.pathname, to)
}
// 路由导航出错时的回调
export const onError = function (err) {
  console.error(err)
  if (!navigator.onLine) {
    router.push({ name: 'NetError' })
  }
}
