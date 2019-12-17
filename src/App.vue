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
import { SET_THEME, USER_INFO, GET_MALL_INFO, LOGIN, GET_ACTIVITY_DATA, GET_SKIN_ID, SET_LIVE_INFO, SET_COUPON_INFO, SET_INVITING_EVENT, SET_JX_EVENT, SET_NW_EVENT } from './store/mutation-type'
import share from './assets/js/wechat/wechat-share'
import { isIOS } from './assets/js/util'
import Cookie from './assets/js/storage-cookie'
import qs from 'qs'
import { getLiveInfo, getJianxueInfo, getNianweiInfo } from './apis/home'
import { getMyCouponList } from './apis/my-coupon'
import { getCurrentActivity } from './apis/invitenewcomers'

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
        'InviteNewcomers',
        'SpringPloughing'
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
      this.getEntryData()
      // 尝试清除微信缓存
      // 必须放在微信登录之后，否则会影响微信登录
      // 且有code时不用刷新
      // let cleanCache = Date.now()
      // let search = location.search
      // if (search.indexOf('cleanCache') === -1) {
      //   if (!search) {
      //     location.replace(location.href + '?cleanCache=' + cleanCache)
      //   } else {
      //     location.replace(location.href + '&cleanCache=' + cleanCache)
      //   }
      // }
    } catch (e) {
      throw e
    }
  },
  async mounted () {},
  methods: {
    ...mapMutations({
      setTheme: SET_THEME,
      setLiveInfo: SET_LIVE_INFO,
      setCouponInfo: SET_COUPON_INFO,
      setInvitingEvent: SET_INVITING_EVENT,
      setJxEvent: SET_JX_EVENT,
      setNwEvent: SET_NW_EVENT
    }),
    ...mapActions({
      getUserInfo: USER_INFO,
      getMallInfo: GET_MALL_INFO,
      login: LOGIN,
      getActivityData: GET_ACTIVITY_DATA,
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
    },
    // 获取首页、主会场页所需数据
    async getEntryData () {
      try {
        // 获取皮肤id
        this.getSkinId()
        this.getActivityData()
        //   if (~[5, 6, 7].indexOf(activityId)) {
        const [{ result: liveInfo }, { result: couponInfo }, { result: invitingEvent }, { result: jxEvent }, { result: nwEvent }] = await Promise.all([getLiveInfo(), getMyCouponList({ current: 1, size: 10, status: 0 }), getCurrentActivity(), getJianxueInfo(), getNianweiInfo()])
        this.setLiveInfo(liveInfo)
        this.setCouponInfo(couponInfo)
        this.setInvitingEvent(invitingEvent)
        this.setJxEvent(jxEvent)
        this.setNwEvent(nwEvent)
        // }
        // if (activityId === 8) {
        // const [{ result }] = await Promise.all([getCurrentActivity()])
        // console.log(result)
        // }
      } catch (error) {
        this.setLiveInfo({})
        this.setCouponInfo({})
        this.setInvitingEvent({})
        this.setJxEvent({})
        this.setNwEvent({})
        throw error
      } finally {

      }
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
<style module lang="scss"></style>
