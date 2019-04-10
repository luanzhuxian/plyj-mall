<template>
  <div :class="$style.paySuccess">
    <pl-svg
      :class="$style.icon"
      name="pay-success"
    />
    <p :class="$style.tip1">
      订单支付成功
    </p>
    <p :class="$style.tip2">
      请保持手机通畅，以便于我们为您提供服务！
    </p>
    <router-link
      :class="$style.tip3"
      :to="{ name: 'OrderDetail', params: { orderId } }"
    >
      查看订单
    </router-link>
    <pl-button
      size="huge"
      type="warning"
      @click="$router.replace({ name: 'Home' })"
    >
      完成，返回首页
    </pl-button>
  </div>
</template>

<script>
export default {
  name: 'PaySuccess',
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    let { orderId } = to.params
    if (orderId) {
      next()
    } else {
      next({ name: 'Home' })
    }
  }
}
</script>

<style module lang="scss">
  .paySuccess {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    padding: 0 40px;
    text-align: center;
  }
  .icon {
    width: 142px;
  }
  .tip1 {
    margin-top: 67px;
    font-size: 40px;
  }
  .tip2 {
    margin-top: 24px;
    font-size: 28px;
    color: #999;
  }
  .tip3 {
    display: block;
    margin: 46px 0;
    font-size: 30px;
    color: #85A5FF;
  }
</style>
