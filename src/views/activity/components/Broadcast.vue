<template>
  <router-link
    :class="$style.broadcast"
    tag="div"
    :to="{ name: 'LiveRoom' }"
  >
    <div :class="$style.moduleWrapper">
      <div :class="$style.imgWrapper">
        <img :src="(live.hasNotice ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-middle'">
        <pl-icon name="icon-play-btn" type="svg" />
      </div>
      <div :class="$style.info">
        <div :class="$style.main">
          {{ live.name }}
        </div>
        <div
          :class="{
            [$style.time]: true,
            [$style.active]: live.statue === 4,
          }"
        >
          <div :class="$style.timeLeft">
            <pl-icon name="icon-clock" color="#fff" size="26" v-if="live.statue === 2 && live.hasNotice" />
            <span v-if="live.statue === 2 && live.hasNotice">预告</span>
            <span v-if="live.statue === 4">直播中</span>
          </div>
          <div :class="$style.timeRight">
            <count-down
              v-if="live.statue === 2 && live.hasNotice"
              :timestamp="ts"
              :color="color"
              size="mini"
              text-after="后开始"
              @done="live.statue = 4"
            />
            <span v-if="live.statue === 4">
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
  name: 'Broadcast',
  inject: ['parent'],
  mixins: [mixin],
  components: {
    CountDown
  },
  data () {
    return {
      ts: '',
      color: ''
    }
  },
  computed: {
    live () {
      return this.parent.liveInfo || {}
    }
  },
  created () {
    const { liveStartTime, hasNotice } = this.live
    if (hasNotice && liveStartTime) {
      this.ts = moment(liveStartTime).valueOf()
    }
    this.color = hasNotice ? '#EC6BA4' : '#EFB835'
  }
}
</script>

<style module lang="scss">
  .broadcast {
    .module-wrapper {
      display: flex;
      padding: 24px;
      background-color: #FFF;
      border-radius: 20px;
    }
    .img-wrapper {
      position: relative;
      margin-right: 16px;
      width: 256px;
      height: 172px;
      border-radius: 16px;
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
        width: 60px;
        height: 60px;
      }
    }
    .info {
      flex: 1;
      width: 0;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    .main {
      margin-bottom: 24px;
      height: 76px;
      font-size: 28px;
      font-weight: bold;
      line-height: 36px;
      color: #333333;
      @include elps-wrap(2);
      text-align: justify;
    }
    .time {
      display: flex;
      align-items: center;
      text-align: center;
      height: 48px;
      line-height: 48px;
      border: 2px solid #EC6BA4;
      border-radius: 176px;
      overflow: hidden;
      &.active {
        border: 2px solid #EFB835;
        .time-left {
          background: linear-gradient(90deg, rgba(243, 190, 65, 1) 0%, rgba(239, 184, 53, 1) 100%);
        }
        .time-right {
          color: #EFB835;
        }
      }
      &-left {
        width: 114px;
        font-size: 26px;
        color: #FFF;
        background: linear-gradient(90deg, rgba(237, 133, 93, 1) 0%, rgba(236, 107, 164, 1) 100%);
        overflow: hidden;
      }
      &-right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        font-weight: bold;
        color: #DB4D7D;
      }
      i {
        margin-right: 6px;
      }
    }
  }
</style>
