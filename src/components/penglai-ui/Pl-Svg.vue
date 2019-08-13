<template>
  <svgicon
    class="pl-svg"
    :name="theme + '/' + name"
    :fill="fill"
    :original="true"
    :color="color"
    @click="handleClick"
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

<style scoped>

</style>
