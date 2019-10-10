<template>
  <div id="app">
    <keep-alive :exclude="exclude">
      <router-view v-if="logined" />
    </keep-alive>

    <navbar v-if="showNavbar.indexOf(routeName) > -1" />
    <QuickNavbar v-else />

    <div id="demo-player" style="width: 100vw; height: 300px" />
    <div id="ppt" style="width: 100vw; height: 300px" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import QuickNavbar from './components/Quick-Navbar.vue'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { SET_THEME, USER_INFO, GET_MALL_INFO, LOGIN } from './store/mutation-type'
import share from './assets/js/wechat/wechat-share'
// import crypto from 'crypto-js'
import qs from 'qs'
export default {
  components: {
    Navbar,
    QuickNavbar
  },
  data () {
    return {
      logined: false,
      exclude: [
        'ShoppingCart'
      ],
      showNavbar: [
        'Home',
        'My',
        'ShoppingCart',
        'Classify',
        'WhatsHelper'
      ],
      // 允许分享和复制链接的页面
      shareRoutes: [
        'Home',
        'Classify',
        'My',
        'Appointment'
      ]
    }
  },
  watch: {
    $route (route) {
      if (!/^\/detail/.test(route.path)) {
        // 如果不是商品详情页面，采用其他分享策略
        let willHide = []
        if (this.shareRoutes.indexOf(route.name) === -1) {
          willHide = ['menuItem:share:appMessage', 'menuItem:share:timeline']
        }
        if (this.appId) {
          this.share(willHide)
        }
      }
    }
  },
  computed: {
    routeName: function () {
      return this.$route.name
    },
    ...mapGetters(['userId', 'openId', 'appId', 'token', 'mallName', 'mallDesc', 'logoUrl'])
  },
  async created () {
    try {
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
      this.share()
    } catch (e) {
      throw e
    }
  },
  mounted () {
    let t = Date.now()
    let data = {
      appId: 'fgpe9p5979',
      channelId: '393112',
      timestamp: t
    }
    console.log(qs.stringify(data))
    var liveSdk = new window.PolyvLiveSdk({
      channelId: '393112',
      sign: '9DC859F0251761015E0D8179E610BAE1', // 频道验证签名
      timestamp: 1570712118205, // 毫秒级时间戳
      appId: 'fgpe9p5979', // polyv 后台的appId
      user: {
        userId: 'ea0c93b91e',
        userName: 'polyv-test'
      }
    })
    // 监听频道信息并初始化播放器
    liveSdk.on(window.PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
      console.log(event)
      console.log(data)
      liveSdk.setupPlayer({
        pptEl: '#ppt',
        el: '#demo-player',
        type: 'auto',
        autoplay: true,
        audioMode: true
      })
    })
  },
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
