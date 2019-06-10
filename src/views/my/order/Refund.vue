<template>
  <div :class="$style.refund">
    <section :class="$style.orderInfo">
      <order-item
        :img="productInfo.productImg"
        :name="productInfo.productName"
        :option="productInfo.optionName"
        hide-price
      />
    </section>

    <section :class="$style.content">
      <div :class="$style.panel">
        <router-link
          tag="div"
          :to="{ name: 'RefundApply', params: { orderId, refundType: '1' } }"
          :class="$style.item"
        >
          <div :class="$style.itemLeft">
            <div :class="$style.itemTitle">
              退款(无需退货)
            </div>
            <div>
              未收到货（包含未签收），请您先联系商家协商
              <br>
              商家同意后可直接退款；
            </div>
          </div>
          <pl-svg
            :class="$style.itemRight"
            name="right"
            color="#DEDEDE"
          />
        </router-link>

        <router-link
          tag="div"
          :to="{ name: 'RefundApply', params: { orderId, orderProductRId, refundType: '2' } }"
          :class="$style.item"
        >
          <div :class="$style.itemLeft">
            <div :class="$style.itemTitle">
              退款退货
            </div>
            <div>
              已收到货，需要退换所收到的商品，商家收到商品后
              <br>
              可退款；
            </div>
          </div>
          <pl-svg
            :class="$style.itemRight"
            name="right"
            color="#DEDEDE"
          />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
// import { getProductDetail } from '../../../apis/product'
import { getOrderDetail } from '../../../apis/order-manager'

export default {
  name: 'Refund',
  components: {
    OrderItem
  },
  props: {
    orderId: {
      type: String,
      default: null
    },
    orderProductRId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      refundType: 'REFUND', // 退款类型  RETURN_REFUND REFUND
      productInfo: {}
      // statusTypeMap: {
      //   WAIT_SHIP: 'WAIT_SHIP_REFUND_RULE', // 待发货的待退款
      //   WAIT_RECEIVE: 'WAIT_RECEIVE_REFUND_RULE', // 待收货的待退款
      //   FINISHED: 'FINISHED_REFUND_RULE' // 待收货的待退款
      // },
      // orderStatus: '',
      // operationType: '' // 在何种情况下退款
    }
  },
  activated () {
    this.getProductDetail()
  },
  methods: {
    async getProductDetail () {
      // getOrderDetail(this.orderId)
      const { result } = await getOrderDetail(this.orderId)
      const products = result.productInfoModel.productDetailModels.filter(product => product.orderProductRId === this.orderProductRId)
      this.productInfo = products.length ? products[0] : {}
      // this.orderStatus = orderInfoModel.orderStatus
      // this.operationType = this.statusTypeMap[orderInfoModel.orderStatus]
    }
  }
}
</script>

<style module lang="scss">
  .order-info {
    padding: 24px;
    background-color: #FFF;
    display: flex;
  }

  .content {
    padding: 20px 24px;
  }

  .panel {
    border-radius: 20px;
    background-color: #fff;
    overflow: hidden;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 20px 24px 20px 32px;
    &:nth-of-type(1) {
      border-bottom: 1px solid #F0F0F0;
    }
  }

  .item-left {
    flex: 1;
    font-size: 22px;
    color: #999999;
    line-height: 32px;
  }

  .item-right {
    width: 22px;
  }

  .item-title {
    font-size: 26px;
    font-family: PingFangSC-Medium;
    font-weight: bold;
    color: #000;
    line-height: 36px;
    margin-bottom: 8px;
  }
</style>
