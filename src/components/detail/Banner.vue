<template>
    <div
        v-if="banners.length > 0"
        :class="{
            'detail-banner': true,
            [$style.detailBanner]: true
        }"
    >
        <swiper ref="swiper" :options="swiperOption" @slideChange="slideChange">
            <swiperSlide
                v-for="(img, index) of main ? [main, ...banners.slice(1)] : banners"
                :key="index"
                :class="{ 'swiper-no-swiping': banners.length < 2 }"
            >
                <img
                    v-if="img.indexOf('video/') > -1"
                    :src="img + '?x-oss-process=video/snapshot,t_5000,m_fast'"
                    ref="img"
                    :class="$style.bannerImg"
                >
                <img
                    v-else
                    :class="$style.bannerImg"
                    :src="img"
                    ref="img"
                >
                <pl-svg v-if="img.indexOf('video/') > -1" @click="play(img)" :class="$style.playBtn" name="icon-play" fill="#fff" />
            </swiperSlide>
        </swiper>
        <div v-show="banners.length > 1" :class="'swiper-pagination ' + $style.pagination" />
        <slot />
        <transition name="fade">
            <div
                v-show="isPlay"
                :class="$style.videoBox"
            >
                <video
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
                <pl-svg @click="close" :class="$style.close" name="icon-close" fill="#bbb" />
            </div>
        </transition>
    </div>

    <div
        v-else
        :class="$style.skeleton"
    />
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    name: 'DetailBanner',
    components: {
        swiper,
        swiperSlide
    },
    props: {
        banners: {
            type: Array,
            default () {
                return []
            }
        },
        main: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            swiperOption: {
                autoplay: true,
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            isPlay: false,
            url: ''
        }
    },
    computed: {
        swiper () {
            return this.$refs.swiper.swiper
        }
    },
    updated () {
        if (this.$refs.img) {
            this.$emit('slideChange', this.$refs.img, 0)
        }
    },
    methods: {
        slideChange () {
            this.$emit('slideChange', this.$refs.img, this.swiper.activeIndex)
        },
        async play (url) {
            this.url = url
            this.isPlay = true
            await this.$nextTick()
            this.$refs.video.play()
        },
        loadeddata () {},
        canplay () {},
        ended () {
            this.isPlay = false
        },
        close () {
            this.$refs.video.pause()
            this.isPlay = false
        }
    },
    deactivated () {
        this.isPlay = false
    }
}
</script>

<style module lang="scss">
  .detail-banner {
    position: relative;
    font-size: 0;
    height: 502px;
    .banner-img {
      width: 750px;
      height: 502px;
      object-fit: cover;
    }
  }
  .pagination {
    width: 100%;
    bottom: 20px;
  }
  .skeleton {
    height: 502px;
    @include skeAnimation(#eee)
  }
  .play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
  .videoBox {
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
    > .close {
      position: absolute;
      right: 30px;
      top: 30px;
      width: 30px;
      padding: 20px;
    }
  }
</style>
<style lang="scss">
  .detail-banner {
    .swiper-pagination-bullet {
      position: relative;
      width: 8px;
      height: 6px;
      margin-left: 8px;
      border-radius: 3px;
      transition: width .3s linear;
      background-color: #848786;
      opacity: 1;
      &.swiper-pagination-bullet-active {
        width: 22px;
        background-color:  #e8e8e8;
      }
    }
  }
</style>
