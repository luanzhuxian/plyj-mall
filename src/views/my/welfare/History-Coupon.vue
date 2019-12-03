<template>
  <div>
    <div :class="$style.historyCoupon">
      <div :class="$style.tabMenu">
        <tab :tabs="menuArray" :active-id.sync="activeMenuId" :color9="true" />
        <button @click="isManagementState = !isManagementState">管理</button>
      </div>
      <div v-show="activeMenuId === 1" :class="$style.couponsView">
        <load-more
          :request-methods="getMyCouponList"
          :form="usedCouponorForm"
          @refresh="refreshHandler"
          ref="usedCouponorLoadMore"
          no-content-tip="暂无优惠券"
          no-icon
        >
          <template>
            <div name="icon" :class="$style.noCouponIcon" v-if="usedCouponList.length === 0">
              <pl-svg name="icon-newCouponIcon" width="400" />
            </div>
            <div v-for="item in usedCouponList" :key="item.id"
                 :class="[$style.couponsViewItem, isManagementState ? $style.checkBox : '']"
                 @click="selectedChange(item.id)"
            >
              <span v-if="isManagementState">
                <pl-svg v-if="!item.checked" name="icon-weixuanzhong1" width="40" />
                <pl-svg v-if="item.checked" name="icon-xuanzhong" width="40" />
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
                :coupon-type="item.couponType"
                status="已使用"
              />
            </div>
          </template>
        </load-more>
        <button v-if="usedCouponList.length === 0" :class="$style.receiveMore">
          <router-link :to="{ name: 'CouponCenter'}">
            福利中心 领好券
          </router-link>
        </button>
      </div>
      <div v-show="activeMenuId === 2" :class="$style.couponsView">
        <load-more
          :request-methods="getMyCouponList"
          :form="overduedCouponForm"
          @refresh="refreshHandler"
          ref="overduedCouponLoadMore"
          no-content-tip="暂无优惠券"
          no-icon
        >
          <template>
            <div name="icon" :class="$style.noCouponIcon" v-if="overduedCouponList.length === 0">
              <pl-svg name="icon-newCouponIcon" width="400" />
            </div>
            <div v-for="item in overduedCouponList" :key="item.id"
                 :class="[$style.couponsViewItem, isManagementState ? $style.checkBox : '']"
                 @click="selectedChange(item.id)"
            >
              <span v-if="isManagementState">
                <pl-svg v-if="!item.checked" name="icon-weixuanzhong1" width="40" />
                <pl-svg v-if="item.checked" name="icon-xuanzhong" width="40" />
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
                :coupon-type="item.couponType"
                status="已过期"
              />
            </div>
          </template>
        </load-more>
      </div>
    </div>
    <div :class="[$style.footer, isManagementState ? $style.deleteFooter : '']">
      <router-link v-if="!isManagementState" :to="{ name: 'MyCoupon'}">
        返回红包卡券
      </router-link>
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
  name: 'HistoryCoupon',
  components: {
    tab,
    CouponItem,
    LoadMore
  },
  mounted () {
    this.refreshList()
  },
  activated () {
    this.refreshList()
  },
  deactivated () {
    this.activeMenuId = 1
  },
  data () {
    return {
      menuArray: [{ name: '已使用', id: 1 }, { name: '已过期', id: 2 }],
      activeMenuId: 1,
      isManagementState: false,
      usedCouponList: [],
      usedCouponorForm: {
        current: 1,
        size: 10,
        status: 1
      },
      overduedCouponList: [],
      overduedCouponForm: {
        current: 1,
        size: 10,
        status: 99
      },
      getMyCouponList
    }
  },
  methods: {
    formatCouponList (list) {
      list.map(item => {
        item.checked = false
      })
      return list
    },
    refreshHandler (list) {
      this.activeMenuId === 1 ? this.usedCouponList = this.formatCouponList(list)
        : this.overduedCouponList = this.formatCouponList(list)
    },
    refreshList () {
      this.activeMenuId === 1 ? this.$refs.usedCouponorLoadMore && this.$refs.usedCouponorLoadMore.refresh()
        : this.$refs.overduedCouponLoadMore && this.$refs.overduedCouponLoadMore.refresh()
    },
    findCurrentCouponIndex (id, list) {
      return list.findIndex(value => value.id === id)
    },
    selectedChange (id) {
      if (this.activeMenuId === 1) {
        let index = this.findCurrentCouponIndex(id, this.usedCouponList)
        let currentCoupon = this.usedCouponList.splice(index, 1)[0]
        currentCoupon.checked = !currentCoupon.checked
        this.usedCouponList.splice(index, 0, currentCoupon)
      } else {
        let index = this.findCurrentCouponIndex(id, this.overduedCouponList)
        let currentCoupon = this.overduedCouponList.splice(index, 1)[0]
        currentCoupon.checked = !currentCoupon.checked
        this.overduedCouponList.splice(index, 0, currentCoupon)
      }
    },
    async deleteCoupon () {
      try {
        let needDeleteLists = this.activeMenuId === 1 ? this.usedCouponList : this.overduedCouponList
        let deleteList = needDeleteLists.filter(item => item.checked).map(item => item.id)
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
          this.refreshList()
        } else {
          this.$error(message)
        }
      } catch (e) {
        throw e
      }
    }
  },
  watch: {
    activeMenuId: function (val) {
      if (val === 1) {
        this.usedCouponorForm = {
          current: 1,
          size: 10,
          status: 1
        }
      } else {
        this.overduedCouponForm = {
          current: 1,
          size: 10,
          status: 99
        }
      }
      this.isManagementState = false
      this.refreshList()
    },
    isManagementState (val) {
      if (val) {
        let listName = this.activeMenuId === 1 ? 'usedCouponList' : 'overduedCouponList'
        this[listName] = this.formatCouponList(this[listName])
      }
    }
  }
}
</script>

<style module lang="scss">
  .history-coupon {
   .tab-menu{
     display: flex;
     background-color: #fff;
     padding-right: 24px;
     button {
       font-size:32px;
       font-weight:400;
       line-height:44px;
       color:#333;
       margin-left: auto;
     }
   }

    .coupons-view {
      margin-bottom: 100px;
      padding: 80px 24px 100px;
      position: relative;

      .no-coupon-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 300px;
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

        > div {
          transition: marginLeft 1s linear;
        }
      }

      .check-box {
        > div {
          margin-left: 100px;
        }
      }

      .receive-more{
        width:250px;
        height:60px;
        line-height:60px;
        text-align: center;
        background:rgba(255,244,235,1);
        border:2px solid rgba(254,119,0,1);
        border-radius:8px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        a {
          font-size:28px;
          font-weight:400;
          color:rgba(254,119,0,1);
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
    background: #F2B036;
    left: 0;
    bottom: 0;
    font-size: 32px;
    font-weight: 400;

    a {
      color: #fff;
    }

    button {
      color: #fff;
    }
  }

  .delete-footer {
    background: #FE7700;
  }
</style>
