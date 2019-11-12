<template>
  <svgicon
    class="pl-svg"
    :name="theme + '/' + name"
    :fill="fill"
    :original="true"
    :color="color"
    @click="handleClick"
    :style="{
      width: width ? width / 7.5 + 'vw' : '',
      height: height ? height / 7.5 + 'vw' : ''
    }"
  />
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
    color: {
      type: String,
      default: ''
    },
    fill: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
    }
  },
  created () {
    this.setTheme()
  },
  computed: {
    ...mapGetters(['theme'])
  },
  watch: {
    theme () {
      this.setTheme()
    }
  },
  methods: {
    setTheme () {
    },
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
</style>
