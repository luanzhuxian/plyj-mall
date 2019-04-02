import { router } from '../../router'
export const beforeEach = function (to, from, next) {
  next()
  document.title = to.meta.title
}
export const beforeResolve = function (to, from, next) {
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
