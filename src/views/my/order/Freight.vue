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
        <div :class="$style.datetime">
          <span :class="$style.date">{{ item.msgTime * 1000 | dateFormat('MM-DD') }}</span>
          <span :class="$style.time">{{ item.msgTime * 1000 | dateFormat('HH:mm') }}</span>
        </div>

        <div
          :class="$style.freightContent"
          v-text="item.content"
        />
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
import { getFreightData } from '../../../apis/order-manager'
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
      // let orderDetail = await getOrderDetail(this.orderId)
      // this.orderDetail = orderDetail.result
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
    display: flex;
    padding-bottom: 20px;
    &:nth-of-type(1) {
      .datetime {
        color: #333;
      }
      .freightContent {
        color: #333;
        &:before {
          background: linear-gradient(180deg, #FFAF00, #FE7700);
        }
      }
    }
    &:nth-last-of-type(1) {
      > .freightContent {
        &:after {
          display: none;
        }
        &:before {
          left: 11px;
          width: 42px;
          height: 42px;
          border-radius: 21px;
          background: #fff url("../../../assets/images/shipped.png") no-repeat center center;
          background-size: 50%;
          border: 1px solid #D8D8D8;
          box-sizing: border-box;
        }
      }
    }
  }
  .datetime {
    display: inline-flex;
    flex-direction: column;
    text-align: right;
    color: #999;
    > .date {
      font-size: 22px;
      line-height: 32px;
    }
    > .time {
      font-size: 18px;
      line-height: 26px;
    }
  }
  .freightContent {
    position: relative;
    flex: 1;
    padding-left: 62px;
    font-size: 22px;
    line-height: 32px;
    color: #999;
    &:before {
      position: absolute;
      content: '';
      left: 24px;
      top: 10px;
      width: 14px;
      height: 14px;
      border-radius: 7px;
      background: #D8D8D8;
      z-index: 2;
    }
    &:after {
      position: absolute;
      content: '';
      left: 31px;
      top: 24px;
      width: 1px;
      height: 120%;
      border-radius: 7px;
      background-color: #D8D8D8;
      z-index: 1;
    }
  }
  .tip {
    font-size: 24px;
    text-align: center;
    color: $--font-color_gray3;
  }
</style>
