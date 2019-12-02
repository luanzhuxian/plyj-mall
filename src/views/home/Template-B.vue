<template>
  <div
    :class="{
      [$style.homeTemplateB]: true,
      [$style.noSkin]: skinId === 0,
      [$style.skinXmas]: skinId === 1,
      [$style.skinNewYear]: skinId === 2
    }"
  >
    <div :class="$style.container">
      <search :class="$style.search" placeholder="搜索商品" />
      <banner :class="$style.banner" :data="BANNER" />
      <div :class="$style.shuang12">
        <img
          src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/1.9.5/double-twelve-header-1571393161453.png.png"
          @click="$router.push({ name: 'DoubleTwelveDay' })"
        >
      </div>
      <adv :class="$style.adv" v-if="type === 4 && ADV.showStatue === 1" :data="ADV" />
      <broadcast :class="$style.broadcast" v-if="isLiveShow" />
      <activity :class="$style.activity" v-if="type === 4" />
      <div :class="$style.hotItem" v-if="POPULAR.showStatue === 1">
        <hot-item v-if="skinId === 0" :data="POPULAR" />
        <hot-item v-else :data="POPULAR">
          <template slot="title">
            <div :class="$style.titleBg" v-if="skinId === 1">
              <div :class="$style.title">
                {{ POPULAR.moduleName }}
              </div>
            </div>
            <div :class="$style.titleBg" v-if="skinId === 2">
              <span :class="$style.characterBg" v-for="(item, index) of POPULAR.moduleName.split('')" :key="index">
                {{ item }}
              </span>
            </div>
          </template>
        </hot-item>
      </div>
      <appointment-gift :class="$style.appointment" :data="{ YUYUE, PINGXUAN }" />
      <div :class="$style.best" v-if="CLASS.showStatue === 1">
        <best v-if="skinId === 0" :data="CLASS" />
        <best v-else :data="CLASS">
          <template slot="title">
            <div :class="$style.titleBg" v-if="skinId === 1">
              <div :class="$style.title">
                {{ CLASS.moduleName }}
              </div>
            </div>
            <div :class="$style.titleBg" v-if="skinId === 2">
              <span :class="$style.characterBg" v-for="(item, index) of CLASS.moduleName.split('')" :key="index">
                {{ item }}
              </span>
            </div>
          </template>
        </best>
      </div>
      <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
        <best-recommend v-if="skinId === 0" :data="RECOMMEND" />
        <best-recommend v-else :data="RECOMMEND">
          <template slot="title">
            <div :class="$style.titleBg" v-if="skinId === 1">
              <div :class="$style.title">
                {{ RECOMMEND.moduleName }}
              </div>
            </div>
            <div :class="$style.titleBg" v-if="skinId === 2">
              <span :class="$style.characterBg" v-for="(item, index) of RECOMMEND.moduleName.split('')" :key="index">
                {{ item }}
              </span>
            </div>
          </template>
        </best-recommend>
        <footer :class="$style.footer">
          — 技术支持 朋来科技 —
        </footer>
      </div>
    </div>
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
    skinId: {
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
    },
    isLiveShow () {
      return this.type === 4 &&
      this.parent.liveInfo &&
      (this.parent.liveInfo.statue === 4 || (this.parent.liveInfo.statue === 2 && this.parent.liveInfo.hasNotice))
    }
  }
}
</script>

<style module lang="scss">
  @import "./skin.scss";

  .home-Template-b {
    background-color: #EDEDED;
    font-size: 0;
  }
  .search {
    position: relative;
    padding: 0 20px;
  }
  .banner {
    padding: 24px 24px 32px 24px;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
  }
  .adv {
    padding: 20px 24px 0;
    background-color: #F4F5F9;
  }
  .broadcast,
  .activity {
    padding: 20px 24px 0;
    background-color: #F4F5F9;
  }
  .hot-item {
    padding: 34px 24px 24px 24px;
    background-color: #F4F5F9;
  }
  .appointment {
    padding: 20px 24px;
    background-color: #f4f5f9;
  }
  .best {
    padding: 24px;
    background-color: #f4f5f9;
  }
  .recommend {
    padding: 0 24px;
    color: #000;
    background: linear-gradient(180deg, #DFE4F3, #ECEAF7);
  }
  .footer {
    padding:  48px 0 48px;
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
