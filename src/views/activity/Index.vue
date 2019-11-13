<template>
  <div :class="$style.activity">
    <div :class="$style.background">
      <search placeholder="搜索商品" />
      <div :class="$style.container">
        <router-link
          :class="{
            [$style.btnTop]: true,
            [$style.coupon]: topBtnType === 1,
            [$style.default]: topBtnType === 2,
          }"
          tag="div"
          :to="{ name: topBtnType === 1 ? 'MyCoupon' : '' }"
        />
        <TemplateFengqiang
          v-if="type === 5"
          :data="modules"
          :type="type"
        />
        <TemplateBaofa
          v-if="type === 6"
          :data="modules"
          :type="type"
        />
        <TemplateFanchang
          v-if="type === 7"
          :data="modules"
          :type="type"
        />
      </div>
    </div>
    <invite-newcomers-home-entry />
    <newcomers-home-entry />
  </div>
</template>

<script>
import Search from './components/Search.vue'
import TemplateFengqiang from './Template-Fengqiang.vue'
import TemplateBaofa from './Template-Baofa.vue'
import TemplateFanchang from './Template-Fanchang.vue'
import InviteNewcomersHomeEntry from '../invitenewcomers/InviteNewcomersHomeEntry.vue'
import NewcomersHomeEntry from '../double-twelve-day/newcomers/NewcomersHomeEntry.vue'
import { getCurrentTemplate, getLiveInfo, getJianxueInfo } from '../../apis/home'
import { getMyCouponList } from '../../apis/my-coupon'
import { getCurrentActivity } from '../../apis/invitenewcomers'

export default {
  name: 'Activity',
  components: {
    Search,
    TemplateFengqiang,
    TemplateBaofa,
    TemplateFanchang,
    InviteNewcomersHomeEntry,
    NewcomersHomeEntry
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
      topBtnType: 0 // 0：不显示 1：优惠卷 2：默认
    }
  },
  async created () {
    try {
      this.getTemplate()
      // 查询可使用优惠卷
      getMyCouponList({ current: 1, size: 10, status: 0 })
        .then(({ result }) => {
          this.topBtnType = result.total ? 1 : 2
        })
        .catch(err => {
          this.topBtnType = 2
          throw err
        })
      // 查询直播
      getLiveInfo().then(({ result }) => {
        this.liveInfo = result || {}
      })
      // 邀新有礼
      getCurrentActivity().then(({ result }) => {
        this.invitingEvent = result || {}
      })
      // 见学之路
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
        let { type, moduleModels } = result
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
        this.type = type
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
    background: #d20001;
    .background {
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/main-bg.jpg") no-repeat center top;
      background-size: 100% auto;
      min-height: 100vh;
    }
    .container {
      padding: 236px 24px 176px;
    }
    .btn-top {
      width: 520px;
      height: 78px;
      border-radius: 70px;
      margin: 0 auto 28px;
      &.coupon {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-top.png") no-repeat center center;
        background-size: 100% auto;
        box-shadow: 18px 6px 25px #800F0F;
      }
      &.default {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/Button 4.png") no-repeat center center;
        background-size: 100% auto;
        box-shadow: 18px 6px 25px #800F0F;
      }
    }
  }
</style>
