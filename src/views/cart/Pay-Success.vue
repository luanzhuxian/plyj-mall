<template>
  <div :class="$style.paySuccess">
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
      @click="$router.push({ name: 'Home' })"
    >
      完成，返回首页
    </pl-button>
  </div>
</template>

<script>
export default {
  name: 'PaySuccess',
  props: ['orderId']
}
</script>

<style module lang="scss">
  .paySuccess {
    padding: 0 40px;
    text-align: center;
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
