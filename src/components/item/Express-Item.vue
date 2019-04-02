<template>
  <div :class="$style.expressItem">
    <pl-svg name="express"></pl-svg>
    <div :class="$style.right+' fz-28'">
      <div class="bold" v-text="expressName"></div>
      <div>运单号：<i v-text="expressNumber" /></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Express-Item',
  props: {
    expressName: String,
    expressNumber: String
  }
}
</script>

<style module lang="scss">
  .express-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 28px 28px 28px 0;
    background-color: #fff;
    border-radius: 20px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
    svg {
      width: 64px;
      height: 64px;
      margin-left: 28px;
      margin-right: 28px;
      fill: $--warning-color;
    }
  }
</style>
