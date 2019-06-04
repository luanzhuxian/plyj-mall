<template>
  <div
    :class="{
      [$style.cartItem]: true
    }"
  >
    <div
      :class="{
        [$style.cartItem1]: true,
        [$style.skeAnimation]: true
      }"
    />
    <div
      :class="$style.cartItemRight"
    >
      <div
        :class="{
          [$style.cartItem2]: true,
          [$style.skeAnimation]: true
        }"
      />
      <div
        :class="{
          [$style.cartItem3]: true,
          [$style.skeAnimation]: true
        }"
      />
      <div
        :class="{
          [$style.cartItem4]: true,
          [$style.skeAnimation]: true
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartItem'
}
</script>

<style module lang="scss">
  .cartItem {
    display: flex;
    width: 702px;
    margin: 20px auto;
  }
  .cartItem1 {
    width: 164px;
    height: 164px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
  .cartItemRight {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    padding-left: 24px;
  }
  .cartItem2 {
    height: 64px;
  }
  .cartItem3 {
    width: 400px;
    height: 44px;
    margin-top: 10px;
  }
  .cartItem4 {
    height: 40px;
    width: 200px;
    margin-top: 6px;
  }
</style>
