<template>
  <div :class="$style.homeTemplateB">
    <Search placeholder="搜索商品" />
    <Banner :data="BANNER" />
    <Adv v-if="type === 4 && Adv.showStatue === 1" :data="Adv" />
    <HotItem v-if="POPULAR.showStatue === 1" :data="POPULAR" />
    <appointment-gift :data="{ YUYUE, PINGXUAN }" />
    <Best v-if="CLASS.showStatue === 1" :data="CLASS" />
    <BestRecommend
      v-if="RECOMMEND.values && RECOMMEND.values.length"
      :data="RECOMMEND"
    />
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Banner from './components/Banner.vue'
import Adv from './components/Adv.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import BestRecommend from './components/Best-Recommend.vue'
import AppointmentGift from './components/Appointment-Gift.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'HomeTemplateB',
  components: {
    Banner,
    Adv,
    Search,
    HotItem,
    Best,
    BestRecommend,
    AppointmentGift
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
      default: 0
    }
  },
  computed: {
    ...mapGetters(['mallId']),
    ...mapState(['data88']),
    BANNER () {
      return this.data.BANNER || {}
    },
    Adv () {
      return this.data.Adv || {}
    },
    POPULAR () {
      return this.data.POPULAR || { values: [] }
    },
    RECOMMEND () {
      return this.data.RECOMMEND || { values: [] }
    },
    CLASS () {
      return this.data.CLASS || {}
    },
    YUYUE () {
      return this.data.YUYUE || {}
    },
    PINGXUAN () {
      return this.data.PINGXUAN || {}
    }
  }
}
</script>

<style module lang="scss">
  .home-Template-b {
    background-color: #EDEDED;
    font-size: 0;
  }
</style>
