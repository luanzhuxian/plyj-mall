<template>
  <div :class="$style.homeTemplateB">
    <Search placeholder="搜索商品" />
    <Banner :data="BANNER" />
    <Adv v-if="type === 4 && Adv.showStatue === 1" :data="Adv" />
    <div v-if="type === 4 && $attrs.live && ($attrs.live.statue === 4 || ($attrs.live.statue === 2 && $attrs.live.hasNotice))" :class="$style.broadcast">
      <Broadcast v-bind="$attrs" />
    </div>
    <div v-if="type === 4" :class="$style.activity">
      <Activity v-bind="$attrs" />
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
import Activity from '../activity/components/Activity.vue'
export default {
  name: 'HomeTemplateB',
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
</style>
