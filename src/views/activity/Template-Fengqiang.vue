<template>
  <div :class="$style.templateFengqiang">
    <!-- 直播-->
    <Broadcast :class="$style.broadcast" />
    <!-- 活动 -->
    <div :class="$style.moduleActivity">
      <div v-if="true" :class="[$style.small, $style.road]" />
      <div v-if="true" :class="[$style.small, $style.invitation]" />
      <!-- <div v-if="true" :class="$style.large road" /> -->
      <!-- <div v-if="true" :class="$style.large invitation" /> -->
    </div>
    <!-- <Banner :data="BANNER" />
    <Adv v-if="type === 4 && Adv.showStatue === 1" :data="Adv" />
    <HotItem v-if="POPULAR.showStatue === 1" :data="POPULAR" />
    <appointment-gift :data="{ YUYUE, PINGXUAN }" />
    <Best v-if="CLASS.showStatue === 1" :data="CLASS" />
    <BestRecommend
      v-if="RECOMMEND.values && RECOMMEND.values.length"
      :data="RECOMMEND"
    /> -->
  </div>
</template>

<script>
import Broadcast from './components/Broadcast.vue'
// import HotItem from './components/Hot-Item.vue'
// import Best from './components/Best.vue'
// import BestRecommend from './components/Best-Recommend.vue'
// import AppointmentGift from './components/Appointment-Gift.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeTemplateB',
  components: {
    Broadcast
    // Adv,
    // Search,
    // HotItem,
    // Best,
    // BestRecommend,
    // AppointmentGift
  },
  data () {
    return {
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(['mallId']),
    MIAO_SHA () {
      return this.data.MIAO_SHA || {}
    },
    PIN_TUAN () {
      return this.data.PIN_TUAN || {}
    },
    MAI_SONG () {
      return this.data.MAI_SONG || {}
    },
    COUPON () {
      return this.data.COUPON || {}
    },
    YU_GOU () {
      return this.data.YU_GOU || {}
    },
    FENG_QIANG () {
      return this.data.FENG_QIANG || {}
    },
    RECOMMEND () {
      return this.data.RECOMMEND || { values: [] }
    }
  }
}
</script>

<style module lang="scss">
  .template-fengqiang {
    .broadcast {
      margin: 0 24px 16px;
    }

    // 活动
    .module-activity {
      display: flex;
      justify-content: space-between;
      padding: 16px 0;
      .small {
        width: 340px;
        height: 176px;
        &.road {
          background: url("../../assets/images/activity/road-small.png") no-repeat center center;
          background-size: 100% auto;
        }
        &.invitation {
          background: url("../../assets/images/activity/invitation-small.png") no-repeat center center;
          background-size: 100% auto;
        }
      }
      .large {
        width: 100%;
        height: 176px;
        &.road {
          background: url("../../assets/images/activity/road-large.png") no-repeat center center;
          background-size: 100% auto;
        }
        &.invitation {
          background: url("../../assets/images/activity/invitation-large.png") no-repeat center center;
          background-size: 100% auto;
        }
      }
    }
  }
</style>
