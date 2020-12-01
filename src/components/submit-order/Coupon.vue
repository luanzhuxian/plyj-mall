<template>
    <div>
        <div
            :class="$style.itemSelector"
            @click.capture="showCoupon = true"
        >
            <pl-fields
                size="middle"
                :can-click="false"
            >
                <div>
                    <pl-svg class="mr-10" name="icon-coupon" width="40" :vertical-align="-8" />
                    <span>优惠</span>
                </div>
                <div slot="right-content" :class="$style.couponContent">
                    <div v-if="!checkedRedpacket && !checkedCoupon">
                        <span class="fz-26 mr-10">
                            可选 <i class="warn-color-active">{{ couponList.length }}</i> 张优惠券
                        </span>
                        <pl-svg name="icon-right" fill="#c1c1c1" width="20" />
                    </div>
                    <div v-if="checkedRedpacket">
                        <span class="fz-26 warn-color-active mr-10" v-text="couponTypeMap[checkedRedpacket.couponType]" />
                        <span class="fz-26 warn-color-active mr-24">满{{ checkedRedpacket.useLimitAmount }}减{{ checkedRedpacket.amount }}</span>
                        <span class="fz-26 gray-4">-{{ checkedRedpacket.amount }}</span>
                        <pl-svg name="icon-right" fill="#c1c1c1" width="20" />
                    </div>
                    <div v-if="checkedCoupon">
                        <span class="fz-26 warn-color-active mr-10" v-text="couponTypeMap[checkedCoupon.couponType]" />
                        <span class="fz-26 warn-color-active mr-24">满{{ checkedCoupon.useLimitAmount }}减{{ checkedCoupon.amount }}</span>
                        <span class="fz-26 gray-4">-{{ checkedCoupon.amount }}</span>
                        <pl-svg name="icon-right" fill="#c1c1c1" width="20" />
                    </div>
                </div>
            </pl-fields>
        </div>
        <pl-popup
            :show.sync="showCoupon"
            title="领取优惠券"
            title-align="left"
        >
            <div :class="$style.coupon">
                <p class="fz-28 gray-3">先领优惠券，购物更划算</p>
                <pl-radio-group :class="$style.couponList" v-model="checkedRedpacket">
                    <pl-radio
                        v-for="(item, i) of redPacket"
                        :key="i"
                        position="right"
                        :label="item"
                        :cancel-value="null"
                    >
                        <div :key="i" :class="$style.couponItem">
                            <div :class="$style.button">省{{ item.amount }}</div>
                            <div :class="$style.type" v-text="couponTypeMap[item.couponType]" />
                            <div :class="$style.full">满{{ item.useLimitAmount }}减{{ item.amount }}</div>
                            <span :class="$style.timeDesc">{{ item.timeDesc }}</span>
                            <span :class="$style.recommend" v-if="recommendCouponId === item.id">推荐使用</span>
                        </div>
                    </pl-radio>
                </pl-radio-group>
                <pl-radio-group :class="$style.couponList" v-model="checkedCoupon">
                    <pl-radio
                        v-for="(item, i) of coupons"
                        :key="i"
                        position="right"
                        :label="item"
                        :cancel-value="null"
                    >
                        <div :key="i" :class="$style.couponItem">
                            <div :class="$style.button">省{{ item.amount }}</div>
                            <div :class="$style.type" v-text="couponTypeMap[item.couponType]" />
                            <div :class="$style.full">满{{ item.useLimitAmount }}减{{ item.amount }}</div>
                            <span :class="$style.timeDesc">{{ item.timeDesc }}</span>
                            <span :class="$style.recommend" v-if="recommendCouponId === item.id">推荐使用</span>
                        </div>
                    </pl-radio>
                </pl-radio-group>
                <pl-radio-group :class="$style.couponList" v-model="noJoin">
                    <pl-radio :label="true" :cancel-value="false">
                        <span class="fz-24 gray-4">不参加优惠</span>
                    </pl-radio>
                </pl-radio-group>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'SubmitOrderCoupon',
    data () {
        return {
            showCoupon: false,
            noJoin: false,
            checkedRedpacket: null,
            checkedCoupon: null
        }
    },
    props: {
        // 当前选择的优惠券
        coupon: {
            type: Object,
            default () {
                return {
                    scholarship: 1
                }
            }
        },
        // 优惠券列表
        couponList: {
            type: Array,
            default () {
                return []
            }
        },
        // 推荐的优惠券
        recommendCoupon: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    computed: {
        ...mapGetters(['couponTypeMap']),
        recommendCouponId () {
            return this.recommendCoupon.id || ''
        },
        redPacket () {
            return this.couponList.filter(item => item.couponType === 3)
        },
        coupons () {
            return this.couponList.filter(item => item.couponType !== 3)
        }
    },
    watch: {
        recommendCoupon: {
            handler (val = {}) {
                const recommend = this.couponList.find(item => item.id === val.id)
                console.log(recommend)
                recommend ? recommend.couponType === 3 ? this.checkedRedpacket = recommend : this.checkedCoupon = recommend : this.noJoin = true
            },
            immediate: true
        },
        noJoin (val) {
            if (val) {
                this.checkedRedpacket = null
                this.checkedCoupon = null
            }
        },
        checkedCoupon (val) {
            this.noJoin = !val && !this.checkedRedpacket
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.$emit('change', {
                    redPacket: this.checkedRedpacket,
                    coupon: this.checkedCoupon
                })
            })
        },
        checkedRedpacket (val) {
            this.noJoin = !val && !this.checkedCoupon
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.$emit('change', {
                    redPacket: this.checkedRedpacket,
                    coupon: this.checkedCoupon
                })
            }, 100)
        }
    }
}
</script>

<style module lang="scss">
    .item-selector {
        margin-bottom: 20px;
        padding: 0 24px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
    }
    .coupon-content {
        > div {
            margin-bottom: 26px;
            text-align: right;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
        }
    }
    .coupon {
        padding: 0 24px;
        > .coupon-list {
            &:nth-last-of-type(1) {
                margin-top: 0;
                padding-bottom: 40px;
            }

            .coupon-item {
                display: flex;
                align-items: center;
                height: 64px;
                position: relative;
                overflow: hidden;
                font-size: 24px;

                .button {
                    display: inline-block;
                    width: 120px;
                    height: 40px;
                    border: 2px solid $--warning-color;
                    border-radius: 8px;
                    line-height: 40px;
                    color: $--warning-color;
                    text-align: center;
                    float: left;
                }

                .type {
                    margin-left: 20px;
                    color: $--warning-color-active;
                    font-size: 28px;
                }

                .full {
                    display: inline-block;
                    font-size: 28px;
                    color: #373737;
                    float: left;
                    margin-left: 20px;
                }

                .time-desc {
                    display: inline-block;
                    color: #B5B5B5;
                    float: left;
                    margin-left: 20px;
                }
                .recommend {
                    color: #FE0D0D;
                    margin-left: 20px;
                }
                .choices {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    >svg {
                        vertical-align: middle;
                    }
                }
                .not-choose-coupon{
                    font-size:28px;
                    line-height: 72px;
                    color:#C1C1C1;
                }
            }
        }
    }
</style>
<style scoped lang="scss">
    ::v-deep {
        .pl-fields_box.middle {
            padding: 26px 0;
            align-items: flex-start;
            height: max-content;
        }
    }
</style>
