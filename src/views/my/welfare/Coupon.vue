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
          <span>  ({{ couponTotal }}张)</span>
        </div>
        <button @click="isManagementState = !isManagementState">管理</button>
      </div>
      <div :class="$style.couponsView">
        <load-more
          :request-methods="getMyCouponList"
          :form="form"
          @refresh="refreshHandler"
          ref="loadMore"
          no-content-tip="暂无优惠券"
          no-icon
        >
          <template>
            <div name="icon" :class="$style.noCouponIcon" v-if="couponList.length === 0">
              <pl-icon name="icon-coupon1" width="240" height="240" type="svg" />
            </div>
            <div v-for="item in couponList" :key="item.id"
                 :class="[$style.couponsViewItem, isManagementState ? $style.checkBox : '']"
                 @click="selectedChange(item.id)"
            >
              <span v-if="isManagementState">
                <pl-icon v-if="!item.checked" name="icon-weixuanzhong" color="#FFCCCCCC" size="40" type="icon" />
                <pl-icon v-if="item.checked" name="icon-xuanzhong" width="40" height="40" type="svg" />
              </span>
              <CouponItem
                :class="$style.moveCoupon"
                :id="item.id"
                :name="item.name"
                :amount="item.amount"
                :full="item.useLimitAmount"
                :subtract="item.amount"
                :instruction="item.brief"
                :use-start-time="item.useStartTime"
                :use-end-time="item.useEndTime"
                :is-available-status="true"
              />
            </div>
          </template>
        </load-more>
      </div>
    </div>
    <div :class="$style.footer">
      <div :class="$style.link" v-if="!isManagementState">
        <router-link :to="{ name: 'HistoryCoupon'}">
          优惠劵历史记录
        </router-link>
        <router-link :to="{ name: 'CouponCenter'}">
          领更多好券
        </router-link>
      </div>
      <button v-if="isManagementState" @click="deleteCoupon">删除</button>
    </div>
  </div>
</template>

<script>
import CouponItem from '../../../components/item/Coupon-Item.vue'
import LoadMore from '../../../components/Load-More.vue'
import { getMyCouponList, deleteCouponList } from '../../../apis/my-coupon'

export default {
  name: 'MyCoupon',
  components: {
    CouponItem,
    LoadMore
  },
  data () {
    return {
      hasPackages: false, // TODO.暂时去除
      isManagementState: false,
      couponList: [],
      couponTotal: 0,
      getMyCouponList,
      form: {
        current: 1,
        size: 10,
        status: 0
      }
    }
  },
  mounted () {
    if (this.$refs.loadMore) this.$refs.loadMore.refresh()
  },
  activated () {
    this.$refs.loadMore.refresh()
  },
  methods: {
    formatCouponList (list) {
      list.map(item => {
        item.checked = false
      })
      return list
    },
    refreshHandler (list, total) {
      this.couponList = this.formatCouponList(list)
      this.couponTotal = total
    },
    findCurrentCouponIndex (id) {
      return this.couponList.findIndex(value => value.id === id)
    },
    selectedChange (id) {
      let index = this.findCurrentCouponIndex(id)
      let currentCoupon = this.couponList.splice(index, 1)[0]
      currentCoupon.checked = !currentCoupon.checked
      this.couponList.splice(index, 0, currentCoupon)
    },
    async deleteCoupon () {
      try {
        let deleteList = this.couponList.filter(item => item.checked).map(item => item.id)
        let length = deleteList.length
        if (!length) {
          this.$warning('您没有选中任何优惠券')
          return
        }
        await this.$confirm(`确定删除将这${length}张优惠券删除？`)
        const { result, message } = await deleteCouponList(deleteList)
        if (result) {
          this.$success('删除成功')
          this.isManagementState = false
          this.$refs.loadMore.refresh()
        } else {
          this.$error(message)
        }
      } catch (e) {
        throw e
      }
    }
  },
  watch: {
    isManagementState: function (val) {
      if (val) this.couponList = this.formatCouponList(this.couponList)
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

    .coupons-view {
      width: 100%;
      padding-top: 80px;
      margin-bottom: 100px;
      .no-coupon-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 400px;
        margin-bottom: -200px;
      }

      .coupons-view-item {
        overflow: hidden;
        position: relative;

        > span {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 32px;
        }
        > div{
          transition: marginLeft 1s linear;
        }
      }

      .check-box {
        > div {
          margin-left: 100px;
        }
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
    font-size: 32px;
    font-weight: 400;

    button {
      color: #fff;
    }

    .link {
      display: flex;

      :first-child {
        background: #F2B036;
      }

      a {
        color: #fff;
        flex: 1;
      }
    }

  }
</style>
