<template>
  <div id="app">
    <keep-alive :exclude="exclude">
      <router-view v-if="logined" />
    </keep-alive>

    <navbar v-if="showNavbar.indexOf(routeName) > -1" :is-nav-btn-show="isNavBtnShow" />
    <QuickNavbar v-else />
  </div>
</template>

<script>
import Navbar from './components/common/Navbar.vue'
import QuickNavbar from './components/common/Quick-Navbar.vue'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { SET_THEME, USER_INFO, GET_MALL_INFO, LOGIN } from './store/mutation-type'
import share from './assets/js/wechat/wechat-share'
import { getCurrentTemplate } from './apis/home'

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
        'ShoppingCart'
      ],
      showNavbar: [
        'Home',
        'My',
        'ShoppingCart',
        'Classify',
        'WhatsHelper',
        'Activity'
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
        // 'InviteNewcomers',
        'InviteNewcomersHelp',
        'Newcomers'
      ],
      isNavBtnShow: false
    }
  },
  computed: {
    ...mapGetters(['userId', 'openId', 'appId', 'token', 'mallName', 'mallDesc', 'logoUrl'])
  },
  watch: {
    $route: {
      handler (route) {
        this.routeName = route.name
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
      // 是否显示双十二主会场tab入口
      getCurrentTemplate({ type: 2 }).then(({ result }) => {
        this.isNavBtnShow = !!result
      })
      await this.getMallInfo()
      let mallId = localStorage.getItem('mallId')
      let lastMallId = localStorage.getItem('lastMallId')
      // 如果以及登录，且商城没切换，就不用重新登录
      if (this.token && mallId === lastMallId) {
        await this.getUserInfo()
      } else {
        await this.login()
        await this.getUserInfo()
      }
      this.logined = true
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
      login: LOGIN
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
</script>
<style module lang="scss">
  @import "assets/scss/theme/base.scss";
</style>
