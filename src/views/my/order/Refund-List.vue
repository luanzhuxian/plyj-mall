<template>
  <div class="refund-list">
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
            :to="{ name: 'RefundDetail', params: { orderId: item.id } }"
            :class="$style.refundItem"
          >
            <div>
              <div :class="$style.orderItemLeft">
                <span
                  :class="$style.orderTag"
                  v-text="orderTypeMap[item.orderType]"
                />
                <pl-list
                  title="退单号："
                  :content="item.id"
                />
              </div>
              <p
                :class="$style.status"
                v-text="orderStatusMap[item.status]"
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
                <span :class="$style.reundType">
                  {{ '退款退货' }}
                </span>
                <pl-button
                  v-if="item.status === 'WAIT_PAY'"
                  round
                  plain
                  @click="cancel"
                >
                  取消申请
                </pl-button>
                <pl-button
                  round
                  plain
                  @click="checkDetail"
                >
                  查看详情
                </pl-button>
                <pl-button
                  type="warning"
                  round
                  plain
                  @click="checkExpressInfo"
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
import { mapGetters } from 'vuex'
import {
  getOrderList,
  orderPhysicalorderSummary
} from '../../../apis/order-manager'

const tabs = [{
  name: '全部',
  id: 'ALL_ORDER'
}, {
  name: '待审核',
  id: 'WAIT_PAY'
}, {
  name: '退换货',
  id: 'WAIT_SHIP'
}, {
  name: '退款成功',
  id: 'WAIT_RECEIVE'
}]

const orderTypeMap = {
  PHYSICAL: '实体商品',
  VIRTUAL: '虚拟商品'
}

const count = {
  WAIT_PAY: 0,
  WAIT_RECEIVE: 0,
  WAIT_SHIP: 0
}

const orderStatusMap = {
  WAIT_PAY: '待审核',
  WAIT_SHIP: '退换货',
  WAIT_RECEIVE: '退款成功'
}

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
        orderStatus: ''
      },
      getOrderList,
      orderPhysicalorderSummary,
      loading: false,
      $refresh: null,
      count,
      orderTypeMap,
      orderStatusMap
    }
  },
  computed: {
    // ...mapGetters(['orderStatusMap', 'orderStatusMapCamel'])
    ...mapGetters(['orderStatusMapCamel'])
  },
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
        this.$router.replace({ name: 'RefundList', params: { status: item.id || null } })
        this.$refresh()
      })
    },
    onRefresh (list, total) {
      const counter = (array) => (key) => array.reduce((total, current) => total + (key ? current[key] : current), 0)
      for (let item of list) {
        item.totalCount = counter(item.products)('purchaseQuantity')
      }
      this.orderList = list
      this.getOrderSummary()
    },
    async getOrderSummary () {
      try {
        const { orderStatusMapCamel } = this
        const { result } = await orderPhysicalorderSummary(this.userId)
        for (let key of Object.keys(result)) {
          if (orderStatusMapCamel.hasOwnProperty(key)) {
            this.count[orderStatusMapCamel[key]] = result[key] > 99 ? '99+' : result[key]
          }
        }
      } catch (e) {
        throw e
      }
    },
    cancel () {},
    checkDetail () {},
    checkExpressInfo () {}
  }
}
</script>

<style module lang="scss">
  .order-list {
    padding: 22px 24px 120px;
  }
  .refund-item {

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
    .reund-type {
      font-size: 24px;
      color: #FE7700;
      line-height: 32px;
      margin-right: 16px;
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
