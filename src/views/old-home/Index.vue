<template>
  <div v-if="loaded" :class="$style.home">
    <template-old
      ref="template-old"
      :data="modules"
    />
  </div>
  <div v-else :class="$style.skeleton">
    <div :class="$style.skeAnimation + ' ' + $style.skeWelcome" />
    <div :class="$style.skeAnimation + ' ' + $style.skeDate" />
    <div :class="$style.skeAnimation + ' ' + $style.skeA" />
    <div :class="$style.skeB">
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
    </div>
    <div :class="$style.skeAnimation + ' ' + $style.skeC" />
    <div :class="$style.skeD">
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
    </div>
    <div :class="$style.skeAnimation + ' ' + $style.skeE" />
    <div :class="$style.skeF">
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
    </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import TemplateOld from './Template-Old.vue'
import { getTemplate } from '../../apis/home'

export default {
  name: 'Home',
  components: {
    TemplateOld
  },
  data () {
    return {
      loaded: false,
      type: null,
      modules: {
        'BANNER': null,
        'MODULEA': null,
        'MODULEB': null,
        'MODULEC': null,
        'MODULED': null,
        'MODULEE': null
      }
    }
  },
  async created () {
    try {
      const { modules } = this
      const { result } = await getTemplate()
      console.log(result)
      this.type = result.type
      if (result.type === 1) { // 旧模板
        const bannerList = result.moduleModels.filter(module => module.moduleType === 1)
        const prodList = result.moduleModels.filter(module => module.moduleType === 2)
        modules['BANNER'] = bannerList[0]
        modules['MODULEB'] = bannerList[1]
        modules['MODULED'] = bannerList[2]
        modules['MODULEA'] = prodList[0]
        modules['MODULEC'] = prodList[1]
        modules['MODULEE'] = prodList[2]
      }
      this.loaded = true
    } catch (e) {
      throw e
    }
  },
  methods: {
    getBanner (homeData) {
      let banner = homeData.find(item => item.moduleType === 'BANNER') || {}
      if (banner && banner.values && banner.values.length) {
        this.modules['BANNER'] = banner.values
      }
      return Promise.resolve()
    }
    // async getModule (homeData) {
    //   let MODULE = homeData.filter(item => item.moduleType === 'MODULE')
    //   let module1 = MODULE.filter(item => /A|C|E/.test(item.moduleSuffix))
    //   let module2 = MODULE.filter(item => /B|D/.test(item.moduleSuffix))
    //   for (let m of module1) {
    //     if (!m.values || !m.values.length) continue
    //     const ids = m.values
    //       .filter(val => !!val.link)
    //       .map(val => val.link)
    //
    //     if (ids.length) {
    //       try {
    //         let { result } = await getProduct(ids)
    //         for (let item of result) {
    //           item.productSkuModels.sort((a, b) => a.price - b.price)
    //         }
    //         Array.prototype.push.apply(this.modules[m.moduleSuffix], result)
    //       } catch (e) {
    //         throw e
    //       }
    //     }
    //   }
    //
    //   for (let m of module2) {
    //     if (!m.values || !m.values.length) continue
    //     this.modules[m.moduleSuffix] = m.values
    //   }
    //   return Promise.resolve()
    // }
  }
}
</script>
<style module lang="scss">
  .home {
    padding-bottom: 120px;
    background-color: #F4F5F9;
    overflow: hidden;
  }
  /* skeleton starts */
  .skeleton {
    padding: 30px 40px;
    > div {
    }
  }
  .skeWelcome {
    width: 60%;
    height: 53px;
  }
  .skeDate {
    width: 40%;
    height: 37px;
    margin-top: 14px;
    background-color: #eee;
  }
  .skeA, .skeC, .skeE {
    height: 324px;
    margin-top: 60px;
    background-color: #eee;
  }
  .skeB, .skeD, .skeF {
    display: grid;
    width: 100%;
    height: 220px;
    margin-top: 60px;
    justify-content: space-between;
    grid-template-columns: repeat(3, 200px);
    > div {
      background-color: #eee;
    }
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
  /* skeleton ends */
</style>
