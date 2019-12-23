import Vue from 'vue'
import Router from 'vue-router'
import my from './my'
import classify from './classify'
import home from './home'
import yaji from './yaji'
import detail from './detail'
import order from './order'
import setting from './setting'
import Cart from './cart'
import Appointment from './appointment'
import NotFound from '../views/404.vue'
import DoubleTwelveDay from './double-twelve-day'
import Live from './live'
import Activity from './activity'
import Newcomers from './newcomers'
import InviteNewcomers from './invitenewcomers'
import roadlearning from './roadlearning'
import NewYear from './new-year.js'
const NetError = require('../views/Net-Error.vue')
Vue.use(Router)
/**
 * vue-router新版本给push和replace方法新增了回调（Promise）
 * 有时会有错误抛出，但是并不会影响正常跳转
 * 为了能避免错误的打印，以下式vue-router作者给出的解决方案
 * 同时，在这里可以拦截push和replace方法，为自定义路由参数提供了无限的可能性
 * 例如：下面就是为每次路由跳转提供了一个noCache的参数，值为时间戳，以防止微信的缓存和CDN缓存
 * 由于noCache是可选的，所有有没有都不影响路由的正常访问
 */
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
Router.prototype.push = function push (location, onResolve, onReject) {
  if (typeof location === 'object') {
    if (location.query) {
      location.query.noCache = Date.now()
    } else {
      Object.assign(location, {
        query: {
          noCache: Date.now()
        }
      })
    }
  }
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Router.prototype.replace = function replace (location, onResolve, onReject) {
  if (typeof location === 'object') {
    if (location.params) {
      location.params.noCache = Date.now()
    } else {
      Object.assign(location, {
        params: {
          noCache: Date.now()
        }
      })
    }
  }
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
/**
 * ！！！！！！！！！注意！！！！！！！！！！
 * 不要使用from作为query的key，因为为了处理微信分享功能，query中的from将会被无条件删除！
 * 除此之外，还有一下参数不能使用：
 * isappinstalled
 */
export const routes = [
  {
    path: '/',
    redirect: `/home/${Date.now()}`
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面未找到'
    }
  },
  {
    path: '/net-error',
    name: 'NetError',
    components: NetError,
    meta: {
      title: '无网络'
    }
  }
]
const allRoutes = [
  ...routes,
  ...home,
  ...my,
  ...classify,
  ...yaji,
  ...detail,
  ...order,
  ...setting,
  ...Cart,
  ...Appointment,
  ...DoubleTwelveDay,
  ...Live,
  ...Activity,
  ...Newcomers,
  ...InviteNewcomers,
  ...roadlearning,
  ...NewYear
]
// 为每个路由配置可选参数noCache
// for (let route of allRoutes) {
//   const paths = route.path.split('/')
//   if (!paths[0]) {
//     // route.path += '/:noCache?'
//   }
// }

export const router = new Router({
  mode: 'history',
  base: window.location.pathname.split('/')[1] || '',
  routes: allRoutes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
