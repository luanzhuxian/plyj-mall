<template>
  <div
    :class="$style.classifyItem"
    @click="itemClick"
  >
    <img
      class="radius-20"
      :src="img"
      v-img-error="'classifyIcon'"
    >
    <div v-text="text" />
  </div>
</template>

<script>
export default {
  name: 'ClassifyItem',
  props: {
    cid: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  },
  methods: {
    itemClick () {
      if (this.cid && this.text) {
        this.$emit('click', {
          cid: this.cid,
          name: this.text
        })
      } else {
        this.$alert('子分类数据错误！')
      }
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
  margin-bottom: 32px;
  > div {
    margin-top: 8px;
    color: #666;
    font-size: 22px;
  }
  > img {
    width: 96px;
    height: 96px;
    object-fit: cover;
  }
}
</style>
