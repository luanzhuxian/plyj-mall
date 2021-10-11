<template>
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" ref="pswp">
        <div class="pswp__bg" />
        <div class="pswp__scroll-wrap">
            <div class="pswp__header">
                <div class="pswp-counter">
                    {{ currentIndex + 1 }}/{{ total }}
                </div>
                <button class="pswp__button--close" title="close" @click="close">
                    <pl-svg name="icon-close" fill="#fff" height="30" />
                </button>
            </div>
            <div class="pswp__container">
                <div class="pswp__item" />
                <div class="pswp__item" />
                <div class="pswp__item" />
            </div>

            <div class="pswp__ui pswp__ui--hidden" />
            <div class="pswp__footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script>
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

export default {
    name: 'PlImagePreview',
    props: {
        items: {
            type: Array,
            default () {
                return []
            },
            required: true
        },
        show: Boolean,

        // 打开时，默认显示的图片下标
        index: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },
    data () {
        this.options = {
            index: 0,
            escKey: false,
            loop: false,
            arrowKeys: false,
            preloaderEl: false,
            counterEl: false,
            fullscreenEl: false,
            zoomEl: false,
            shareEl: false,
            captionEl: false,
            // 当前项目被缩放时，允许滑动导航到下一个/上一个项目
            allowPanToNext: true
        }
        return {

            // 初始化时，最少加载的图片数量
            initCount: 3,
            currentIndex: 1
        }
    },
    watch: {
        show (val) {
            if (val) {
                this.options.index = this.index
                this.init()
            }
        }
    },
    methods: {
        init () {
            try {
                // const gallery = new window.PhotoSwipe(this.$refs.pswp, window.PhotoSwipeUI_Default, this.items, this.options)
                const gallery = new PhotoSwipe(this.$refs.pswp, PhotoSwipeUI_Default, this.items, this.options)
                gallery.init()
                gallery.listen('afterChange', this.afterChange)
                gallery.listen('close', this.close)
                this.gallery = gallery
                this.currentIndex = gallery.getCurrentIndex()
                this.$emit('slideChange', this.currentIndex, this.total)
            } catch (e) {
                setTimeout(() => {
                    this.init()
                }, 200)
                this.$emit('update:show', false)
            }
        },
        loadImg (src) {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = src
                img.onload = () => {
                    resolve(img)
                }
                img.onerror = e => {
                    reject(e)
                }
            })
        },
        afterChange () {
            const current = this.gallery.getCurrentIndex()
            this.currentIndex = current
            this.$emit('slideChange', current, this.total)
        },
        close () {
            this.gallery.close()
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang="scss">
  // @import "../../assets/scss/photo-swipe/main.scss";
</style>
