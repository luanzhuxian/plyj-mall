<template>
    <transition name="fade">
        <div :class="$style.previewer" v-if="show">
            <pl-svg name="icon-shibai" width="40" :class="$style.close" @click.stop="close" />
            <pl-svg v-show="!isLoaded" name="icon-btn-loading" width="50" fill="#fff" class="rotate" />
            <canvas v-show="isLoaded" ref="canvas" :class="$style.canvas" />
            <div :class="$style.previewerBtnGroup">
                <pl-svg name="icon-left" width="25" :class="$style.left" @click.stop="prev" />
                <pl-svg name="icon-left" width="25" :class="$style.right" @click.stop="next" />
            </div>
        </div>
    </transition>
</template>

<script>
import pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = 'https://mallcdn.youpenglai.com/cdn/pdf/pdf.worker.min.js'

export default {
    name: 'PdfPreviewer',
    props: {
        show: Boolean,
        // 缩放指数
        // scale: {
        //     type: Number,
        //     default: 1
        // },
        url: {
            type: String,
            default: '',
            required: true
        }
    },
    data () {
        return {
            // 当前pdf文件
            file: null,
            // 是否加载
            isLoaded: false,
            // 正在绘制
            isRendering: false,
            // pdf总页数
            totle: 0,
            // 当前预览页
            current: 1,
            cacheMap: new Map(),
            scale: 1
        }
    },
    watch: {
        show: {
            handler (val) {
                if (val) {
                    this.previewPdf()
                } else {
                    this.close()
                }
            },
            immediate: true
        }
    },
    methods: {
        async calculateScale () {
            const page = await this.file.getPage(1)
            const screenWidth = window.screen.width * window.devicePixelRatio
            const { width } = page.getViewport({ scale: 1 })
            this.scale = screenWidth / width
            return this.scale
        },
        async previewPdf () {
            const { url } = this
            let file

            // 是否已缓存
            const isCached = !!this.cacheMap.get(url)

            try {
                if (!isCached) {
                    file = await this.loadPdf(url)
                    this.cacheMap.set(url, file)
                    // console.log(file)
                } else {
                    file = this.cacheMap.get(url)
                    // console.log('cached')
                }

                this.file = file
                this.totle = file.numPages
                this.current = 1
                await this.calculateScale()
                await this.renderPdf(this.current)
                await this.$nextTick()
                this.isLoaded = true
            } catch (error) {
                throw error
            }
        },
        async loadPdf (url) {
            try {
                const loadingTask = pdfjs.getDocument(url)
                const file = await loadingTask.promise
                return file
            } catch (error) {
                throw error
            }
        },
        async renderPdf (pageNumber) {
            const { scale } = this
            try {
                if (this.isRendering) {
                    return false
                }

                this.isRendering = true

                const page = await this.file.getPage(pageNumber)
                const viewport = page.getViewport({ scale })
                const canvas = this.$refs.canvas
                const context = canvas.getContext('2d')

                canvas.height = viewport.height
                canvas.width = viewport.width

                const renderContext = {
                    canvasContext: context,
                    viewport
                }
                const renderingTask = page.render(renderContext)
                await renderingTask.promise
                this.current = pageNumber
            } catch (error) {
                throw error
            } finally {
                this.isRendering = false
            }
        },
        prev () {
            const { current, isLoaded } = this
            const pageNumber = current - 1
            if (!isLoaded) {
                return false
            }
            if (pageNumber < 1) {
                return false
            }
            this.renderPdf(pageNumber)
        },
        next () {
            const { current, isLoaded, totle } = this
            const pageNumber = current + 1
            if (!isLoaded) {
                return false
            }
            if (pageNumber > totle) {
                return false
            }
            this.renderPdf(pageNumber)
        },
        clear () {
            this.file = null
            this.loaded = false
            this.isRendering = false
            this.totle = 0
            this.current = 1
        },
        close () {
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
    overflow-x: hidden;
    overflow-y: scroll;
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
        > .right {
            margin-left: 50px;
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

</style>
