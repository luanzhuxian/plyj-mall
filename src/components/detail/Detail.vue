<template>
    <div :class="$style.detailInfo + ' ql-snow'" ref="detail">
        <h3 v-text="title" />
        <div
            :class="$style.content + ' ql-container ql-editor'"
            v-html="afterHtml"
            ref="wrap"
            @click="preivew"
        />
    </div>
</template>

<script>
export default {
    name: 'DetailInfo',
    data () {
        return {
            afterHtml: '',
            imgList: []
        }
    },
    props: {
        content: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    computed: {
        detail () {
            // 解决 BOM &#65279; 幽灵字符
            return this.content.replace(/\ufeff/g, '') || ''
        }
    },
    watch: {
        detail: {
            async handler (val) {
                if (val) {
                    this.afterHtml = val.replace(/<img[^>]+src="([^"]*)"[^>]*>/g, '<img data-src="$1" src=$1?x-oss-process=style/thum-middle>')
                }
                await this.$nextTick()
                this.setPreview()
            },
            immediate: true
        }
    },
    methods: {
        setPreview () {
            const imgs = Array.from(this.$refs.wrap.querySelectorAll('img'))
            this.imgList = imgs.map(item => item.dataset.src)
        },
        preivew (e) {
            e.stopPropagation()
            if (e.target.tagName === 'IMG') {
                window.wx.previewImage({
                    // 当前显示图片的http链接
                    current: e.target.dataset.src,
                    // 需要预览的图片http链接列表
                    urls: [...this.imgList]
                })
            }
        }
    }
}
</script>
<style module lang="scss">
    .detail-info {
        padding: 30px 40px;
        background-color: #fff;

        h3 {
            margin-bottom: 28px;
            font-size: 32px;
            color: #000;
            font-weight: bold;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        color: #999 !important;
        font-size: 16px !important;

        img {
            display: inline-block;
            width: 670px !important;
            height: auto !important;
        }
    }
</style>
