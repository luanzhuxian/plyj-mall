<template>
  <div
    :class="{
      [$style.htmlToCanvas]: true,
      [$style.show]: show
    }"
  >
    <div ref="container">
      <slot />
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  name: 'HtmlToCanvas',
  props: {
    /**
     * 生成的文件类型
     * canvas
     * base64
     * blob
     */
    type: {
      type: String,
      default: 'canvas'
    },
    show: Boolean
  },
  methods: {
    async toCanvas () {
      return new Promise(async (resolve, reject) => {
        if (this.$refs.container) {
          try {
            let canvas = await html2canvas(this.$slots.default[0].elm, {
              allowTaint: true,
              useCORS: true,
              imageTimeout: 0
            })
            if (this.type === 'canvas') {
              resolve(canvas)
            }
            if (this.type === 'base64') {
              resolve(canvas.toDataURL('image/jpeg', 0.7))
            }
            if (this.type === 'blob') {
              canvas.toBlob(blob => {
                resolve(blob)
              }, 'image/jpeg', 0.7)
            }
          } catch (e) {
            console.log(e)
            reject(new Error('生成海报失败'))
          }
        } else {
          reject(new Error('生成海报失败'))
        }
      })
    },
    loadImage (src) {
      let img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = src + '?' + Date.now()
      return new Promise((resolve, reject) => {
        img.onload = () => {
          resolve(img)
        }
        img.onerror = (e) => {
          reject(new Error('图片加载错误'))
        }
      })
    }
  }
}
</script>

<style module lang="scss">
  .html-to-canvas {
    position: fixed;
    width: max-content;
    height: max-content;
    left: -10000px;
    top: -10000px;
    z-index: -9999;
    &.show {
      position: relative;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }
</style>
