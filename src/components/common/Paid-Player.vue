<template>
  <div :class="$style.paidPlayer">
    <pl-svg class="rotate" v-if="checking" name="icon-btn-loading" width="50" fill="#fff" />
    <video
      ref="video"
      v-if="!checking && type === 'video' && src"
      preload="metadata"
      controls
      x5-video-player-type="h5-page"
      :src="src + '?q=' + Date.now()"
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
    // this.timeFragment = [] // 缓存每次加载的时间片段，发送给后端后会被清空
    return {
      timeFragment: [],
      sizeFragment: [],
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
      let end = timeRanges.end(timeRanges.length - 1)
      let start = this.nextLoadedStart > end ? timeRanges.start(timeRanges.length - 1) : this.nextLoadedStart
      let loadedTime = end - start
      const loadedSize = Math.round(loadedTime / this.duration * this.videoSize) || 0
      this.timeFragment.push(loadedTime)
      this.sizeFragment.push(loadedSize)
      let totalSize = this.sizeFragment.reduce((t, a) => t + a)
      // 如果缓存的大小超过2M，就发一次请求。然后清空缓存的片段
      if (totalSize > 1024 * 1024 * 2) {
        this.sendFlow()
      }
      this.nextLoadedStart = end
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
    sendFlow () {
      if (!this.timeFragment.length || !this.sizeFragment.length) return
      this.setLivePaidData({
        watchTime: Number.parseInt(this.timeFragment.reduce((t, a) => t + a)) || 0,
        dataFlowSize: Number.parseInt(this.sizeFragment.reduce((t, a) => t + a)) || 0 || 0
      })
      this.timeFragment = []
      this.sizeFragment = []
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
      this.sendFlow()
    },
    pause (e) {
      this.$emit('pause', e)
      this.sendFlow()
    },
    error (e) {
      this.$emit('error', e)
    }
    // async getPoster () {
    //   try {
    //     const { data } = await AXIOS.get(this.src + '?x-oss-process=video/snapshot,t_10000,f_jpg,w_0,h_0,m_fast')
    //     console.log(data)
    //   } catch (e) {
    //     throw e
    //   }
    // },
    // async fullScreen () {
    //   // 进入全屏
    //   const video = this.video
    //   if (video.requestFullscreen) {
    //     // 最新标准
    //     video.requestFullscreen()
    //   } else if (video.webkitRequestFullscreen) {
    //     video.webkitRequestFullscreen()
    //   } else {
    //     // iOS进入全屏
    //     video.webkitEnterFullscreen()
    //     // 针对iOS监听不到webkitfullscreenchange事件做的兼容，感知退出全屏
    //     let timer = setInterval(() => {
    //       if (!video.webkitDisplayingFullscreen) {
    //         // 退出了全屏
    //         clearInterval(timer)
    //       }
    //     }, 1000)
    //   }
    // }
  }
}
</script>

<style module lang="scss">
.paid-player {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 422px;
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
  }
}

@media screen and (orientation:landscape) {
}
</style>
