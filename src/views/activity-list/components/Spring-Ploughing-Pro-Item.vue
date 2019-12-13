<template>
  <!-- 春耘计划商品组件 -->
  <div :class="$style.springPloughingProItem">
    <img src="https://img.alicdn.com/imgextra/https://gw.alicdn.com/imgextra/i4/407916093/O1CN01krGUZs1usdo1MPyqc_!!407916093-0-pixelsss.jpg_430x430q90.jpg" alt="">
    <div :class="$style.right">
      <p :class="$style.name">少儿英语三节名师特色少儿英语三节名师特色</p>
      <p :class="$style.limit">每人仅可购买1件</p>
      <p :class="$style.price">折后价：￥600</p>
      <p :class="$style.originalPrice">原价：￥1000</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpringPloughingProItem'
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
    display: inline-flex;
    flex-direction: column;
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
