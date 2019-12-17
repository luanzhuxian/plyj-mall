<template>
  <div
    :class="{
      [$style.homeTemplateC]: true,
      [$style.skinXmas]: skinId === 1,
      [$style.skinYuanDan]: skinId === 2,
      [$style.skinNewYear]: skinId === 3,
      [$style.skinXiaoNian]: skinId === 4
    }"
  >
    <div :class="$style.container">
      <search :class="$style.search" placeholder="搜索商品" />
      <propagate :class="$style.propagate" :data="PIN_XUAN" />
      <live :class="$style.live" v-if="isLiveShow" />
      <activity :class="$style.activity" v-if="isNwEventShow" />
      <appointment :class="$style.appointment" :data="YU_YUE" :style-type="2" />
      <div :class="$style.hotItem" v-if="POPULAR.showStatue === 1">
        <div v-if="skinId === 0" :class="$style.title" v-text="POPULAR.moduleName" />
        <skin-title
          v-else
          :class="$style.skinTitle"
          :data="POPULAR.moduleName"
          :skin-id="skinId"
        />
        <hot-item :data="POPULAR" />
      </div>
      <div :class="$style.teachers" v-if="TEACHERS.showStatue === 1">
        <div v-if="skinId === 0" :class="$style.title" v-text="TEACHERS.moduleName" />
        <skin-title
          v-else
          :class="$style.skinTitle"
          :data="TEACHERS.moduleName"
          :skin-id="skinId"
        />
        <teachers :data="TEACHERS" />
      </div>
      <div :class="$style.best" v-if="CLASS.showStatue === 1">
        <div v-if="skinId === 0" :class="$style.title" v-text="CLASS.moduleName" />
        <skin-title
          v-else
          :class="$style.skinTitle"
          :data="CLASS.moduleName"
          :skin-id="skinId"
        />
        <best :data="CLASS" />
      </div>
      <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
        <div v-if="skinId === 0" :class="$style.title" v-text="RECOMMEND.moduleName" />
        <skin-title
          v-else
          :class="$style.skinTitle"
          :data="RECOMMEND.moduleName"
          :skin-id="skinId"
        />
        <best-recommend :data="RECOMMEND" />
      </div>
      <footer :class="$style.footer">
        — 技术支持 朋来科技 —
      </footer>
    </div>
  </div></template>

<script>
import { mapGetters } from 'vuex'
import Search from './components/Search.vue'
import Live from '../activity/components/Live.vue'
import Activity from '../activity/xin-chun/Activity.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import BestRecommend from './components/Best-Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate.vue'
import Teachers from './components/Teachers'
import SkinTitle from './components/Skin-Title.vue'

export default {
  name: 'HomeTemplateC',
  inject: ['parent'],
  components: {
    Search,
    Live,
    Activity,
    HotItem,
    Best,
    BestRecommend,
    Appointment,
    Propagate,
    Teachers,
    SkinTitle
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
    ...mapGetters(['nwEvent']),
    PIN_XUAN () {
      return this.data.PIN_XUAN || {}
    },
    YU_YUE () {
      return this.data.YU_YUE || {}
    },
    POPULAR () {
      return this.data.POPULAR || {}
    },
    TEACHERS () {
      return this.data.TEACHERS || {}
    },
    CLASS () {
      return this.data.CLASS || {}
    },
    RECOMMEND () {
      return this.data.RECOMMEND || {}
    },
    isLiveShow () {
      return this.parent.liveInfo &&
      (this.parent.liveInfo.statue === 4 || (this.parent.liveInfo.statue === 2 && this.parent.liveInfo.hasNotice))
    },
    isNwEventShow () {
      return this.nwEvent && this.nwEvent.permissionStatus
    }
  }
}
</script>

<style module lang="scss">
  @import "./skin.scss";

  .home-template-c {
    background-color: #EDEDED;
    font-size: 0;
  }
  .title {
    padding: 40px 0 20px;
    display: flex;
    align-items: center;
    color: #333333;
    font-size: 40px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    &::before {
      display: inline-block;
      content: '';
      width: 6px;
      height: 38px;
      background: #FE7700;
      margin-right: 14px;
    }
  }
  .search {
    position: relative;
    padding: 0 20px;
  }
  .hot-item {
    position: relative;
    .title {
      &:after {
        position: absolute;
        top: 38px;
        left: 190px;
        content: 'HOT';
        width: 44px;
        line-height: 24px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        font-weight: normal;
        background: linear-gradient(60deg, #FE7700 35%, rgba(255, 255, 255, .5), #FE7700 75%);
        background-size: 200%;
        border-radius: 12px;
        animation: bgc-move 2s ease infinite;
      }
    }
    @keyframes bgc-move {
      0% { background-position: 150% 0 }
      100% { background-position: -50% 0 }
    }
  }

  .hot-item,
  .teachers,
  .best,
  .recommend {
    padding: 0 24px;
  }

  .live,
  .activity,
  .appointment {
    padding: 24px 24px 0;
  }

  .propagate {
    padding: 10px 24px 0;
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    font-size: 26px;
    color: #999;
  }
</style>
