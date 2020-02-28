<template>
  <div :class="$style.liveWrapper">
    <div :class="$style.liveHead">
      <div :class="$style.liveHeadLeft">
        <div :class="$style.liveHeadLeftMain">
          <pl-svg name="icon-live-a8210" width="36" height="40" />
          <span>互动直播</span>
        </div>
        <div :class="$style.liveHeadLeftSub">
          <span>{{ `直播中 ${data.nowCount || 0}` }}</span>
          <span>{{ `即将开始 ${data.futrueCount || 0}` }}</span>
          <span>{{ `往期直播 ${data.pastCount || 0}` }}</span>
        </div>
      </div>
      <router-link
        :class="$style.liveHeadRight"
        :to="{ name: 'InteractiveLive' }"
      >
        查看全部
      </router-link>
    </div>
    <router-link
      :class="$style.live"
      :to="{ name: 'LiveRoom' }"
    >
      <div :class="$style.imgWrapper">
        <img :src="(live.hasNotice ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-middle'">
        <div :class="$style.label" v-if="isNoticeShow">
          预告
        </div>
        <pl-svg name="icon-play" width="60" />
      </div>
      <div :class="$style.info">
        <div :class="$style.top">
          {{ live.name }}
        </div>
        <div :class="$style.bottom">
          <div :class="$style.bottomLeft">
            <pl-svg name="icon-clock" fill="#fff" width="26" />
          </div>
          <div :class="$style.bottomRight">
            <span v-if="isNoticeShow">距开始仅剩</span>
            <span v-if="live.statue === 4" :class="$style.highlight">正在直播</span>
            <span v-if="live.statue === 0" :class="$style.highlight">已结束</span>
            <count-down
              v-if="isNoticeShow"
              :timestamp="ts"
              color="#333"
              size="mini"
              @done="done"
            />
            <span v-if="live.statue === 4" :class="$style.highlight">
              {{ `${live.visitTimes}人观看` }}
            </span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import moment from 'moment'
import mixin from '../mixin.js'
import CountDown from './Count-Down.vue'

export default {
  name: 'Live',
  mixins: [mixin],
  components: {
    CountDown
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      ts: ''
    }
  },
  computed: {
    live () {
      return this.data.liveModel || {}
    },
    isNoticeShow () {
      return this.live.statue === 2 && this.live.hasNotice
    }
  },
  created () {
    const { liveStartTime, hasNotice } = this.live
    if (hasNotice && liveStartTime) {
      this.ts = moment(liveStartTime).valueOf()
    }
  },
  methods: {
    done () {
      if (this.live.statue === 2) {
        this.live.statue = 4
        this.data.nowCount += 1
        this.data.futrueCount -= 1
      } else if (this.live.statue === 4) {
        this.live.statue = 0
        this.data.nowCount -= 1
        this.data.pastCount += 1
      }
    }
  }
}
</script>

<style module lang="scss">
  .live-wrapper {
    padding: 32px 20px 40px;
    background-color: #fff;
  }
  .live-head {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    &-left {
      flex: 1;
      width: 0;
      &-main {
        display: flex;
        align-items: end;
        margin-bottom: 12px;
        > span {
          margin-left: 16px;
          font-size: 32px;
          font-weight: bold;
          color: #333333;
        }
      }
      &-sub > span {
        font-size: 22px;
        height: 32px;
        line-height: 32px;
        color: #1592E6;
        margin-left: 10px;
        padding-left: 10px;
        border-left: 2px solid #E7E7E7;
        &:nth-of-type(1) {
          margin-left: 0;
          padding-left: 0;
          border-left: none;
        }
      }
    }
    &-right {
      width: 144px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      border: 2px solid #CCCCCC;
      border-radius: 10px;
      font-size: 24px;
      color: #666666;
    }
  }
  .live {
    display: flex;
    background-color: #FFF;
    border-radius: 40px 20px 20px 20px;
    overflow: hidden;
  }
  .img-wrapper {
    position: relative;
    width: 280px;
    height: 186px;
    border-radius: 20px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .label {
    position: absolute;
    top: 0;
    left: 0;
    width: 130px;
    height: 48px;
    line-height: 48px;
    background: #FB7D55;
    border-radius: 0 0px 40px 0px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    color: #FFFFFF;
    text-align: center;
  }
  .info {
    flex: 1;
    width: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 14px 14px 14px 24px;
  }
  .top {
    height: 76px;
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 36px;
    color: #333333;
    text-align: justify;
    @include elps-wrap(2);
  }
  .bottom {
    display: inline-flex;
    align-self: center;
    width: max-content;
    min-width: 300px;
    height: 40px;
    border: 2px solid #FF9800;
    border-radius: 20px;
    overflow: hidden;
    // &.active {
    //   border: 2px solid #EFB835;
    //   .time-left {
    //     background: linear-gradient(90deg, rgba(243, 190, 65, 1) 0%, rgba(239, 184, 53, 1) 100%);
    //   }
    //   .time-right {
    //     color: #EFB835;
    //   }
    // }
    &-left {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      font-size: 26px;
      color: #FFF;
      background: linear-gradient(360deg, rgba(247, 91, 35, 1) 0%, rgba(250, 133, 57, 1) 100%);
      overflow: hidden;
    }
    &-right {
      flex: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0 12px;
      font-size: 24px;
      font-family: MicrosoftYaHei;
      color: #333333;
      > span {
        margin-right: 10px;
      }
    }
  }
  .highlight {
    color: #fe7b21;
    font-weight: bold;
  }
</style>
