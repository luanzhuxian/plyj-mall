<template>
  <div :class="$style.home">
    <router-view v-if="loaded" />
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { getTemplate } from '../../apis/home'
export default {
  name: 'Home',
  data () {
    return {
      loaded: false,
      type: 0
    }
  },
  activated () {
    if (this.type) {
      this.jump()
    }
  },
  async created () {
    try {
      this.getTemplate()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getTemplate () {
      try {
        const { result } = await getTemplate()
        const modules = {
          'BANNER': null,
          'MODULE_A': null,
          'MODULE_B': null,
          'MODULE_C': null,
          'MODULE_D': null,
          'MODULE_E': null
        }
        const bannerList = result.moduleModels.filter(module => module.moduleType === 1)
        const prodList = result.moduleModels.filter(module => module.moduleType === 2)
        modules['BANNER'] = bannerList[0]
        modules['MODULE_B'] = bannerList[1]
        modules['MODULE_D'] = bannerList[2]
        modules['MODULE_A'] = prodList[0]
        modules['MODULE_C'] = prodList[1]
        modules['MODULE_E'] = prodList[2]
        localStorage.setItem('TEMPLATE_MODULES', JSON.stringify(modules))
        this.loaded = true
        let { type } = result
        type = 2
        this.type = type
        this.jump()
      } catch (e) {
        throw e
      }
    },
    jump () {
      if (this.type === 1) {
        this.$router.replace({ name: 'TemplateA' })
      } else if (this.type === 2) {
        this.$router.replace({ name: 'TemplateB' })
      }
    }
  }
}
</script>
<style module lang="scss">
  .home {
    background-color: #f4f5f9;
  }
</style>
