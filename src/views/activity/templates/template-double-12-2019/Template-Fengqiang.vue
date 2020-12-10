<template>
    <div :class="$style.templateFengqiang">
        <!-- 直播-->
        <Live :class="$style.live" v-if="isLiveShow" :data="parent.liveInfo" />
        <!-- 活动 -->
        <!-- <div :class="$style.moduleActivity" v-if="hasInvitingEvent || hasJxEvent">
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
        </div> -->
        <Miaosha
            v-if="Miaosha.values && Miaosha.values.length && Miaosha.values[0].goodsInfo"
            :data="Miaosha"
        />
        <Pintuan
            v-if="Pintuan.values && Pintuan.values.length"
            :data="Pintuan"
        />
        <Maisong
            v-if="Maisong.values && Maisong.values.length"
            :data="Maisong"
            :type="type"
        />
        <Coupon
            v-if="Coupon.values && Coupon.values.length"
            :data="Coupon"
            :type="type"
        />
        <Yugou
            v-if="Yugou.values && Yugou.values.length"
            :data="Yugou"
        />
        <Fengqiang
            v-if="Fengqiang.values && Fengqiang.values.length"
            :data="Fengqiang"
            :type="type"
        />
        <div :class="$style.recommend" v-if="Recommend.values && Recommend.values.length">
            <div :class="$style.btnBottom" />
            <Recommend :data="Recommend" />
        </div>
    </div>
</template>

<script>
import Live from '../../double-12-2019/Live.vue'
import Pintuan from '../../double-12-2019/Pintuan.vue'
import Coupon from '../../double-12-2019/Coupon.vue'
import Maisong from '../../double-12-2019/Maisong.vue'
import Yugou from '../../double-12-2019/Yugou.vue'
import Fengqiang from '../../double-12-2019/Fengqiang.vue'
import Miaosha from '../../double-12-2019/Miaosha-Small.vue'
import Recommend from '../../../home/components/Recommend.vue'

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
        Miaosha,
        Recommend
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
        Miaosha () {
            return this.data.Miaosha || {}
        },
        Pintuan () {
            return this.data.Pintuan || {}
        },
        Maisong () {
            return this.data.Maisong || {}
        },
        Coupon () {
            return this.data.Coupon || {}
        },
        Yugou () {
            return this.data.Yugou || {}
        },
        Fengqiang () {
            return this.data.Fengqiang || {}
        },
        Recommend () {
            return this.data.Recommend || {}
        },
        // invitingEvent () {
        //     return (this.parent && this.parent.invitingEvent) || {}
        // },
        // jxEvent () {
        //     return (this.parent && this.parent.jxEvent) || {}
        // },
        // hasInvitingEvent () {
        //     return ~[1, 2].indexOf(this.invitingEvent.status)
        // },
        // hasJxEvent () {
        //     return ~[1, 2].indexOf(this.jxEvent.status)
        // },
        isLiveShow () {
            const { liveInfo } = this.parent
            if (!liveInfo.liveModel || !liveInfo.liveModel.length) {
                return false
            }
            const list = liveInfo.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
            return !!list.length
        }
    }
}
</script>

<style module lang="scss">
.live {
    margin: 0 0 16px;
}
// 活动
// .module-activity {
//     display: flex;
//     justify-content: space-between;
//     margin-top: 32px;
//     .small {
//         width: 340px;
//         height: 176px;
//         &.road {
//             background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/road-small.png') no-repeat center center;
//             background-size: 100% auto;
//         }
//         &.invitation {
//             background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/invitation-small-v2.png') no-repeat center center;
//             background-size: 100% auto;
//         }
//     }
//     .large {
//         width: 100%;
//         height: 176px;
//         &.road {
//             background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/road-large.png') no-repeat center center;
//             background-size: 100% auto;
//         }
//         &.invitation {
//             background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/invitation-large-v2.png') no-repeat center center;
//             background-size: 100% auto;
//         }
//     }
// }
.btn-bottom {
    width: 520px;
    height: 78px;
    background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-bottom.png') no-repeat center center;
    background-size: 100% auto;
    border-radius: 70px;
    margin: 48px auto 32px;
}

</style>
