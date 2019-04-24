<!-- order-item 骨架屏 -->
<template>
  <div :class="$style.addressitemSke">
    <div :class="$style.addressitemSke1 + ' ' + $style.skeAnimation" />
    <div :class="$style.addressitemSke2">
      <div :class="$style.addressitemSke21 + ' ' + $style.skeAnimation" />
      <div :class="$style.addressitemSke22 + ' ' + $style.skeAnimation" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderItemSkeleton'
}
</script>

<style module lang="scss">
  .addressitemSke {
    display: flex;
    align-items: center;
    padding: 34px 28px;
  }
  .addressitemSke-1 {
    width: 64px;
    height: 64px;
  }
  .addressitemSke-2 {
    margin-left: 28px;
  }
  .addressitemSke-2-1 {
    width: 150px;
    height: 37px;
  }
  .addressitemSke-2-2 {
    width: 300px;
    height: 30px;
    margin-top: 6px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
</style>
