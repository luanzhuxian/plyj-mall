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
        <svg
          :class="$style.circle"
          viewBox="0 0 20 20"
        >
          <circle
            cx="10"
            cy="10"
            r="10"
          />
        </svg>
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
      v-else-if="!loading"
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
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      freightData: [],
      orderDetail: {
        relationModel: []
      }
    }
  },
  async activated () {
    try {
      this.loading = true
      let orderDetail = await getOrderDetail(this.orderId)
      this.orderDetail = orderDetail.result
      let freightData = await getFreightData(this.orderId)
      freightData.result.sort((a, b) => b.msgTime - a.msgTime)
      this.freightData = freightData.result
    } catch (e) {
      throw e
    } finally {
      this.loading = false
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
    margin-bottom: 40px;
    padding-left: 50px;
    &:nth-of-type(1) {
      color: red;
      .circle {
        fill: red;
      }
    }
    .circle {
      position: absolute;
      left: 0;
      top: 40%;
      transform: translateY(-50%);
      fill: #ccc;
      width: 2.5vw;
      z-index: 2;
    }
    &:after {
      position: absolute;
      left: 1.25vw;
      top: calc(40% + 10px);
      content: '';
      width: 1px;
      height: calc(100% + 40px);
      transform: scaleX(0.5);
      background-color: #ccc;
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
