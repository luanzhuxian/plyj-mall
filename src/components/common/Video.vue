<template>
    <div :class="$style.video">
        <img v-imgError
             :class="$style.cover"
             :src="`${url}?x-oss-process=video/snapshot,t_10000,m_fast`"
             :style="{
                 width: width / 7.5 + 'vw',
                 height: height / 7.5 + 'vw',
                 borderRadius: radius / 7.5 + 'vw'
             }"
             alt=""
        >
        <img v-if="url" :class="$style.play" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/play.png" alt="" @click="play">
        <div
            v-if="isPlay"
            :class="$style.videoBox"
        >
            <video
                v-if="isPlay"
                :src="url"
                ref="video"
                controlslist="nodownload"
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
            <pl-svg
                :class="$style.close"
                name="icon-close"
                fill="#bbb"
                :height="30"
                @click="close"
            />
        </div>
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
        },
        radius: {
            type: Number,
            default: 20
        },
        width: {
            type: [Number, String],
            default: 702
        },
        height: {
            type: [Number, String],
            default: 356
        }
    },
    deactivated () {
        this.isPlay = false
    },
    methods: {
        canplay () {
        },
        async loadeddata () {
        },
        play () {
            this.isPlay = true
            this.$nextTick(() => {
                this.$refs.video.play()
            })
        },
        close () {
            this.$refs.video.pause()
            this.isPlay = false
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
      object-fit: cover;
    }
    > .play {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100px;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    > .videoBox {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 9999;
      > .play-video {
        width: 100%;
        background-color: #000;
      }
    }
    .close {
      position: absolute;
      right: 30px;
      top: 30px;
      padding: 20px;
    }
  }
</style>
