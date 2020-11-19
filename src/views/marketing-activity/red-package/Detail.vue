<template>
    <div
        :class="{
            [$style.redPackageDetail]: true,
            [$style.bgRed]: backgroundId === 0,
            [$style.bgBlue]: backgroundId === 1,
            [$style.bgPurple]: backgroundId === 2,
            [$style.bgYellow]: backgroundId === 3
        }"
        class="red-package-detail"
    >
        <div :class="$style.background">
            <div :class="$style.container">
                <!-- logo -->
                <div :class="$style.logoWrapper">
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/gift.png" alt="">
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
                        @finish="() => resetStatus()"
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
                <div :class="$style.count">
                    {{ `144人已领取 仅剩10张` }}
                </div>
                <div :class="$style.mainWrapper">
                    <!-- 红包 -->
                    <section :class="$style.redPackage">
                        <div :class="$style.redPackageHeader">
                            <b>小金额，大额券，边逛边优惠！</b>
                            <button :class="$style.redPackageRule">规则</button>
                        </div>
                        <ul :class="$style.redPackageList">
                            <Coupon :class="$style.redPackageListItem" />
                        </ul>
                        <div :class="$style.redPackageForm">
                            <PlForm ref="form" :model="form" :rules="rules">
                                <PlFormItem prop="number" label="领取数量" class="input-number">
                                    <button type="button" :disabled="form.number <= 1" @click.stop="minus">
                                        -
                                    </button>
                                    <input type="number" v-model.number="form.number" @blur.stop="onInputNumberChange">
                                    <button type="button" :disabled="form.number >= 99" @click.stop="add">
                                        +
                                    </button>
                                </PlFormItem>
                                <PlFormItem prop="name" label="姓名：" :gap-top="34">
                                    <PlInput v-model="form.name" />
                                </PlFormItem>
                                <PlFormItem prop="mobile" label="电话：" :gap-top="34">
                                    <PlInput v-model="form.mobile" />
                                </PlFormItem>
                            </PlForm>
                        </div>
                        <button :class="[$style.redPackageBtn, $style.disabled]" @click="check">
                            <span v-if="true">仅需￥1  敬请期待</span>
                            <!-- <span v-else-if="">仅需￥1  立即领取</span>
                            <span v-else-if="">您已领取  立即查看</span>
                            <span v-else-if="">领取更多福利</span> -->
                        </button>
                    </section>
                    <!-- 商品 -->
                    <section :class="$style.product">
                        <b :class="$style.productHeader">
                            适用商品
                        </b>
                        <ul :class="$style.productList">
                            <Product :class="$style.productListItem" v-for="(item, index) of 3" :key="index" />
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Countdown from '../../activity/components/Countdown.vue'
import Coupon from './components/Coupon.vue'
import Product from './components/Product.vue'
import { checkLength, isPhone } from '../../../assets/js/validate'

export default {
    name: 'RedPackageDetail',
    components: {
        Countdown,
        Coupon,
        Product
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            backgroundId: 0,
            status: 0,
            form: {
                number: 1,
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
            }
        }
    },
    computed: {
        isCountdownShow () {
            return this.status === 0 || this.status === 1
        }
    },
    created () {
        console.log('created', this.id)
    },
    methods: {
        getDuration () {
            return Date.now().valueOf() - 1599999999999
        },
        resetStatus () {

        },
        minus () {
            this.form.number--
        },
        add () {
            this.form.number++
        },
        onInputNumberChange () {

        },
        check () {
            const result = this.$refs.form.validate()
            console.log(result)
        }
    }
}
</script>

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
    &-btn {
        display: block;
        margin: 38px auto 50px;
        width: 600px;
        line-height: 80px;
        text-align: center;
        background: linear-gradient(180deg, #F58A2D 0%, #EC3E01 100%);
        border-radius: 60px;
        font-size: 30px;
        color: #FFFFFF;
        &.disabled {
            opacity: 0.6;
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

</style>
