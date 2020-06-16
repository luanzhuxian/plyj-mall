<template>
    <div :class="$style.newcomers">
        <h1>新人活动温暖感恩回馈</h1>
        <h2>新人优惠大礼包 惊喜派送</h2>
        <div :class="$style.time">
            <span>距活动开始仅剩：</span>
            <span :class="$style.timeItem">02</span>
            <i>天</i>
            <span :class="$style.timeItem">23</span>
            <i>:</i>
            <span :class="$style.timeItem">59</span>
            <i>:</i>
            <span :class="$style.timeItem">59</span>
        </div>
        <div :class="$style.count">
            已有<i>12</i>人领取了新人优惠大礼包
        </div>

        <div :class="$style.contentBox">
            <div :class="{ [$style.contentMain]: true, [$style.coupon]: true }">
                <div :class="$style.top">
                    优惠券大礼包 <i class="rmb">1000</i>
                </div>
                <Coupon />
                <Coupon />
                <Coupon />
                <pl-button size="large" round type="warning">
                    查看更多优惠券
                </pl-button>
            </div>
        </div>

        <div :class="$style.contentBox">
            <div :class="{ [$style.contentMain]: true, [$style.scholarship]: true }">
                <div :class="$style.top">
                    优惠券大礼包 <i class="rmb">1000</i>
                </div>
                <div :class="$style.scholarshipWrap">
                    <div :class="$style.scholarshipList">
                        <Scholarship />
                        <Scholarship />
                        <Scholarship />
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.contentBox" class="mb-28">
            <div :class="{ [$style.contentMain]: true, [$style.gift]: true }">
                <div :class="$style.top">
                    新人礼品 <span class="gray-3 fz-24">注册成为新会员即可获得</span>
                </div>
                <div :class="$style.giftWrap">
                    <div :class="$style.giftList">
                        <Gift />
                        <Gift />
                        <Gift />
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.notice">
            <pl-svg name="icon-speaker-97a9a" fill="#fff" width="20" />
            <span>快来领取新人优惠大礼包，领取成功后，您可进入个人中心中查看</span>
        </div>

        <button disabled>活动即将开始</button>
        <button>一键领取</button>
    </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { mapGetters } from 'vuex'
import share from '../../../assets/js/wechat/wechat-share'
import CouponItem from '../../../components/item/Coupon-Item.vue'
import Coupon from './Coupon.vue'
import Scholarship from './Scholarship.vue'
import Gift from './Gift.vue'
import { getNewcomersDetail } from '../../../apis/newcomers'

export default {
    name: 'Newcomers',
    components: {
        Coupon,
        Gift,
        Scholarship
    },
    data () {
        return {
            isShowRule: false,
            isShowDlg: true,
            activityInfo: {}
        }
    },

    computed: {
        ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
        // isNewUser () {
        //     return !this.userId
        // },
        // isActivityStoped () {
        //     return moment(this.activityInfo.activityEndTime).isBefore(moment()) || this.activityInfo.status === 0
        // },
        // btnClaimText () {
        //     if (this.activityInfo.status === 0) {
        //         return '该活动已停止，暂不能领用礼包'
        //     }
        //     if (moment(this.activityInfo.activityEndTime).isBefore(moment())) {
        //         return '该活动已结束，不能领用礼包'
        //     }
        //     if (!this.isNewUser) {
        //         return '您已成功领取礼包'
        //     }
        //     return '一键领取'
        // },
        // activityBrief () {
        //     return (this.activityInfo.activityBrief || '').replace(/\n/g, '<br>')
        // }
    },

    watch: {
        // 'activityInfo.hasClaim' (newVal, old) {
        //     if (newVal && (!this.isActivityStoped)) {
        //         this.reClaimed()
        //     }
        // }
    },

    async created () {
    },

    async activated () {
        // try {
        //     await this.getNewcomersDetail()
        //     await this.tryClaim(true)
        //     this.share()
        // } catch (e) {
        //     throw e
        // }
    },

    methods: {
    }
}
</script>

<style lang="scss" module>
.newcomers {
    padding: 0 12px 58px 12px;
    background: #FA8E59 url("https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser-bg.png") no-repeat top center;
    background-size: 100%;
    overflow: hidden;
    > h1 {
        margin-top: 76px;
        margin-bottom: 24px;
        font-size: 60px;
        text-align: center;
        color: #fff;
        font-weight: normal;
    }
    > h2 {
        width: 400px;
        margin: 0 auto;
        text-align: center;
        line-height: 60px;
        font-size: 30px;
        font-weight: normal;
        color: #FC6E1F;
        background-color: #FBEFD7;
        border-radius: 20px;
    }
    > .time {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 436px;
        height: 72px;
        margin: 378px auto 0;
        text-align: center;
        font-size: 24px;
        background: linear-gradient(180deg, #F67D3E, #FB621C) no-repeat;
        border-radius: 36px;
        > span {
            color: #FBEFD7;
        }
        > i {
            color: #FBEFD7;
            margin: 0 4px;
        }
        > .timeItem {
            width: 36px;
            line-height: 38px;
            color: #DF5B2F;
            background-color: #FBEFD7;
            border-radius: 6px;
        }
    }
    > button {
        display: block;
        width: 450px;
        margin: 0 auto;
        line-height: 80px;
        font-size: 32px;
        color: #FB5817;
        background-color: #FED546;
        border-radius: 40px;
        box-shadow: 0 6px 12px rgba(230, 102, 39, 1);
        &:disabled {
            background-color: #fbca77;
            color: #FA8E59;
            opacity: 1;
        }
    }
}
.count {
    margin: 10px 0 24px 0;
    text-align: center;
    font-size: 24px;
    color: #fff;
    > i {
        color: #FCF28C;
    }
}
.contentBox {
    margin-bottom: 42px;
    padding-top: 34px;
    background: url("https://mallcdn.youpenglai.com/static/admall/2.11.0/contetn-head.png") no-repeat top center;
    background-size: 100%;
    > .contentMain {
        width: 680px;
        margin: 0 auto;
        background: #fff linear-gradient(180deg, rgba(251, 89, 23, 0.8), rgba(251, 89, 23, 0) 38px, #fff 38px) no-repeat center 0;
        overflow-y: hidden;
        box-sizing: border-box;
        &.coupon {
            display: flex;
            flex-direction: column;
            align-items: center;
            > button {
                width: 450px;
                margin: 38px 0 46px 0;
            }
        }
        &.scholarship, &.gift {
            > .top {
                padding: 0 32px;
                box-sizing: border-box;
            }
            > .scholarshipWrap, > .giftWrap {
                width: 100%;
                height: max-content;
                padding: 0 32px 64px 32px;
                box-sizing: border-box;
                overflow: scroll;
                > .scholarshipList,  > .giftList {
                    width: max-content;
                    font-size: 0;
                    overflow-y: hidden;
                }
            }
        }
        > .top {
            width: 630px;
            margin: 56px 0 26px 0;
            font-size: 32px;
            > i {
                font-size: 40px;
                font-weight: bold;
                color: #FF4622;
                &:before {
                    font-size: 30px;
                }
            }
        }
    }
}
.notice {
    margin-bottom: 52px;
    font-size: 20px;
    color: #fff;
    text-align: center;
    > svg {
        margin-right: 12px;
        vertical-align: -3px;
    }
}
</style>
