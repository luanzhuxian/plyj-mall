<template>
  <svg
    class="pl-svg"
    aria-hidden="true"
    :style="{
      '--width': truthWidth,
      '--height': truthHeight,
    }"
    @click="clickHandler"
  >
    <use :xlink:href="'#' + name" />
  </svg>
</template>

<script>
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
      return 'auto'
    },
    truthHeight () {
      if (this.height) {
        return this.height / 7.5 + 'vw'
      }
      // 如果没设置高，默认高等于宽
      if (this.width) {
        return this.width / 7.5 + 'vw'
      }
      return 'auto'
    }
  },
  watch: {
    fill: {
      async handler (val) {
        if (val) {
          setTimeout(() => {
            const svg = document.querySelector('#' + this.name)
            const fills = svg.querySelectorAll('[fill]')
            const colors = svg.querySelectorAll('[color]')
            svg.setAttribute('fill', val)
            for (const fill of fills) {
              fill.setAttribute('fill', val)
            }
            for (const color of colors) {
              color.setAttribute('color', val)
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

<style lang="scss">
  .pl-svg {
    width: var(--width);
    height: var(--height);
  }
</style>
