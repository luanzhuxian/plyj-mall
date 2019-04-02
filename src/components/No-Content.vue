<template>
  <div :class="$style.noContent">
    <pl-svg :name="icon"></pl-svg>
    <p :class="$style.text" v-text="text"></p>
  </div>
</template>

<script>
export default {
  name: 'No-Content',
  props: {
    text: String,
    icon: {
      type: String,
      default: 'no-content'
    }
  }
}
</script>

<style module lang="scss">
  .no-content {
    width: 100%;
    margin: 120px 0;
    text-align: center;
    svg {
      width: 450px;
      height: 282px;
    }
    .text {
      margin-top: 30px;
      font-size: 32px;
      color: #999;
    }
  }
</style>
