<template>
  <div :class="$style.freight">
    <OrderItem
      :class="$style.orderPro"
      v-for="item of orderDetail.relationModel"
      :key="item.orderProductRelationModel.productSeq"
      :border="true"
      :img="item.mediaInfoModels[0].mediaUrl"
      :name="item.orderProductRelationModel.productName"
      :option="item.orderProductRelationModel.optionName"
      :price="item.orderProductRelationModel.productPrice"
      :count="item.orderProductRelationModel.count"
    />
    <ul
      :class="$style.freightList"
      v-if="freightData.length > 0"
    >
      <li
        v-for="item of freightData"
        :key="item.msgTime"
        :class="$style.freightItem"
      >
        <p
          :class="$style.msg"
          v-text="item.content"
        />
        <p :class="$style.msgTime">
          {{ item.msgTime * 1000 | formatDateTime }}
        </p>
      </li>
    </ul>

    <p
      :class="$style.tip"
      v-else
    >
      暂无物流信息
    </p>
  </div>
</template>

<script>
import { getFreightData, getOrderDetail } from '../../../apis/order-manager'
import OrderItem from '../../../components/item/Order-Item.vue'
export default {
  name: 'Freight',
  components: {
    OrderItem
  },
  data () {
    return {
      freightData: [],
      orderDetail: {
        relationModel: []
      }
    }
  },
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  async activated () {
    try {
      let orderDetail = await getOrderDetail(this.orderId)
      this.orderDetail = orderDetail.result
      let freightData = await getFreightData(this.orderId)
      this.freightData = freightData.result
    } catch (e) {
      throw e
    }
  }
}
</script>

<style module lang="scss">
  .freight {
    background-color: #fff;
    padding: 30px 40px;
    min-height: 100vh;
  }
  .orderPro {
    margin-bottom: 30px;
  }
  .freightList {
    margin-top: 40px;
  }
  .freightItem {
    position: relative;
    padding-bottom: 40px;
    padding-left: 50px;
    &:before {
      position: absolute;
      left: 0;
      top: calc(50% - 50px);
      transform: translateY(50%);
      content: '';
      width: 20px;
      height: 20px;
      border: 1px solid #fff;
      border-radius: 11px;
      background-color: #bbb;
      z-index: 1;
    }
    &:after {
      position: absolute;
      left: 10px;
      top: calc(50% - 10px);
      content: '';
      width: 1px;
      height: calc(50% + 20px);
      background-color: #bbb;
    }
    &:nth-last-of-type(1):after {
      display: none;
    }
  }
  .msg {
    position: relative;
    margin-bottom: 10px;
    font-size: 28px;
  }
  .msgTime {
    font-size: 20px;
    color: #999;
  }
  .tip {
    font-size: 24px;
    text-align: center;
    color: $--font-color_gray3;
  }
</style>
