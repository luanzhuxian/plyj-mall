<template>
  <svgicon
    class="pl-svg"
    :name="theme + '/' + name"
    :fill="true"
    :original="true"
    :color="color"
    @click="handleClick"
  />
</template>

<script>
import SvgIcon from 'vue-svgicon'
import { mapGetters } from 'vuex'
export default {
  name: 'PlSvg',
  components: {
    svgicon: SvgIcon
  },
  props: {
    name: {
      type: String,
      require: true,
      default: ''
    },
    color: {
      type: String,
      default: ''
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
