<template>
  <div :class="$style.homeTemplateB">
    <Search placeholder="搜索商品" />
    <Banner :data="BANNER" />
    <div :class="$style.shuang12">
      <img
        src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/1.9.5/double-twelve-header-1571393161453.png.png" alt=""
        @click="$router.push({ name: 'DoubleTwelveDay' })"
      >
    </div>
    <!--<slot name="88" />-->
    <Adv v-if="type === 4 && Adv.showStatue === 1" :data="Adv" />
    <div
      v-if="type === 4 && parent.liveInfo && (parent.liveInfo.statue === 4 || (parent.liveInfo.statue === 2 && parent.liveInfo.hasNotice))" :class="$style.broadcast"
    >
      <Broadcast />
    </div>
    <div v-if="type === 4" :class="$style.activity">
      <Activity />
    </div>
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
import { mapGetters } from 'vuex'
import Search from './components/Search.vue'
import Banner from './components/Banner.vue'
import Adv from './components/Adv.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import BestRecommend from './components/Best-Recommend.vue'
import AppointmentGift from './components/Appointment-Gift.vue'
import Broadcast from '../activity/components/Broadcast.vue'
import Activity from './components/Activity.vue'

export default {
  name: 'HomeTemplateB',
  inject: ['parent'],
  components: {
    Banner,
    Adv,
    Search,
    HotItem,
    Best,
    BestRecommend,
    AppointmentGift,
    Broadcast,
    Activity
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['mallId']),
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
    .broadcast,
    .activity {
      padding: 20px 24px 0;
      background-color: #F4F5F9;
    }
  }
  .shuang12 {
    padding: 20px 24px 0;
    background-color: #F4F5F9;
    img {
      display: block;
      width: 100%;
    }
  }
</style>
