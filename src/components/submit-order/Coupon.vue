<template>
    <div v-if="couponList.length > 0">
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
                    <div v-if="!this.coupon.copon && !this.coupon.redPacket">
                        <span class="fz-26 mr-10">
                            可选 <i class="warn-color-active">{{ couponList.length }}</i> 张优惠券
                        </span>
                        <pl-svg name="icon-right" fill="#c1c1c1" width="20" />
                    </div>
                    <div v-if="this.coupon.redPacket">
                        <span class="fz-26 warn-color-active mr-10" v-text="couponTypeMap[this.coupon.redPacket.couponType]" />
                        <span class="fz-26 warn-color-active mr-24">满{{ this.coupon.redPacket.useLimitAmount }}减{{ this.coupon.redPacket.amount }}</span>
                        <span class="fz-26 gray-4">-{{ this.coupon.redPacket.amount }}</span>
                        <pl-svg name="icon-right" fill="#c1c1c1" width="20" />
                    </div>
                    <div v-if="this.coupon.coupon">
                        <span class="fz-26 warn-color-active mr-10" v-text="couponTypeMap[this.coupon.coupon.couponType]" />
                        <span class="fz-26 warn-color-active mr-24">满{{ this.coupon.coupon.useLimitAmount }}减{{ this.coupon.coupon.amount }}</span>
                        <span class="fz-26 gray-4">-{{ this.coupon.coupon.amount }}</span>
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
                        :label="item.id"
                        :cancel-value="''"
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
                        :label="item.id"
                        :cancel-value="''"
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
import {
    getCouponByPrice,
    getCouponOfMax

    /* getRedEnvelopeListByPrice */
} from '../../apis/my-coupon'
import moment from 'moment'
export default {
    name: 'SubmitOrderCoupon',
    data () {
        return {
            showCoupon: false,
            noJoin: false,
            checkedRedpacket: '',
            checkedCoupon: '',
            couponList: []
        }
    },
    props: {
        // 活动状态（2 进行中）
        preActivity: {
            type: Number,
            default: 1
        },
        // 活动类型
        activeProduct: {
            type: Number,
            default: 1
        },
        // 商品列表
        products: {
            type: Array,
            default () {
                return []
            }
        },
        // 兑换码信息
        exchangeCodeInfo: {
            type: Object,
            default () {
                return null
            }
        },
        addressId: {
            type: String,
            default: ''
        },
        // 当前选择的优惠券
        coupon: {
            type: Object,
            default () {
                return {
                    redPacket: null,
                    coupon: null
                }
            }
        },
        // 推荐的优惠券
        recommendCoupon: {
            type: Object,
            default () {
                return {}
            }
        },
        serverTime: {
            type: [String, Number],
            default: 0
        }
    },
    computed: {
        ...mapGetters(['couponTypeMap']),
        ...mapGetters('submitOrder', ['orderProducts']),
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
        exchangeCodeInfo (val) {
            if (val) {
                this.checkedRedpacket = ''
                this.checkedCoupon = ''
            }
        },
        noJoin (val) {
            if (val) {
                this.checkedRedpacket = ''
                this.checkedCoupon = ''
            }
        },
        checkedCoupon (val) {
            this.noJoin = !val && !this.checkedRedpacket
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                const data = {
                    redPacket: this.couponList.find(item => item.id === this.checkedRedpacket) || null,
                    coupon: this.couponList.find(item => item.id === val) || null
                }
                this.$emit('change', data)
                this.$emit('update:coupon', data)
                this.$store.commit('submitOrder/setOrderProducts', {
                    discountModel: {
                        couponModel: data
                    }
                })
            })
        },
        checkedRedpacket (val) {
            this.noJoin = !val && !this.checkedCoupon
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                const data = {
                    redPacket: this.couponList.find(item => item.id === val) || null,
                    coupon: this.couponList.find(item => item.id === this.checkedCoupon) || null
                }
                this.$emit('change', data)
                this.$emit('update:coupon', data)
                this.$store.commit('submitOrder/setOrderProducts', {
                    discountModel: {
                        couponModel: data
                    }
                })
            }, 100)
        }
    },
    async mounted () {
        const COUPON_DATA = {
            activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
            activityId: this.activityId,
            cartProducts: this.products,
            addressSeq: this.addressId
        }
        await this.getCouponList(COUPON_DATA)
        if (this.couponList.length === 0) return

        // 取出缓存的数据
        const { discountModel } = this.orderProducts
        discountModel.couponModel = discountModel.couponModel || { redPacket: null, coupon: null }
        const { couponModel: { redPacket, coupon } } = discountModel
        if (!redPacket && !coupon) {
            await this.getRecommedCoupon(COUPON_DATA)
        }
        if (redPacket) this.checkedRedpacket = redPacket.id
        if (coupon) this.checkedCoupon = coupon.id
    },
    methods: {
        // 优惠券列表
        async getCouponList (COUPON_DATA) {
            // 初始化优惠券列表
            const { result } = await getCouponByPrice(COUPON_DATA)
            // 设置优惠券列表
            this.couponList = result.map(item => {
                const duration = moment(item.useEndTime).valueOf() - moment(this.serverTime).valueOf()
                const day = Math.floor(moment.duration(duration).asDays())
                item.timeDesc = ''
                if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                return item
            })
            this.$emit('loaded', this.couponList)
        },
        // 推荐的优惠券
        async getRecommedCoupon (COUPON_DATA) {
            const { result } = await getCouponOfMax(COUPON_DATA)
            const recommend = this.couponList.find(item => item.id === result.id)
            recommend ? recommend.couponType === 3 ? this.checkedRedpacket = recommend.id : this.checkedCoupon = recommend.id : this.noJoin = true
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
