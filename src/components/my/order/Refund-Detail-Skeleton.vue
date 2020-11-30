<template>
    <div :class="$style.skeleton">
        <div :class="[$style.skeleton1 + ' ' + $style.skeAnimation]" />
        <div :class="[$style.skeleton2 + ' ' + $style.skeAnimation]" />
        <div :class="$style.skeleton3">
            <AddressItemSkeleton />
            <AddressItemSkeleton />
        </div>
        <div :class="$style.skeleton4">
            <div :class="$style.skeletonPrice">
                <div :class="[$style.skeletonPriceLeft, $style.skeAnimation]" />
                <div :class="[$style.skeletonPriceRight, $style.skeAnimation]" />
            </div>
            <div :class="$style.skeletonPrice">
                <div :class="[$style.skeletonPriceLeft, $style.skeAnimation]" />
                <div :class="[$style.skeletonPriceRight, $style.skeAnimation]" />
            </div>
        </div>
        <div :class="$style.skeleton4">
            <div :class="[$style.skeleton41, $style.skeAnimation]" />
            <div :class="[$style.skeleton42, $style.skeAnimation]" />
            <OrderItemSkeleton />
            <div :class="[$style.skeleton44, $style.skeAnimation]" />
            <div :class="[$style.skeleton45, $style.skeAnimation]" />
            <div :class="[$style.skeleton46, $style.skeAnimation]" />
            <div :class="[$style.skeleton47, $style.skeAnimation]" />
            <div :class="[$style.skeleton48, $style.skeAnimation]" />
        </div>
    </div>
</template>

<script>
import OrderItemSkeleton from '../../skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../skeleton/Address-Item.vue'
export default {
    name: 'RefundDetailSkeleton',
    components: {
        OrderItemSkeleton,
        AddressItemSkeleton
    }
}
</script>

<style  module lang="scss">
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
  }
  .skeleton4-2 {
    width: 214px;
    height: 32px;
    margin-top: 8px;
  }
  .skeleton4-4 {
    width: 112px;
    height: 37px;
    margin-top: 80px;
  }
  .skeleton4-5 {
    width: 300px;
    height: 40px;
    margin-top: 12px;
  }
  .skeleton4-6 {
    width: 150px;
    height: 37px;
    margin-top: 50px;
  }
  .skeleton4-7 {
    width: 250px;
    height: 37px;
    margin-top: 14px;
  }
  .skeleton4-8 {
    width: 350px;
    height: 40px;
    margin-top: 50px;
  }
  .skeleton-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .skeleton-price-left,
  .skeleton-price-right {
    width: 120px;
    height: 37px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
  /** skeleton end **/
</style>
