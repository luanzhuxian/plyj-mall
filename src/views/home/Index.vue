<template>
  <div :class="$style.home">
    <TemplateA :data="modules" v-if="type === 1" />
    <TemplateB :data="modules" v-else-if="type === 2 || type === 3" :type="type" />
    <div :class="$style.skeleton" v-else>
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
      <div :class="$style.skeletonC" />
      <div :class="$style.skeletonD" />
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
    </div>
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
      type: 0,
      modules: {}
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
        const { moduleModels } = result
        let { type } = result
        let modules
        if (type === 1) {
          modules = {
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
        }
        if (type === 3) {
          modules = {
            BANNER: null,
            POPULAR: null,
            CLASS: null,
            RECOMMEND: null
          }
          modules.BANNER = moduleModels[0]
          modules.POPULAR = moduleModels[1]
          modules.CLASS = moduleModels[2]
          modules.RECOMMEND = moduleModels[3]
        }
        if (type === 2) {
          modules = {
            BANNER: null,
            POPULAR: null,
            RECOMMEND: null
          }
          modules.BANNER = moduleModels[0]
          modules.POPULAR = moduleModels[1]
          modules.RECOMMEND = moduleModels[2]
        }
        this.modules = modules
        this.loaded = true
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
  .skeleton {
    padding: 24px;
    .skeleton-a {
      width: 70vw;
      height: 60px;
      @include skeAnimation(#eee)
    }
    .skeleton-b {
      width: 50vw;
      height: 40px;
      margin-top: 20px;
      @include skeAnimation(#eee)
    }
    .skeleton-c {
      height: 320px;
      margin-top: 20px;
      margin-bottom: 20px;
      border-radius: 20px;
      @include skeAnimation(#eee)
    }
  }
</style>
