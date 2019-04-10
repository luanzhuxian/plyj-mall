<template>
  <div :class="$style.refundDetail">
    <div style="position: relative;">
      <top-text
        title="待退款"
        tip="商家正在处理，如有问题请咨询商家"
      />
      <!--<top-text title="退款成功" tip="2018年7月23日 17:31:32" />-->
      <!--<top-text title="退款失败" tip="2018年7月23日 17:31:32" />-->
      <a :href="`tel:${$store.getters.supportPhone}`">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <div :class="$style.money + ' fz-30 radius-20 mt-28'">
      <div class="bold">
        <span>退款总金额</span>
        <!--<span>已退款 -> 退款成功</span>-->
        <!--<span>已退款 -> 退款失败</span>-->
        <span
          :class="$style.price + ' rmb'"
          v-text="refundAmount"
        />
      </div>
      <div class="gray-3 fz-26">
        审核中
      </div>
      <!--<div class="gray-3">已退回微信零钱 -> 退款成功</div>-->
      <!--<div class="gray-3">退款已驳回，请联系商家 -> 退款失败</div>-->
    </div>

    <div :class="$style.refund + ' mt-28 radius-20'">
      <module-title title="退款信息" />
      <div :class="$style.productInfo">
        <order-item
          v-for="item of productsDetail"
          :key="item.optionCode"
          :img="item.mediaInfoModels[0].mediaUrl"
          :option="item.optionName"
          :name="item.productName"
          :count="item.count"
          :price="item.productPrice"
          route-name="Lesson"
          :product-seq="item.productSeq"
        />
      </div>
      <div :class="$style.totalPrice">
        <span class="fz-24">总价：</span>
        <Price
          :price="refundAmount"
          size="small"
        />
      </div>
    </div>

    <div :class="$style.refundInfo + ' radius-20 mt-28'">
      <div :class="$style.infoList">
        <pl-list
          title="退款编号："
          :content="refundId"
        />
        <pl-list
          title="申请时间："
          :content="applyDate"
        />
        <pl-list
          title="服务类型："
          :content="serviceType"
        />
      </div>
      <div :class="$style.reason">
        <pl-list
          title="问题描述："
          :content="problemDesc"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import ModuleTitle from '../../../components/Module-Title.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import Price from '../../../components/Price.vue'
import { getRefundDetail } from '../../../apis/order-manager'
export default {
  name: 'RefundDetail',
  components: {
    TopText,
    ModuleTitle,
    OrderItem,
    Price
  },
  data () {
    return {
      serviceType: '',
      refundId: '',
      applyDate: '',
      problemDesc: '',
      refundAmount: '',
      productsDetail: []
    }
  },
  props: ['orderSn'],
  activated () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      try {
        let { result } = await getRefundDetail(this.orderSn)
        let { serviceType, refundId, applyDate, problemDesc, refundAmount, productsDetail } = result
        this.serviceType = serviceType
        this.refundId = refundId
        this.applyDate = applyDate
        this.problemDesc = problemDesc
        this.refundAmount = Number(refundAmount) || 0
        this.productsDetail = productsDetail || []
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .refund-detail {
    padding: 28px 40px;
  }
  .call-me {
    position: absolute;
    top: -28px;
    right: 40px;
    width: 38px;
    height: 80px;
  }
  .money {
    display: flex;
    justify-content: space-between;
    padding: 34px 28px;
    background-color: #fff;
    .price {
      margin-left: 20px;
      color: $--primary-color;
      &:before {
      }
    }
  }
  .refund {
    padding: 20px 0 20px 28px;
    background-color: #fff;
  }
  .product-info {
    position: relative;
    padding: 28px 0;
    margin-top: 28px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
    &:before {
      @include border-half-top(#e7e7e7);
    }
  }
  .total-price {
    padding: 0 28px;
    text-align: right;
    margin-top: 16px;
  }
  .refund-info {
    padding: 28px;
    background-color: #fff;
    .info-list {
      position: relative;
      overflow: hidden;
      margin-bottom: 40px;
      padding-bottom: 40px;
      &:after {
        @include border-half-bottom(#e7e7e7);
      }
    }
  }
</style>
