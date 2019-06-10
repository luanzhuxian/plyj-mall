<template>
  <div
    class="order-complete"
    :class="$style.orderComplete"
  >
    <div :class="$style.top">
      <div :class="$style.text">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
        <span>交易完成</span>
      </div>
      <div :class="$style.button">
        <pl-button
          plain
          round
          size="middle"
          @click="$router.push({ name: 'Refund', params: { orderId, productId: item.productId } })"
        >
          返回首页
        </pl-button>
        <pl-button
          plain
          round
          size="middle"
          @click="$router.push({ name: 'Refund', params: { orderId, productId: item.productId } })"
        >
          立即评价
        </pl-button>
      </div>
    </div>
    <div class="">
      <you-like
        :is-my="true"
        style="margin-top: 16px"
      />
    </div>
  </div>
</template>

<script>
import YouLike from '../../old-home/YouLike.vue'

export default {
  name: 'OrderComplete',
  components: {
    YouLike
  },
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  methods: {}
}
</script>

<style module lang="scss">
.order-complete {
  box-sizing: border-box;
  height: 264px;
  padding: 32px 0 88px;
  overflow: hidden;
  // background-image: url('../../../assets//base-theme/order-complete-bg.svg');
  background-image: url('../../../assets/images/order-complete-bg.png');
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;

  .text,
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    font-size: 36px;
    color: #FFF;
    line-height: 50px;
    margin-bottom: 34px;
  }

  button {
    &:nth-of-type(1) {
      margin-right: 60px;
    }
  }
}
</style>

<style lang="scss">
  .order-complete {
    .pl-button__default.plain {
      color: #FFF;
    }
    .pl-button__small.plain:after {
      border: 1px solid #FFF;
    }
  }
</style>
