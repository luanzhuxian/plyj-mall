<template>
  <div :class="$style.detailDesc">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DetailTitle'
}
</script>

<style module lang="scss">
  .detail-desc {
    margin-top: 12px;
    margin-bottom: 28px;
    font-size: 22px;
    line-height: 32px;
    color: #666;
  }
</style>
