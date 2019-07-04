<template>
  <div :class="$style.refundList">
    <pl-tab
      :class="$style.tabBar"
      size="small"
      :tabs="tabs"
      :active-id.sync="form.returnStatus"
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
        :request-methods="getRefundOrderList"
        no-content-tip="暂无订单"
        @refresh="onRefresh"
      >
        <template v-slot="{ list }">
          <router-link
            :class="$style.listItem"
            tag="div"
            v-for="(item, i) of orderList"
            :key="i"
            :to="{ name: 'RefundDetail', params: { id: item.id } }"
          >
            <div>
              <div :class="$style.listItemLeft">
                <span
                  :class="$style.tag"
                  v-text="orderTypeMap[item.orderType]"
                />
                <pl-list
                  title="退单号："
                  :content="item.id"
                />
              </div>
              <p
                :class="$style.status"
                v-text="refundStatusMap[item.returnStatus]"
              />
            </div>
            <order-item
              :img="item.productPic + '?x-oss-process=style/thum'"
              :name="item.productName"
              :option="item.skuName2 ? `${item.skuName};${item.skuName2}` : item.skuName"
              :count="item.productCount"
              :price="item.productPrice"
              border
            />
            <div :class="$style.listItemBottom">
              <div>
                <span :class="$style.totalCount">{{ `共${item.productCount}件商品` }}</span>
                <price
                  prefix-text="退款金额："
                  :price="item.actualRefund"
                  size="medium"
                  plain
                />
              </div>
              <div :class="$style.buttons">
                <span
                  :class="$style.reundType"
                  v-text="refundTypeMap[item.refundType]"
                />
                <pl-button
                  v-if="item.returnStatus === 'WAIT_CHECK'"
                  round
                  plain
                  @click="cancelApplication(item, i)"
                >
                  取消申请
                </pl-button>
                <pl-button
                  v-if="item.returnStatus === 'WAIT_CHECK' || item.returnStatus === 'REFUND_PRODUCT' || item.returnStatus === 'FINISHED'"
                  round
                  plain
                  @click="$router.push({ name: 'RefundDetail', params: { id: item.id } })"
                >
                  查看详情
                </pl-button>
                <pl-button
                  v-if="item.returnStatus === 'REFUND_PRODUCT_WAIT_RETURN'"
                  type="warning"
                  round
                  plain
                  @click="$router.push({ name: 'RefundDetail', params: { id: item.id } })"
                >
                  寄件运单号
                </pl-button>
              </div>
            </div>
          </router-link>
        </template>
      </load-more>
    </div>
  </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import Price from '../../../components/Price.vue'
import LoadMore from '../../../components/Load-More.vue'
import {
  getRefundOrderList,
  cancelRefundApplication
} from '../../../apis/order-manager'
import { mapGetters } from 'vuex'

const tabs = [{
  name: '全部',
  id: 'ALL_ORDER'
}, {
  name: '待审核',
  id: 'WAIT_CHECK'
}, {
  name: '退换货',
  id: 'REFUND_PRODUCT'
}, {
  name: '退款成功',
  id: 'FINISHED'
}]

export default {
  name: 'RefundList',
  components: {
    LoadMore,
    OrderItem,
    Price
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
      orderList: [],
      form: {
        current: 1,
        size: 10,
        returnStatus: ''
      },
      getRefundOrderList,
      loading: false,
      $refresh: null
    }
  },
  computed: {
    ...mapGetters(['refundStatusMap', 'orderTypeMap', 'refundTypeMap'])
  },
  // 不要删
  // beforeRouteEnter (to, from, next) {
  //   to.meta.noRefresh = from.name === 'RefundDetail'
  //   to.meta.removeItem = from.meta.removeItem || null
  //   to.meta.returnStatus = from.meta.returnStatus || null
  //   if (from.meta.noRefresh) delete from.meta.noRefresh
  //   if (from.meta.removeItem) delete from.meta.removeItem
  //   if (from.meta.returnStatus) delete from.meta.returnStatus
  //   next()
  // },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    // 不要删
    // const currentRoute = this.$router.currentRoute
    // if (currentRoute.meta.noRefresh) {
    //   if (currentRoute.meta.removeItem) {
    //     this.orderList = this.orderList.filter(item => item.id !== currentRoute.meta.removeItem)
    //     !this.orderList.length && this.$refresh()
    //   }
    //   if (currentRoute.meta.returnStatus) {
    //     const item = this.orderList.find(item => item.id === currentRoute.meta.returnStatus)
    //     item && (item.returnStatus = 'REFUND_PRODUCT')
    //   }
    //   return
    // }
    this.form.returnStatus = this.status
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'RefundList', params: { status: item.id } })
        this.$refresh()
      })
    },
    onRefresh (list, total) {
      this.orderList = list
    },
    async cancelApplication (item, index) {
      try {
        await this.$confirm('退单正在审核中，确定要取消？')
        await cancelRefundApplication({ id: item.id })
        this.$success('取消申请成功')
        this.orderList.splice(index, 1)
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .refund-list {
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
  .list-item {
    margin-bottom: 20px;
    padding: 0 24px 28px;
    border-radius: 20px;
    background-color: #fff;
    > div {
      &:nth-of-type(1) {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 22px 0 36px;
      }
    }
    .status {
      color: var(--primary-color);
      font-size: 24px;
      line-height: 34px;
    }
  }
  .list-item-bottom {
    margin-top: 16px;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
    }
    .total-count {
      font-size: 20px;
      font-family: MicrosoftYaHeiUI;
      color: #999999;
      margin-right: 12px;
    }
    .price {
      font-size: 40px;
      align-self: flex-end;
      &:before {
        margin-right: 10px;
        padding-bottom: 4px;
        font-size: 24px;
        content: '总价：¥';
      }
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 24px;
      button {
        margin-left: 24px;
        &:nth-of-type(1) {
          margin-left: 40px;
        }
      }
    }
    .reund-type {
      font-size: 24px;
      color: #FE7700;
      line-height: 32px;
    }
  }
  .list-item-left {
    display: inline-flex;
    align-items: center;
    .tag {
      width: 104px;
      height: 28px;
      background: #F2B036;
      border-radius: 14px;
      font-size: 20px;
      color: #FFFFFF;
      line-height: 28px;
      margin-right: 12px;
      text-align: center;
    }
  }
</style>
