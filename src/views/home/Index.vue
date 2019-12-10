<template>
  <div :class="$style.home">
    <!-- <TemplateA
      v-if="type === 1"
      :data="modules"
    /> -->
    <TemplateB
      v-if="~[3, 4].indexOf(type)"
      :type="type"
      :skin-id="skinId"
      :data="modules"
    />
    <TemplateC
      v-if="type === -1"
      :type="type"
      :skin-id="skinId"
      :data="modules"
    />
    <div :class="$style.skeleton" v-else>
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
      <div :class="$style.skeletonC" />
      <div :class="$style.skeletonD" />
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
    </div>
    <invite-newcomers-home-entry />
    <newcomers-home-entry />
    <!--瓜分奖学金-->
    <split-burse />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'swiper/dist/css/swiper.css'
// import TemplateA from './Template-A.vue'
import TemplateB from './Template-B.vue'
import TemplateC from './Template-C.vue'
import InviteNewcomersHomeEntry from '../invitenewcomers/InviteNewcomersHomeEntry.vue'
import NewcomersHomeEntry from '../double-twelve-day/newcomers/NewcomersHomeEntry.vue'
import SplitBurse from './../../components/common/Split-Burse.vue'
import { getTemplate, getLiveInfo, getJianxueInfo } from '../../apis/home'
import { getCurrentActivity } from '../../apis/invitenewcomers'

export default {
  name: 'Home',
  components: {
    // TemplateA,
    TemplateB,
    TemplateC,
    InviteNewcomersHomeEntry,
    NewcomersHomeEntry,
    SplitBurse
    // WWEC
  },
  provide () {
    return {
      parent: this
    }
  },
  data () {
    return {
      loaded: false,
      type: 0,
      skinId: 0,
      modules: {
        BANNER: null,
        ADV: null,
        POPULAR: null,
        YUYUE: null,
        PINGXUAN: null,
        CLASS: null,
        RECOMMEND: null
        // MODULE_A: null,
        // MODULE_B: null,
        // MODULE_C: null,
        // MODULE_D: null,
        // MODULE_E: null
      },
      dataMoonLightBox: {},
      // 820用户注册次数
      registerCountFor820: 0,
      liveInfo: {}, // 直播
      invitingEvent: {}, // 邀新有礼
      jxEvent: {} // 见学之路
    }
  },
  async created () {
    try {
      this.getTemplate()
      const [{ result: live }, { result: invitingEvent }, { result: jxEvent }] = await Promise.all([getLiveInfo(), getCurrentActivity(), getJianxueInfo()])
      this.liveInfo = live || {}
      this.invitingEvent = invitingEvent || {}
      this.jxEvent = jxEvent || {}
    } catch (e) {
      throw e
    }
  },
  computed: {
    ...mapGetters(['mallId', 'serverTime', 'agentUser', 'userId', 'isActivityAuth'])
  },
  watch: {
    isActivityAuth: {
      handler (val) {
        if (val === true && !this.$router.currentRoute.meta.from) {
          this.$router.push({ name: 'Activity' })
        }
      },
      immediate: true
    }
  },
  methods: {
    async getTemplate () {
      try {
        const { result } = await getTemplate({ type: 1 })
        if (!result) {
          this.noFinish = true
          this.$alert('商城还在装修中哦，请您先看看我们都有哪些商品吧 😘')
            .finally(() => {
              this.$router.replace({ name: 'Classify' })
            })
          return
        }
        let { type, skinStatus, moduleModels } = result
        // if (type === 1) {
        //   const bannerList = moduleModels.filter(module => module.moduleType === 1)
        //   const prodList = moduleModels.filter(module => module.moduleType === 2)
        //   this.modules.BANNER = bannerList[0]
        //   this.modules.MODULE_B = bannerList[1]
        //   this.modules.MODULE_D = bannerList[2]
        //   this.modules.MODULE_A = prodList[0]
        //   this.modules.MODULE_C = prodList[1]
        //   this.modules.MODULE_E = prodList[2]
        // }
        // if (type === 2) {
        //   this.modules.BANNER = moduleModels[0]
        //   this.modules.POPULAR = moduleModels[1]
        //   this.modules.YUYUE = moduleModels[2]
        //   this.modules.PINGXUAN = moduleModels[3]
        //   this.modules.RECOMMEND = moduleModels[4]
        // }
        if (type === 3) {
          this.modules.BANNER = moduleModels[0]
          this.modules.POPULAR = moduleModels[1]
          this.modules.YUYUE = moduleModels[2]
          this.modules.PINGXUAN = moduleModels[3]
          this.modules.CLASS = moduleModels[4]
          this.modules.RECOMMEND = moduleModels[5]
        }
        if (type === 4) {
          this.modules.BANNER = moduleModels[0]
          this.modules.ADV = moduleModels[1]
          this.modules.POPULAR = moduleModels[2]
          this.modules.YUYUE = moduleModels[3]
          this.modules.PINGXUAN = moduleModels[4]
          this.modules.CLASS = moduleModels[5]
          this.modules.RECOMMEND = moduleModels[6]
        }
        if (type === -1) {
          this.modules.PINGXUAN = moduleModels[0]
          this.modules.YUYUE = moduleModels[1]
          this.modules.POPULAR = moduleModels[2]
          this.modules.TEACHERS = moduleModels[3]
          this.modules.CLASS = moduleModels[4]
          this.modules.RECOMMEND = moduleModels[5]
        }
        this.type = type
        this.skinId = skinStatus
        this.loaded = true
      } catch (e) {
        throw e
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.from = from.name
    next(vm => {
      if (vm.noFinish) {
        vm.$alert('商城还在装修中哦，请您先看看我们都有哪些商品吧 😘')
          .finally(() => {
            vm.$router.replace({ name: 'Classify' })
          })
      }
    })
  }
}
</script>
<style module lang="scss">
  .home {
    padding-bottom: 88px;
  }
  .skeleton {
    padding: 24px;
    .skeleton-a {
      width: 70vw;
      height: 60px;
      @include skeAnimation(#eee)
    }
    .skeleton-b {
      width: 50vw;
      height: 40px;
      margin-top: 20px;
      @include skeAnimation(#eee)
    }
    .skeleton-c {
      height: 320px;
      margin-top: 20px;
      margin-bottom: 20px;
      border-radius: 20px;
      @include skeAnimation(#eee)
    }
  }
</style>
