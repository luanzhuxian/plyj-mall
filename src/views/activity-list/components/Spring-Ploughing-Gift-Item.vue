<template>
  <!-- 春耘计划礼品组件 -->
  <div :class="$style.springPloughingGiftItem">
    <img src="https://img.alicdn.com/imgextra/https://gw.alicdn.com/imgextra/i4/407916093/O1CN01krGUZs1usdo1MPyqc_!!407916093-0-pixelsss.jpg_430x430q90.jpg" alt="">
    <div :class="$style.right">
      <p :class="$style.name">小姐姐 x1</p>
      <p :class="$style.desc">每人仅可购买1件</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpringPloughingGiftItem'
}
</script>

<style module lang="scss">
  .spring-ploughing-gift-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    margin-bottom: 20px;
    background-color: #26601F;
    box-shadow: 0 0 0 2px #124E0B inset;
    border-radius: 60px;
    box-sizing: border-box;
    > img {
      width: 168px;
      height: 112px;
      margin: 4px;
      object-fit: cover;
      border: 2px solid #A3D816;
      border-radius: 56px;
    }
  }
  .right {
    flex: 1;
    margin-left: 26px;
    padding: 14px 0;
    font-size: 28px;
    @include elps()
  }
  .name {
    margin-bottom: 4px;
    color: #D1E42C;
    @include elps()
  }
  .desc {
    color: #fff;
    @include elps()
  }
</style>
