<template>
  <div :class="$style.cartItem">
    <img
      :class="$style.cartItemImage"
      :src="img"
      alt=""
    >

    <div :class="$style.cartItemContent">
      <div
        :class="$style.productName"
        v-text="name"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    name: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .cartItem {
    display: flex;
    flex: 1;
    margin-left: 24px;
    padding: 22px 20px;
    border-radius: 20px;
    background-color: #fff;
  }
  .cartItemImage {
    width: 164px;
    height: 164px;
    object-fit: cover;
  }
  .cartItemContent {
    display: inline-flex;
    flex: 1;
    margin-left: 24px;
  }
  .productName {
    font-size: 22px;
    height: 64px;
    line-height: 32px;
    @include elps-wrap(2);
  }
</style>
