<template>
    <div
        :class="$style.poster"
        :style="{
            '--bc': borderColor,
            '--bgc1': bgc1,
            '--bgc2': bgc2
        }"
    >
        <!-- 展示海报按钮 -->
        <button :class="$style.showPoster" @click="showPoster">
            <pl-svg name="icon-poster-512b1" fill="#fff" height="25" :vertical-align="-4" />
            <span>海报</span>
        </button>
        <pl-mask :show.sync="show">
            <img style="height: 70vh;" v-if="!loading" :src="poster" alt="">
            <pl-svg v-else :class="$style.loading" name="icon-loading" fill="#fff" height="45" />
        </pl-mask>
    </div>
</template>

<script>
/* eslint-disable */
import { loadImage, createCanvas, generateQrcode } from '../../../assets/js/util'
export default {
    name: 'SharePoster',
    data () {
        return {
            poster: '',
            show: false,
            loading: false
        }
    },
    props: {
        // 按钮边框颜色
        borderColor: {
            type: String,
            default: '#FFE3C8'
        },
        // 按钮背景色1
        bgc1: {
            type: String,
            default: '#FF981A'
        },
        // 按钮背景色1
        bgc2: {
            type: String,
            default: '#EE4620'
        },
        // 海报背景图片，建议尺寸 1500 * 2668, 格式为jpg
        bgi: {
            type: String,
            default: ''
        },
        // 海报的宽高
        w: {
            type: Number,
            default: 1500
        },
        h: {
            type: Number,
            default: 2668
        }
    },
    methods: {
        async showPoster () {
            this.show = true
            this.loading = true
            if (!this.poster) {
                await this.createPoster()
            }
            this.loading = false
        },
        async createPoster () {
            const { cvs, ctx } = createCanvas(this.w, this.h)
            const bg = await loadImage(this.bgi)
            ctx.drawImage(bg, 0, 0, this.w, this.h)
            const qrcode = await generateQrcode({
                size: 300,
                text: location.href,
                type: 'canvas'
            })
            ctx.drawImage(qrcode, 522, 1780, 480, 480)
            this.poster = cvs.toDataURL('image/jpeg', 0.8)
        }
    }
}
</script>

<style module lang="scss">
    .show-poster {
        position: fixed;
        right: 0;
        top: 306px;
        z-index: 1;
        height: 48px;
        padding: 0 15px;
        border: 1px solid var(--bc);
        border-right: none;
        border-radius: 24px 0 0 24px;
        line-height: 48px;
        background: linear-gradient(90deg, var(--bgc1), var(--bgc2));
        letter-spacing: 2px;

        > span {
            display: inline-block;
            margin-left: 6px;
            color: #fff;
            font-size: 23px;
        }
    }
    .loading {
        &:global {
            animation: rotate 2s linear infinite;
        }
    }
</style>
