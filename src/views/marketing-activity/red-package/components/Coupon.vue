<template>
    <li :class="$style.coupon">
        <div :class="$style.countdownWrapper" v-if="isCountdownShow">
            <span :class="$style.text" v-if="status === 0">距活动开始：</span>
            <span :class="$style.text" v-if="status === 1">距活动结束：</span>
            <Countdown
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
        <div :class="$style.left">
            <b :class="$style.price">{{ 1000 }}</b>
            <span :class="$style.stock">{{ `剩余${12}张` }}</span>
        </div>
        <div :class="$style.right">
            <div :class="$style.top">
                <div :class="$style.topLeft">
                    <b :class="$style.main">
                        {{ `满20可抵1000` }}
                    </b>
                    <p :class="$style.sub">
                        {{ '威巴克专属' }}
                    </p>
                </div>
                <button v-if="false">20元抢购</button>
                <!-- <button v-else-if="true">立即领取</button> -->
                <!-- <button v-else-if="true" :class="$style.disabled">活动结束</button> -->
            </div>
            <p :class="$style.bottom">
                {{ `使用时间：2020.11.12-2020.12.21` }}
            </p>
        </div>
    </li>
</template>

<script>
import Countdown from '../../../activity/components/Countdown.vue'
// import { receiveCoupon } from '../../../apis/my-coupon'
// import { getDate } from '../helper.js'

// let isClickable = false

export default {
    name: 'Coupon',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {
            status: 0
        }
    },
    computed: {
        isCountdownShow () {
            return this.status === 0 || this.status === 1
        }
    },
    methods: {
        getDuration () {
            return Date.now().valueOf() - 1599999999999
        },
        resetStatus () {

        }
        // getDate,
        // async getCoupon ({ goodsInfo = {} }) {
        //     const { id } = goodsInfo
        //     if (isClickable) return
        //     if (!id) return
        //     isClickable = true
        //     try {
        //         await receiveCoupon({ couponId: id })
        //         this.$success('领取成功！')
        //     } catch (e) {
        //         throw e
        //     } finally {
        //         setTimeout(() => (isClickable = false), 500)
        //     }
        // }
    }
}
</script>

<style lang="scss" module>
.coupon {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/coupon.png) no-repeat center;
    background-size: 100%;
    height: 190px;
    font-size: 20px;
    color: #F19874;
}
.countdown-wrapper {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 46px;
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/countdown.png) no-repeat top;
    background-size: 100%;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #FFFFFF;
    @include elps();
    .colon {
        padding: 0 5px;
    }
    .day {
        margin-right: 12px;
    }
}
.left {
    position: relative;
    text-align: center;
    box-sizing: border-box;
    padding: 56px 0 6px 20px;
    width: 184px;
    height: 100%;
    @include elps();
    &::after {
        position: absolute;
        top: 32px;
        right: -1px;
        content: '';
        width: 1px;
        height: 128px;
        border-right: 2px dashed #FDAC85;
    }
}
.price {
    display: block;
    font-size: 42px;
    line-height: 32px;
    color: #F23D00;
    @include elps();
    &:before {
        content: '￥';
        font-size: 20px;
    }
}
.stock {
    margin-top: 4px;
    @include elps();
}
.right {
    flex: 1;
    width: 0;
    padding: 6px 20px 6px 34px;
    @include elps();
}
.top {
    display: flex;
    align-items: center;
    &-left {
        flex: 1;
        width: 0;
        @include elps();
    }
    > button {
        margin-right: 40px;
        width: 142px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        background: linear-gradient(180deg, #F58A2D 0%, #EC3E01 100%);
        border-radius: 40px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #FFFFFF;
        &.disabled {
            background: linear-gradient(180deg, #E1E1E1 0%, #B8B8B8 100%);
        }
    }
}
.main {
    font-size: 24px;
    line-height: 32px;
    color: #F23D00;
    @include elps();
}
.sub {
    margin-top: 8px;
    @include elps();
}
.bottom {
    margin-top: 6px;
    @include elps();
}
</style>
