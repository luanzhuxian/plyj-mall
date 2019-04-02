<template>
  <h2 :class="$style.detailTitle">
    <slot></slot>
  </h2>
</template>

<script>
export default {
  name: 'DetailTitle'
}
</script>

<style module lang="scss">
  .detail-title {
    margin-top: 40px;
    font-size: 36px;
    line-height: 48px;
    font-weight: bold;
  }
</style>
