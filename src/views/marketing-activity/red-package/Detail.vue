<template>
    <div
        :class="{
            [$style.redPackageDetail]: true,
            [$style.bgRed]: activity.bgUrlsIndex === 0,
            [$style.bgBlue]: activity.bgUrlsIndex === 1,
            [$style.bgPurple]: activity.bgUrlsIndex === 2,
            [$style.bgYellow]: activity.bgUrlsIndex === 3
        }"
        class="red-package-detail"
    >
        <div :class="$style.background">
            <div :class="$style.container">
                <!-- logo -->
                <div :class="$style.logoWrapper" v-if="activity.logoShow">
                    <img :src="activity.logoUrl" alt="">
                </div>
                <!-- 海报 -->
                <div :class="$style.topBtnWrapper">
                    <div :class="$style.topBtn">海报分享</div>
                </div>
                <!-- 倒计时 -->
                <div :class="$style.countdownWrapper">
                    <span :class="$style.text" v-if="status === 0">距活动开始：</span>
                    <span :class="$style.text" v-if="status === 1">距活动结束：</span>
                    <span :class="$style.text" v-if="status === 2">活动已结束</span>
                    <Countdown
                        v-if="isCountdownShow"
                        :duration="getDuration()"
                        format="DD天HH:mm:ss"
                        @finish="status++"
                    >
                        <template v-slot="{time}">
                            <i>{{ String(time.days) }}</i>
                            <span :class="$style.day">天</span>
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
                    <section :class="$style.barrage">
                        <Barrage ref="barrage" :list="bulletList" :template="getBulletTemplate" />
                    </section>
                    <!-- 红包 -->
                    <section :class="$style.redPackage">
                        <div :class="$style.redPackageHeader">
                            <b>小金额，大额券，边逛边优惠！</b>
                            <router-link :class="$style.redPackageRule" :to="{ name: 'RedPackageIntro'}">
                                规则
                            </router-link>
                        </div>
                        <ul :class="$style.redPackageList">
                            <Coupon
                                :class="$style.redPackageListItem"
                                :status.sync="status"
                                :name="activity.name"
                                :stock="Number(activity.issueVolume) - Number(activity.claimVolume)"
                                :amount="redPackage.amount"
                                :use-limit-amount="redPackage.useLimitAmount"
                                :price="redPackage.price"
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
                                        <button type="button" :disabled="form.count <= 1" @click.stop="minus">
                                            -
                                        </button>
                                        <input type="number" v-model.number="form.count" @blur.stop="onInputNumberChange">
                                        <button type="button" :disabled="isBtnDisabled" @click.stop="add">
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
                        <button :class="[$style.redPackageBtn, $style.disabled]" v-if="status === 0" @click.stop="check">
                            {{ `仅需￥${totalPrice}  敬请期待` }}
                        </button>
                        <button
                            v-else-if="status === 1"
                            :class="{
                                [$style.redPackageBtn]: true,
                                [$style.disabled]: submiting
                            }"
                            :disabled="submiting"
                            @click.stop="submit"
                        >
                            <PlSvg v-show="submiting" name="icon-btn-loading" fill="#FFF" width="35" />
                            <span>
                                {{ `仅需￥${totalPrice}  立即领取` }}
                            </span>
                        </button>
                        <!-- <button :class="$style.redPackageBtn" v-else-if="status === 1 && quantityLimit" @click.stop="check">
                            您已领取  立即查看
                        </button> -->
                        <button :class="$style.redPackageBtn" v-else @click.stop="check">
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
                                :sub="prod.productName"
                                :price="prod.price"
                                :original="prod.originPrice"
                                :sku1="prod.skuCode1Name"
                                :sku2="prod.skuCode2Name"
                            />
                        </ul>
                    </section>
                </div>
                <PlSvg :class="$style.loading" name="icon-loading" fill="#FFF" width="90" v-else />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Barrage from '../longmen-festival/action/components/Barrage.vue'
import Countdown from '../../activity/components/Countdown.vue'
import Coupon from './components/Coupon.vue'
import Product from './components/Product.vue'
import { checkLength, isPhone } from '../../../assets/js/validate'
import { getRedPackage } from '../../../apis/marketing-activity/red-package'
import { submit, pay } from './pay'

// 单位转换：分转元
const fenToYuan = function (num) {
    const regexp = /(?:\.0*|(\.\d+?)0+)$/
    num = (num / 100).toFixed(2)
    num = num.replace(regexp, '$1')
    return Number(num)
}

const bulletModel = {
    avatar: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/gift.png',
    name: '张三',
    phone: '13333331111',
    donationAmount: '0.0001'
}

const bulletList = Array.from({ length: 10 }).fill(bulletModel)

export default {
    name: 'RedPackageDetail',
    components: {
        Barrage,
        Countdown,
        Coupon,
        Product
    },
    props: {
        activityId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            backgroundId: 0,
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
                    { required: true, message: '请输入联系人姓名' },
                    { validator: checkLength(12), message: '联系人姓名为1~12个字符' }
                ],
                mobile: [
                    { required: true, message: '请输入联系人手机号' },
                    { validator: isPhone, message: '联系人手机号格式错误' }
                ]
            },
            // 是否数据请求完毕
            allLoaded: false,
            // 是否在支付
            submiting: false
        }
    },
    computed: {
        ...mapGetters(['realName', 'mobile']),
        isCountdownShow () {
            return this.status === 0 || this.status === 1
        },
        isFormShow () {
            return this.status === 1 && this.redPackage.price > 0
        },
        isBtnDisabled () {
            const { count } = this.form
            return count >= (this.activity.issueVolume - this.activity.claimVolume) || count >= this.quantityLimit
        },
        totalPrice () {
            const { price } = this.redPackage
            const { count } = this.form
            return price * count
        }
    },
    async created () {
        console.log('created', this.activityId)
    },
    async activated () {
        try {
            const request = [
                this.getRedPackage()
            ]
            await Promise.all(request.map(p => p.catch(e => console.error(e))))
            this.form.name = this.realName
            this.form.mobile = this.mobile
            this.bulletList = Object.freeze(bulletList)
            if (this.$refs.barrage) {
                this.$refs.barrage.run()
            }
        } catch (error) {
            throw error
        } finally {
            this.allLoaded = true
        }
    },
    methods: {
        async getRedPackage () {
            try {
                const { result } = await getRedPackage(this.activityId)
                const { redPacketCouponVO, ...activity } = result
                redPacketCouponVO.price = fenToYuan(redPacketCouponVO.price)
                this.status = 1
                // this.status = result.activityStatus
                this.activity = activity
                this.redPackage = redPacketCouponVO
                this.productList = result.redPacketCouponVO.applicableGoodsVOS
            } catch (error) {
                throw error
            }
        },
        getDuration () {
            // 0 未开始 1 进行中 2 暂停 3 结束
            const { status } = this
            const { receiveStartTime, receiveEndTime } = this.redPackage
            const now = Date.now().valueOf()
            if (status === 0) {
                return now - new Date(receiveStartTime).valueOf()
            } else if (status === 1) {
                return new Date(receiveEndTime).valueOf() - now
            }
            return 0
        },
        getBulletTemplate (bullet, vm) {
            const { avatar, name, phone } = bullet
            const message = `${ name }****${ phone.slice(-4) }刚刚领取满${ 10 }元抵${ 100 }的储备金`
            const template = `
                <div class="my-bullet">
                    <div class="my-bullet__avatar">
                        <img src="${ avatar }" alt="${ name }">
                    </div>
                    <div class="my-bullet__message">
                        ${ message }
                    </div>
                </div>
            `
            return template
        },
        minus () {
            this.form.count--
        },
        add () {
            this.form.count++
        },
        onInputNumberChange () {

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
        async submit () {
            try {
                if (!this.checkMobile()) {
                    return false
                }

                if (this.isFormShow && this.$refs.form) {
                    if (!this.$refs.form.validate()) {
                        return false
                    }
                }

                this.submiting = true
                const { payData, orderBatchNumber } = await submit(this.activityId, this.form.count)
                const result = await pay(payData, payData.orderIds, payData.orderIds.length, orderBatchNumber, this.totalPrice)
                console.log('result', result)
                if (result === true) {
                    await this.showModel('success')
                }
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
        async showModel (type) {
            try {
                let imgSrc
                let text1
                let text2

                if (type === 'success') {
                    imgSrc = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/弹框1.png'
                    text1 = '领取成功，可在订单或'
                    text2 = '领券中心查看'
                } else {
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
                    message: '恭喜您',
                    slot: Content,
                    confirmText: '查看活动',
                    hasCancelButton: false,
                    confirmStyle: {
                        color: '#F23D00',
                        borderTop: '2px solid #E7E7E7'
                    }
                })
                return this.$router.push({ name: 'RedPackage' })
            } catch (error) {
                throw error
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
        width: 207;
        height: 182;
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
                    height: 38px;
                    border: 2px solid #E7E7E7;
                    text-align: center;
                }
                > button {
                    width: 40px;
                    height: 38px;
                    border: 2px solid #E7E7E7;
                    border-radius: 0px 8px 8px 0px;
                }
            }
        }
    }
}
</style>

<style lang="scss" module>
.red-package-detail {
    min-height: 100vh;
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
    padding: 478px 24px 80px;
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
    width: 120px;
    height: 48px;
    line-height: 48px;
    text-align: center;
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
            animation: rotate 2s linear infinite;
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
        transform: rotate(0deg) translate(0, 0);
    }
    to {
        transform: rotate(359deg) translate(0, 0);
    }
}

</style>
