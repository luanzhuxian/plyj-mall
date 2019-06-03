<template>
  <div :class="$style.refund">
    <div style="position: relative;">
      <a href="tel:15091719776">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <div
      v-if="relationModel.mediaInfoModels"
      :class="$style.order"
    >
      <img
        :class="$style.orderPicture"
        v-lazy="relationModel.mediaInfoModels[0].mediaUrl"
        alt="商品图片"
      >
      <div :class="$style.orderInfo">
        <div :class="$style.orderInfoName">
          {{ relationModel.productModel.productName }}
        </div>
        <div :class="$style.orderInfoOption">
          {{ relationModel.productModel.optionName }}
        </div>
      </div>
    </div>
    <div :class="$style.content">
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
    </div>
  </div>
</template>

<script>
import {
  getOrderDetail
} from '../../../apis/order-manager'
export default {
  name: 'Refund',
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
  props: {
    orderId: {
      type: String,
      default: null
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

  .order {
    padding: 24px;
    background-color: #FFF;
    display: flex;
  }
  .order-picture {
    width: 140px;
    height: 140px;
    margin-right: 16px;
  }
  .order-info {
    flex: 1;
  }
  .order-info-name {
    font-size: 22px;
    line-height: 26px;
    margin-bottom: 8px;
    height: 52px;
    @include elps-wrap(2);
  }
  .order-info-option {
    font-size: 20px;
    line-height: 28px;
    color: #999999;
    @include elps-wrap(1);
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
