<template>
  <div :class="$style.homeTemplateB">
    <search placeholder="搜索商品" />
    <banner :data="BANNER" />
    <div :class="$style.shuang12">
      <img
        src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/1.9.5/double-twelve-header-1571393161453.png.png"
        @click="$router.push({ name: 'DoubleTwelveDay' })"
      >
    </div>
    <adv v-if="type === 4 && ADV.showStatue === 1" :data="ADV" />
    <div
      v-if="type === 4 && parent.liveInfo && (parent.liveInfo.statue === 4 || (parent.liveInfo.statue === 2 && parent.liveInfo.hasNotice))" :class="$style.broadcast"
    >
      <broadcast />
    </div>
    <div v-if="type === 4" :class="$style.activity">
      <activity />
    </div>
    <hot-item v-if="POPULAR.showStatue === 1" :data="POPULAR" />
    <appointment-gift :data="{ YUYUE, PINGXUAN }" />
    <best v-if="CLASS.showStatue === 1" :data="CLASS" />
    <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
      <best-recommend :data="RECOMMEND" />
      <footer :class="$style.footer">
        — 技术支持 朋来科技 —
      </footer>
    </div>
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
    ADV () {
      return this.data.ADV || {}
    },
    POPULAR () {
      return this.data.POPULAR || {}
    },
    CLASS () {
      return this.data.CLASS || {}
    },
    RECOMMEND () {
      return this.data.RECOMMEND || {}
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
  .broadcast,
  .activity {
    padding: 20px 24px 0;
    background-color: #F4F5F9;
  }
  .recommend {
    padding: 0 24px;
    color: #000;
    background: linear-gradient(180deg, #DFE4F3, #ECEAF7);
  }
  .footer {
    padding:  56px 0 48px;
    font-size: 26px;
    color: #999;
    text-align: center;
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
