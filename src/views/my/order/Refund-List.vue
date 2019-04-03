<template>
  <div :class="$style.refundList">
    <load-more :request-methods="getOrderList" :form="form">
      <template v-slot="{ list }">
        <router-link
          v-for="item of list"
          tag="div"
          :to="{ name: 'RefundDetail', params: { orderSn: item.orderInfoModel.orderSn } }"
          :class="$style.refundItem + ' radius-20'"
          :key="item.orderInfoModel.orderSn"
        >
          <div :class="$style.orderId">
            <pl-list title="下单时间：" :content="item.orderCreateDate" />
            <pl-list title="订单编号：" :content="item.orderInfoModel.orderSn" />
          </div>
          <OrderItem
            :img="item.mediaInfoModel[0].mediaUrl"
            :name="item.orderProductRelationModel.productName"
            :option="item.orderProductRelationModel.optionName"
            :price="item.orderProductRelationModel.productPrice"
            :count="item.orderProductRelationModel.count"
          />
          <div :class="$style.status + ' mt-28'">
            <pl-button v-if="item.orderInfoModel.orderStatus === 'CLOSED'" plain round>已退款</pl-button>
            <pl-button v-if="item.orderInfoModel.orderStatus === 'FINISHED_REFUND'" type="primary" plain round>审核中</pl-button>
          </div>
        </router-link>
      </template>
    </load-more>
  </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import { getOrderList } from '../../../apis/order-manager'
import LoadMore from '../../../components/Load-More.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Refund-List',
  components: {
    OrderItem,
    LoadMore
  },
  data () {
    return {
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: 'POST_SALE_SERVICE',
        assessment: '',
        orderSnOrName: ''
      },
      getOrderList
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created () {
    this.form.userId = this.userId
  },
  methods: {
  }
}
</script>

<style module lang="scss">
  .refund-list {
    padding: 20px 40px;
  }
  .order-id {
    position: relative;
    padding-bottom: 24px;
    margin-bottom: 24px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
  }
  .refund-item {
    padding: 24px 28px;
    margin-bottom: 28px;
    background-color: #fff;
  }
  .status {
    text-align: right;
    button {
      margin-left: 20px;
    }
  }
</style>
