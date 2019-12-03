<template>
  <div>
    <Field
      label="优惠券"
      can-click
      :label-width="120"
      @click="clickHandler"
    >
      <span
        v-for="(item, i) of couponList"
        :key="i"
        :class="$style.coupontItem"
      >
        满{{ item.useLimitAmount }}减{{ item.amount }}
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
              :name="item.couponName"
              :amount="item.amount"
              :full="item.useLimitAmount"
              :subtract="item.amount"
              :instruction="item.brief"
              :use-end-time="item.useEndTime"
              :use-start-time="item.useStartTime"
              :receive-count="item.count"
              :coupon-type="item.couponType"
              @couponClick="couponClick(item.id)"
            />
          </template>
        </div>
      </div>
    </pl-popup>
  </div>
</template>

<script>
import Field from '../../../components/detail/Field.vue'
import CouponItem from '../../../components/item/Coupon-Item.vue'
import { receiveCoupon } from '../../../apis/my-coupon'
export default {
  name: 'CounponField',
  components: {
    Field,
    CouponItem
  },
  data () {
    return {
      showCoupon: false
    }
  },
  computed: {
    couponText () {
      let text = ''
      this.couponList.map((item, index) => {
        text += `满${item.useLimitAmount}减${item.amount}${index === this.couponList.length - 1 ? '' : '、'}`
      })
      return text
    }
  },
  props: {
    couponList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    clickHandler (e) {
      this.showCoupon = true
    },
    async couponClick (id) {
      try {
        await receiveCoupon({ couponId: id })
        this.$success('领取成功')
        await this.getCouponList()
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
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
