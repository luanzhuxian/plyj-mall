<template>
  <div :class="$style.detailDesc">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DetailTitle'
}
</script>

<style module lang="scss">
  .detail-desc {
    margin-top: 16px;
    margin-bottom: 30px;
    font-size: 24px;
    line-height: 32px;
    color: #666;
  }
</style>
