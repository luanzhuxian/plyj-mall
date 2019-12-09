<template>
  <div
    :class="{
      [$style.homeTemplateC]: true,
      [$style.noSkin]: skinId === 0,
      [$style.skinXmas]: skinId === 1,
      [$style.skinYuanDan]: skinId === 2,
      [$style.skinNewYear]: skinId === 3,
      [$style.skinXiaoNian]: skinId === 4
    }"
  >
    <div :class="$style.container">
      <search :class="$style.search" placeholder="搜索商品" />
      <propagate :class="$style.propagate" :data="PINGXUAN" />
      <live :class="$style.live" v-if="isLiveShow" />
      <appointment :class="$style.appointment" :data="YUYUE" />
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
        <div v-if="skinId === 0" :class="$style.title">
          <span>-</span>
          <span v-text="RECOMMEND.moduleName" />
          <span>-</span>
        </div>
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
import Search from './components/Search.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import BestRecommend from './components/Best-Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate.vue'
import Live from '../activity/components/Live.vue'
import SkinTitle from './components/Skin-Title.vue'

export default {
  name: 'HomeTemplateC',
  inject: ['parent'],
  components: {
    Search,
    HotItem,
    Best,
    BestRecommend,
    Appointment,
    Propagate,
    Live,
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
    TEACHERS () {
      return this.data.TEACHERS || {}
    },
    isLiveShow () {
      return this.parent.liveInfo &&
      (this.parent.liveInfo.statue === 4 || (this.parent.liveInfo.statue === 2 && this.parent.liveInfo.hasNotice))
    }
  }
}
</script>

<style module lang="scss">
  @import "./skin.scss";

  .home-Template-c {
    background-color: #EDEDED;
    font-size: 0;
  }
  .search {
    position: relative;
    padding: 0 20px;
  }
  .hot-item {
    padding: 34px 24px 0;
    // background-color: #EDEDED;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
      position: relative;
      font-size: 36px;
      font-weight: bold;
      &:after {
        position: absolute;
        top: 0;
        left: 136px;
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
  .best {
    padding: 24px;
    // background-color: #EDEDED;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
      position: relative;
      font-size: 36px;
      font-weight: bold;
    }
  }
  .recommend {
    padding: 0 24px;
    color: #000;
    // background: #EDEDED;
    .title {
      position: relative;
      text-align: center;
      font-size: 36px;
      font-weight: bolder;
      color: #F2B036;
      letter-spacing: 14px;
      padding: 40px 0 34px;
      span {
        display: inline-block;
        &:nth-last-of-type(1) {
          transform: scaleX(2);
          margin-left: 18px;
        }
        &:nth-of-type(1) {
          margin-right: 18px;
          transform: scaleX(2);
          transform-origin: 0;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    font-size: 26px;
    color: #999;
    // background: #EDEDED;
  }
  .live,
  .activity {
    padding: 20px 24px 0;
    // background-color: #EDEDED;
  }
  .appointment,
  .propagate {
    padding: 24px 24px 0;
    // background-color: #EDEDED;
  }
</style>
