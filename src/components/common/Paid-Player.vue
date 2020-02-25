<template>
  <div :class="$style.paidPlayer">
    <video
      v-if="type === 'video' && src"
      preload
      controls
      x5-video-player-type="h5-page"
      :src="src"
      playsinline=""
      x-webkit-airplay="true"
      @loadedmetadata="videoLoadedmetadata"
      @progress="videoProgress"
      @loadeddata="loadeddata"
      @error="videoError"
    />
  </div>
</template>

<script>
import axios from 'axios'
const AXIOS = axios.create({
  responseType: 'blob'
})
export default {
  name: 'PaidPlayer',
  data () {
    return {
      duration: 0, // 视频总长
      size: 0 // 视频总大小
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
    }
  },
  watch: {
    src: {
      async handler (src) {
        if (src) {
          const res = await AXIOS.head(this.src)
          this.size = Number(res.headers['content-length']) || 0
        }
      },
      immediate: true
    }
  },
  created () {
  },
  methods: {
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
      const loadedSize = Math.round(loadedTime / this.duration * this.size)
      console.log(loadedSize, loadedTime)
    },
    videoError (e) {
      this.$alert({
        message: '视频加载失败',
        viceMessage: e.message
      })
    },
    loadeddata (e) {
      console.log(e)
    }
  }
}
</script>

<style module lang="scss">
.paid-player {
  display: flex;
  align-items: center;
  height: 422px;
  margin: 0 !important;
  padding: 0 !important;
  justify-content: center;
  background-color: #000;
  > video {
    height: 422px;
    background-color: #000;
  }
}
</style>
