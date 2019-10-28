<template>
  <div :class="$style.home">
    <TemplateA :data="modules" v-if="type === 1">
    <!-- 月光宝盒项目 -->
    <!--<router-link
        slot="88"
        v-if="mallId === '1057573777392603136'"
        :to="{ name: 'MoonCake' }"
      >
        <img
          :class="$style.img88"
          src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/moon-cake/entry.png" alt=""
        >
      </router-link>-->
    <!-- 88无现金日 -->
    <!--<img
        slot="88"
        v-if="show88"
        :class="$style.img88"
        :src="data88[mallId].gif" alt=""
        @click="showHaibao"
      >-->
    </TemplateA>
    <TemplateB
      v-if="~[2, 3, 4].indexOf(type)"
      :type="type"
      :data="modules"
      :live="liveInfo"
      :inviting-event="invitingEvent"
      :jx-event="jxEvent"
    >
      <!-- 月光宝盒项目 -->
      <!--<router-link
        slot="88"
        v-if="mallId === '1057573777392603136'"
        :to="{ name: 'MoonCake' }"
      >
        <img
          :class="$style.img88"
          src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/moon-cake/entry.png" alt=""
        >
      </router-link>-->
      <!-- 88无现金日 -->
      <!--<img
        slot="88"
        v-if="show88"
        :class="$style.img88"
        :src="data88[mallId].gif" alt=""
        @click="showHaibao"
      >-->
    </TemplateB>
    <div :class="$style.skeleton" v-else>
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
      <div :class="$style.skeletonC" />
      <div :class="$style.skeletonD" />
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
    </div>

    <!--<transition name="fade">
      <div :class="$style.haibao" v-if="haibao">
        <img @click="haibao = ''" :src="haibao" alt="">
      </div>
    </transition>
    <transition name="fade">
      <div :class="$style.pop" v-if="pop">
        <img :src="pop" alt="">
        <pl-svg @click="pop = ''" name="close3" color="#fff" />
      </div>
    </transition>-->
    <!--<WWEC :show.sync="show820" />-->
    <invite-newcomers-home-entry />
    <newcomers-home-entry />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'swiper/dist/css/swiper.css'
import { getTemplate, getLiveInfo, getJianxueInfo } from '../../apis/home'
import { getCurrentActivity } from '../../apis/invitenewcomers'
// import { wasGetInfo } from '../../apis/wwec'
// import moment from 'moment'
import TemplateA from './Template-A.vue'
import TemplateB from './Template-B.vue'
import InviteNewcomersHomeEntry from '../invitenewcomers/InviteNewcomersHomeEntry.vue'
import NewcomersHomeEntry from '../newcomers/NewcomersHomeEntry.vue'
// import WWEC from '../../components/WWEC.vue'

export default {
  name: 'Home',
  components: {
    TemplateA,
    TemplateB,
    InviteNewcomersHomeEntry,
    NewcomersHomeEntry
    // WWEC
  },
  data () {
    return {
      loaded: false,
      // show820: false,
      type: 0,
      modules: {
        BANNER: null,
        Adv: null,
        POPULAR: null,
        YUYUE: null,
        PINGXUAN: null,
        CLASS: null,
        RECOMMEND: null,
        MODULE_A: null,
        MODULE_B: null,
        MODULE_C: null,
        MODULE_D: null,
        MODULE_E: null
      },
      // haibao: '',
      // pop: '',
      // data88: {
      //   '1110736772377198592': {
      //     haibao: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/hansi_haibao.jpg',
      //     pop: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/hansi_pop.jpg',
      //     gif: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/han_si_bo.gif',
      //     startTime: 1564588800000, // 2019-08-01 00:00:00
      //     endTime: 1568563199000 // 2019-09-15 23:59:59
      //   },
      //   '1120991459349135360': {
      //     haibao: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhide_haibao.jpg',
      //     pop: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhide_pop.jpg',
      //     gif: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhi_de_shuo.gif',
      //     startTime: 1564588800000, // 2019-08-01 00:00:00
      //     endTime: 1567267199000 // 2019-08-31 23:59:59
      //   }
      // },
      dataMoonLightBox: {},
      // 820用户注册次数
      registerCountFor820: 0,
      liveInfo: {},
      invitingEvent: {},
      jxEvent: {},
      timestamp: ''
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
  async mounted () {
    // if (this.mallId === '1057573777392603136') {
    //   this.show820 = true
    // }
  },
  computed: {
    ...mapGetters(['mallId', 'serverTime', 'agentUser', 'userId'])
    // serverTimestump () {
    //   return moment(this.serverTime).valueOf()
    // },
    // cur88Data () {
    //   return this.data88[this.mallId] || {}
    // },
    // curStartTime () {
    //   return this.cur88Data.startTime || 0
    // },
    // curEndTime () {
    //   return this.cur88Data.endTime || 0
    // }
    // show88 () {
    //   let { serverTimestump, curStartTime, curEndTime } = this
    //   return Boolean(curStartTime && serverTimestump >= curStartTime && serverTimestump <= curEndTime)
    // }
  },
  watch: {
    // show88: {
    //   handler (val) {
    //     if (val) {
    //       this.showPop(500)
    //     }
    //   },
    //   immediate: true
    // }
  },
  methods: {
    // showPop (delay) {
    //   if (this.data88[this.mallId]) {
    //     setTimeout(() => {
    //       this.pop = this.data88[this.mallId].pop
    //     }, delay)
    //   }
    // },
    // showHaibao () {
    //   this.haibao = this.data88[this.mallId].haibao
    // },
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
        let { type, currentTime, moduleModels } = result
        if (type === 1) {
          const bannerList = moduleModels.filter(module => module.moduleType === 1)
          const prodList = moduleModels.filter(module => module.moduleType === 2)
          this.modules.BANNER = bannerList[0]
          this.modules.MODULE_B = bannerList[1]
          this.modules.MODULE_D = bannerList[2]
          this.modules.MODULE_A = prodList[0]
          this.modules.MODULE_C = prodList[1]
          this.modules.MODULE_E = prodList[2]
        }
        if (type === 2) {
          this.modules.BANNER = moduleModels[0]
          this.modules.POPULAR = moduleModels[1]
          this.modules.YUYUE = moduleModels[2]
          this.modules.PINGXUAN = moduleModels[3]
          this.modules.RECOMMEND = moduleModels[4]
        }
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
          this.modules.Adv = moduleModels[1]
          this.modules.POPULAR = moduleModels[2]
          this.modules.YUYUE = moduleModels[3]
          this.modules.PINGXUAN = moduleModels[4]
          this.modules.CLASS = moduleModels[5]
          this.modules.RECOMMEND = moduleModels[6]
        }
        this.type = type
        this.timestamp = currentTime || Date.now()
        this.loaded = true
      } catch (e) {
        throw e
      }
    }
  },
  beforeRouteEnter (to, from, next) {
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

  /*.pop, .haibao {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
    z-index: 5;
    > img {
      width: 560px;
    }
    > svg {
      width: 48px;
      margin-top: 64px;
    }
  }
  .haibao {
    text-align: center;
    overflow: auto;
    z-index: 5;
    > img {
      width: 90%;
      justify-items: flex-start !important;
    }
  }

  .img88 {
    width: 100%;
    padding-bottom: 24px;
    padding-top: 16px;
    background-color: #f4f5f9;
  }*/
</style>
