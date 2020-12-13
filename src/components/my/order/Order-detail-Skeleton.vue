<template>
    <!-- 骨架屏 -->
    <div :class="$style.skeleton">
        <div :class="[$style.skeleton1, $style.skeAnimation]" />
        <div :class="[$style.skeleton2, $style.skeAnimation]" />
        <div :class="$style.skeleton3">
            <AddressItemSkeleton />
        </div>
        <div :class="$style.skeleton4">
            <OrderItemSkeleton :class="$style.skeletionOrder" />
            <div :class="[$style.skeleton41, $style.skeAnimation]" />
            <div :class="[$style.skeleton42, $style.skeAnimation]" />
        </div>
        <div :class="$style.skeleton3">
            <AddressItemSkeleton />
        </div>
        <div :class="$style.skeleton4">
            <div :class="[$style.skeleton41, $style.skeAnimation]" />
            <div :class="[$style.skeleton42, $style.skeAnimation]" />
            <div :class="[$style.skeleton41, $style.skeAnimation]" />
            <div :class="[$style.skeleton42, $style.skeAnimation]" />
            <div :class="[$style.skeleton41, $style.skeAnimation]" />
            <div :class="[$style.skeleton42, $style.skeAnimation]" />
            <div :class="[$style.skeleton41, $style.skeAnimation]" />
            <div :class="[$style.skeleton42, $style.skeAnimation]" />
        </div>
    </div>
</template>

<script>
import OrderItemSkeleton from '../../skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../skeleton/Address-Item.vue'
export default {
    name: 'OrderDetailSkeleton',
    components: {
        OrderItemSkeleton,
        AddressItemSkeleton
    }
}
</script>

<style module lang="scss">
  /** skeleton start **/
  .skeleton {
    padding: 28px 40px;
  }
  .skeleton1 {
    width: 200px;
    height: 53px;
  }
  .skeleton2 {
    width: 500px;
    height: 37px;
    margin-top: 14px;
  }
  .skeleton3 {
    margin-top: 30px;
    background-color: #fff;
  }
  .skeleton4 {
    margin-top: 30px;
    padding: 24px 28px;
    background-color: #fff;
  }
  .skeleton4-1 {
    width: 364px;
    height: 32px;
    margin-bottom: 8px;
  }
  .skeleton4-2 {
    width: 214px;
    height: 32px;
    margin-bottom: 20px;
  &:nth-last-of-type(1) {
     margin-bottom: 0;
   }
  }
  .skeletion-order {
    margin-top: 0px;
    margin-bottom: 20px;
  }
  .skeAnimation {
  @include skeAnimation(#eee)
  }
  /** skeleton end **/
</style>
