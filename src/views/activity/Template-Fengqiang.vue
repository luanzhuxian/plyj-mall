<template>
    <div :class="$style.templateFengqiang">
        <!-- 直播-->
        <live :class="$style.live" v-if="isLiveShow" :data="parent.liveInfo" />
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
        <miaosha-small
            v-if="MIAO_SHA.values && MIAO_SHA.values.length && MIAO_SHA.values[0].goodsInfo"
            :data="MIAO_SHA"
        />
        <pintuan
            v-if="PIN_TUAN.values && PIN_TUAN.values.length"
            :data="PIN_TUAN"
        />
        <maisong
            v-if="MAI_SONG.values && MAI_SONG.values.length"
            :data="MAI_SONG"
            :type="type"
        />
        <coupon
            v-if="COUPON.values && COUPON.values.length"
            :data="COUPON"
            :type="type"
        />
        <yugou
            v-if="YU_GOU.values && YU_GOU.values.length"
            :data="YU_GOU"
        />
        <fengqiang
            v-if="FENG_QIANG.values && FENG_QIANG.values.length"
            :data="FENG_QIANG"
            :type="type"
        />
        <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
            <div :class="$style.btnBottom" />
            <best-recommend :data="RECOMMEND" />
        </div>
    </div>
</template>

<script>
import Live from './components/Live.vue'
import Pintuan from './double-12/Pintuan.vue'
import Coupon from './double-12/Coupon.vue'
import Maisong from './double-12/Maisong.vue'
import Yugou from './double-12/Yugou.vue'
import Fengqiang from './double-12/Fengqiang.vue'
import MiaoshaSmall from './double-12/Miaosha-Small.vue'
import BestRecommend from '../home/components/Best-Recommend.vue'

export default {
    name: 'HomeTemplateB',
    inject: ['parent'],
    components: {
        Live,
        Pintuan,
        Coupon,
        Maisong,
        Yugou,
        Fengqiang,
        MiaoshaSmall,
        BestRecommend
    },
    data () {
        return {}
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
            return this.data.RECOMMEND || {}
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
        },
        isLiveShow () {
            const { liveInfo } = this.parent
            return liveInfo && liveInfo.liveModel && (liveInfo.liveModel.statue === 4 || (liveInfo.liveModel.statue === 2 && liveInfo.liveModel.hasNotice))
        }
    }
}
</script>

<style module lang="scss">
  .live {
    margin: 0 0 16px;
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
  .btn-bottom {
    width: 520px;
    height: 78px;
    background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-bottom.png") no-repeat center center;
    background-size: 100% auto;
    border-radius: 70px;
    margin: 48px auto 32px;
  }
</style>
