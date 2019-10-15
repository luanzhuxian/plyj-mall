<template>
  <div>
    <div :class="$style.historyCoupon">
      <div :class="$style.tabMenu">
        <tab :tabs="menuArray" :active-id.sync="activeMenuId" :color9="true" />
        <button @click="isManagementState = !isManagementState">管理</button>
      </div>
      <div v-show="activeMenuId === 1">
        已使用列表
      </div>
      <div v-show="activeMenuId === 2">
        已过期列表
      </div>
    </div>
    <div :class="$style.footer">
      <router-link :to="{ name: 'MyCoupon'}">
        返回红包卡券
      </router-link>
    </div>
  </div>
</template>

<script>
import tab from '../../../components/penglai-ui/Tab'

export default {
  name: 'HistoryCoupon',
  components: {
    tab
  },
  data () {
    return {
      menuArray: [{ name: '已使用', id: 1 }, { name: '已过期', id: 2 }],
      activeMenuId: 1,
      isManagementState: false,
      usedCouponList: [],
      overduedCouponList: []
    }
  },
  methods: {}
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
