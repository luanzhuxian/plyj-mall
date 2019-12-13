<template>
  <router-link
    :class="$style.live"
    tag="div"
    :to="{ name: 'LiveRoom' }"
  >
    <div :class="$style.moduleWrapper">
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
            <span v-if="isNoticeShow">距开始</span>
            <span v-if="live.statue === 4" :class="$style.highlight">正在直播中</span>
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
    </div>
  </router-link>
</template>

<script>
import moment from 'moment'
import mixin from '../mixin.js'
import CountDown from './Count-Down.vue'

export default {
  name: 'Live',
  inject: ['parent'],
  mixins: [mixin],
  components: {
    CountDown
  },
  data () {
    return {
      ts: ''
    }
  },
  computed: {
    live () {
      return this.parent.liveInfo || {}
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
      }
      if (this.live.statue === 4) {
        this.live.statue = 0
      }
    }
  }
}
</script>

<style module lang="scss">
  .live {
    .module-wrapper {
      display: flex;
      background-color: #FFF;
      border-radius: 40px 20px 20px 20px;
      overflow: hidden;
    }
    .img-wrapper {
      position: relative;
      width: 256px;
      height: 172px;
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
      padding: 14px 24px 14px 14px;
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
      display: flex;
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
        display: flex;
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
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-family: MicrosoftYaHei;
        color: #333333;
        padding: 0 12px;
        > span {
          margin-right: 10px;
        }
      }
    }
    .highlight {
      color: #fe7b21;
      font-weight: bold;
    }
}
</style>
