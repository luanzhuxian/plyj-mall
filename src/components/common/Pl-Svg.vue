<template>
  <svg
    class="pl-svg"
    aria-hidden="true"
    @click="clickHandler"
    :style="{
      width: truthWidth,
      height: truthHeight
    }"
  >
    <use :xlink:href="'#' + (tempName || name)" />
  </svg>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
export default {
  name: 'PlSvg',
  props: {
    name: {
      type: String,
      require: true,
      default: ''
    },
    fill: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: null
    },
    height: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      // svg id的副本
      tempName: ''
    }
  },
  computed: {
    ...mapGetters(['theme']),
    truthWidth () {
      if (this.width) {
        return this.width / 7.5 + 'vw'
      }
      // 如果没设置宽，默认宽等于高
      if (this.height) {
        return this.height / 7.5 + 'vw'
      }
      return null
    },
    truthHeight () {
      if (this.height) {
        return this.height / 7.5 + 'vw'
      }
      // 如果没设置高，默认高等于宽
      if (this.width) {
        return this.width / 7.5 + 'vw'
      }
      return null
    }
  },
  activated () {
    if (this.tempSvg) {
      this.svgParent.appendChild(this.tempSvg)
    }
  },
  deactivated () {
    if (this.svgParent) {
      this.svgParent.removeChild(this.tempSvg)
    }
  },
  beforeDestroy () {
    if (this.svgParent) {
      this.svgParent.removeChild(this.tempSvg)
    }
    this.tempSvg = null
  },
  watch: {
    fill: {
      async handler (val) {
        /**
         * 由于使用的是svg精灵，所以
         * 要使得fill属性生效，必须保证不存在行内fill属性 或者 修改行内fill属性
         * 如果直接修改行内属性，会改变全局所有的svg颜色
         * 所以，先复制一份svg，然后修改这个副本的颜色，使用完之后，再删除这个副本，避免副本越来越多
         */
        if (val) {
          // _uid可以作为每个组件唯一的标识，用来作为图标副本的id，再合适不过了
          const uid = this._uid
          this.tempName += `${this.name}_${uid}`
          setTimeout(() => {
            const svg = document.querySelector('#' + this.name)
            try {
              const tempSvg = svg.cloneNode(true)
              const fills = tempSvg.querySelectorAll('[fill]')
              const colors = tempSvg.querySelectorAll('[color]')
              svg.parentNode.appendChild(tempSvg)
              tempSvg.setAttribute('id', this.tempName)
              tempSvg.setAttribute('fill', val)
              for (const fill of fills) {
                fill.setAttribute('fill', val)
              }
              for (const color of colors) {
                color.setAttribute('color', val)
              }
              if (!this.svgParent) {
                this.svgParent = svg.parentNode
              }
              this.tempSvg = tempSvg
            } catch (e) {
              console.error('svg ' + this.name + ' 不存在')
            }
          }, 100)
        }
      },
      immediate: true
    }
  },
  methods: {
    clickHandler (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style module lang="scss">
  .pl-svg {
  }
</style>
