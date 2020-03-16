<template>
    <div :class="$style.soldOut">
        <pl-svg name="icon-sold-out" />
        <p>抱歉，该商品已删除</p>
        <pl-button
            plain
            size="middle"
            @click="$router.replace({ name: 'Home' })"
        >
            去逛商城
        </pl-button>
    </div>
</template>

<script>
export default {
    name: 'SoldOut'
}
</script>

<style module lang="scss">
  .soldOut {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 120px;
    height: 500px;
    svg {
      width: 442px;
      height: 442px;
    }
    P {
      font-size: 32px;
      color: #9b9a9a;
      margin-bottom: 45px;
      margin-top: -45px;
    }
  }
</style>
