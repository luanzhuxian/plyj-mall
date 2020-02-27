<template>
  <div :class="$style.paidPlayer">
    <pl-svg class="rotate" v-if="checking" name="icon-btn-loading" width="50" fill="#fff" />
    <video
      ref="video"
      v-if="!checking && type === 'video' && src"
      preload
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
    return {
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
    // 视频大小，如果没传，将尝试获取
    size: {
      type: [Number, String],
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
                this.$router.go(-1)
              })
              return
            }
            if (this.size) {
              this.videoSize = Number(this.size)
              this.checking = false
              this.setCurrentTime()
              return
            }
            const res = await AXIOS.head(this.src)
            this.videoSize = Number(res.headers['content-length']) || 0
            this.checking = false
            this.setCurrentTime()
          } catch (e) {
            if (e.message.indexOf('404') > -1) {
              this.$alert('该视频已被删除')
                .finally(() => {
                  this.$router.go(-1)
                })
            } else {
              this.$alert('视频加载失败')
                .finally(() => {
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
      const times = []
      for (let i = 0; i < timeRanges.length; i++) {
        times.push(timeRanges.end(i) - timeRanges.start(i))
      }
      const loadedTime = times.reduce((t, a) => t + a)
      // 单位为字节
      const loadedSize = Math.round(loadedTime / this.duration * this.videoSize)
      this.setLivePaidData({
        watchTime: loadedTime,
        dataFlowSize: loadedSize
      })
    },
    async setLivePaidData ({ watchTime, dataFlowSize }) {
      const data = {
        'id': this.livePaidId || '',
        resourceId: this.resourceId,
        resourceName: this.resourceName,
        videoId: this.videoId,
        videoTime: this.duration,
        watchTime,
        dataFlowSize
      }
      clearTimeout(this.reqTimer)
      this.reqTimer = setTimeout(async () => {
        try {
          const { result } = await setLivePaidData(data)
          if (result) this.livePaidId = result
        } catch (e) {
          this.$error(JSON.parse(e.message).message)
        }
      }, 2000)
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
      this.$alert('视频加载错误，请联系机构管理人员')
    },
    async fullScreen () {
      // 进入全屏
      const video = this.video
      if (video.requestFullscreen) {
        // 最新标准
        video.requestFullscreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      } else {
        // iOS进入全屏
        video.webkitEnterFullscreen()
        // 针对iOS监听不到webkitfullscreenchange事件做的兼容，感知退出全屏
        let timer = setInterval(() => {
          if (!video.webkitDisplayingFullscreen) {
            // 退出了全屏
            clearInterval(timer)
          }
        }, 1000)
      }
    }
  }
}
</script>

<style module lang="scss">
.paid-player {
  display: flex;
  align-items: center;
  height: 422px;
  max-width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
  justify-content: center;
  background-color: #000 !important;
  > video {
    height: 422px;
    background-color: #000;
    &:fullscreen {
      transform: rotate(90deg);
    }
  }
}

@media screen and (orientation:landscape) {
}
</style>
