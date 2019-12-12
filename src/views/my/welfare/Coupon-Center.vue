<template>
  <div>
    <div :class="$style.banner">
      <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/my/receive-coupon-banner.jpg">
    </div>
    <div :class="$style.couponList">
      <div :class="$style.couponHeader">
        <pl-svg name="icon-coupon2" width="40" height="33" />
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
              <pl-svg name="icon-newCouponIcon" width="400" />
            </div>
            <CouponItem
              v-for="item in couponList"
              :key="item.id"
              :id="item.id"
              :name="item.couponName"
              :amount="item.amount"
              :full="item.useLimitAmount"
              :subtract="item.amount"
              :instruction="item.brief"
              :use-start-time="item.useStartTime"
              :use-end-time="item.useEndTime"
              :receive-count="item.count"
              :coupon-type="item.couponType"
              :is-over-max="!item.canReceive"
              :is-claimed="!!item.isClaimed"
              @couponClick="couponClick(item.id)"
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
import CouponItem from '../../../components/item/Coupon-Item.vue'
import LoadMore from '../../../components/common/Load-More.vue'
import { getAvailableCouponList, receiveCoupon } from '../../../apis/my-coupon'

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
      isCouponLoading: false // 增加节流阀
    }
  },
  activated () {
    if (this.$refs.loadMore) this.$refs.loadMore.refresh()
  },
  methods: {
    async couponClick (id) {
      if (this.isCouponLoading) return
      try {
        this.isCouponLoading = true
        const { result } = await receiveCoupon({
          couponId: id
        })
        result.isClaimed = true
        // 只刷新所领取卡券信息
        let oldCouponIndex = this.couponList.findIndex(item => item.id === id)
        this.couponList.splice(oldCouponIndex, 1)
        this.couponList.splice(oldCouponIndex, 0, result)
        this.$success('领取成功')
      } catch (e) {
        throw e
      } finally {
        this.isCouponLoading = false
      }
    },
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

      svg {
        display: inline-block;
        vertical-align: text-bottom;
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
