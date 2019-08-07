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
      // let str = this.content
      // let matched = str.match(/src="\S+"/g) || []
      // for (let src of matched) {
      //   str = str.replace(src, `data-${src}`)
      // }
      this.afterHtml = this.content
      this.$nextTick(() => {
        this.$nextTick(() => {
          let imgList = this.$refs.detail.querySelectorAll('img')
          for (let img of imgList) {
            img.parentNode.style.fontSize = 0
          }
        })
      })
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
  }
</style>
