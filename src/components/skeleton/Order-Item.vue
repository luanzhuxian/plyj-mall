<!-- order-item 骨架屏 -->
<template>
    <div :class="$style.orderItemSke">
        <div :class="$style.orderItemSke1 + ' ' + $style.skeAnimation" />
        <div :class="$style.orderItemSke2">
            <div :class="$style.orderItemSke21 + ' ' + $style.skeAnimation" />
            <div :class="$style.orderItemSke22 + ' ' + $style.skeAnimation" />
            <div :class="$style.orderItemSke23 + ' ' + $style.skeAnimation" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrderItemSkeleton'
}
</script>

<style module lang="scss">
  .orderItemSke {
    display: flex;
    margin-top: 30px;
  }
  .orderItemSke-1 {
    width: 140px;
    height: 140px;
  }
  .orderItemSke-2 {
    margin-left: 18px;
  }
  .orderItemSke-2-1 {
    width: 150px;
    height: 32px;
  }
  .orderItemSke-2-2 {
    width: 250px;
    height: 32px;
    margin-top: 8px;
  }
  .orderItemSke-2-3 {
    width: 100px;
    height: 32px;
    margin-top: 8px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
</style>
