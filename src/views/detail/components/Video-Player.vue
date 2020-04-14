<template>
    <div :class="$style.videoPlayer" v-if="show">
        <video
            ref="video"
            :src="url"
            autoplay
            controls
            preload
            playsinline
            crossorigin="anonymous"
            x5-video-player-type="h5-page"
            @loadeddata="loadeddata"
            @canplay="canplay"
            @ended="ended"
        />
        <pl-svg
            :class="$style.close"
            name="icon-close"
            fill="#bbb"
            :height="30"
            @click="close"
        />
    </div>
</template>

<script>
export default {
    name: 'VideoPlayer',
    data () {
        return {}
    },
    props: {
        show: Boolean,
        url: {
            type: String,
            default: ''
        }
    },
    deactivated () {
        this.$emit('update:show', false)
    },
    methods: {
        canplay () {},
        loadeddata () {},
        play () {
            this.$nextTick(() => {
                this.$refs.video.play()
            })
        },
        close () {
            this.$refs.video.pause()
            this.$emit('update:show', false)
        },
        ended () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module lang="scss">
  .video-player {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 9999;
    > video {
        width: 100%;
        background-color: #000;
    }
    .close {
        position: absolute;
        right: 30px;
        top: 30px;
        padding: 20px;
    }
  }
</style>
