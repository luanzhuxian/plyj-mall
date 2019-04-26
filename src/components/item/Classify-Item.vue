<template>
  <div :class="$style.classifyItem">
    <img
      class="radius-20"
      :src="img"
      :alt="text"
    >
    <div v-text="text" />
  </div>
</template>

<script>
export default {
  name: 'ClassifyItem',
  props: {
    text: {
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
.classify-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 33.333%;
  margin-bottom: 60px;
  > div {
    margin-top: 8px;
    color: #666;
    font-size: 22px;
  }
  > img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
}
</style>
