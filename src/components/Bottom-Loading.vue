<template>
  <div :class="$style.bottomLoading">
    <span v-text="text" />
    <pl-svg
      :class="$style.loading"
      name="btn-loading"
    />
  </div>
</template>

<script>
export default {
  name: 'BottomLoading',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .bottom-loading {
    line-height: 80px;
    text-align: center;
    color: #999;
    transform: rotate(0);
    font-size: 24px;
    .loading {
      width: 24px;
      height: 24px;
      margin-left: 10px;
      vertical-align: -4px;
      fill: currentColor;
      animation: rotate 1s linear infinite;
    }
  }
  @keyframes rotate {
    from { transform: rotate(0) }
    to { transform: rotate(180deg) }
  }
</style>
