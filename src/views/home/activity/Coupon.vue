<template>
    <div>
        <div :class="$style.coupon">
            <router-link :class="$style.couponTitle" tag="div" :to="{ name: 'CouponCenter' }">
                <div :class="$style.couponTitleLeft">
                    <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/speaker.png" width="27" height="27" />
                    您有优惠券可使用！
                </div>
                <div :class="$style.couponTitleRight">
                    <span>立即领取</span>
                    <pl-svg name="icon-right" width="28" height="28" fill="#7E6E4D" />
                </div>
            </router-link>
            <ul :class="$style.couponList" v-if="data.values.length">
                <template v-for="(item, i) of data.values">
                    <router-link
                        v-if="item.goodsInfo"
                        :class="{
                            [$style.couponListItem]: true,
                            [$style.large]: data.values.length === 1,
                            [$style.medium]: data.values.length === 2,
                            [$style.small]: data.values.length === 3
                        }"
                        :key="i"
                        tag="li"
                        :to="{ name: 'CouponCenter' }"
                    >
                        <div :class="$style.couponListItemWrapper">
                            <div :class="$style.price">
                                ￥<span :class="$style.number">{{ item.goodsInfo.amount }}</span>
                            </div>
                            <div>
                                <div :class="$style.rule">{{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}</div>
                                <div :class="$style.date">
                                    <span>{{ `${getDate(item.goodsInfo.useStartTime, 'MM/DD')}-${getDate(item.goodsInfo.useEndTime, 'MM/DD')}` }}</span>
                                </div>
                            </div>
                        </div>
                        <div :class="$style.couponListItemCover">
                            立即领取
                        </div>
                    </router-link>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import { getDate } from '../../activity/helper'

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

<style module lang="scss">
.coupon {
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, .05);
    overflow: hidden;
    &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        font-size: 24px;
        line-height: 64px;
        background: #fbefd7;
        color: #7e6e4d;
        &-left {
            display: flex;
            align-items: center;
            font-size: 26px;
            font-family: Microsoft YaHei;
            color: #ff8533;
            letter-spacing: 2px;
            > img {
                margin-right: 10px;
            }
        }
        &-right {
            display: flex;
            align-items: center;
            > svg {
                margin-left: 10px;
            }
        }
    }
    &-list {
        display: flex;
        justify-content: space-around;
        padding: 24px 12px 40px;
        &-item {
            position: relative;
            box-sizing: border-box;
            padding: 10px;
            width: 214px;
            font-size: 20px;
            color: #f34436;
            background-color: #fbefd7;
            border-radius: 10px;
            &.large {
                width: 570px;
                font-size: 28px;
                .coupon-list-item-wrapper {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                    padding-right: 44px;
                    box-sizing: border-box;
                    height: 142px;
                }
                .price {
                    margin-right: 6px;
                    font-size: 48px;
                }
                .number {
                    font-size: 76px;
                }
                .rule {
                    font-size: 28px;
                }
                .date {
                    font-size: 28px;
                }
                .coupon-list-item-cover {
                    font-size: 26px;
                    line-height: 30px;
                }
            }
            &.medium {
                width: 320px;
                .price {
                    font-size: 30px;
                }
                .number {
                    font-size: 44px;
                }
                .rule {
                    font-size: 22px;
                }
                .date {
                    font-size: 22px;
                }
                .coupon-list-item-cover {
                    font-size: 22px;
                    line-height: 25px;
                }
            }
            &-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 6px 45px 12px 12px;
                height: 100%;
                border: 2px solid #f29e5e;
                border-style: dashed;
                border-radius: 10px;
            }
            &-cover {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 16px;
                width: 54px;
                background: #f6ce9a;
                border-radius: 0 10px 10px 0;
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                line-height: 22px;
                color: #f34436;
            }
            .price {
                font-size: 24px;
                margin-right: 6px;
                @include elps();
            }
            .number {
                font-size: 32px;
                font-family: San Francisco Display;
                font-weight: bold;
            }
            .rule {
                font-size: 20px;
                @include elps-wrap(2);
            }
            .date {
                margin-top: auto;
                font-size: 18px;
                font-family: San Francisco Display;
                @include elps();
            }
        }
    }
}

</style>
