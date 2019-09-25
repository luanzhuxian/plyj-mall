<template>
  <div :class="$style.instructions">
    <div :class="$style.title">
      使用须知
    </div>
    <div :class="$style.content" v-html="lineBreak(content)" />
  </div>
</template>

<script>
export default {
  name: 'Instructions',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 换行
    lineBreak (value) {
      return value.replace(/\n/g, '<br>')
    }
  }
}
</script>

<style module lang="scss">
  .instructions {
    margin-top: 20px;
    padding: 0 24px;
    background-color: #fff;
  }
  .title {
    line-height: 100px;
    color: #000;
    font-size: 32px;
    font-weight: bold;
    border-bottom: 1px solid #e7e7e7;
  }
  .content {
    width: 100%;
    padding: 40px 0 48px 0;
    font-size: 28px;
    line-height: 45px;
    word-break: break-all;
    color: #666;
  }
</style>
