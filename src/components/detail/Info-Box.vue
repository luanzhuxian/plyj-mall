<template>
  <div :class="$style.detailInfoBox + ' radius-20'">
    <div :class="$style.detailBox">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailInfoBox'
}
</script>

<style module lang="scss">
.detail-info-box {
  position: relative;
  top: -60px;
  width: 670px;
  margin: 0 auto;
  background-color: #fff;
  z-index: 10; // swiper的指示器是10, 这里不能低于10
  box-shadow: 0 20px 50px rgba(0, 0, 0, .1);
  .detail-box {
    padding: 0 30px;
    overflow: hidden;
  }
}
</style>
