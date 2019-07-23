<template>
  <div :class="$style.homeTemplateB">
    <Search />
    <Banner :data="BANNER" />
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
  }
</style>
