<template>
    <div>
        <div
            v-if="(coupon.amount || !coupon.id) && activeProduct === 1"
            :class="$style.itemSelector"
            @click.capture="showCoupon = true"
        >
            <pl-fields
                size="middle"
                text="优惠"
                icon="icon-coupon"
                :icon-gap="12"
                show-right-icon
                :right-text="!coupon.id ? couponList.length +'张可用' : '-¥' + coupon.amount "
                left-text-weight="bold"
            />
        </div>
        <pl-popup
            :show.sync="showCoupon"
            title="领取优惠券"
            title-align="left"
        >
            <div :class="$style.coupon">
                <p class="fz-28 gray-3">先领优惠券，购物更划算</p>
                <div :class="$style.couponList">
                    <template v-for="(item, i) of couponList">
                        <div :key="i" :class="$style.couponItem" @click="couponClick(item)">
                            <div :class="$style.button">省{{ item.amount }}</div>
                            <div :class="$style.full">满{{ item.useLimitAmount }}减{{ item.amount }}</div>
                            <span :class="$style.timeDesc">{{ item.timeDesc }}</span>
                            <span :class="$style.recommend" v-if="recommendCouponId === item.id">推荐使用</span>
                            <span :class="$style.choices">
                                <pl-svg v-if="item.id === coupon.id" name="icon-xuanzhong" width="40" />
                                <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                            </span>
                        </div>
                    </template>
                    <div :class="$style.couponItem" @click="couponClick({})">
                        <div :class="$style.notChooseCoupon">不参加优惠</div>
                        <span :class="$style.choices">
                            <pl-svg v-if="!coupon.id" name="icon-xuanzhong" width="40" />
                            <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                        </span>
                    </div>
                </div>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import { getCouponByPrice, getCouponOfMax } from '../../../apis/my-coupon'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name: 'SubmitOrderCoupon',
    data () {
        return {
            showCoupon: false,
            coupon: {},
            couponList: [],
            recommendCouponId: ''
        }
    },
    props: {
        activeProduct: {
            type: Number,
            default: 1
        },
        serverTime: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters(['selectedAddress'])
    },
    async mounted () {
        try {
            const CONFIRM_LIST = JSON.parse(sessionStorage.getItem('CONFIRM_LIST'))
            await this.getCouponList(CONFIRM_LIST)
            await this.getCouponOfMax(CONFIRM_LIST)
        } catch (e) {
            throw e
        }
    },
    methods: {
        // 根据商品总价，获取合适的优惠券，并设置为当前的优惠券
        async getCouponOfMax (proList = []) {
            try {
                // 获取优惠券信息
                const { result } = await getCouponOfMax({
                    activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
                    activityId: this.activityId,
                    cartProducts: proList,
                    addressSeq: this.selectedAddress.sequenceNbr
                })
                this.coupon = result.id ? result : { scholarship: 1 }
                this.$emit('change', JSON.parse(JSON.stringify(this.coupon)))
                this.recommendCouponId = result.id
            } catch (e) {
                throw e
            }
        },
        // 获取优惠券列表
        async getCouponList (proList) {
            try {
                if (this.activeProduct !== 1) return
                const { result } = await getCouponByPrice({
                    activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
                    activityId: this.activityId,
                    cartProducts: proList,
                    addressSeq: this.selectedAddress.sequenceNbr
                })
                const { serverTime } = this
                this.couponList = result.map(item => {
                    const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
                    const day = Math.floor(moment.duration(duration).asDays())
                    item.timeDesc = ''
                    if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                    return item
                })
            } catch (e) {
                throw e
            }
        },
        // 选择优惠券, 选择完成后，重新计算价格
        async couponClick (item) {
            this.$emit('change', JSON.parse(JSON.stringify(item)))
            this.coupon = item
        }
    }
}
</script>

<style module lang="scss">
    .item-selector {
        margin-bottom: 20px;
        padding-left: 24px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
    }
    .coupon {
        padding: 0 24px;
        > .coupon-list {
            margin-top: 48px;
            padding-bottom: 40px;

            .coupon-item {
                height: 72px;
                line-height: 72px;
                position: relative;
                overflow: hidden;
                font-size: 24px;

                .button {
                    display: inline-block;
                    width: 120px;
                    height: 40px;
                    border: 2px solid #F2B036;
                    border-radius: 8px;
                    line-height: 40px;
                    color: #F2B036;
                    text-align: center;
                    margin-top: 10px;
                    float: left;
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
                    color:#FE0D0D;
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
