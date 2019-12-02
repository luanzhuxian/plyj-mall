<template>
  <svg
    class="pl-svg"
    aria-hidden="true"
    :style="{
      width: width ? width / 7.5 + 'vw' : null,
      height: height ? height / 7.5 + 'vw' : null,
    }"
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
    ...mapGetters(['theme'])
  },
  watch: {
    fill: {
      handler (val) {
        if (val) {
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
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
  .pl-svg {
  }
</style>
