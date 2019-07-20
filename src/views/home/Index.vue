<template>
  <div :class="$style.home">
    <TemplateA v-if="type === 1" />
    <TemplateB v-else-if="type === 2" />
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { getTemplate } from '../../apis/home'
import TemplateA from './Template-A.vue'
import TemplateB from './Template-B.vue'
export default {
  name: 'Home',
  components: {
    TemplateA,
    TemplateB
  },
  data () {
    return {
      loaded: false,
      type: 0
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
        this.loaded = true
        let { type } = result
        type = 2
        this.type = type
      } catch (e) {
        throw e
      }
    }
  }
}
</script>
<style module lang="scss">
  .home {
    padding-bottom: 88px;
  }
</style>
