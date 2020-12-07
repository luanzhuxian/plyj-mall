<template>
    <div>
        <Field
            :class="$style.field"
            label="优惠券"
            :label-width="120"
            clickable
            @click="clickHandler"
        >
            <span
                v-for="(item, i) of couponList"
                :key="i"
                :class="$style.coupontItem"
            >
                <template v-if="item.couponType === 3">
                    福利红包抵{{ item.amount }}
                </template>
                <template v-else>
                    满{{ item.useLimitAmount }}减{{ item.amount }}
                </template>
            </span>
        </Field>

        <!-- 优惠券弹框 -->
        <pl-popup
            :show.sync="showCoupon"
            title="领取优惠券"
            title-align="left"
        >
            <div :class="$style.coupon">
                <p class="fz-28 gray-3">先领优惠券，购物更划算</p>
                <div :class="$style.couponList">
                    <template v-for="(item, i) of couponList">
                        <CouponItem
                            :key="i"
                            :coupon-type="Number(item.couponType)"
                            :coupon-id="item.id"
                            :name="item.couponName"
                            :amount="item.amount"
                            :full="item.useLimitAmount"
                            :subtract="item.amount"
                            :red-packet-activity-id="item.activityId"
                            :instruction="item.brief"
                            :use-end-time="item.useEndTime"
                            :use-start-time="item.useStartTime"
                            :receive-count="item.count"
                            :price="Number(item.orderPrice)"
                            :can-receive="item.canReceive"
                        />
                    </template>
                </div>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import Field from './Field.vue'
import CouponItem from '../my/coupon/Coupon-Item.vue'

export default {
    name: 'CounponField',
    components: {
        Field,
        CouponItem
    },
    props: {
        couponList: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            showCoupon: false,
            // 增加节流阀
            isCouponLoading: false
        }
    },
    computed: {
        couponText () {
            let text = ''
            for (const [index, item] of this.couponList.entries()) {
                text += `满${ item.useLimitAmount }减${ item.amount }${ index === this.couponList.length - 1 ? '' : '、' }`
            }
            return text
        }
    },
    methods: {
        clickHandler (e) {
            this.showCoupon = true
        }
    }
}
</script>

<style module lang="scss">
    .field {
        margin-top: 20px;
        padding: 0 24px;
    }
    .coupontItem {
        line-height: 36px;
        color: #FE7700;
        &:nth-last-of-type(1) {
            &:after {
            content: '';
            }
        }
        &:after {
            content: ',';
            color: #333;
        }
    }

    .coupon {
        padding: 0 24px;
        > .coupon-list {
            margin-top: 48px;
        }
    }
</style>
