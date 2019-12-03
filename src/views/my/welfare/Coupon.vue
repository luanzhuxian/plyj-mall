<template>
  <div>
    <div :class="$style.walfareTip" v-if="hasPackages">
      <pl-svg name="icon-alarm" fill="#fff" width="18" />
      <span>
        您有一个新人有礼优惠大礼包，还未领取哦！
        <pl-svg name="icon-right" fill="#fff" width="16" />
      </span>
    </div>
    <div :class="$style.coupons">
      <div :class="$style.tabMenu">
        <tab :tabs="menuArray" :active-id.sync="activeMenuId" :color9="true" />
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
              <pl-svg name="icon-coupon1" width="240" height="240" />
            </div>
            <div v-for="item in couponList" :key="item.id"
                 :class="[$style.couponsViewItem, isManagementState ? $style.checkBox : '']"
                 @click="selectedChange(item.id)"
            >
              <span v-if="isManagementState">
                <pl-svg v-if="!item.checked" name="icon-weixuanzhong" fill="#FFCCCCCC" width="40" />
                <pl-svg v-if="item.checked" name="icon-xuanzhong" fill="40" width="40" />
              </span>
              <CouponItem
                :class="$style.moveCoupon"
                :id="item.id"
                :name="item.couponName"
                :amount="item.amount"
                :full="item.useLimitAmount"
                :subtract="item.amount"
                :instruction="item.brief"
                :use-start-time="item.useStartTime"
                :use-end-time="item.useEndTime"
                :is-available-status="true"
                :coupon-type="item.couponType"
                :coupon-id="item.coupon"
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
          福利中心 领好券
        </router-link>
      </div>
      <button v-if="isManagementState" @click="deleteCoupon">删除</button>
    </div>
  </div>
</template>

<script>
import tab from '../../../components/penglai-ui/Tab'
import CouponItem from '../../../components/item/Coupon-Item.vue'
import LoadMore from '../../../components/common/Load-More.vue'
import { getMyCouponList, deleteCouponList } from '../../../apis/my-coupon'

export default {
  name: 'MyCoupon',
  components: {
    CouponItem,
    LoadMore,
    tab
  },
  data () {
    return {
      hasPackages: false, // TODO.暂时去除
      menuArray: [{ name: '全部', id: '' }, { name: '满减券', id: 1 }, { name: '品类券', id: 2 }],
      activeMenuId: '',
      isManagementState: false,
      couponList: [],
      couponTotal: 0,
      getMyCouponList,
      form: {
        current: 1,
        size: 10,
        status: 0,
        couponType: ''
      }
    }
  },
  mounted () {
    if (this.$refs.loadMore) this.$refs.loadMore.refresh()
  },
  activated () {
    this.$refs.loadMore.refresh()
  },
  deactivated () {
    this.activeMenuId = ''
    this.isManagementState = false
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
        await this.$confirm(`确定删除这${length}张优惠券？`)
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
    },
    activeMenuId (val) {
      this.isManagementState = false
      this.form.couponType = val
      this.$refs.loadMore.refresh()
    }
  }
}
</script>

<style module lang="scss">
  .walfare-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    margin: 10px 50px;
    color: #fff;
    font-size: 26px;
    background-color: #F67070;
    box-shadow: 0 10px 20px rgba(0, 0, 0, .2);
    border-radius: 258px;
  }

  .coupons {
    .tab-menu {
      display: flex;
      background-color: #fff;
      padding-right: 24px;

      button {
        font-size: 32px;
        font-weight: 400;
        line-height: 44px;
        color: #333;
        margin-left: auto;
      }
    }
    .coupons-view {
      width: 100%;
      padding-top: 16px;
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
        padding-right: 24px;
        padding-left: 24px;

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
