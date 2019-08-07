<template>
  <div :class="$style.video">
    <img :class="$style.cover" :src="`${url}?x-oss-process=video/snapshot,t_10000,m_fast`" alt="">
    <img :class="$style.play" src="../assets/images/play.png" alt="" @click="play">
    <video
      v-if="isPlay"
      :src="url"
      ref="video"
      crossorigin="anonymous"
      @loadeddata="loadeddata"
      @canplay="canplay"
      @ended="ended"
      x5-video-player-type="h5-page"
      playsinline
      preload
      controls
      :class="{ [$style.playVideo]: isPlay }"
    />
  </div>
</template>

<script>
export default {
  name: 'PlVideo',
  data () {
    return {
      isPlay: false
    }
  },
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    canplay () {
      // console.log(123)
      // this.$refs.video.play()
      // setTimeout(() => {
      //   let canvas = this.$refs.canvas
      //   let ctx = canvas.getContext('2d')
      //   ctx.drawImage(this.$refs.video, 0, 0)
      //   this.IMG = canvas.toBlob(res => {
      //     console.log(res)
      //     console.dir(this.$refs.video.buffered)
      //   })
      // }, 1000)
    },
    async loadeddata () {
      // console.log(321)
      // let video = this.$refs.video
      // this.videoWidth = video.videoWidth
      // this.videoHeight = video.videoHeight
      // video.play()
      // setTimeout(async () => {
      //   video.pause()
      //   await this.$nextTick()
      //   let canvas = this.$refs.canvas
      //   let ctx = canvas.getContext('2d')
      //   ctx.drawImage(video, 0, 0)
      //   this.IMG = canvas.toDataURL()
      // }, 100)

      // console.log(video)
    },
    play () {
      this.isPlay = true
      this.$refs.video.play()
    },
    ended () {
      this.isPlay = false
    }
  }
}
</script>

<style module lang="scss">
  .video {
    position: relative;
    > .cover {
      width: 702px;
      height: 356px;
      object-fit: cover;
      border-radius: 20px;
    }
    > .play {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100px;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    > .play-video {
      position: fixed;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 9999;
    }
  }
</style>
