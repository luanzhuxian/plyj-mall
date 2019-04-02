<template>
  <div :class="$style.soldOut">
    <pl-svg name="sold-out"></pl-svg>
    <p>抱歉，该商品已下架</p>
    <pl-button plain size="middle" @click="$router.replace({ name: 'Home' })">返回首页</pl-button>
  </div>
</template>

<script>
export default {
  name: 'Sold-Out'
}
</script>

<style module lang="scss">
  .soldOut {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    svg {
      width: 420px;
    }
    P {
      font-size: 32px;
      color: #9b9a9a;
      margin-bottom: 45px;
      margin-top: -45px;
    }
  }
</style>
