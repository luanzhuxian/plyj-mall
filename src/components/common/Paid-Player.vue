<template>
  <div :class="$style.paidPlayer">
    <pl-svg class="rotate" v-if="checking" name="icon-btn-loading" width="50" fill="#fff" />
    <video
      ref="video"
      v-if="!checking && type === 'video' && src"
      preload="metadata"
      controls
      x5-video-player-type="h5-page"
      :src="src"
      playsinline=""
      x-webkit-airplay="true"
      @loadedmetadata="videoLoadedmetadata"
      @progress="videoProgress"
      @loadeddata="loadeddata"
      @play="playHandler"
      @playing="playingHandler"
      @timeupdate="timeupdate"
      @ended="ended"
      @pause="pause"
      @error="error"
      :class="{
        [$style.autoHeight]: autoHeight
      }"
      :poster="src + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast'"
    />
  </div>
</template>

<script>
import axios from 'axios'
import {
  setLivePaidData,
  checkRateOfFlow
} from '../../apis/live-library'
const AXIOS = axios.create({
  responseType: 'arraybuffer'
})
export default {
  name: 'PaidPlayer',
  data () {
    this.timeFragment = [] // 缓存每次加载的时间片段，发送给后端后会被清空
    // this.sizeFragment = [] // 缓存每次加载的时间片段，发送给后端后会被清空
    // this.lastLoadedEnd = 0
    this.lastLoadedTime = 0
    return {
      test: [],
      checking: true, // 是否正在检查视频可用性
      duration: 0, // 视频总长
      videoSize: 0 // 视频总大小
    }
  },
  props: {
    type: {
      type: String,
      default: 'video'
    },
    src: {
      type: String,
      default: ''
    },
    currentTime: {
      type: Number,
      default: 0
    },
    videoId: {
      type: String,
      default: ''
    },
    resourceName: {
      type: String,
      default: ''
    },
    resourceId: {
      type: String,
      default: '0'
    },
    // 观看未成功的跳转路由名
    backRouteName: {
      type: String,
      default: ''
    },
    // 定义视频的高度是否自动
    autoHeight: Boolean,
    autoFullScreen: Boolean
  },
  watch: {
    src: {
      async handler (src) {
        if (src) {
          try {
            const { result } = await checkRateOfFlow()
            if (!result) {
              this.$alert({
                message: '流量已经耗尽',
                viceMessage: '请联系机构管理人员'
              }).finally(() => {
                if (this.backRouteName) {
                  this.$router.replace({ name: this.backRouteName })
                  return
                }
                this.$router.go(-1)
              })
              return
            }
            const res = await AXIOS.head(this.src)
            this.videoSize = Number(res.headers['content-length']) || 0
            this.checking = false
            this.setCurrentTime()
          } catch (e) {
            if (e.message.indexOf('404') > -1) {
              this.$alert({
                message: '视频已被删除',
                viceMessage: '请联系机构管理人员'
              })
                .finally(() => {
                  if (this.backRouteName) {
                    this.$router.replace({ name: this.backRouteName })
                    return
                  }
                  this.$router.go(-1)
                })
            } else {
              this.$alert({
                message: '视频加载失败',
                viceMessage: '请联系机构管理人员'
              })
                .finally(() => {
                  if (this.backRouteName) {
                    this.$router.replace({ name: this.backRouteName })
                    return
                  }
                  this.$router.go(-1)
                })
            }
            throw e
          }
        }
      },
      immediate: true
    },
    currentTime: {
      handler () {
        this.setCurrentTime()
      },
      immediate: true
    }
  },
  deactivated () {
    this.checking = true
    this.$emit('update:src', '')
  },
  computed: {
    video () {
      return this.$refs.video
    }
  },
  methods: {
    async setCurrentTime () {
      await this.$nextTick()
      const video = this.$refs.video
      if (video && this.currentTime) {
        video.currentTime = this.currentTime
      }
    },
    videoLoadedmetadata (e) {
      this.duration = e.target.duration
    },
    videoProgress (e) {
      const video = e.target
      const timeRanges = video.buffered
      if (!timeRanges.length) return
      let loadedTime = 0
      for (let i = 0; i < timeRanges.length; i++) {
        loadedTime += timeRanges.end(i) - timeRanges.start(i)
      }
      this.timeFragment.push(loadedTime - this.lastLoadedTime || 0)
      console.log(loadedTime, this.lastLoadedTime, this.timeFragment)
      if (this.timeFragment.length) {
        let total = this.timeFragment.reduce((a, b) => a + b)
        // 加载的时间片段长度超过6秒就发一次请求，着并不意味着请求频率是1次/6秒
        if (total > 6) {
          this.sendFlow(total)
        }
      }
      this.lastLoadedTime = loadedTime
    },
    async setLivePaidData ({ watchTime, dataFlowSize }) {
      if (!this.videoId) return
      const data = {
        'id': this.livePaidId || '',
        resourceId: this.resourceId,
        resourceName: this.resourceName,
        videoId: this.videoId,
        videoTime: this.duration,
        watchTime,
        dataFlowSize
      }
      try {
        const { result } = await setLivePaidData(data)
        if (result) this.livePaidId = result
      } catch (e) {
        this.$error(JSON.parse(e.message).message)
      }
    },
    sendFlow (time) {
      this.setLivePaidData({
        watchTime: Number.parseInt(time),
        dataFlowSize: Number.parseInt(time / this.duration * this.videoSize) || 0
      })
      this.timeFragment = []
    },
    loadeddata (e) {
      this.$emit('loadeddata', e)
    },
    // 在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。
    playingHandler (e) {
      this.$emit('playing', e)
    },
    // 在媒体回放被暂停后再次开始时触发。即，在一次暂停事件后恢复媒体回放
    playHandler (e) {
      this.$emit('play', e)
    },
    timeupdate (e) {
      this.$emit('timeupdate', e)
    },
    ended (e) {
      this.$emit('ended', e)
    },
    pause (e) {
      this.$emit('pause', e)
    },
    error (e) {
      this.$emit('error', e)
    }
  }
}
</script>

<style module lang="scss">
.paid-player {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 422px;
  width: 100vw;
  max-width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
  background-color: #000 !important;
  > video {
    height: 422px;
    background-color: #000;
    &:fullscreen {
      transform: rotate(90deg);
    }
    &.auto-height {
      width: 100% !important;
      height: 100% !important;
    }
  }
}

@media screen and (orientation:landscape) {
}
</style>
