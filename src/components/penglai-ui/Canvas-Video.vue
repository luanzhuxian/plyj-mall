<template>
  <div
    :class="{
      'canvas-video': true,
      'fullscreen': isFullscreen
    }"
  >
    <canvas
      :width="videoWidth"
      :height="videoHeight"
      ref="canvas"
      @click="showControls = true"
    />
    <div
      v-show="showControls || stoped"
      class="canvas-video-ctrl-wrap"
    >
      <div
        class="canvas-video-play"
        :style="{
          backgroundImage: `url(${stoped ? playIcon : pauseIcon})`
        }"
        @click="playOrPause"
      />
      <div class="canvas-video-controls">
        <div class="canvas-video-progress-box">
          <div
            :style="{ '--progress': progress }"
            class="progress-bar"
          />
        </div>
        <div class="canvas-video-ctrl-box">
          <div class="ctrl-box-left">
            <div
              class="canvas-video-play-btn"
              :style="{
                backgroundImage: `url(${stoped ? smallPlayIcon : smallPauseIcon})`
              }"
              @click="playOrPause"
            />
            <!--<div class="canvas-video-time">
              00:00:00 / 00:00:00
            </div>-->
          </div>
          <div class="ctrl-box-right">
            <!--<div class="canvas-video-volume-btn">
              123
            </div>-->
            <div
              class="canvas-video-fullscreen-btn"
              :style="{ backgroundImage: `url(${isFullscreen ? exitfullscreenIcon : fullscreenIcon})` }"
              @click="fullscreen"
            />
          </div>
        </div>

      </div>
    </div>

    <video
      v-show="false"
      ref="video"
      @canplay="canplay"
      @loadeddata="loadeddata"
      @pause="pauseHandler"
      @ended="endedHandler"
      @error="errorHandler"
      controls
      :src="url"
      :width="videoWidth"
      :height="videoHeight"
    />
  </div>
</template>
<script>
import pauseIcon from './assets/image/pause.png'
import smallPlayIcon from './assets/image/play_s.png'
import smallPauseIcon from './assets/image/pause_s.png'
import fullscreenIcon from './assets/image/fullscreen.png'
import exitfullscreenIcon from './assets/image/exitfullscreen.png'
import volume from './assets/image/volume.png'
const playIcon = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/play.png'
let stopedTimer = 0
let ctrlTimer = 0
export default {
  name: 'PlCanvasVideo',
  data () {
    return {
      videoHeight: 0,
      videoWidth: 0,
      // 保存初始化时的宽高，用以控制全屏显示
      initWidth: 0,
      initHeight: 0,
      videoCanPlay: false,
      stoped: true,
      showControls: true,
      playIcon,
      pauseIcon,
      smallPlayIcon,
      smallPauseIcon,
      fullscreenIcon,
      exitfullscreenIcon,
      volume,
      progress: 0,
      // 视频时长（s）
      duration: 0,
      isFullscreen: false
    }
  },
  computed: {
    canvas () {
      return this.$refs.canvas
    },
    ctx () {
      return this.canvas.getContext('2d')
    },
    video () {
      return this.$refs.video
    },
    // 宽高比
    aspectRatio () {
      return this.initWidth / this.initHeight
    }
  },
  props: {
    url: {
      type: String,
      default: 'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/tcEvM53Bo-WdA47HEp-5Jp0EFVu-2A0sfKX9-0USSLhbh-q-1564971644774.mp4'
    }
  },
  watch: {
    stoped (val) {
      if (!this.stoped) {
        clearTimeout(stopedTimer)
        stopedTimer = setTimeout(() => {
          this.showControls = false
        }, 3000)
      }
    },
    showControls (val) {
      if (val && !this.stoped) {
        clearTimeout(ctrlTimer)
        ctrlTimer = setTimeout(() => {
          this.showControls = false
        }, 3000)
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.resize)
  },
  methods: {
    canplay () {
      this.videoCanPlay = true
    },
    async loadeddata () {
      let videoWidth = this.video.videoWidth
      this.duration = this.video.duration
      // 竖屏
      this.videoWidth = this.$el.offsetWidth
      this.videoHeight = this.video.videoHeight * this.videoWidth / videoWidth
      await this.$nextTick()
      // 显示第一帧
      this.ctx.drawImage(this.$refs.video, 0, 0, this.videoWidth, this.videoHeight)
    },
    pauseHandler () {
      this.stoped = true
      this.showControls = true
    },
    endedHandler () {
      this.stoped = true
      this.showControls = true
    },
    errorHandler () {},
    playOrPause () {
      if (this.stoped) {
        this.$refs.video.play()
        playing(this.ctx, this.video, this.videoWidth, this.videoHeight, this.getProgress)
        this.stoped = false
      } else {
        this.stoped = true
        this.$refs.video.pause()
      }
    },
    getProgress (currentTime) {
      this.progress = currentTime / this.duration * 100 + '%'
    },
    fullscreen () {
      if (this.isFullscreen) {
        document.exitFullscreen()
        this.isFullscreen = false
      } else {
        document.documentElement.requestFullscreen()
        // if (this.video.videoWidth > this.video.videoHeight) {
        //
        // }
        this.isFullscreen = true
      }
      this.loadeddata()
    },
    async resize () {
      if (this.isFullscreen) {
        if (window.orientation === 0 || window.orientation === 180) {
          this.videoWidth = window.innerWidth
          this.videoHeight = this.video.videoHeight * this.videoWidth / this.video.videoWidth
        } else {
          this.videoHeight = window.innerHeight
          this.videoWidth = this.videoHeight * (this.videoWidth / this.video.videoWidth)
        }
        await this.$nextTick()
        this.ctx.drawImage(this.$refs.video, 0, 0, this.videoWidth, this.videoHeight)
      } else {
        this.loadeddata()
      }
    },
    setBoxWidth () {
      if (window.orientation === 0) {
        this.$el.style = {
        }
      }
    }
  }
}

/**
   * 在canvas上播放视频
   * @param ctx {CanvasRenderingContext2D}
   * @param video {HTMLVideoElement}
   */
function playing (ctx, video, videoWidth, videoHeight, callback) {
  let { paused, ended, error, currentTime } = video
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
  if (!paused && !ended && !error) {
    callback(currentTime)
    window.requestAnimationFrame(playing.bind(this, ctx, video, videoWidth, videoHeight, callback))
  }
}
</script>
<style lang="scss">
  .canvas-video {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #000;
    transition: transform .3s ease;
    &.fullscreen {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 9999;
    }
  }

  .canvas-video-ctrl-wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .canvas-video-play {
    width: 50px;
    height: 50px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100%;
    cursor: pointer;
  }
  .canvas-video-controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
  }
  .canvas-video-progress-box {
    background-color: rgba(0, 0, 0, .5);
    background-clip: content-box;
    .progress-bar {
      width: var(--progress);
      height: 4px;
      background-color: #00b5e5;
      z-index: 99;
    }
  }
  .canvas-video-ctrl-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  .ctrl-box-left {
    display: flex;
  }
  .canvas-video-play-btn {
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100%;
    cursor: pointer;
  }
  .canvas-video-time {
    margin-left: 20px;
    color: #fff;
    font-size: 18px;
  }
  .canvas-video-fullscreen-btn {
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100%;
    cursor: pointer;
  }
</style>
