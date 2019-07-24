<template>
  <div :class="$style.homeTemplateB">
    <Search placeholder="搜索商品" />
    <Banner :data="BANNER" />
    <img :class="$style.img88" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/hansibo.gif" alt="">
    <img :class="$style.img88" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhidejiaoyu.gif" alt="">
    <HotItem :data="POPULAR" />
    <Best v-if="type === 3" :data="CLASS" />
    <BestRecommend
      :data="RECOMMEND"
      :type="type"
    />
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Banner from './components/Banner.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import BestRecommend from './components/Best-Recommend.vue'
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
  },
  computed: {
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
  }
}
</script>

<style module lang="scss">
  .home-Template-b {
    background-color: #EDEDED;
    font-size: 0;
  }
  .img88 {
    padding: 10px 0;
    width: 100%;
    background-color: #fff;
  }
</style>
