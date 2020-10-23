<template>
    <router-link :class="$style.coupon" tag="div" :to="{ name: 'CouponCenter' }">
        <div :class="$style.couponTitle">
            <h3>领券不停，福利多多</h3>
            <span>·  更多优惠——快来领取  ·</span>
        </div>
        <ul :class="$style.couponList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo"
                    :class="$style.couponListItem"
                    :key="i"
                >
                    <div :class="$style.couponListItemName">
                        {{ item.goodsInfo.couponName }}
                    </div>
                    <div :class="$style.couponListItemLeft">
                        <b :class="$style.price" v-text="item.goodsInfo.amount" />
                    </div>
                    <div :class="$style.couponListItemMiddle">
                        <p :class="$style.rule">
                            {{ `满${item.goodsInfo.useLimitAmount}` }}
                        </p>
                        <p :class="$style.rule">
                            {{ `减${item.goodsInfo.amount}` }}
                        </p>
                    </div>
                    <button :class="$style.couponListItemBtn">
                        立即抢券
                    </button>
                </li>
            </template>
        </ul>
    </router-link>
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
    methods: {
        getDate
    }
}
</script>

<style lang="scss" module>
.coupon {
    position: relative;
    padding: 0 40px 24px;
    background: #FFFBF1;
    border-radius: 20px;
    // overflow: hidden;
    &::before {
        content: '';
        position: absolute;
        top: 114px;
        left: -12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #DB451B;
    }
    &::after {
        content: '';
        position: absolute;
        top: 114px;
        right: -12px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #DB451B;
    }
    &-title {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        height: 128px;
        border-bottom: 4px solid #F0CEAC;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/logo-large.png') no-repeat center bottom;
        background-size: 452px 120px;
        > h3 {
            font-size: 40px;
            line-height: 54px;
            color: #D80000;
        }
        > span {
            padding-bottom: 14px;
            font-size: 20px;
            line-height: 28px;
            color: #BA9E61;
        }
    }
    &-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-wrap: nowrap;
        padding: 34px 0;
        &-item {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            margin-top: 20px;
            padding: 0 24px;
            width: 100%;
            height: 142px;
            background: linear-gradient(176deg, #FFEFCC 0%, #EDCC86 76%, #FFDD95 100%);
            border-radius: 12px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
            &-name {
                position: absolute;
                top: 14px;
                left: -8px;
                box-sizing: border-box;
                padding: 0 16px 0 8px;
                width: 192px;
                line-height: 32px;
                text-align: center;
                background: #D80000;
                font-size: 20px;
                color: #E7C06D;
                @include elps();
                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-top: 16px solid transparent;
                    border-left: 8px solid transparent;
                    border-right: 8px solid #F8E8C5;
                    border-bottom: 16px solid transparent;
                    z-index: 1;

                }
            }
            &-left {
                position: relative;
                top: 6px;
                flex: 1;
                @include elps();
                > .price {
                    font-size: 60px;
                    line-height: 80px;
                    color: #D80000;
                    &:before {
                        content: '￥';
                        font-size: 40px;
                        line-height: 54px;
                    }
                }
            }
            &-middle {
                width: 176px;
                @include elps();
                .rule {
                    font-size: 28px;
                    line-height: 38px;
                    color: #A58B54;
                    @include elps();
                }
            }
            &-btn {
                margin-left: 8px;
                width: 160px;
                height: 54px;
                line-height: 54px;
                text-align: center;
                background: #D80000;
                border: none;
                border-radius: 8px;
                font-size: 28px;
                color: #FFFFFF;
            }
        }
    }
}

</style>
