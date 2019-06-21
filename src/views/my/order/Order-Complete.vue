<template>
  <div
    class="order-complete"
    :class="$style.orderComplete"
  >
    <div :class="$style.top">
      <div :class="$style.text">
        <pl-svg
          :class="$style.icon"
          name="success"
        />
        <span>交易完成</span>
      </div>
      <div :class="$style.button">
        <pl-button
          plain
          round
          size="middle"
          @click="$router.push({ name: 'Home' })"
        >
          返回首页
        </pl-button>
        <pl-button
          plain
          round
          size="middle"
          @click="$router.push({ name: 'OrderDetail', params: { orderId } })"
        >
          立即评价
        </pl-button>
      </div>
    </div>
    <div :class="$style.wrapper">
      <you-like :is-my="true" />
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
  beforeRouteLeave (to, from, next) {
    if (to.name === 'OrderDetail') {
      from.meta.receiveOrderId = this.orderId
    }
    next()
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
  min-height: 100vh;
  .top {
    box-sizing: border-box;
    height: 264px;
    padding: 32px 0 88px;
    overflow: hidden;
    background-image: url('../../../assets/images/order-complete-bg.png');
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
  }
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
    text-align: center;
  }
  .icon {
    width: 40px;
    fill: #FFF;
    margin-right: 8px;
    vertical-align: middle;
  }
  .wrapper {
    margin-top: 32px;
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
    .pl-button__middle {
      padding: 0 38px;
      font-size: 26px;
    }
    .pl-button__middle.plain:after {
      border: 1px solid #FFF;
      border-radius: 60px;
    }
  }
</style>
