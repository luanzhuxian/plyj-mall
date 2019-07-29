<template>
  <div :class="$style.home">
    <TemplateA :data="modules" v-if="type === 1">
      <img
        slot="88"
        v-if="data88[mallId]"
        :class="$style.img88"
        :src="data88[mallId].gif" alt=""
        @click="showHaibao"
      >
    </TemplateA>
    <TemplateB :data="modules" v-else-if="type === 2 || type === 3" :type="type">
      <img
        slot="88"
        v-if="data88[mallId]"
        :class="$style.img88"
        :src="data88[mallId].gif" alt=""
        @click="showHaibao"
      >
    </TemplateB>
    <div :class="$style.skeleton" v-else>
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
      <div :class="$style.skeletonC" />
      <div :class="$style.skeletonD" />
      <div :class="$style.skeletonA" />
      <div :class="$style.skeletonB" />
    </div>

    <transition name="fade">
      <div :class="$style.haibao" v-if="haibao">
        <img @click="haibao = ''" :src="haibao" alt="">
      </div>
    </transition>
    <transition name="fade">
      <div :class="$style.pop" v-if="pop">
        <img :src="pop" alt="">
        <pl-svg @click="pop = ''" name="close3" color="#fff" />
      </div>
    </transition>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { getTemplate } from '../../apis/home'
import TemplateA from './Template-A.vue'
import TemplateB from './Template-B.vue'
import { mapGetters } from 'vuex'
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
      modules: {},
      haibao: '',
      pop: '',
      data88: {
        '1057573777392603136': {
          haibao: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/hansi_haibao.jpg',
          pop: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/hansi_pop.jpg',
          gif: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/han_si_bo.gif'
        },
        '1108363572472762368': {
          haibao: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhide_haibao.jpg',
          pop: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhide_pop.jpg',
          gif: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhi_de_shuo.gif'
        }
      }
    }
  },
  async created () {
    try {
      await this.getTemplate()
      this.showPop(500)
    } catch (e) {
      throw e
    }
  },
  computed: {
    ...mapGetters(['mallId'])
  },
  methods: {
    showPop (delay) {
      setTimeout(() => {
        this.pop = this.data88[this.mallId].pop
      }, delay)
    },
    showHaibao () {
      this.haibao = this.data88[this.mallId].haibao
    },
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

  .pop, .haibao {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
    z-index: 5;
    > img {
      width: 560px;
    }
    > svg {
      width: 48px;
      margin-top: 64px;
    }
  }
  .haibao {
    text-align: center;
    overflow: auto;
    z-index: 5;
    > img {
      width: 90%;
      justify-items: flex-start !important;
    }
  }

  .img88 {
    width: 100%;
    padding-bottom: 24px;
    padding-top: 16px;
    background-color: #f4f5f9;
  }
</style>
