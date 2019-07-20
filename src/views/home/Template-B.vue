<template>
  <div :class="$style.homeTemplateB">
    <Search />
    <Banner :data="banner" />
    <HotItem />
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Banner from './components/Banner.vue'
import HotItem from './components/Hot-Item.vue'
export default {
  name: 'HomeTemplateB',
  components: {
    Banner,
    Search,
    HotItem
  },
  data () {
    return {
      data: {
        BANNER: {},
        MODULE_A: {},
        MODULE_B: {},
        MODULE_C: {},
        MODULE_D: {},
        MODULE_E: {}
      }
    }
  },
  created () {
    this.data = JSON.parse(localStorage.getItem('TEMPLATE_MODULES')) || this.data
  },
  computed: {
    banner () {
      return this.data.BANNER
    },
    moduleA () {
      return this.data.MODULE_A
    },
    moduleB () {
      return this.data.MODULE_B
    },
    moduleC () {
      return this.data.MODULE_C
    },
    moduleD () {
      return this.data.MODULE_D
    },
    moduleE () {
      return this.data.MODULE_E
    }
  }
}
</script>

<style module lang="scss">
  .home-Template-b {
    background-color: #EDEDED;
  }
</style>
