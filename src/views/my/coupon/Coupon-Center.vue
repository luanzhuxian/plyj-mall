<template>
    <div>
        <div :class="$style.banner">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/my/485f13c1-6d89-4b22-8852-ac84f87f498a.png">
        </div>
        <div :class="$style.couponList">
            <div :class="$style.couponHeader">
                <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/coupon2.png" width="40" height="33" />
                <span>优惠券</span>
            </div>
            <div :class="$style.couponView">
                <load-more
                    :request-methods="getAvailableCouponList"
                    :form="form"
                    @refresh="refreshHandler"
                    @more="refreshHandler"
                    ref="loadMore"
                    no-content-tip="暂无优惠券"
                    no-icon
                >
                    <template>
                        <div name="icon" :class="$style.noCouponIcon" v-if="couponList.length === 0">
                            <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/newCouponIcon.png" width="400" />
                        </div>
                        <CouponItem
                            v-for="item in couponList"
                            :key="item.id"
                            :coupon-id="item.id"
                            :coupon-type="Number(item.couponType)"
                            :price="Number(item.orderPrice)"
                            :name="item.couponName"
                            :amount="item.amount"
                            :full="item.useLimitAmount"
                            :red-packet-activity-id="item.activityId"
                            :subtract="item.amount"
                            :instruction="item.brief"
                            :use-start-time="item.useStartTime"
                            :use-end-time="item.useEndTime"
                            :receive-count="item.count"
                            :can-receive="item.canReceive"
                        />
                    </template>
                </load-more>
            </div>
        </div>
        <div :class="$style.footer">
            <router-link :to="{ name: 'MyCoupon'}">
                我的卡券
            </router-link>
        </div>
    </div>
</template>

<script>
import CouponItem from '../../../components/my/coupon/Coupon-Item.vue'
import LoadMore from '../../../components/common/Load-More.vue'
import { getAvailableCouponList } from '../../../apis/my-coupon'

export default {
    name: 'CouponCenter',
    components: {
        CouponItem,
        LoadMore
    },
    data () {
        return {
            couponList: [],
            form: {
                current: 1,
                size: 10
            },
            getAvailableCouponList,
            // 增加节流阀
            isCouponLoading: false
        }
    },
    activated () {
        if (this.$refs.loadMore) this.$refs.loadMore.refresh()
    },
    methods: {
        refreshHandler (list) {
            this.couponList = list
        }
    }
}
</script>

<style module lang="scss">
  .banner {
    img {
      width: 100%;
    }
  }

  .coupon-list {
    margin-top: 32px;
    margin-left: 22px;

    .coupon-header {
      line-height: 44px;

      img {
        vertical-align: -4px;
      }

      span {
        margin-left: 20px;
        font-size: 32px;
        font-weight: 800;
        color: #333;
      }
    }

    .coupon-view {
      margin-bottom: 100px;
      padding-right: 24px;
      .no-coupon-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 300px;
        margin-bottom: -200px;
      }
    }
  }

  .footer {
    position: fixed;
    height: 96px;
    line-height: 96px;
    text-align: center;
    width: 100%;
    background: #F2B036;
    left: 0;
    bottom: 0;

    a {
      font-size: 32px;
      font-weight: 400;
      color: #fff;
    }
  }
</style>
