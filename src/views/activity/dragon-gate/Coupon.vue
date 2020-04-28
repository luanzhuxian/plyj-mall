<template>
    <div :class="$style.coupon">
        <div :class="$style.couponBg">
            <ul
                v-if="data.values.length"
                :class="{
                    [$style.couponList]: true,
                    [$style.large]: data.values.length === 1
                }"
            >
                <template v-for="(item, i) of data.values">
                    <router-link
                        v-if="item.goodsInfo"
                        :class="$style.couponListItem"
                        :key="i"
                        tag="li"
                        :to="{ name: 'CouponCenter' }"
                    >
                        <div :class="$style.couponListItemTop">
                            <div :class="$style.price" v-text="item.goodsInfo.amount" />
                            <p :class="$style.sub">
                                {{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}
                            </p>
                        </div>
                        <div :class="$style.couponListItemBottom">
                            {{ `有效期至${getDate(item.goodsInfo.useEndTime, 'MM月DD日')}` }}
                        </div>
                    </router-link>
                </template>
            </ul>
        </div>
        <router-link :class="$style.button" :to="{ name: 'MyCoupon' }">
            您有优惠券可领取
            <pl-svg name="icon-right" height="36" fill="#00237A" />
        </router-link>
    </div>
</template>

<script>
import { getDate } from '../helper'

export default {
    name: 'Coupon',
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        getDate
    }
}
</script>

<style lang="scss" module>
.coupon {
    &-bg {
        box-sizing: border-box;
        height: 412px;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/coupon-bg.png') no-repeat center top;
        background-size: 100%;
    }
    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 24px auto 0;
        width: 514px;
        height: 108px;
        background: #ffe31a;
        border: 2px solid #707070;
        border-radius: 110px;
        font-size: 44px;
        font-weight: bold;
        color: #00237a;
        > svg {
            position: relative;
            top: 2px;
        }
    }
    &-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        padding: 164px 56px 0;
        &.large {
            justify-content: center;
            .coupon-list-item {
                width: 366px;
                background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/coupon-large.png') no-repeat center;
                background-size: 100%;
            }
        }
        &-item {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding-right: 22px;
            width: 308px;
            height: 174px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/coupon-small.png') no-repeat center;
            background-size: 100%;
            font-size: 24px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 26px;
            color: #b4e1f2;
            &-top {
                flex: 1;
                height: 0;
                padding: 24px 60px 0 14px;
                > .price {
                    margin-bottom: 4px;
                    font-size: 56px;
                    line-height: 42px;
                    color: #ffe31a;
                    @include elps();
                    &:before {
                        content: '￥';
                        font-size: 24px;
                    }
                }
                > p {
                    @include elps();
                }
            }
            &-bottom {
                height: 44px;
                line-height: 44px;
                text-align: center;
                font-size: 24px;
                color: #00237a;
            }
        }
    }
}

</style>
