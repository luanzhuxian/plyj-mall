import { router } from '../../router'
import store from '../../store'
const notAllowedCoffer = [
  'Coffers',
  'WithdrawCash',
  'WithdrawCashSuccess',
  'WithdrawList',
  'WithdrawDetail',
  'AccumulatedRebate',
  'RebateList'
]
export const beforeEach = function (to, from, next) {
}
export const beforeResolve = function (to, from, next) {
  if (!store.getters.agentUser && notAllowedCoffer.indexOf(to.name) > -1) {
    next({
      path: '/'
    })
  } else {
    next()
  }
  console.log()
  document.title = to.meta.title
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
