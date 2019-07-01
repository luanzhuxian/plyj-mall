<template>
  <h2 :class="$style.detailTitle">
    <slot />
  </h2>
</template>

<script>
export default {
  name: 'DetailTitle'
}
</script>

<style module lang="scss">
  .detail-title {
    margin-top: 26px;
    font-size: 28px;
    line-height: 48px;
    font-weight: bold;
    color: #000;
  }
</style>
