<template>
  <div
    :class="$style.classifyItem"
    @click="itemClick"
  >
    <img
      class="radius-20"
      :src="img"
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
      if (this.cid) {
        this.$emit('click', this.cid)
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
