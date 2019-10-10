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
const NetError = require('../views/Net-Error.vue')
Vue.use(Router)
export const routes = [
  {
    path: '/',
    redirect: '/home'
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
export const router = new Router({
  mode: 'history',
  base: window.location.pathname.split('/')[1] || '',
  routes: [
    ...routes,
    ...home,
    ...my,
    ...classify,
    ...yaji,
    ...detail,
    ...order,
    ...setting,
    ...Cart,
    ...Appointment
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
