<template>
    <div :class="$style.newcomers">
        <h1 v-text="activityInfo.activityName" />
        <h2>新人优惠大礼包 惊喜派送</h2>
        <Rules
            :start-time="startTime"
            :end-time="endTime"
            :activity-brief="activityInfo.activityBrief"
        />
        <Poster
            :show-logo="activityInfo.logoShow"
            :logo="activityInfo.logoUrl"
            :share-url="shareUrl"
            :name="activityInfo.activityName"
            ref="poster"
        />
        <Countdown
            :start-time="startTime"
            :end-time="endTime"
            :duration="duration"
            :is-start="isStarted"
            :is-end="isEnd"
            @end="countdownEnd"
        />
        <div :class="$style.count">
            <span v-if="activityInfo.claimNumShow">已有<i v-text="activityInfo.claimNum" />人领取了新人优惠大礼包</span>
        </div>

        <div :class="$style.contentBox" v-if="coupons.length">
            <div :class="{ [$style.contentMain]: true, [$style.coupon]: true }">
                <div :class="$style.top">
                    优惠券大礼包 <i class="rmb" v-text="totalCouponPrice" />
                </div>
                <div
                    :class="{ [$style.couponList]: true, [$style.more]: seeMoreCoupon, [$style.few]: coupons.length < 4 }"
                    :style="{ height: coupons.length > 3 ? (seeMoreCoupon ? ((coupons.length * 180 + (coupons.length - 1) * 18) / 7.5) + 'vw' : 576 / 7.5 + 'vw') : 'auto' }"
                >
                    <Coupon
                        v-for="(item, i) of coupons"
                        :key="i"
                        :price="item.amount"
                        :type="item.couponType"
                        :limit="item.useLimitAmount"
                        :start="item.useStartTime"
                        :end="item.useEndTime"
                    />
                </div>
                <template v-if="coupons.length > 3">
                    <pl-button v-if="!seeMoreCoupon" size="large" round type="warning" @click="seeMoreCoupon = true">
                        查看更多优惠券
                    </pl-button>
                    <button v-else style="color: #FA8E59" :class="$style.collapse" @click="seeMoreCoupon = false">
                        收起 <pl-svg name="icon-right" width="30" fill="#FA8E59" />
                    </button>
                </template>
            </div>
        </div>

        <div :class="$style.contentBox" v-if="scholarships.length">
            <div :class="{ [$style.contentMain]: true, [$style.scholarship]: true }">
                <div :class="$style.top">
                    新人奖学金 <i class="rmb" v-text="totalScholarship" />
                </div>
                <div :class="$style.scholarshipWrap">
                    <div :class="{ [$style.scholarshipList]: true, [$style.two]: scholarships.length === 2 }">
                        <Scholarship
                            v-for="(item, i) of scholarships"
                            :key="i"
                            :price="item.scholarshipPrice"
                            :days="item.scholarshipEffectiveTime"
                            :count="scholarships.length"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.contentBox" class="mb-28" v-if="gifts.length">
            <div :class="{ [$style.contentMain]: true, [$style.gift]: true }">
                <div :class="$style.top">
                    新人礼品 <span class="gray-3 fz-24">注册成为新会员即可获得</span>
                </div>
                <div :class="$style.giftWrap">
                    <div :class="{ [$style.giftList]: true, [$style.two]: scholarships.length === 2 }">
                        <Gift
                            v-for="(item, i) of gifts"
                            :key="i"
                            :image="item.giftImage"
                            :name="item.giftName"
                            :start="item.useStartTime"
                            :end="item.useEndTime"
                            :count="gifts.length"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.notice">
            <pl-svg name="icon-speaker-97a9a" fill="#fff" width="20" />
            <span>快来领取新人优惠大礼包，领取成功后，您可进入个人中心查看</span>
        </div>

        <template v-if="isStarted && !isEnd">
            <button v-if="success" @click="akeyToGet">领取成功 分享给好友</button>
            <button v-else @click="akeyToGet">一键领取</button>
        </template>
        <button v-else-if="!isStarted" disabled>活动即将开始</button>
        <button v-else disabled>活动已结束</button>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { share } from '../../../../assets/js/wechat/wechat-share'
import Coupon from './components/Coupon.vue'
import Scholarship from './components/Scholarship.vue'
import Gift from './components/Gift.vue'
import Countdown from './components/Countdown.vue'
import Rules from './components/Rules.vue'
import Poster from './components/Poster.vue'
import {
    akeyToGet,
    isNewUser,
    getInfoById
} from '../../../../apis/newcomers'

export default {
    name: 'Newcomers',
    components: {
        Coupon,
        Gift,
        Scholarship,
        Countdown,
        Rules,
        Poster
    },
    data () {
        return {
            isShowRule: false,
            seeMoreCoupon: false,
            success: false,
            activityInfo: {},
            duration: 0,
            shareUrl: ''
        }
    },
    props: {
        shareId: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['appId', 'mallDomain', 'agentUser', 'mallUrl', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
        coupons () {
            return this.activityInfo.couponModels || []
        },
        scholarships () {
            return this.activityInfo.scholarships || []
        },
        gifts () {
            return this.activityInfo.gifts || []
        },
        totalCouponPrice () {
            return Number((this.coupons.length ? this.coupons.map(item => item.amount).reduce((a, b) => a + b) : 0).toFixed(2))
        },
        totalScholarship () {
            return Number((this.scholarships.length ? this.scholarships.map(item => item.scholarshipPrice).reduce((a, b) => a + b) : 0).toFixed(2))
        },
        startTime () {
            return moment(this.activityInfo.activityStartTime).valueOf() || 0
        },
        endTime () {
            return moment(this.activityInfo.activityEndTime).valueOf() || 0
        },
        // 是否已经开始
        isStarted () {
            return Date.now() - this.startTime > 0 && Number(this.activityInfo.status) !== 0
        },
        isEnd () {
            return Number(this.activityInfo.status) === 0
        }
    },
    methods: {
        async getNewUserInfo () {
            try {
                const { result: activityInfo } = await getInfoById(this.id)
                // 活动不存在
                if (!activityInfo) {
                    this.$alert({
                        message: '活动不存在',
                        viceMessage: '您可返回商城参与其它活动哦~',
                        confirmText: '去逛逛'
                    }).finally(() => {
                        this.$router.push({ name: 'Home' })
                    })
                    return
                }
                // 处理活动数据
                this.activityInfo = activityInfo || {}
                let duration = 0
                const startTime = moment(activityInfo.activityStartTime).valueOf() || 0
                const endTime = moment(activityInfo.activityEndTime).valueOf() || 0
                await this.$nextTick()
                if (!this.isStarted) {
                    duration = startTime - Date.now()
                }
                if (this.isStarted && !this.isEnd) {
                    duration = endTime - Date.now()
                }
                this.duration = duration
                // 活动已结束
                if (this.isEnd) {
                    await this.$alert({
                        message: '新人有礼活动已结束',
                        viceMessage: '您可返回商城参与其它活动哦',
                        confirmText: '去逛逛',
                        useDangersHtml: true
                    })
                    this.$router.replace({ name: 'Home' })
                }
            } catch (e) {
                throw e
            }
        },

        /**
         * 领取礼物
         * @param showTip 是否提示用户领取成功
         * @return {Promise<void>}
         */
        async akeyToGet (showTip = true) {
            try {
                // 未绑定手机
                if (!this.mobile) {
                    sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                        name: this.$route.name,
                        params: this.$route.params,
                        query: this.$route.query
                    }))
                    this.$router.push({ name: 'BindMobile' })
                    return
                }
                // 绑定手机了但不是新用户
                if (!this.isNew) {
                    await this.$alert({
                        message: '仅新注册用户可领取',
                        viceMessage: '活动期间仅新注册为会员可领取新人优惠大礼包，快去邀请好友领取吧~',
                        confirmText: '去分享给好友'
                    })
                    await this.$refs.poster.generate()
                    return
                }
                await akeyToGet(this.activityInfo.id, this.shareId)
                if (showTip) {
                    let text = `<p>恭喜你获得新人优惠大礼包</p>`
                    if (this.totalCouponPrice > 0) {
                        text += `<p>价值<i style="color: #FE7700">${ this.totalCouponPrice }</i>元的优惠券</p>`
                    }
                    if (this.totalScholarship > 0) {
                        text += `<p>价值<i style="color: #FE7700">${ this.totalScholarship }</i>元的奖学金</p>`
                    }
                    if (this.gifts.length > 0) {
                        text += `<p><i style="color: #FE7700">${ this.gifts.length }</i>个新人礼品</p>`
                    }
                    this.$toast({ message: text })
                }
                this.isNew = false
                this.success = true
            } catch (e) {
                throw e
            }
        },
        share () {
            let shareUrl = ''
            if (this.userId) {
                shareUrl = `${ this.mallUrl }/newcomers/${ this.id }/${ this.userId }?t=${ Date.now() }`
            } else {
                shareUrl = `${ this.mallUrl }/newcomers/${ this.id }?t=${ Date.now() }`
            }
            this.shareUrl = shareUrl
            share({
                appId: this.appId,
                title: `${ this.activityInfo.activityName }`,
                desc: `快来成为新会员，即可领取新人优惠大礼包哦`,
                link: shareUrl,
                imgUrl: 'https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser.jpg',
                willHide: ['menuItem:share:timeline']
            })
        },
        // 倒计时结束
        async countdownEnd () {
            try {
                await this.getNewUserInfo()
            } catch (e) {
                throw e
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(async vm => {
            await vm.getNewUserInfo()
            await vm.share()
            const { result: isNew } = await isNewUser(vm.activityInfo.id)
            vm.isNew = isNew
            if (isNew && vm.mobile && from.name === 'BindMobile') {
                if (!vm.isEnd) {
                    // 如果活动没结束，就自动领取礼物
                    await vm.akeyToGet(false)
                }
                await vm.$alert({
                    message: '恭喜您成功注册会员',
                    viceMessage: vm.isEnd ? `<p>新人有礼活动已结束</p><p>很遗憾！未领取新人优惠大礼包</p>` : `<p>新人优惠大礼包已领取成功</p><p>请在有效期内使用</p><p>快去邀请好友领取吧~~</p>`,
                    confirmText: vm.isEnd ? '去逛逛' : '去分享给好友',
                    useDangersHtml: true
                })
                if (vm.isEnd) {
                    vm.$router.replace({ name: 'Home' })
                } else {
                    await vm.$refs.poster.generate()
                }
            }
        })
    }
}
</script>

<style lang="scss" module>
.newcomers {
    position: relative;
    padding: 0 12px 58px 12px;
    background: #FA8E59 url("https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser-bg.jpg") no-repeat top center;
    background-size: 100%;
    overflow: hidden;
    > h1 {
        margin-top: 76px;
        margin-bottom: 24px;
        font-size: 56px;
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
    i {
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
            > .couponList {
                overflow: hidden;
                transition: height .5s linear;
                &.few {
                    padding-bottom: 56px;
                }
            }
            > button {
                width: 450px;
                margin: 38px 0 46px 0;
                &.collapse {
                    font-size: 30px;
                    > svg {
                        transform: rotate(-90deg);
                        vertical-align: -4px;
                    }
                }
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
                    &.two {
                        margin: 0 auto;
                    }
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
