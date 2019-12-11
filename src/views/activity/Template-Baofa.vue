<template>
  <div :class="$style.templateBaofa">
    <coupon
      v-if="COUPON.values && COUPON.values.length"
      :data="COUPON"
      :type="type"
    />
    <!-- 直播-->
    <live
      v-if="parent.liveInfo && (parent.liveInfo.statue === 4 || (parent.liveInfo.statue === 2 && parent.liveInfo.hasNotice))"
      :class="$style.live"
    />
    <maisong
      v-if="MAI_SONG.values && MAI_SONG.values.length"
      :data="MAI_SONG"
      :type="type"
    />
    <miaosha
      v-if="MIAO_SHA.values && MIAO_SHA.values.length"
      :data="MIAO_SHA"
    />
    <!-- 活动 -->
    <div :class="$style.moduleActivity" v-if="hasInvitingEvent || hasJxEvent">
      <router-link
        v-if="hasInvitingEvent && hasJxEvent"
        :class="[$style.road, $style.small]"
        tag="div"
        :to="{ name: 'RoadLearning' }"
      />
      <router-link
        v-if="hasInvitingEvent && hasJxEvent"
        :class="[$style.invitation, $style.small]"
        tag="div"
        :to="{ name: 'InviteNewcomers', params: { activityId: invitingEvent.id } }"
      />
      <router-link
        v-if="!hasInvitingEvent && hasJxEvent"
        :class="[$style.road, $style.large]"
        tag="div"
        :to="{ name: 'RoadLearning' }"
      />
      <router-link
        v-if="hasInvitingEvent && !hasJxEvent"
        :class="[$style.invitation, $style.large]"
        tag="div"
        :to="{ name: 'InviteNewcomers', params: { activityId: invitingEvent.id } }"
      />
    </div>
    <pintuan
      v-if="PIN_TUAN.values && PIN_TUAN.values.length"
      :data="PIN_TUAN"
    />
    <fengqiang
      v-if="FENG_QIANG.values && FENG_QIANG.values.length"
      :data="FENG_QIANG"
      :type="type"
    />
  </div>
</template>

<script>
import Live from './components/Live.vue'
import Pintuan from './components/Pintuan.vue'
import Coupon from './components/Coupon.vue'
import Maisong from './components/Maisong.vue'
import Fengqiang from './components/Fengqiang.vue'
import Miaosha from './components/Miaosha.vue'

export default {
  name: 'HomeTemplateB',
  inject: ['parent'],
  components: {
    Live,
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
    return {}
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
      return this.data.PIN_TUAN || {}
    },
    FENG_QIANG () {
      return this.data.FENG_QIANG || {}
    },
    invitingEvent () {
      return (this.parent && this.parent.invitingEvent) || {}
    },
    jxEvent () {
      return (this.parent && this.parent.jxEvent) || {}
    },
    hasInvitingEvent () {
      return ~[1, 2].indexOf(this.invitingEvent.status)
    },
    hasJxEvent () {
      return ~[1, 2].indexOf(this.jxEvent.status)
    }
  }
}
</script>

<style module lang="scss">
  .live {
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
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/road-small.png") no-repeat center center;
        background-size: 100% auto;
      }
      &.invitation {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/invitation-small-v2.png") no-repeat center center;
        background-size: 100% auto;
      }
    }
    .large {
      width: 100%;
      height: 176px;
      &.road {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/road-large.png") no-repeat center center;
        background-size: 100% auto;
      }
      &.invitation {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/invitation-large-v2.png") no-repeat center center;
        background-size: 100% auto;
      }
    }
  }
</style>
