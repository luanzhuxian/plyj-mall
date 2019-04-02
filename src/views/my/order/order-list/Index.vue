<template>
  <div class="order-list">
    <pl-tab :tabs="tabs" size="small" :active-id.sync="currentStatus" @change="tabChange" />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Order-List',
  data () {
    return {
      currentStatus: '',
      tabs: [
        {
          name: '全部',
          id: 'ALL',
          route: 'AllOrders'
        },
        {
          name: '待付款',
          id: 'WAIT_PAY',
          route: 'waitPay'
        },
        {
          name: '待发货',
          id: 'WAIT_SHIP',
          route: 'waitShip'
        },
        {
          name: '待收货',
          id: 'WAIT_RECEIVE',
          route: 'waitReceive'
        },
        {
          name: '待评价',
          id: 'WAIT_COMMENT',
          route: 'waitComment'
        }
      ],
      orderIdMap: []
    }
  },
  activated () {
    this.currentStatus = this.tabs.filter(item => item.route === this.$route.name)[0].id
  },
  methods: {
    tabChange (item) {
      this.$router.replace({ name: item.route })
    }
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.currentStatus = this.tabs.filter(item => item.route === to.name)[0].id
  }
}
</script>
