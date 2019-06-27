<template>
  <div :class="$style.orderList">
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
        no-content-tip="暂无订单"
        @refresh="onRefresh"
        @more="onRefresh"
      >
        <template v-slot="{ list }">
          <router-link
            :class="$style.listItem"
            tag="div"
            v-for="(item, i) of orderList"
            :key="i"
            :to="{ name: 'OrderDetail', params: { orderId: item.id } }"
          >
            <div>
              <div :class="$style.listItemLeft">
                <span
                  :class="$style.tag"
                  v-text="orderTypeMap[item.orderType]"
                />
                <pl-list
                  title="订单编号："
                  :content="item.id"
                />
              </div>
              <p
                :class="$style.status"
                v-text="item.status === 'FINISHED' ? item.commentStatus ? orderFinishMap['FINISH'] : orderFinishMap['COMMENT'] : orderStatusMap[item.status]"
              />
            </div>
            <order-item
              v-for="(product, j) of item.products"
              :key="j"
              :img="product.productImg + '?x-oss-process=style/thum'"
              :name="product.productName"
              :option="product.skuName2 ? `${product.skuName}；${product.skuName2}` : product.skuName"
              :count="product.purchaseQuantity"
              :price="product.unitPrice"
              :status="refundStatusMap[product.afterSalesStatus]"
              border
            />
            <div :class="$style.listItemBottom">
              <div>
                <span :class="$style.totalCount">{{ `共${item.totalCount}件商品` }}</span>
                <price
                  prefix-text="总价："
                  :price="item.totalPrice"
                  size="medium"
                  plain
                />
              </div>
              <div
                :class="$style.buttons"
                v-if="item.status !== 'WAIT_SHIP'"
              >
                <pl-button
                  v-if="item.status === 'WAIT_PAY'"
                  round
                  plain
                  @click="cancelOrder(item, i)"
                >
                  取消订单
                </pl-button>
                <pl-button
                  v-if="item.status === 'WAIT_PAY'"
                  type="warning"
                  round
                  :loading="payloading && currentPayId === item.id"
                  :disabled="payloading"
                  @click="pay(item.id, item.orderType)"
                >
                  去付款
                </pl-button>
                <pl-button
                  v-if="(item.status === 'FINISHED' || item.status === 'CLOSED') && item.isDeleteBtnShow"
                  round
                  plain
                  @click="deleteOrder(item, i)"
                >
                  删除订单
                </pl-button>
                <pl-button
                  v-if="item.orderType === 'PHYSICAL' && (item.status === 'WAIT_RECEIVE' || item.status === 'FINISHED')"
                  round
                  plain
                  @click="$router.push({ name: 'Freight', params: { orderId: item.id } })"
                >
                  查看物流
                </pl-button>
                <pl-button
                  v-if="item.status === 'WAIT_RECEIVE'"
                  type="warning"
                  round
                  @click="confirmReceipt(item.id, item.orderType)"
                >
                  确认收货
                </pl-button>
              </div>
            </div>
          </router-link>
        </template>
      </load-more>
    </div>
    <pl-picker
      :show.sync="isPickerShow"
      :slots="pickerColumns"
      @confirm="(selected) => { this.resolve(selected[0]) }"
      @close="reject(false)"
    />
  </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import Price from '../../../components/Price.vue'
import LoadMore from '../../../components/Load-More.vue'
import { mapGetters } from 'vuex'
import {
  getOrderList,
  getAwaitPayInfo,
  confirmReceipt,
  cancelOrder,
  deleteOrder
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'

const tabs = [{
  name: '全部',
  id: 'ALL_ORDER'
}, {
  name: '待付款',
  id: 'WAIT_PAY'
}, {
  name: '待发货',
  id: 'WAIT_SHIP'
}, {
  name: '待收货',
  id: 'WAIT_RECEIVE'
}, {
  name: '待评价',
  id: 'FINISHED'
}]

const orderTypeMap = {
  PHYSICAL: '实体商品',
  VIRTUAL: '虚拟商品'
}

const orderFinishMap = {
  FINISH: '交易成功',
  COMMENT: '待评价'
}

const refundStatusMap = {
  '1': '退款中',
  '2': '退款成功',
  '3': '退款驳回',
  '4': '退款中', //  退换货-已退货
  '5': '待退货', //  退换货-待退货
  '9': '退款中'
}

export default {
  name: 'OrderList',
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
        orderStatus: ''
      },
      getOrderList,
      $refresh: null,
      loading: false,
      payloading: false,
      currentPayId: '', // 当前正在支付的订单id
      isPickerShow: false,
      pickerColumns: [
        {
          flex: 1,
          values: ['不想买了', '信息填写错误，重新拍', '线下自提', '其他原因'],
          textAlign: 'center'
        }
      ],
      orderTypeMap,
      orderFinishMap,
      refundStatusMap
    }
  },
  computed: {
    ...mapGetters(['orderStatusMap'])
  },
  // 不要删
  // beforeRouteEnter (to, from, next) {
  //   to.meta.noRefresh = from.name === 'OrderDetail' || from.name === 'Freight'
  //   to.meta.receiveOrderId = from.meta.receiveOrderId || null
  //   to.meta.deleteOrderId = from.meta.deleteOrderId || null
  //   to.meta.cancelOrderId = from.meta.cancelOrderId || null
  //   to.meta.commentOId = from.meta.commentOId || null
  //   to.meta.commentPId = from.meta.commentPId || null
  //   if (from.meta.noRefresh) delete from.meta.noRefresh
  //   if (from.meta.receiveOrderId) delete from.meta.receiveOrderId
  //   if (from.meta.deleteOrderId) delete from.meta.deleteOrderId
  //   if (from.meta.cancelOrderId) delete from.meta.cancelOrderId
  //   if (from.meta.commentOId) delete from.meta.commentOId
  //   if (from.meta.commentPId) delete from.meta.commentPId
  //   console.log(to)
  //   next()
  // },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    // 不要删
    // const currentRoute = this.$router.currentRoute
    // if (currentRoute.meta.noRefresh) {
    //   if (currentRoute.meta.receiveOrderId) {
    //     this.orderList = this.orderList.filter(item => item.id !== currentRoute.meta.receiveOrderId)
    //     !this.orderList.length && this.$refresh()
    //     delete currentRoute.meta.receiveOrderId
    //   }
    //   if (currentRoute.meta.deleteOrderId) {
    //     this.orderList = this.orderList.filter(item => item.id !== currentRoute.meta.deleteOrderId)
    //     !this.orderList.length && this.$refresh()
    //     delete currentRoute.meta.deleteOrderId
    //   }
    //   if (currentRoute.meta.cancelOrderId) {
    //     if (this.status === 'ALL_ORDER') {
    //       const order = this.orderList.find(item => item.id === currentRoute.meta.cancelOrderId)
    //       order && (order.status = 'CLOSED')
    //     } else if (this.status === 'WAIT_PAY') {
    //       this.orderList = this.orderList.filter(item => item.id !== currentRoute.meta.cancelOrderId)
    //       !this.orderList.length && this.$refresh()
    //     }
    //     delete currentRoute.meta.cancelOrderId
    //   }
    //   if (currentRoute.meta.commentOId && currentRoute.meta.commentPId) {
    //     debugger
    //     const order = this.orderList.find(item => item.id === currentRoute.meta.commentOId)
    //     if (!order) return
    //     const product = order.products.find(item => item.id === currentRoute.meta.commentPId)
    //     if (!product) return
    //     product.assessmentStatus = 1
    //     order.commentStatus = !order.products.some(item => item.assessmentStatus !== 1)
    //     if (this.status === 'FINISHED') {
    //       this.orderList = this.orderList.filter(item => item.commentStatus)
    //       !this.orderList.length && this.$refresh()
    //     }
    //     delete currentRoute.meta.commentOId
    //     delete currentRoute.meta.commentPId
    //   }
    //   return
    // }

    this.form.orderStatus = this.status
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'Orders', params: { status: item.id || null } })
        this.$refresh()
      })
    },
    showPicker () {
      return new Promise((resolve, reject) => {
        this.isPickerShow = true
        this.resolve = resolve
        this.reject = reject
      })
    },
    onRefresh (list, total) {
      const counter = (array) => (key) => array.reduce((total, current) => total + (key ? current[key] : current), 0)
      for (let item of list) {
        item.totalCount = counter(item.products)('purchaseQuantity')
        item.isDeleteBtnShow = !item.products.some(product => (product.afterSalesStatus !== 0 && product.afterSalesStatus !== 2))
      }
      this.orderList = list
    },
    async pay (orderId, orderType) {
      this.payloading = true
      this.currentPayId = orderId
      try {
        const { result } = await getAwaitPayInfo(orderId)
        // 调用微信支付api
        await wechatPay(result)
        if (orderType === 'PHYSICAL') {
          this.form.orderStatus = 'WAIT_SHIP'
          this.tabChange({
            name: '待发货',
            id: 'WAIT_SHIP'
          })
        } else {
          this.form.orderStatus = 'WAIT_RECEIVE'
          this.tabChange({
            name: '待收货',
            id: 'WAIT_RECEIVE'
          })
        }
      } catch (e) {
        throw e
      } finally {
        this.payloading = false
      }
    },
    async confirmReceipt (orderId, orderType) {
      try {
        await this.$confirm('您确定收货吗？')
        await confirmReceipt(orderId)
        this.$success('确认收货成功')
        setTimeout(() => {
          this.$router.push({ name: 'OrderComplete', params: { orderId } })
        }, 2000)
      } catch (e) {
        throw e
      }
    },
    async cancelOrder (item, index) {
      const orderId = item.id
      const { orderStatus } = this.form
      try {
        const reason = await this.showPicker()
        await this.$confirm('订单一旦取消，将无法恢复 确认要取消订单？')
        await cancelOrder(orderId, reason)
        if (orderStatus === 'ALL_ORDER') {
          item.status = 'CLOSED'
        } else {
          this.orderList.splice(index, 1)
          this.$forceUpdate()
        }
        this.$success('订单取消成功')
      } catch (e) {
        throw e
      }
    },
    async deleteOrder (item, index) {
      const orderId = item.id
      try {
        await this.$confirm('订单一旦删除，将无法恢复 确认要删除订单？')
        await deleteOrder(orderId)
        this.orderList.splice(index, 1)
        this.$forceUpdate()
        this.$success('订单删除成功')
      } catch (e) {
        throw e
      }
    }
  }
}
</script>
<style module lang="scss">
  .order-list {
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
      margin-top: 24px;
      button {
        margin-left: 24px;
      }
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
