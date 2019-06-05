<template>
  <div :class="$style.refund">
    <div style="position: relative; z-index: 9999;">
      <a href="tel:15091719776">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <section :class="$style.orderInfo">
      <order-item
        :img="'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png'"
        :name="'McQ Alexander McQueen 2018春夏新款棉氨男士…'"
        :option="'课程：英语互动'"
        hide-price
      />
    </section>

    <section :class="$style.content">
      <div :class="$style.panel">
        <router-link
          tag="div"
          :to="{ name: 'RefundApply', params: { orderId, refundType: 'REFUND' } }"
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
          :to="{ name: 'RefundApply', params: { orderId, refundType: 'RETURN_REFUND' } }"
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
    }
  },
  data () {
    return {
      type: 'REFUND', // 退款类型  RETURN_REFUND REFUND
      relationModel: [],
      statusTypeMap: {
        WAIT_SHIP: 'WAIT_SHIP_REFUND_RULE', // 待发货的待退款
        WAIT_RECEIVE: 'WAIT_RECEIVE_REFUND_RULE', // 待收货的待退款
        FINISHED: 'FINISHED_REFUND_RULE' // 待收货的待退款
      },
      orderStatus: '',
      operationType: '' // 在何种情况下退款
    }
  },
  activated () {
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail () {
      const { result } = await getOrderDetail(this.orderId)
      let { relationModel, orderInfoModel } = result
      this.relationModel = relationModel[0]
      this.orderStatus = orderInfoModel.orderStatus
      this.operationType = this.statusTypeMap[orderInfoModel.orderStatus]
    }
  }
}
</script>

<style module lang="scss">
  .call-me {
    position: absolute;
    top: -28px;
    right: 40px;
    width: 38px;
    height: 80px;
  }

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
