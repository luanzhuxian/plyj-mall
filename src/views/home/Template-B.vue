<template>
  <div :class="$style.homeTemplateB">
    <Search placeholder="搜索商品" />
    <Banner :data="BANNER" />
    <img
      v-if="data88[mallId]"
      :class="$style.img88"
      :src="data88[mallId].gif" alt=""
      @click="showHaibao"
    >
    <HotItem :data="POPULAR" />
    <Best v-if="type === 3" :data="CLASS" />
    <BestRecommend
      v-if="RECOMMEND.values && RECOMMEND.values.length"
      :data="RECOMMEND"
      :type="type"
    />
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
import Search from './components/Search.vue'
import Banner from './components/Banner.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import BestRecommend from './components/Best-Recommend.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'HomeTemplateB',
  components: {
    Banner,
    Search,
    HotItem,
    Best,
    BestRecommend
  },
  data () {
    return {
      haibao: '',
      pop: ''
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: Number,
      default: 2
    }
  },
  created () {
    this.showPop(500)
  },
  computed: {
    ...mapGetters(['mallId']),
    ...mapState(['data88']),
    BANNER () {
      return this.data.BANNER || {}
    },
    POPULAR () {
      return this.data.POPULAR || { values: [] }
    },
    RECOMMEND () {
      return this.data.RECOMMEND || { values: [] }
    },
    CLASS () {
      return this.data.CLASS || {}
    }
  },
  methods: {
    getHaibao () {

    },
    showPop (delay) {
      setTimeout(() => {
        this.pop = this.data88[this.mallId].pop
      }, delay)
    },
    showHaibao () {
      this.haibao = this.data88[this.mallId].haibao
    }
  }
}
</script>

<style module lang="scss">
  .home-Template-b {
    background-color: #EDEDED;
    font-size: 0;
  }
  .img88 {
    width: 100%;
    padding-top: 16px;
    background-color: #f4f5f9;
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
      width: 100%;
      justify-items: flex-start !important;
    }
  }
</style>
