<template>
  <div :class="$style.detailInfo + ' ql-snow'" ref="detail">
    <h3 v-text="title" />
    <lazy-component>
      <div
        :class="$style.content + ' ql-container ql-editor'"
        v-html="afterHtml"
      />
    </lazy-component>
  </div>
</template>

<script>
const imgError = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/img_error.png'
export default {
  name: 'DetailInfo',
  data () {
    return {
      imgError,
      afterHtml: ''
    }
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  created () {
    this.afterHtml = this.content
  },
  watch: {
    content () {
      this.afterHtml = this.content
    }
  }
}
</script>
<style module lang="scss">
  .detail-info {
    padding: 30px 40px ;
    h3 {
      margin-bottom: 28px;
      font-size: 32px;
      color: #000;
      font-weight: bold;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: #999 !important;
    font-size: 14px !important;
    img {
      width: 670px !important;
      height: auto !important;
    }
    > p, > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  }
</style>
