<template>
    <transition name="slide-bottom-fade">
        <div
            v-if="show"
            class="back-to-top"
            :style="{
                right: vpRight,
                bottom: vpBottom
            }"
            @click.stop="handleClick"
        >
            <slot />
        </div>
    </transition>
</template>

<script>
import { throttle } from '../../assets/js/util'

const RAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
const cubic = value => Math.pow(value, 3)
const easeInOutCubic = value => value < 0.5
    ? cubic(value * 2) / 2
    : 1 - cubic((1 - value) * 2) / 2

export default {
    name: 'BackToTop',
    props: {
        // 触发滚动的对象
        target: {
            type: String,
            default: ''
        },
        // 滚动高度达到此参数值才出现
        threshold: {
            type: Number,
            default: 500
        },
        right: {
            type: Number,
            default: 32
        },
        bottom: {
            type: Number,
            default: 120
        }

    },
    data () {
        return {
            show: false,
            el: null,
            // 绑定滚动事件的元素
            container: null,
            scrollHandler: null
        }
    },
    computed: {
        vpRight () {
            return `${ this.right / 7.5 }vw`
        },
        vpBottom () {
            return `${ this.bottom / 7.5 }vw`
        }
    },
    mounted () {
        this.init()
        this.scrollHandler = throttle(this.onScroll, 300)
        this.container.addEventListener('scroll', this.scrollHandler)
    },
    beforeDestroy () {
        this.container.removeEventListener('scroll', this.scrollHandler)
    },
    methods: {
        init () {
            this.container = document
            this.el = document.documentElement
            if (this.target) {
                this.el = document.querySelector(this.target)
                if (!this.el) {
                    throw new Error(`target is not existed: ${ this.target }`)
                }
                this.container = this.el
            }
        },
        onScroll () {
            this.show = this.el.scrollTop >= this.threshold
        },
        scrollToTop () {
            const { el } = this
            const startTime = Date.now()
            const startTop = { el }

            const callback = () => {
                const progress = (Date.now() - startTime) / 500

                if (progress < 1) {
                    el.scrollTop = startTop * (1 - easeInOutCubic(progress))
                    RAF(callback)
                } else {
                    el.scrollTop = 0
                }
            }

            RAF(callback)
        },
        handleClick (e) {
            this.scrollToTop()
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="scss">
.back-to-top {
    position: fixed;
    z-index: 1;
}
.slide-bottom-fade-enter-active {
    transition: all .3s ease-in;
}
.slide-bottom-fade-leave-active {
    transition: all .3s ease-out;
}
.slide-bottom-fade-enter, .slide-bottom-fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
.slide-bottom-fade-enter-to, .slide-bottom-fade-leave {
    transform: translateY(0);
    opacity: 1;
}
</style>
