<template>
    <transition name="fade">
        <div :class="$style.previewer" v-if="show">
            <pl-svg name="icon-shibai" width="40" :class="$style.close" @click.stop="close" />
            <pl-svg v-show="!isLoaded" name="icon-btn-loading" width="50" fill="#fff" class="rotate" />
            <div ref="container" v-show="isLoaded" :class="$style.swiperContainer">
                <div ref="list" :class="$style.swiperList">
                    <div :class="$style.swiperItem" v-for="(item, index) of pages" :key="index">
                        <canvas :ref="'canvas-' + (index + 1)" />
                    </div>
                </div>
            </div>
            <div :class="$style.previewerBtnGroup">
                <pl-svg name="icon-left" width="25" :class="$style.left" @click.stop="toPreviousPage" />
                <span>{{ current }}</span>
                <pl-svg name="icon-left" width="25" :class="$style.right" @click.stop="toNextPage" />
            </div>
        </div>
    </transition>
</template>

<script>
import pdfjsLib from 'pdfjs-dist'
import { throttle } from '../../../assets/js/util'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mallcdn.youpenglai.com/cdn/pdf/pdf.worker.min.js'

export default {
    name: 'PdfPreviewer',
    props: {
        show: Boolean,
        url: {
            type: String,
            default: '',
            required: true
        }
    },
    data () {
        return {
            // 是否加载
            isLoaded: false,
            // 正在绘制
            isRendering: false,
            // 是否在翻页
            isSwiping: false,
            // pdf总页数
            total: 10,
            // 当前预览页页数
            current: 1,
            // 已渲染的最后一页页数
            lastRenderedPage: 0,
            cacheMap: new Map(),
            // 缩放系数
            scale: 1,
            // 当前pdf文件
            file: null,
            pages: [],
            container: null,
            scrollHandler: null
        }
    },
    watch: {
        show: {
            async handler (val) {
                if (val) {
                    try {
                        await this.previewPdf()
                        this.bindScroll()
                    } catch (error) {
                        throw error
                    }
                } else {
                    this.clear()
                }
            },
            immediate: true
        }
    },
    mounted () {
        this.init()
    },
    activated () {
        this.init()
    },
    deactivated () {
        if (this.container) {
            this.container.removeEventListener('scroll', this.scrollHandler)
        }
    },
    beforeDestroy () {
        if (this.container) {
            this.container.removeEventListener('scroll', this.scrollHandler)
        }
    },
    methods: {
        init () {
            if (this.$refs.container) {
                this.container = this.$refs.container
            }
            this.screenWidth = window.screen.width * window.devicePixelRatio
        },
        bindScroll () {
            this.scrollHandler = throttle(this.onScroll, 200)
            this.container = this.$refs.container
            this.container.addEventListener('scroll', this.scrollHandler, { passive: true })
        },
        onScroll (e) {
            const { target } = e
            // const container = this.$refs.container
            // const list = this.$refs.list
            // console.log(e)
            // console.log('target.scrollLeft', target.scrollLeft)
            // console.log('target.clientWidth', target.clientWidth)
            // console.log('target.scrollWidth', target.scrollWidth)
            // console.log('container.scrollLeft', container.scrollLeft)
            // console.log('container.clientWidth', container.clientWidth)
            // console.log('list.clientWidth', list.clientWidth)
            this.current = this.calculateCurrentPage(target) || 1
            if (target.scrollLeft + target.clientWidth > target.scrollWidth - (5 * target.clientWidth)) {
                this.renderMutiplePages(10)
            }
        },
        calculateCurrentPage ({ scrollLeft, clientWidth }) {
            const result = scrollLeft / clientWidth
            const decimal = `0.${ result
                .toString()
                .split('.')
                .pop() }`
            return decimal > 0.3
                ? Math.ceil(result) + 1
                : Math.floor(result) + 1
        },
        async calculateScale () {
            const page = await this.file.getPage(1)
            const { width } = page.getViewport({ scale: 1 })
            this.scale = this.screenWidth / width
            return this.scale
        },
        async previewPdf () {
            const { url } = this
            let file

            // 是否已缓存
            const isCached = !!this.cacheMap.get(url)

            try {
                if (!isCached) {
                    file = await this.loadFile(url)
                    if (!file) {
                        this.close()
                        await this.$nextTick()
                        return this.$error({ message: '资料获取失败，请检查资料是否存在' })
                    }

                    // file.pages = []
                    this.cacheMap.set(url, file)
                    // console.log('file', file)
                } else {
                    file = this.cacheMap.get(url)
                }

                this.file = file
                this.total = file.numPages
                this.current = 1

                await this.calculateScale()
                await this.renderMutiplePages(1)
                await this.$nextTick()
                this.isLoaded = true
                await this.renderMutiplePages(9)
            } catch (error) {
                throw error
            }
        },
        async loadFile (url) {
            try {
                const loadingTask = pdfjsLib.getDocument(url)
                const file = await loadingTask.promise.catch(e => false)
                return file
            } catch (error) {
                throw error
            }
        },
        async renderPage (pageNumber) {
            const { scale } = this

            try {
                const page = await this.file.getPage(pageNumber)
                this.pages.push(page)
                await this.$nextTick()

                const viewport = page.getViewport({ scale })
                const domList = this.$refs[`canvas-${ pageNumber }`]
                if (!domList) {
                    this.$error({ message: `第${ pageNumber }页渲染错误，找不到对应canvas` })
                    return Promise.reject(new Error(`第${ pageNumber }页渲染错误，找不到对应canvas`))
                }
                const canvas = domList[0]
                const context = canvas.getContext('2d')

                canvas.width = this.screenWidth
                // canvas.width = viewport.width
                canvas.height = viewport.height

                const renderContext = {
                    canvasContext: context,
                    viewport
                }
                const renderingTask = page.render(renderContext)
                await renderingTask.promise
                // console.log(`canvas-${ pageNumber }`, canvas.toDataURL('image/jpeg', 0.1))

                return pageNumber
            } catch (error) {
                throw error
            }
        },
        async renderMutiplePages (size) {
            const asyncIterableMaker = size => ({
                [Symbol.asyncIterator] () {
                    return {
                        i: 0,
                        next () {
                            if (this.i < size) {
                                this.i++
                                return Promise.resolve({ value: this.i, done: false })
                            }
                            return Promise.resolve({ value: this.i, done: true })
                        }
                    }
                }
            })

            const asyncIterable = asyncIterableMaker(size)

            if (!this.isRendering) {
                try {
                    this.isRendering = true

                    // eslint-disable-next-line
                    for await (const i of asyncIterable) {
                        const next = this.lastRenderedPage + 1
                        if (!next) {
                            break
                        }
                        if (next > this.total) {
                            break
                        }
                        this.lastRenderedPage = await this.renderPage(next)
                    }
                } catch (error) {
                    throw error
                } finally {
                    this.isRendering = false
                }
            }
        },
        swipe (pageNumber) {
            const offset = (pageNumber - 1) * this.screenWidth
            this.isSwiping = true

            this.container.scrollLeft = offset

            this.isSwiping = false
        },
        toPreviousPage () {
            const { isLoaded, isSwiping, current } = this
            const previous = current - 1

            if (!isLoaded) {
                return false
            }
            if (isSwiping) {
                return false
            }
            if (previous < 1) {
                return false
            }

            this.current = previous
            this.swipe(previous)
        },
        toNextPage () {
            const { isLoaded, isSwiping, total, current, lastRenderedPage } = this
            const next = current + 1

            if (!isLoaded) {
                return false
            }
            if (isSwiping) {
                return false
            }
            if (next > total) {
                return false
            }
            if (lastRenderedPage - current < 5) {
                this.renderMutiplePages(10)
            }

            this.current = next
            this.swipe(next)
        },
        clear () {
            this.current = 1
            this.lastRenderedPage = 0
            this.total = 0
            this.file = null
            this.pages = []
            this.loaded = false
            this.isRendering = false
        },
        close () {
            // 渲染完才能关闭
            if (this.isRendering) return

            this.clear()
            this.$emit('update:show', false)
        }
    }

}
</script>

<style module lang="scss">
.previewer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(58, 58, 58, .9);
    &-btn-group {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 80px;
        background-color: #ededed;
        z-index: 1;
        > span {
            margin: 0 25px;
            font-size: 32px;
        }
        > .right {
            transform: rotate(180deg);
        }
    }
    > .close {
        position: absolute;
        top: 30px;
        left: 30px;
        z-index: 1;
    }
}
.swiper {
    &-container {
        width: 100%;
        overflow-x: scroll;
    }
    &-list {
        display: inline-flex;
        align-items: center;
        scroll-behavior: smooth;
    }
}

</style>
