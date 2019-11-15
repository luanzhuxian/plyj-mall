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
export const beforeEach = function (to, from, next) {
  // console.log('beforeEach', location.href)
  // next()
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
}
// 路由导航出错时的回调
export const onError = function (err) {
  console.error(err)
  if (!navigator.onLine) {
    router.push({ name: 'NetError' })
  }
}
