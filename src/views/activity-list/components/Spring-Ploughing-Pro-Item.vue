<template>
  <!-- 春耘计划商品组件 -->
  <div :class="$style.springPloughingProItem">
    <img :src="data.goodsImage" alt="">
    <div :class="$style.right">
      <p :class="$style.name" v-text="data.goodsName" />
      <p :class="$style.limit">
        {{ data.sku1Name }}{{ data.sku2Name ? ` ,${data.sku2Name}` : '' }}
      </p>
      <p :class="$style.price">折后价：￥{{ data.amount }}</p>
      <p :class="$style.originalPrice">原价：￥{{ data.originPrice }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpringPloughingProItem',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style module lang="scss">
  .spring-ploughing-pro-item {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 16px;
    background-color: #26601F;
    box-shadow: 0 0 0 2px #A3D816 inset;
    > img {
      width: 280px;
      height: 188px;
      object-fit: cover;
    }
  }
  .right {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    margin-left: 16px;
    padding: 8px 0;
  }
  .name {
    width: 300px;
    margin-bottom: 8px;
    font-size: 28px;
    color: #fff;
    @include elps();
  }
  .limit {
    margin-bottom: 20px;
    font-size: 24px;
    color: #88DE9E;
  }
  .price {
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 28px;
    color: #D1E42C;
  }
  .original-price {
    font-size: 24px;
    color: #D1E42C;
  }
</style>
