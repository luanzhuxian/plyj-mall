<template>
  <load-more :requestMethods="getOrderList" :options="form" ref="loadMore" no-content-tip="暂无订单">
    <template v-slot="{ list }">
      <router-link
        v-for="(item, i) of list"
        tag="div"
        :key="i"
        :to="{ name: 'OrderDetail', params: { orderId: item.orderInfoModel.orderSn } }"
        :class="'mb-28 ' + $style.orderBox">
        <div class="fz-24">
          <pl-list title="订单编号：" :content="item.orderInfoModel.orderSn" />
          <p :class="$style.status" v-text="orderStatus[item.orderInfoModel.orderStatus]" />
        </div>
        <order-item
          :img="item.mediaInfoModel[0].mediaUrl"
          :name="item.orderProductRelationModel.productName"
          :option="item.orderProductRelationModel.optionName"
          :count="item.orderProductRelationModel.count"
          :price="item.orderProductRelationModel.productPrice"
          border />
        <div :class="$style.orderBoxBottom">
          <price prefix-text="总价：" :price="item.orderInfoModel.amount + item.orderInfoModel.freight" size="small" plain />
          <div :class="$style.buttons" v-if="item.orderInfoModel.orderStatus !== 'CLOSED'">
            <pl-button v-if="item.orderInfoModel.orderStatus === 'WAIT_PAY'" type="warning" round @click="pay(item.orderInfoModel.orderSn, item.orderInfoModel.orderType)">去支付</pl-button>
            <pl-button
              v-if="item.orderInfoModel.orderStatus === 'WAIT_RECEIVE'"
              @click="confirmGet(item.orderInfoModel.orderType, item.orderInfoModel.orderSn)"
              type="warning" round>
              确认收货
            </pl-button>
            <pl-button
              v-if="item.orderInfoModel.orderStatus === 'FINISHED' && item.orderInfoModel.assessment === 'NO'"
              type="warning" plain round
              @click="$router.push({ name: 'CommentOrder', params: { orderId: item.orderInfoModel.orderSn } })">
              去评价
            </pl-button>
          </div>
        </div>
      </router-link>
    </template>
  </load-more>
</template>
<script>
import OrderItem from '../../../../components/item/Order-Item.vue'
import Price from '../../../../components/Price.vue'
import LoadMore from '../../../../components/Load-More.vue'
import { mapGetters } from 'vuex'
import {
  getOrderList,
  getAwaitPayInfo,
  physicalorderReceiving,
  physicalorderReceivingForVirtual
} from '../../../../apis/order-manager'
import wechatPay from '../../../../assets/js/wechat/wechat-pay'
export default {
  name: 'List-Component',
  components: {
    OrderItem,
    Price,
    LoadMore
  },
  props: {
    form: Object
  },
  computed: {
    ...mapGetters(['orderStatus', 'userId'])
  },
  data () {
    return {
      orderList: [],
      orderIdMap: [],
      loading: true,
      getOrderList
    }
  },
  created () {
    this.form.userId = this.userId
  },
  activated () {
    this.$refs.loadMore.refresh()
  },
  methods: {
    async pay (id, orderType) {
      try {
        const { result } = await getAwaitPayInfo(id)
        // 调用微信支付api
        await wechatPay(result)
        if (orderType === 'PHYSICAL_GOODS') {
          this.$router.push({ name: 'waitShip' })
        } else {
          this.$router.push({ name: 'waitReceive' })
        }
      } catch (e) {
        throw e
      }
    },
    // 确定收货
    async confirmGet (orderType, orderId) {
      try {
        await this.$confirm('您确定收货吗？')
        if (orderType === 'PHYSICAL_GOODS') {
          await physicalorderReceiving(orderId)
        } else {
          await physicalorderReceivingForVirtual(orderId)
        }
        // 跳转至待评价
        this.$router.push({ name: 'waitComment' })
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .order-box {
    padding-left: 28px;
    padding-bottom: 24px;
    border-radius: 20px;
    background-color: #fff;
    > div {
      &:nth-of-type(1) {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80px;
        padding-right: 28px;
        margin-bottom: 30px;
        &:after {
          @include border-half-bottom(#e7e7e7);
        }
      }
    }
    .status {
      color: var(--primary-color);
    }
  }
  .order-box-bottom {
    margin-top: 16px;
    > div {
      display: flex;
      padding-right: 28px;
      justify-content: flex-end;
      align-items: flex-end;
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
      margin-top: 32px;
      button {
        margin-left: 20px;
        margin-bottom: 20px;
      }
    }
  }
</style>
