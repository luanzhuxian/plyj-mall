<template>
  <div :class="$style.activity">
    <div :class="$style.background">
      <search placeholder="搜索商品" />
      <div :class="$style.container">
        <router-link
          :class="$style.btnTop"
          tag="div"
          :to="{ name: 'MyCoupon' }"
        />
        <TemplateFengqiang
          v-if="type === 5"
          :data="modules"
          :type="type"
          :timestamp="timestamp"
        />
        <TemplateBaofa
          v-if="type === 6"
          :data="modules"
          :type="type"
          :timestamp="timestamp"
        />
        <TemplateFanchang
          v-if="type === 7"
          :data="modules"
          :type="type"
          :timestamp="timestamp"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import TemplateFengqiang from './Template-Fengqiang.vue'
import TemplateBaofa from './Template-Baofa.vue'
import TemplateFanchang from './Template-Fanchang.vue'
import { getCurrentTemplate, getLiveInfo, getJianxueInfo } from '../../apis/home'
import { getCurrentActivity } from '../../apis/invitenewcomers'

export default {
  name: 'Activity',
  components: {
    Search,
    TemplateFengqiang,
    TemplateBaofa,
    TemplateFanchang
  },
  provide () {
    return {
      parent: this
    }
  },
  data () {
    return {
      type: 0,
      modules: {
        COUPON: null,
        MAI_SONG: null,
        PIN_TUAN: null,
        YU_GOU: null,
        MIAO_SHA: null,
        FENG_QIANG: null,
        RECOMMEND: null
      },
      liveInfo: {}, // 直播
      invitingEvent: {}, // 邀新有礼
      jxEvent: {}, // 见学之路
      timestamp: '' // 服务器时间
    }
  },
  async created () {
    try {
      this.getTemplate()
      getLiveInfo().then(({ result }) => {
        this.liveInfo = result || {}
      })
      getCurrentActivity().then(({ result }) => {
        this.invitingEvent = result || {}
      })
      getJianxueInfo().then(({ result }) => {
        this.jxEvent = result || {}
      })
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getTemplate () {
      try {
        const { result } = await getCurrentTemplate({ type: 2 })
        if (!result) {
          this.noFinish = true
          this.$alert('双十二主会场还在装修中哦，请您先看看我们都有哪些商品吧 😘')
            .finally(() => {
              this.$router.replace({ name: 'Classify' })
            })
          return
        }
        let { type, currentTime, moduleModels } = result
        this.type = type
        this.timestamp = currentTime || Date.now()
        if (type === 5) {
          this.modules.MIAO_SHA = moduleModels[0]
          this.modules.PIN_TUAN = moduleModels[1]
          this.modules.MAI_SONG = moduleModels[2]
          this.modules.COUPON = moduleModels[3]
          this.modules.YU_GOU = moduleModels[4]
          this.modules.FENG_QIANG = moduleModels[5]
          this.modules.RECOMMEND = moduleModels[6]
        }
        if (type === 6) {
          this.modules.COUPON = moduleModels[0]
          this.modules.MAI_SONG = moduleModels[1]
          this.modules.MIAO_SHA = moduleModels[2]
          this.modules.PIN_TUAN = moduleModels[3]
          this.modules.FENG_QIANG = moduleModels[4]
          this.modules.MIAO_SHA.values.forEach((item, index) => {
            if (!item.goodsInfo || !Array.isArray(item.goodsInfo)) {
              item.goodsInfo = []
            }
            this.$set(item, 'range', item.valueName.split(','))
          })
        }
        if (type === 7) {
          this.modules.MAI_SONG = moduleModels[0]
          this.modules.MIAO_SHA = moduleModels[1]
          this.modules.PIN_TUAN = moduleModels[2]
          this.modules.FENG_QIANG = moduleModels[3]
          this.modules.RECOMMEND = moduleModels[4]
        }
      } catch (e) {
        throw e
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.noFinish) {
        vm.$alert('双十二主会场还在装修中哦，请您先看看我们都有哪些商品吧 😘')
          .finally(() => {
            vm.$router.replace({ name: 'Classify' })
          })
      }
    })
  }
}
</script>
<style module lang="scss">
  .activity {
    position: relative;
    background: rgba(195, 1, 10, 1);
    .background {
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/main-bg.jpg") no-repeat center top;
      background-size: 100% auto;
      min-height: 100vh;
    }
    .container {
      padding: 236px 24px 176px;
    }
    .btn-top {
      width: 520px;
      height: 78px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-top.png") no-repeat center center;
      background-size: 100% auto;
      border-radius: 70px;
      box-shadow: 18px 6px 25px #800F0F;
      margin: 0 auto 28px;
    }
  }
</style>
