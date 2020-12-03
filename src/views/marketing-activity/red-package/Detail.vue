<template>
    <div
        class="red-package-detail"
        :class="{
            [$style.redPackageDetail]: true,
            [$style.bgRed]: activity.bgUrlsIndex === 0,
            [$style.bgBlue]: activity.bgUrlsIndex === 1,
            [$style.bgPurple]: activity.bgUrlsIndex === 2,
            [$style.bgYellow]: activity.bgUrlsIndex === 3
        }"
    >
        <div :class="$style.background">
            <div :class="$style.container">
                <!-- logo -->
                <div :class="$style.logoWrapper" v-if="activity.logoShow">
                    <img :src="activity.logoUrl" alt="">
                </div>
                <!-- 海报 -->
                <div :class="$style.topBtnWrapper" @click="createPoster">
                    <PlSvg v-show="creatingPoster" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
                    <span v-show="!creatingPoster">海报分享</span>
                </div>
                <!-- 倒计时 -->
                <div :class="$style.countdownWrapper">
                    <span :class="$style.text" v-if="status === 0">距活动开始：</span>
                    <span :class="$style.text" v-if="status === 1">距活动结束：</span>
                    <span :class="$style.text" v-if="status === 3">活动已结束</span>
                    <Countdown
                        v-if="isCountdownShow"
                        :duration="getDuration(status, redPackage.receiveStartTime, redPackage.receiveEndTime)"
                        format="DD天HH:mm:ss"
                        @finish="resetCountdown"
                    >
                        <template v-slot="{time}">
                            <i v-if="time.days">{{ String(time.days) }}</i>
                            <span :class="$style.day" v-if="time.days">天</span>
                            <i>{{ String(time.hours).padStart(2, '0') }}</i>
                            <span :class="$style.colon">:</span>
                            <i>{{ String(time.minutes).padStart(2, '0') }}</i>
                            <span :class="$style.colon">:</span>
                            <i>{{ String(time.seconds).padStart(2, '0') }}</i>
                        </template>
                    </Countdown>
                </div>
                <div :class="$style.count" v-if="allLoaded">
                    {{ `${activity.claimVolume}人已领取 仅剩${activity.issueVolume - activity.claimVolume}张` }}
                </div>
                <div :class="$style.mainWrapper" v-if="allLoaded">
                    <!-- 弹幕 -->
                    <section :class="$style.barrage" v-if="isBarrageShow">
                        <Barrage ref="barrage" :list="bulletList" :template="getBulletTemplate" :gap="2" />
                    </section>
                    <!-- 红包 -->
                    <section :class="$style.redPackage">
                        <div :class="$style.redPackageHeader">
                            <b>小金额，大额券，边逛边优惠！</b>
                            <router-link :class="$style.redPackageRule" :to="{ name: 'RedPackageIntro', query: { from: 'RedPackageDetail' } }">
                                规则
                            </router-link>
                        </div>
                        <ul :class="$style.redPackageList">
                            <Coupon
                                :class="$style.redPackageListItem"
                                :status.sync="status"
                                :name="activity.name"
                                :stock="Number(activity.issueVolume) - Number(activity.claimVolume)"
                                :amount="Number(redPackage.amount)"
                                :use-limit-amount="Number(redPackage.useLimitAmount)"
                                :price="Number(redPackage.price)"
                                :receive-start-time="redPackage.receiveStartTime"
                                :receive-end-time="redPackage.receiveEndTime"
                                :use-start-time="redPackage.useStartTime"
                                :use-end-time="redPackage.useEndTime"
                            />
                        </ul>
                        <div :class="$style.redPackageForm" v-if="isFormShow">
                            <PlForm ref="form" :model="form" :rules="rules">
                                <PlFormItem prop="number" label="领取数量" class="input-number">
                                    <template v-if="redPackage.quantityLimit !== 1">
                                        <button type="button" :disabled="form.count <= 1" @click.stop="form.count--">
                                            -
                                        </button>
                                        <input type="number" v-model.number="form.count">
                                        <button type="button" :disabled="isInputNumberDisabled" @click.stop="form.count++">
                                            +
                                        </button>
                                    </template>
                                    <div :class="$style.redPackageLimit" v-if="redPackage.quantityLimit">
                                        {{ `每人限领${redPackage.quantityLimit}张` }}
                                    </div>
                                </PlFormItem>
                                <PlFormItem prop="name" label="姓名：" :gap-top="34">
                                    <PlInput v-model="form.name" />
                                </PlFormItem>
                                <PlFormItem prop="mobile" label="电话：" :gap-top="34">
                                    <PlInput v-model="form.mobile" />
                                </PlFormItem>
                            </PlForm>
                        </div>
                        <!-- 按钮 -->
                        <button :class="[$style.redPackageBtn, $style.disabled]" v-if="status === 0">
                            <span v-if="totalPrice"> {{ `仅需￥${totalPrice}  敬请期待` }}</span>
                            <span v-else>敬情期待</span>
                        </button>
                        <template v-else-if="status === 1">
                            <button :class="$style.redPackageBtn" v-if="isUpLimitReached" @click.stop="$router.push({ name: 'MyCoupon' })">
                                您已领取  立即查看
                            </button>
                            <button
                                v-else
                                :class="{
                                    [$style.redPackageBtn]: true,
                                    [$style.disabled]: submiting || isUpLimitReached
                                }"
                                :disabled="submiting || isUpLimitReached"
                                @click.stop="submitRedPackageOrder"
                            >
                                <PlSvg v-show="submiting" name="icon-btn-loading" fill="#FFF" width="35" class="rotate" />
                                <span v-if="totalPrice">{{ `仅需￥${totalPrice}  立即领取` }}</span>
                                <span v-else>数量有限 立即领取</span>
                            </button>
                        </template>
                        <button
                            v-else
                            :class="$style.redPackageBtn"
                            @click.stop="$router.push({ name: 'RedPackage' })"
                        >
                            领取更多福利
                        </button>
                    </section>
                    <!-- 商品 -->
                    <section :class="$style.product" v-if="productList && productList.length">
                        <b :class="$style.productHeader">
                            适用商品
                        </b>
                        <ul :class="$style.productList">
                            <Product
                                :class="$style.productListItem"
                                v-for="(prod, index) of productList"
                                :key="index"
                                :id="prod.productId"
                                :img="prod.image"
                                :main="prod.productName"
                                :price="Number(prod.price)"
                                :original="Number(prod.originPrice)"
                                :sku1="prod.skuCode1Name"
                                :sku2="prod.skuCode2Name"
                                :amount="Number(redPackage.amount)"
                            />
                        </ul>
                    </section>
                </div>
                <PlSvg :class="$style.loading" name="icon-loading" fill="#FFF" width="90" v-else />
                <router-link :class="$style.navBtn" :to="{ name: 'RedPackage' }">
                    <span>活动</span>
                    <span>首页</span>
                </router-link>
            </div>
        </div>
        <Poster
            ref="poster"
            :bg-index="activity.bgUrlsIndex"
            show-coupon
            :show-logo="activity.logoShow"
            :logo-url="activity.logoUrl"
            :name="activity.name"
            :status="activity.activityStatus"
            :amount="redPackage.amount"
            :use-limit-amount="redPackage.useLimitAmount"
            :issue-volume="activity.issueVolume"
            :claim-volume="activity.claimVolume"
            :use-start-time="redPackage.useStartTime"
            :use-end-time="redPackage.useEndTime"
            :share-url="shareUrl"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Barrage from '../longmen-festival/action/components/Barrage.vue'
import Countdown from '../../../components/activity/Countdown.vue'
import Coupon from './components/Coupon.vue'
import Product from './components/Product.vue'
import Poster from './components/Poster.vue'
import { checkLength, isPhone } from '../../../assets/js/validate'
import { getRedPackage, getRedPackageBarrage } from '../../../apis/marketing-activity/red-package'
import { submitRedPackageOrder } from './pay'
import {
    getDuration,
    getBulletTemplate,
    fenToYuan,
    isToday
} from './utils'
import share from '../../../assets/js/wechat/wechat-share'

export default {
    name: 'RedPackageDetail',
    components: {
        Barrage,
        Countdown,
        Coupon,
        Product,
        Poster
    },
    props: {
        activityId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            // 是否数据请求完毕
            allLoaded: false,
            // 是否在支付
            submiting: false,
            // 0 未开始 1 进行中 2 暂停 3 结束
            status: 0,
            activity: {},
            redPackage: {},
            bulletList: [],
            productList: [],
            form: {
                count: 1,
                name: '',
                mobile: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名' },
                    { validator: checkLength(12), message: '姓名为1~12个字符' }
                ],
                mobile: [
                    { required: true, message: '请输入电话' },
                    { validator: isPhone, message: '电话格式错误' }
                ]
            },
            creatingPoster: false,
            shareUrl: ''
        }
    },
    computed: {
        ...mapGetters(['realName', 'userName', 'mobile', 'appId', 'mallUrl']),
        isCountdownShow () {
            return this.status === 0 || this.status === 1
        },
        isBarrageShow () {
            return (this.status === 1 || this.status === 2 || this.status === 3) && this.bulletList && this.bulletList.length
        },
        isFormShow () {
            return this.status === 1 && this.redPackage.price > 0
        },
        // 购买上限
        isInputNumberDisabled () {
            let { count } = this.form
            count += this.activity.userClaimed
            return count >= (this.activity.issueVolume - this.activity.claimVolume) || count >= this.redPackage.quantityLimit
        },
        // 是否达到领取上限
        isUpLimitReached () {
            return this.activity.userClaimed >= this.redPackage.quantityLimit
        },
        totalPrice () {
            const { price } = this.redPackage
            const { count } = this.form
            return Number(price) * Number(count)
        }
    },
    async activated () {
        try {
            const request = [
                this.getRedPackage(),
                this.getRedPackageBarrage()
            ]
            await Promise.all(request.map(p => p.catch(e => console.error(e))))
            this.form.name = this.realName
            this.form.mobile = this.mobile
            if (this.$refs.barrage) {
                this.$refs.barrage.run()
            }
        } catch (error) {
            throw error
        } finally {
            this.allLoaded = true
        }
    },
    deactivated () {
        this.submiting = false
        this.creatingPoster = false
    },
    beforeRouteEnter (to, from, next) {
        to.meta.from = from.name
        next()
    },
    methods: {
        // 获取红包活动详情
        async getRedPackage () {
            try {
                const { result } = await getRedPackage(this.activityId)
                const { redPacketCouponVO, ...activity } = result
                redPacketCouponVO.price = fenToYuan(redPacketCouponVO.price)
                // 从我的卡券进入不弹窗
                if (this.$route.meta.from !== 'MyCoupon' && (result.activityStatus === 2 || result.activityStatus === 3)) {
                    return this.$alert('很遗憾，该活动已结束，请查看更多活动')
                        .finally(() => {
                            this.$router.replace({ name: 'RedPackage' })
                        })
                }
                this.status = result.activityStatus
                this.activity = activity
                this.redPackage = redPacketCouponVO
                this.productList = result.redPacketCouponVO.applicableGoodsVOS
            } catch (error) {
                throw error
            }
        },
        // 获取红包弹幕
        async getRedPackageBarrage () {
            try {
                const { result } = await getRedPackageBarrage()
                if (result.length) {
                    for (const item of result) {
                        item.time = isToday(item.createTime) ? '刚刚' : ''
                        item.msg = item.message ? item.message.replace(/\.\d+0+/g, '') : ''
                    }
                }
                this.bulletList = Object.freeze(result)
            } catch (error) {
                throw error
            }
        },
        // 获取红包弹幕模板
        getBulletTemplate,
        // 计算福利红包倒计时间隔
        getDuration,
        // 重置倒计时
        resetCountdown () {
            if (this.status === 0) {
                this.status = 1
            }
            if (this.status === 1) {
                this.status = 3
            }
        },
        // 检查是否绑定手机号
        checkMobile () {
            if (!this.mobile) {
                this.$confirm('您还没有绑定手机，请先绑定手机')
                    .then(() => {
                        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                            name: this.$route.name,
                            params: this.$route.params,
                            query: this.$route.query
                        }))
                        this.$router.push({ name: 'BindMobile' })
                    })
                    .catch(() => {})
                return false
            }
            return true
        },
        // 提交福利红包订单
        async submitRedPackageOrder () {
            try {
                if (!this.checkMobile()) {
                    return false
                }

                if (this.isFormShow && this.$refs.form) {
                    if (!this.$refs.form.validate()) {
                        return false
                    }
                }

                if (this.form.count + this.activity.userClaimed > this.redPackage.quantityLimit) {
                    return Number(this.activity.userClaimed)
                        ? this.$warning(`每人至多领取${ this.redPackage.quantityLimit }张，您已领取${ Number(this.activity.userClaimed) }张`)
                        : this.$warning(`每人至多领取${ this.redPackage.quantityLimit }张`)
                }

                this.submiting = true
                await submitRedPackageOrder(this.activityId, this.form.count)
                this.activity.userClaimed++
                await this.showModel('success')
            } catch (error) {
                throw error
            } finally {
                this.submiting = false
            }
        },

        /**
         * 领取后弹窗
         * @param {string} type success fail
         * @returns {Promise<*>}
         */
        async showModel (type = 'success') {
            try {
                let imgSrc
                let text1
                let text2

                if (type === 'success') {
                    imgSrc = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/弹框1.png'
                    text1 = '领取成功，可在订单或'
                    text2 = '领券中心查看'
                } else if (type === 'fail') {
                    imgSrc = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/弹框2.png'
                    text1 = '下手慢了，去看看其他活动吧'
                    text2 = ''
                }
                const Image = this.$createElement('img', { attrs: { src: imgSrc } })
                const Text1 = this.$createElement('p', text1)
                const Text2 = this.$createElement('p', text2)
                const Content = this.$createElement(
                    'div', {
                        class: 'message-box__content'
                    },
                    [Image, Text1, Text2]
                )

                await this.$confirm({
                    message: type === 'success' ? '恭喜您' : '优惠券已抢完',
                    slot: Content,
                    confirmText: type === 'success' ? '确定' : '查看活动',
                    hasCancelButton: false,
                    confirmStyle: {
                        color: '#F23D00',
                        borderTop: '2px solid #E7E7E7'
                    }
                })
                if (type === 'fail') {
                    return this.$router.push({ name: 'RedPackage' })
                }
            } catch (error) {
                throw error
            }
        },
        share () {
            const { appId, mallUrl, shareUrl } = this
            this.shareUrl = `${ mallUrl }/red-package/detail/${ this.activityId }?t=${ Date.now() }`
            share({
                appId,
                title: '小金额，大额券，边逛边优惠！',
                desc: `快来抢 ${ this.activity.name }福利红包`,
                link: shareUrl,
                imgUrl: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/share.png'
            })
        },
        // 创建海报
        async createPoster () {
            try {
                if (this.creatingPoster) {
                    return
                }

                this.creatingPoster = true
                await this.$nextTick()
                await this.$refs.poster.createPoster()
            } catch (error) {
                throw error
            } finally {
                this.creatingPoster = false
            }
        }
    }
}
</script>

<style lang="scss">
.my-bullet {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    height: 56px;
    width: max-content;
    animation: run 3s ease-out;
    transform-origin: 0 0;
    &__avatar {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 56px;
        height: 56px;
        background: #FFFFFF;
        border-radius: 50%;
        overflow: hidden;
        z-index: 99;
        > img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    &__message {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 26px 0 74px;
        line-height: 56px;
        background: #000000;
        opacity: .7;
        border-radius: 40px;
        font-size: 20px;
        color: #FFFFFF;
    }

    @keyframes run {
        0% {
            opacity: 0;
            transform: translate3d(0px, 100px, 0px) scale(0.8);
        }
        50% {
            opacity: 1;
            transform: translate3d(0, 0, 0px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate3d(0, -100px, 0px) scale(1);
        }
    }
}

.message {
    padding: 0;
}
.message-box__content {
    text-align: center;
    padding-bottom: 40px;
    > img {
        width: 207px;
        height: 182px;
        object-fit: cover;
        margin-bottom: 18px;
    }
    > p {
        font-size: 30px;
        line-height: 44px;
        color: #333333;
    }
}
</style>

<style lang="scss">
.red-package-detail {
    .pl-form-item {
        &_label {
            font-size: 24px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 32px;
            color: #333333;
        }
        &_content {
            height: 50px;
            border: 2px solid #E7E7E7;
            border-radius: 8px;
        }
        &.input-number {
            .pl-form-item_content {
                margin-left: auto;
                padding: 0;
                flex: 0;
                border: none;
                > input {
                    width: 66px;
                    height: 50px;
                    border: 2px solid #E7E7E7;
                    text-align: center;
                    font-size: 22px;
                }
                > button {
                    width: 50px;
                    height: 50px;
                    border: 2px solid #E7E7E7;
                    font-size: 25px;
                    &:nth-of-type(1) {
                        border-radius: 8px 0px 0px 8px;
                    }
                    &:nth-last-of-type(1) {
                        border-radius: 0px 8px 8px 0px;
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss" module>
.red-package-detail {
    &.bg-red {
        background: #FD644C;
        .background {
            background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-red.png) no-repeat center top;
            background-size: 100% auto;
        }
    }
    &.bg-blue {
        background: #057DE4;
        .background {
            background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-blue.png) no-repeat center top;
            background-size: 100% auto;
        }
    }
    &.bg-purple {
        background: #7C2FF3;
        .background {
            background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-purple.png) no-repeat center top;
            background-size: 100% auto;
        }
    }
    &.bg-yellow {
        background: #F3B82F;
        .background {
            background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-yellow.png) no-repeat center top;
            background-size: 100% auto;
        }
    }
}

.container {
    position: relative;
    box-sizing: border-box;
    padding: 478px 24px 146px;
    min-height: 100vh;
}

.logo-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 146px;
    height: 126px;
    background: linear-gradient(to top left, transparent 95px, #fff 96px, #fff 100%);
    > img {
        margin: 6px;
        width: 66px;
        height: 66px;
        border-radius: 50%;
        object-fit: cover;
        overflow: hidden;
    }
}

.top-btn-wrapper {
    position: absolute;
    top: 26px;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 48px;
    line-height: 48px;
    background: #000000;
    border-radius: 48px 0px 0px 48px;
    overflow: hidden;
    opacity: .5;
    font-size: 22px;
    color: #FFFFFF;
}

.countdown-wrapper {
    position: absolute;
    top: 134px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 455px;
    height: 56px;
    background: #FEF169;
    border-radius: 40px;
    font-size: 26px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #F23D00;
    @include elps();
    .colon {
        padding: 0 5px;
    }
    .day {
        margin-right: 12px;
    }
}

.count {
    position: absolute;
    top: 202px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    line-height: 32px;
    color: #FFFFFF;
    opacity: 0.8;
}

.barrage {
    margin: 50px 0 60px;
    width: 100%;
}

.red-package {
    background: #FFFFFF;
    border-radius: 20px;
    overflow: hidden;
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        height: 106px;
        background: #FFF36E;
        font-size: 30px;
        line-height: 32px;
        color: #F23D00;
    }
    &-rule {
        box-sizing: border-box;
        width: 130px;
        line-height: 52px;
        text-align: center;
        border: 2px solid #F23D00;
        border-radius: 60px;
        font-size: 30px;
        color: #F23D00;
    }
    &-list {
        margin-top: 44px;
        padding: 0 20px;
        &-item {
            margin-top: 46px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
        }
    }
    &-form {
        margin-top: 34px;
        padding: 0 80px;
    }
    &-limit {
        margin-left: 14px;
        width: max-content;
        font-size: 20px;
        color: #666666;
    }
    &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 38px auto 50px;
        width: 600px;
        line-height: 80px;
        background: linear-gradient(180deg, #F58A2D 0%, #EC3E01 100%);
        border-radius: 60px;
        font-size: 30px;
        color: #FFFFFF;
        &.disabled {
            opacity: 0.6 !important;
            font-weight: normal !important;
        }
        > svg {
            position: relative;
            top: -2px;
            margin-right: 10px;
        }
    }
}

.product {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 56px;
    &-header {
        position: relative;
        display: block;
        font-size: 40px;
        color: #FFFFFF;
        &::before {
            position: absolute;
            top: 50%;
            right: -50px;
            transform: translateY(-50%);
            content: '';
            width: 34px;
            height: 2px;
            background-color: #FFFFFF;
        }
        &::after {
            position: absolute;
            top: 50%;
            left: -50px;
            transform: translateY(-50%);
            content: '';
            width: 34px;
            height: 2px;
            background-color: #FFFFFF;
        }
    }
    &-list {
        margin-top: 30px;
        width: 100%;
        &-item {
            margin-top: 20px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
        }
    }
}

.nav-btn {
    position: fixed;
    right: 26px;
    bottom: 34px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 84px;
    height: 84px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    font-size: 22px;
    line-height: 30px;
    color: #FFFFFF;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    animation: rotate 1.2s linear infinite;
    z-index: 999;
}

@keyframes rotate {
    from {
        transform: rotate(0deg) translate(-50%, -50%);
    }
    to {
        transform: rotate(359deg) translate(-50%, -50%);
    }
}

</style>
