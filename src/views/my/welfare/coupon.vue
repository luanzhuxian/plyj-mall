<template>
  <div>
    <div :class="$style.walfareTip" v-if="hasPackages">
      <!--TODO.闹铃的icon图-->
      <pl-icon name="icon-alarm" color="#fff" size="18" type="icon" />
      <span>
        您有一个新人有礼优惠大礼包，还未领取哦！
        <pl-icon name="icon-arrow-right" color="#fff" size="16" font-weight="bolder" />
      </span>
    </div>
    <div :class="$style.coupons">
      <div :class="$style.couponsHeader">
        <div>
          <b>可用优惠卷</b>
          <span>  ({{ couponsNumber }}张)</span>
        </div>
        <button @click="isManagementState = !isManagementState">管理</button>
      </div>
      <div :class="$style.couponsView">
        <load-more
          :request-methods="getMyCouponList"
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
        <div v-if="couponList.length !== 0">
          <div v-if="!isManagementState">
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
          </div>
          <div v-if="isManagementState">
            <pl-checkbox-group
              v-model="checkedList"
              ref="checkboxGroup"
              @change="selectedChange"
            >
              <pl-checkbox
                v-for="(item, i) of products"
                :key="i"
                :data="item"
                :gap-column="24"
                border
              >
                <template v-slot:suffix="{ data }">
                  <CartItem
                    :data="data"
                    :disabled="isManage"
                    @countChange="computeMoney"
                    @skuClick="skuClick(data)"
                    @change="getList"
                  />
                </template>
              </pl-checkbox>
            </pl-checkbox-group>
          </div>
        </div>
        <div v-if="couponList.length === 0">
          <!--TODO.没有一张优惠卷-->
        </div>
      </div>
    </div>
    <div :class="$style.footer">
      <router-link :to="{ name: 'HistoryCoupon'}">
        优惠劵历史记录
      </router-link>
      <router-link :to="{ name: 'CouponCenter'}">
        领更多好券
      </router-link>
    </div>
  </div>
</template>

<script>
import { getMyCouponList } from '../../../apis/my'

export default {
  name: 'MyCoupon',
  data () {
    return {
      hasPackages: true, // TODO.默认false
      isManagementState: false,
      couponsNumber: 0,
      couponList: [],
      checkedList: [],
      deleteCouponList: [],
      getMyCouponList,
      form: {
        current: 1,
        size: 10
      }
    }
  },
  mounted () {
    if (this.$refs.loadMore) this.$refs.loadMore.refresh()
  },
  methods: {
    selectedChange () {

    },
    refreshHandler (list) {
      this.checkedList = this.formatCouponList(list)
    }

  }
}
</script>

<style module lang="scss">
  .walfare-tip {
    height: 64px;
    line-height: 64px;
    text-align: center;
    margin: 10px 50px;
    background: #F67070;
    box-shadow: 0px 10px 20px #000;
    opacity: 1;
    border-radius: 258px;

    i {
      color: #fff;
    }

    span {
      color: #fff;
      font-size: 26px;
      font-weight: 400;
      line-height: 36px;
      position: relative;

      b {
        font-family: cursive;
      }
    }
  }

  .coupons {
    margin-left: 10px;
    margin-right: 10px;

    .coupons-header {
      font-size: 32px;
      font-weight: 800;
      line-height: 44px;
      color: #333;
      margin: 40px 0;

      div {
        float: left;
      }

      button {
        float: right;
      }

      button:after {
        clear: both;
      }
    }
  }

  .footer {
    position: fixed;
    height: 96px;
    line-height: 96px;
    text-align: center;
    width: 100%;
    background: #FE7700;
    left: 0;
    bottom: 0;
    display: flex;

    :first-child {
      background: #F2B036;
    }

    a {
      font-size: 32px;
      font-weight: 400;
      color: #fff;
      flex: 1;
    }
  }
</style>
