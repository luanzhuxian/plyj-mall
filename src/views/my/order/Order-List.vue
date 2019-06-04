<template>
  <div class="orders">
    <pl-tab
      size="small"
      :tabs="tabs"
      :active-id.sync="form.orderStatus"
      :count="count"
      @change="tabChange"
    >
      <div
        :class="$style.tabCount"
        v-for="(item, i) of tabs"
        :key="i"
        :slot="'tab-pane-' + i"
      >
        <span
          :class="$style.tabCountNumber"
          v-if="count[item.id]"
          v-text="count[item.id]"
        />
      </div>
    </pl-tab>
    <div :class="$style.orderList">
      <load-more
        ref="loadMore"
        :form="form"
        :loading.sync="loading"
        :request-methods="getOrderList"
        no-content-tip="暂无订单"
        @refresh="onRefresh"
      >
        <template v-slot="{ list }">
          <router-link
            tag="div"
            v-for="(item, i) of orderList"
            :key="i"
            :to="{ name: 'OrderDetail', params: { orderId: item.id } }"
            :class="$style.orderItem"
          >
            <div>
              <div :class="$style.orderItemLeft">
                <span
                  :class="$style.orderTag"
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
              :img="product.productImg"
              :name="product.productName"
              :option="product.skuName"
              :count="product.purchaseQuantity"
              :price="product.unitPrice"
              border
            />
            <div :class="$style.orderItemBottom">
              <div>
                <span :class="$style.totalCount">{{ `共${item.products.length}件商品` }}</span>
                <price
                  prefix-text="总价："
                  price="1000"
                  size="small"
                  plain
                />
                <!-- <price
                  prefix-text="总价："
                  :price="item.amount + item.orderInfoModel.freight"
                  size="small"
                  plain
                /> -->
              </div>
              <div
                :class="$style.buttons"
                v-if="item.status !== 'WAIT_SHIP'"
              >
                <pl-button
                  v-if="item.status === 'WAIT_PAY'"
                  round
                  plain
                  @click="cancelOrder(item.id, i)"
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
                  v-if="item.status === 'FINISHED' || item.status === 'CLOSED'"
                  round
                  plain
                  @click="deleteOrder(item.id, i)"
                >
                  删除订单
                </pl-button>
                <pl-button
                  v-if="item.status === 'WAIT_RECEIVE' || item.status === 'FINISHED'"
                  round
                  plain
                  @click="toFreightPage(item.id)"
                >
                  查看物流
                </pl-button>
                <pl-button
                  v-if="item.status === 'WAIT_RECEIVE'"
                  type="warning"
                  round
                  @click="confirmReceipt(item.orderType, item.id)"
                >
                  确认收货
                </pl-button>
                <!-- <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'FINISHED' && item.orderInfoModel.assessment === 'NO'"
                  type="warning"
                  plain
                  round
                  @click="$router.push({ name: 'CommentOrder', params: { orderId: item.orderInfoModel.orderSn } })"
                >
                  去评价
                </pl-button> -->
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
import { mapGetters } from 'vuex'
import {
  getOrderList,
  // getAwaitPayInfo,
  secondaryPayment,
  physicalorderReceiving,
  physicalorderReceivingForVirtual,
  cancelOrder,
  orderPhysicalorderSummary
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'

const tabs = [{
  name: '全部',
  id: 'ALl_ORDER'
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

const count = {
  FINISHED: 0,
  AFTER_SALE: 0,
  WAIT_PAY: 0,
  WAIT_RECEIVE: 0,
  WAIT_SHIP: 0
}

export default {
  name: 'OrderList',
  components: {
    OrderItem,
    Price,
    LoadMore
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
      orderPhysicalorderSummary,
      loading: false,
      payloading: false,
      $refresh: null,
      $router: null,
      currentPayId: '', // 当前正在支付的订单id
      count,
      orderTypeMap,
      orderFinishMap
    }
  },
  props: {
    status: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['orderStatusMap', 'userId'])
  },
  created () {},
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.form.orderStatus = this.status || ''
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'Orders', params: { status: item.id || null } })
        this.$refresh()
      })
    },
    onRefresh (list, total) {
      this.orderList = list
      this.getOrderSummary()
    },
    async getOrderSummary () {
      // try {
      //   const { result } = await this.orderPhysicalorderSummary(this.userId)
      //   for (let k of Object.keys(result)) {
      //     if (result[k] > 99) result[k] = '99+'
      //   }
      //   this.count = result
      // } catch (e) {
      //   throw e
      // }
    },
    async pay (orderId, orderType) {
      this.payloading = true
      this.currentPayId = orderId
      try {
        // const { result } = await getAwaitPayInfo(id)
        const { result } = await secondaryPayment(orderId)
        console.log(result)
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
    // 确定收货
    async confirmReceipt (orderType, orderId) {
      try {
        await this.$confirm('您确定收货吗？')
        if (orderType === 'PHYSICAL_GOODS') {
          await physicalorderReceiving(orderId)
        } else {
          await physicalorderReceivingForVirtual(orderId)
        }
        // 跳转至待评价
        this.form.orderStatus = 'FINISHED'
        this.tabChange({
          name: '待评价',
          id: 'FINISHED'
        })
      } catch (e) {
        throw e
      }
    },
    async cancelOrder (orderId, index) {
      try {
        await this.$confirm('一旦取消，将无法恢复，确认要取消订单？')
        await cancelOrder(orderId)
        this.orderList.splice(index, 1)
      } catch (e) {
        throw e
      }
    },
    deleteOrder (orderId, index) {
    },
    toFreightPage (orderId) {
      this.$router.push({ name: 'Freight', params: { orderId } })
    }
  }
}
</script>
<style module lang="scss">
  .order-list {
    padding: 22px 24px 120px;
  }
  .order-item {
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
        // &:after {
        //   @include border-half-bottom(#e7e7e7);
        // }
      }
    }
    .status {
      color: var(--primary-color);
      font-size: 24px;
      line-height: 34px;
    }
  }
  .order-item-bottom {
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
      // line-height: 28px;
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
  .tab-count {
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
  .tab-count-number {
    display: inline-flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: url("../../../assets/images/my/circle.png") no-repeat center center;
    background-size: 100%;
  }
  .order-item-left {
    display: inline-flex;
    align-items: center;
  }
  .order-tag {
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
</style>
