<template>
  <div id="app">
    <keep-alive :exclude="exclude">
      <router-view v-if="logined" />
    </keep-alive>

    <navbar v-if="showNavbar.indexOf(routeName) > -1" />
    <QuickNavbar v-else />
  </div>
</template>

<script>
import Navbar from './components/common/Navbar.vue'
import QuickNavbar from './components/common/Quick-Navbar.vue'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { SET_THEME, USER_INFO, GET_MALL_INFO, LOGIN, CHECK_ACTIVITY_AUTH, GET_SKIN_ID } from './store/mutation-type'
import share from './assets/js/wechat/wechat-share'
import { isIOS } from './assets/js/util'
import qs from 'qs'
import Cookie from './assets/js/storage-cookie'
export default {
  components: {
    Navbar,
    QuickNavbar
  },
  data () {
    return {
      logined: false,
      routeName: '',
      exclude: [
        'ShoppingCart',
        'LiveRoom'
      ],
      showNavbar: [
        'Home',
        'My',
        'ShoppingCart',
        'Classify',
        'WhatsHelper',
        'Activity',
        'InviteNewcomers'
      ],
      // 允许分享和复制链接的页面 (除了这个和自定义分享，其他页面隐藏分享和复制链接)
      shareRoutes: [
        'Home',
        'Classify',
        'My',
        'Appointment',
        'DoubleTwelveDay',
        'Activity'
      ],
      // 需要自定义分享的页面（分享配置在页面组件内实现）
      customShare: [
        'Lesson',
        'LiveRoom',
        'InviteNewcomers',
        'Newcomers'
      ]
    }
  },
  computed: {
    ...mapGetters(['userId', 'openId', 'appId', 'mallName', 'mallDesc', 'logoUrl'])
  },
  watch: {
    $route: {
      handler (route) {
        this.routeName = route.name
        if (isIOS() && route.name && !window.initialUrl) {
          window.initialUrl = disposeUrl()
        }
        if (route.name && this.customShare.indexOf(route.name) === -1) {
          console.log('默认分享')
          // 如果不是商品详情页面，采用其他分享策略
          let willHide = []
          if (this.shareRoutes.indexOf(route.name) === -1) {
            willHide = ['menuItem:share:appMessage', 'menuItem:share:timeline']
          }
          if (this.appId) {
            this.share(willHide)
          }
        }
      },
      immediate: true
    }
  },
  async created () {
    try {
      await this.getMallInfo()
      let mallId = Cookie.get('mallId')
      let token = Cookie.get('token')
      let lastMallId = localStorage.getItem('lastMallId')
      // 如果以及登录，且商城没切换，就不用重新登录
      if (token && mallId === lastMallId) {
        await this.getUserInfo()
      } else {
        await this.login()
        await this.getUserInfo()
      }
      this.logined = true
      // 是否开通活动权限
      this.checkActivityAuth()
      // 获取皮肤id
      this.getSkinId()
    } catch (e) {
      throw e
    }
  },
  async mounted () {},
  methods: {
    ...mapMutations({
      setTheme: SET_THEME
    }),
    ...mapActions({
      getUserInfo: USER_INFO,
      getMallInfo: GET_MALL_INFO,
      login: LOGIN,
      checkActivityAuth: CHECK_ACTIVITY_AUTH,
      getSkinId: GET_SKIN_ID
    }),
    share (willHide = []) {
      share({
        appId: this.appId,
        title: `${this.mallName}-${this.$route.meta.title}`,
        desc: this.mallDesc,
        link: window.location.href,
        imgUrl: this.logoUrl || 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5CU6yfkSWRHJcwP0BibLpr75V8Qc8bpjmP6FfSto1Mrog/0',
        willHide
      })
    }
  }
}
/**
 * 处理url，删除微信加的参数
 * @return {string}
 */
function disposeUrl () {
  let href = location.href
  let query = href.split('?')[1]
  let { protocol, host, pathname } = location
  let newUrl = ''
  // let hasWeixin = false
  query = qs.parse(query)
  if (query.hasOwnProperty('from') || query.hasOwnProperty('isappinstalled')) {
    delete query.isappinstalled
    delete query.from
    // hasWeixin = true
  }
  query = qs.stringify(query)
  if (query) {
    newUrl = `${protocol}//${host}${pathname}?${query}`
  } else {
    newUrl = `${protocol}//${host}${pathname}`
  }
  // 如果微信加了自己参数，重新设置浏览器历史记录
  // if (hasWeixin) {
  //   history.replaceState({}, document.title, newUrl)
  // }
  return newUrl
}
</script>
<style module lang="scss">
  @import "assets/scss/theme/base.scss";
</style>
