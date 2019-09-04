<template>
  <div :class="$style.helperList">
    <pl-tab
      :class="$style.tabBar"
      size="small"
      :tabs="tabs"
      :active-id.sync="form.orderStatus"
      @change="tabChange"
    >
      <div
        :class="$style.tabPane"
        v-for="(item, i) of tabs"
        :key="i"
        :slot="'tab-pane-' + i"
      />
    </pl-tab>
    <div :class="$style.list">
      <load-more
        ref="loadMore"
        :form="form"
        :loading.sync="loading"
        :request-methods="getOrderList"
        no-content-tip="您还没有相关订单~"
        @refresh="onRefresh"
        @more="onRefresh"
      >
        <template v-slot="{ list }">
          <div
            :class="$style.listItem"
            v-for="(item, i) of list"
            :key="i"
          >
            {{ i }}
          </div>
        </template>
      </load-more>
    </div>
  </div>
</template>
<script>
import LoadMore from '../../../components/Load-More.vue'
import {
  getOrderList
} from '../../../apis/order-manager'

const tabs = [{
  name: '待审核',
  id: 'ALL_ORDER'
}, {
  name: '审核通过',
  id: 'WAIT_PAY'
}, {
  name: '已驳回',
  id: 'FINISHED'
}]

export default {
  name: 'HelperList',
  components: {
    LoadMore
  },
  props: {
    status: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      tabs,
      list: [],
      form: {
        current: 1,
        size: 10,
        orderStatus: ''
      },
      getOrderList,
      $refresh: null,
      loading: false
    }
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    console.log(this.status)
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'HelperList', params: { status: item.id || null } })
        this.$refresh()
      })
    },
    onRefresh (list) {
      this.list = list
    }
  }
}
</script>
<style lang="scss" module>
  .helper-list {
    padding-top: 80px;
  }
  .tab-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2999;
  }
  .tab-pane {
    position: absolute;
    top: 5px;
    right: -45px;
    width: 56px;
    height: 56px;
    line-height: 54px;
    font-size: 28px;
    transform: scale(.5);
    transform-origin: 0 0;
    color: #fff;
  }
  .list {
    padding: 22px 24px 120px;
  }
</style>
