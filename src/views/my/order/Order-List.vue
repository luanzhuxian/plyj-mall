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
        no-content-tip="您还没有相关订单~"
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
                v-text="item.statusText"
              />
            </div>
            <order-item
              v-for="(product, j) of item.products"
              :key="j"
              :img="product.productImg + '?x-oss-process=style/thum'"
              :name="product.productName"
              :option="product.skuName2 ? `${product.skuName},${product.skuName2}` : product.skuName"
              :count="product.purchaseQuantity"
              :price="product.unitPrice"
              :status="refundStatusMap[product.afterSalesStatus]"
              :active-product="item.activeProduct"
              border
            />
            <div :class="$style.listItemBottom">
              <div :class="$style.priceWrapper">
                <span :class="$style.totalCount">{{ `共${item.totalCount}件商品` }}</span>
                <span :class="$style.bold">总价：</span>
                <span :class="$style.price">{{ item.actuallyAmount }}</span>
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
                  :disabled="payloading && currentPayId === item.id"
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
                  @click="$router.push({ name: 'Freight', params: { orderId: item.id }, query: { img: item.products.length && item.products[0].productImg } })"
                >
                  查看物流
                </pl-button>
                <pl-button
                  v-if="item.orderType === 'PHYSICAL' && item.status === 'WAIT_RECEIVE'"
                  type="warning"
                  round
                  @click="confirmReceipt(item, i)"
                >
                  确认收货
                </pl-button>
                <pl-button
                  v-if="item.orderType !== 'PHYSICAL' && item.status === 'WAIT_RECEIVE'"
                  type="warning"
                  round
                  @click="$router.push({ name: 'OrderDetail', params: { orderId: item.id } })"
                >
                  去使用
                </pl-button>
                <pl-button
                  v-if="item.status === 'FINISHED' && item.commentStatus === 0 && ~[0, 3, 6].indexOf(item.afterSalesStatus)"
                  round
                  plain
                  @click="$router.push({ name: 'OrderDetail', params: { orderId: item.id } })"
                >
                  去评价
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
      @confirm="(selected) => { resolve(selected[0]) }"
      @close="reject(false)"
    />
  </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import LoadMore from '../../../components/common/Load-More.vue'
import {
  getOrderList,
  getAwaitPayInfo,
  confirmReceipt,
  cancelOrder,
  deleteOrder
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import { mapGetters } from 'vuex'

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

export default {
  name: 'OrderList',
  components: {
    LoadMore,
    OrderItem
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
      refundStatusMap: {
        '1': '退款中',
        '2': '退款成功',
        '3': '退款驳回',
        '4': '退款中', //  退换货-已退货
        '5': '待退货', //  退换货-待退货
        '9': '退款中'
      }
    }
  },
  computed: {
    ...mapGetters(['orderTypeMap'])
  },
  beforeRouteEnter (to, from, next) {
    to.meta.noRefresh = from.name === 'OrderDetail' || from.name === 'Freight'
    next()
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    const handler = (action) => {
      if (action === 'pay') {
        return (order, index) => {
          if (this.status === 'ALL_ORDER') {
            order.status = order.orderType === 'PHYSICAL' ? 'WAIT_SHIP' : 'WAIT_RECEIVE'
          } else if (this.status === 'WAIT_PAY') {
            this.orderList.splice(index, 1)
          }
        }
      }
      if (action === 'receive') {
        return (order, index) => {
          if (this.status === 'ALL_ORDER') {
            order.status = 'FINISHED'
          } else if (this.status === 'WAIT_RECEIVE') {
            this.orderList.splice(index, 1)
          }
        }
      }
      if (action === 'cancel') {
        return (order, index) => {
          if (this.status === 'ALL_ORDER') {
            order.status = 'CLOSED'
          } else if (this.status === 'WAIT_PAY') {
            this.orderList.splice(index, 1)
          }
        }
      }
      if (action === 'delete') {
        return (order, index) => {
          this.orderList.splice(index, 1)
        }
      }
      if (action === 'comment') {
        return (order, index, pid) => {
          const product = order.products.find(prod => prod.productId === pid)
          if (!product) return
          product.assessmentStatus = 1 // 商品评价状态改为已评价
          order.commentStatus = !order.products.some(prod => prod.assessmentStatus !== 1) // 根据所有商品的评价状态重新设置订单的评价状态，0：有商品待评价 1：所有商品已评价
          if (this.status === 'FINISHED' && order.commentStatus) {
            this.orderList.splice(index, 1)
          }
        }
      }
    }

    if (this.orderList.length && this.$router.currentRoute.meta.noRefresh) {
      const arr = JSON.parse(localStorage.getItem('UPDATE_ORDER_LIST') || '[]')
      if (!arr.length) return
      for (let item of arr) {
        const index = this.orderList.findIndex(order => order.id === item.id)
        if (index === -1) continue
        handler(item.action)(this.orderList[index], index, item.pid)
      }
      localStorage.removeItem('UPDATE_ORDER_LIST')
      this.orderList.length ? this.$forceUpdate() : this.$refresh()
      return
    }

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
    onRefresh (list) {
      const counter = (array) => (key) => array.reduce((acc, current) => acc + (key ? current[key] : current), 0)
      for (let item of list) {
        item.totalCount = counter(item.products)('purchaseQuantity')
        item.isDeleteBtnShow = !item.products.some(product => ![0, 2, 3, 6].includes(product.afterSalesStatus)) // 只要有一个商品在售后状态则不显示删除按钮
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
    async confirmReceipt (item, index) {
      const orderId = item.id
      const { orderStatus } = this.form
      try {
        await this.$confirm('您确定收货吗？')
        await confirmReceipt(orderId)
        this.$success('确认收货成功')
        if (orderStatus === 'ALL_ORDER') {
          item.status = 'FINISHED'
          item.statusText = '已完成'
        } else {
          this.orderList.splice(index, 1)
        }
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
        this.$success('交易关闭')
        if (orderStatus === 'ALL_ORDER') {
          item.status = 'CLOSED'
          item.statusText = '已关闭'
        } else {
          this.orderList.splice(index, 1)
        }
      } catch (e) {
        throw e
      }
    },
    async deleteOrder (item, index) {
      const orderId = item.id
      try {
        await this.$confirm('是否删除当前订单？ 删除后不可找回')
        await deleteOrder(orderId)
        this.orderList.splice(index, 1)
        this.$forceUpdate()
        this.$success('删除成功')
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
    .price-wrapper {
      display: flex;
      align-items: center;
    }
    .total-count {
      font-size: 20px;
      font-family: MicrosoftYaHeiUI;
      color: #999999;
      margin-right: 12px;
    }
    .bold {
      font-size: 30px;
      font-weight: bold;
      color: #333333;
    }
    .price {
      align-self: flex-end;
      font-size: 32px;
      color: #FE7700;
      &:before {
        // margin-right: 10px;
        padding-bottom: 4px;
        font-size: 20px;
        content: '¥';
      }
    }
    .buttons {
      margin-top: 24px;
      > button {
        box-sizing: border-box;
        margin-left: 24px;
        width: 136px;
        padding: 0;
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
