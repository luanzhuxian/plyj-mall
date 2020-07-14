<template>

    <transition name="fade">
        <div :class="$style.previewer" v-show="show">
            <pl-svg name="icon-shibai" width="65" :class="$style.close" @click.stop="close" />
            <pl-svg v-show="!isLoaded" name="icon-btn-loading" width="99" fill="#fff" class="rotate" />
            <canvas v-show="isLoaded" id="canvas" ref="canvas" :class="$style.canvas" />
            <div :class="$style.previewerBtnGroup">
                <pl-svg name="icon-left" width="55" :class="$style.left" @click.stop="renderPdf(current - 1)" />
                <pl-svg name="icon-left" width="55" :class="$style.right" @click.stop="renderPdf(current + 1)" />
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
        scale: {
            type: Number,
            default: 1
        },
        url: {
            type: String,
            default: '',
            required: true
        }
    },
    data () {
        return {
            file: null,
            isLoaded: false,
            isRendering: false,
            totle: 0,
            current: 1,
            cacheMap: new Map()
        }
    },
    computed: {
        // 是否已缓存
        isCurrentCached () {
            return !!this.cacheMap.get(this.url)
        }
    },
    watch: {
        show (val) {
            if (val) {
                this.previewPdf()
            } else {
                this.close()
            }
        }
    },
    methods: {
        async previewPdf () {
            const { url, isCurrentCached } = this
            let file

            try {
                if (!isCurrentCached) {
                    file = await this.loadPdf(url)
                    this.cacheMap.set(url, file)
                    console.log(file)
                } else {
                    console.log('cached')
                    file = this.cacheMap.get(url)
                }

                this.file = file
                this.totle = file.numPages
                this.current = 1
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
            try {
                if (this.isRendering) {
                    return false
                }
                if (!this.isLoaded) {
                    return false
                }
                if (pageNumber < 1 || pageNumber > this.totle) {
                    return false
                }

                this.isRendering = true

                const page = await this.file.getPage(pageNumber)
                const viewport = page.getViewport({ scale: this.scale })
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
        close () {
            this.file = null
            this.loaded = false
            this.isRendering = false
            this.totle = 0
            this.current = 1
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
        height: 110px;
        font-size: 50px;
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
