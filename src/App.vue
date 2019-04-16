<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="logined" />
    </keep-alive>
    <navbar v-if="showNavbar.indexOf(routeName) > -1" />
    <QuickNavbar v-else />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import QuickNavbar from './components/Quick-Navbar.vue'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { SET_THEME, GET_MALL_INFO, LOGIN, USER_INFO } from './store/mutation-type'
import share from './assets/js/wechat/wechat-share'
export default {
  components: {
    Navbar,
    QuickNavbar
  },
  data () {
    return {
      logined: false,
      exclude: [
        'Home'
      ],
      showNavbar: [
        'Home',
        'My',
        'Yaji',
        'Classify',
        'WhatsHelper'
      ],
      // 允许分享和复制链接的页面
      shareRoutes: [
        'Home',
        'Classify',
        'Yaji',
        'My'
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
        share({
          appId: this.appId,
          title: `${this.mallName}-${route.meta.title}`,
          desc: this.mallDesc,
          link: window.location.href,
          imgUrl: this.logoUrl || 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5CU6yfkSWRHJcwP0BibLpr75V8Qc8bpjmP6FfSto1Mrog/0'
        }, willHide)
      }
    }
  },
  computed: {
    routeName: function () {
      return this.$route.name
    },
    ...mapGetters(['mallSeq', 'userId', 'openId', 'token', 'appId', 'mallName', 'mallDesc', 'logoUrl'])
  },
  async created () {
    try {
      await this.getMallInfo()
      /* token 存在并且还未过期 */
      if (this.token) {
        await this.getUserInfo()
      } else {
        await this.login()
      }
      this.logined = true
      share({
        appId: this.appId,
        title: `${this.mallName}-${this.$route.meta.title}`,
        desc: this.mallDesc,
        link: window.location.href,
        imgUrl: this.logoUrl || 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5CU6yfkSWRHJcwP0BibLpr75V8Qc8bpjmP6FfSto1Mrog/0'
      })
    } catch (e) {
      throw e
    }
  },
  methods: {
    ...mapMutations({
      setTheme: SET_THEME
    }),
    ...mapActions({
      getMallInfo: GET_MALL_INFO,
      login: LOGIN,
      getUserInfo: USER_INFO
    })
  }
}
</script>
<style module>
  @import "assets/scss/theme/base.scss";
</style>
<style>
</style>
