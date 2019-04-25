<template>
  <div :class="$style.detailInfo">
    <h3 v-text="title" />
    <div
      v-lazy-container="{ selector: 'img', error: imgError }"
      :class="$style.content"
      v-html="afterHtml"
    />
  </div>
</template>

<script>
import imgError from '../../assets/images/img_error.png'
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
    this.matchedHtml()
  },
  watch: {
    content () {
      this.matchedHtml()
    }
  },
  methods: {
    matchedHtml () {
      let str = this.content
      let matched = str.match(/src="\S+"/g) || []
      for (let src of matched) {
        str = str.replace(src, `data-${src}`)
      }
      this.afterHtml = str
      str = null
    }
  }
}
</script>

<style module lang="scss">
  .detail-info {
    padding: 0 $--slide-padding;
    h3 {
      margin-bottom: 28px;
      font-size: 32px;
      color: #000;
      font-weight: bold;
    }
  }
  .content {
    color: #999 !important;
    font-size: 24px !important;
    line-height: 32px;
    img {
      width: 670px !important;
      height: auto !important;
      margin: 10px 0 !important;
    }
  }
</style>
