<template>
  <div :class="$style.templateBaofa">
    <coupon
      v-if="COUPON.values && COUPON.values.length"
      :data="COUPON"
      :type="type"
    />
    <!-- 直播-->
    <broadcast
      v-if="$attrs.live && ($attrs.live.statue === 1 || ($attrs.live.statue === 2 && $attrs.live.hasNotice))"
      :class="$style.broadcast"
      v-bind="$attrs"
    />
    <maisong
      v-if="MAI_SONG.values && MAI_SONG.values.length"
      :data="MAI_SONG"
      :type="type"
    />
    <miaosha
      v-if="MIAO_SHA.values && MIAO_SHA.values.length"
      :data="MIAO_SHA"
      :type="type"
      v-bind="$attrs"
    />
    <!-- 活动 -->
    <div :class="$style.moduleActivity">
      <router-link
        v-if="true"
        :class="[$style.road, $style.small]"
        tag="div"
        :to="{ name: 'RoadLearning' }"
      />
      <router-link
        v-if="hasInvitingEvent"
        :class="[$style.invitation, $style.small]"
        tag="div"
        :to="{ name: '' }"
      />
      <!-- <div v-if="true" :class="[$style.road, $style.large]" />
      <div v-if="true" :class="[$style.invitation, $style.large]" /> -->
    </div>
    <pintuan
      v-if="PIN_TUAN.values && PIN_TUAN.values.length"
      :data="PIN_TUAN"
      v-bind="$attrs"
    />
    <fengqiang
      v-if="FENG_QIANG.values && FENG_QIANG.values.length"
      :data="FENG_QIANG"
      :type="type"
      :coupon="coupon"
    />
  </div>
</template>

<script>
import Broadcast from './components/Broadcast.vue'
import Pintuan from './components/Pintuan.vue'
import Coupon from './components/Coupon.vue'
import Maisong from './components/Maisong.vue'
import Fengqiang from './components/Fengqiang.vue'
import Miaosha from './components/Miaosha.vue'
import { getMaxCoupon } from '../../apis/home'

export default {
  name: 'HomeTemplateB',
  components: {
    Broadcast,
    Pintuan,
    Coupon,
    Maisong,
    Fengqiang,
    Miaosha
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
  data () {
    return {
      coupon: {}
    }
  },
  computed: {
    COUPON () {
      return this.data.COUPON || {}
    },
    MAI_SONG () {
      return this.data.MAI_SONG || {}
    },
    MIAO_SHA () {
      return this.data.MIAO_SHA || {}
    },
    PIN_TUAN () {
      return this.data.PIN_TUAN || { values: [] }
    },
    FENG_QIANG () {
      return this.data.FENG_QIANG || {}
    },
    hasInvitingEvent () {
      return this.$attrs.invitingEvent && ~[0, 2].indexOf(this.$attrs.invitingEvent.status)
    }
  },
  async created () {
    const { result } = await getMaxCoupon()
    this.coupon = result
  }
}
</script>

<style module lang="scss">
  .template-baofa {
    .broadcast {
      margin: 0 24px 16px;
    }

    // 活动
    .module-activity {
      display: flex;
      justify-content: space-between;
      margin-top: 32px;
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
