<template>
  <div>
    <div :class="$style.banner">
      <img src="../../../assets/images/my/receive-coupon-banner.jpg">
    </div>
    <div :class="$style.couponList">
      <div :class="$style.couponHeader">
        <pl-icon name="icon-coupon1" width="40" height="33" type="svg" />
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
          icon="icon-coupon"
        >
          <template>
            <CouponItem
              v-for="item in couponList"
              :key="item.id"
              :id="item.id"
              :name="item.name"
              :amount="item.amount"
              :full="item.useLimitAmount"
              :subtract="item.amount"
              :instruction="item.brief"
              @receiveCoupon="receiveCoupon(item.id)"
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
import LoadMore from '../../../components/Load-More.vue'
import { getAvailableCouponList, receiveCoupon } from '../../../apis/my'

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
      getAvailableCouponList
    }
  },
  created () {
    this.form.userId = this.userId
    try {
      this.getAvailableCouponList()
    } catch (e) {
      throw e
    }
  },
  mounted () {
    if (this.$refs.loadMore) this.$refs.loadMore.refresh()
  },
  methods: {
    async receiveCoupon (id) {
      try {
        const { result, message } = await receiveCoupon(id)
        if (result) {
          this.$success('领取成功')
          this.$refs.loadMore.refresh()
        } else {
          this.$error(message)
        }
      } catch (e) {
        throw e
      }
    },
    formatCouponList (list) {
      list.map(item => {
        item.status = item.canReceive ? '' : '已领取'
      })
      return list
    },
    refreshHandler (list) {
      this.couponList = this.formatCouponList(list)
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
      padding-right: 24px;
      margin-bottom: 100px;
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
