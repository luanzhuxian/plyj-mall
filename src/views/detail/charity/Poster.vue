<template>
    <div :class="$style.poster" v-if="show">
        <div :class="$style.content">
            <img :src="poster" alt="">
            <pl-svg name="icon-close3" fill="#fff" width="48" @click="close" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    generateQrcode,
    cutImageCenter,
    cutArcImage,
    loadImage,
    createText,
    drawRoundRect
} from '../../../assets/js/util'

const defaultAvatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
const background = 'https://mallcdn.youpenglai.com/static/mall/2.9.0/charity-product-poster.png'

const drawRectWithText = (ctx, x, y, width, height, radius, strokeStyle, fillStyle) => function (text, font, textFillStyle, lineHeight, textAlign) {
    if (radius) {
        drawRoundRect(ctx, x, y, width, height, radius, strokeStyle, fillStyle)
    } else {
        ctx.fillStyle = fillStyle
        ctx.fillRect(x, y, width, height)
    }
    ctx.font = font
    ctx.fillStyle = textFillStyle
    ctx.textAlign = textAlign
    if (textAlign === 'left') {
        ctx.fillText(text, x, y + lineHeight)
        return
    }
    if (textAlign === 'center') {
        ctx.fillText(text, x + width / 2, y + lineHeight)
        ctx.textAlign = 'left'
    }
}
export default {
    name: 'Poster',
    props: {
        show: Boolean,
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        share: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            poster: ''
        }
    },
    computed: {
        ...mapGetters(['userName', 'avatar']),
        courseImg () {
            return this.data.courseImg || ''
        },
        courseName () {
            return this.data.courseName || ''
        },
        price () {
            return this.data.sellingPrice || 0
        }
    },
    created () {
        this.createPoster()
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },

        // 生成海报
        async createPoster (type) {
            try {
                const { avatar, userName, share, courseImg, courseName, price } = this
                let image = await loadImage(courseImg)
                if (!image) {
                    this.$error('图片加载错误')
                    return
                }

                const bg = await loadImage(background)

                // 截取头像
                let lodedAvatar
                try {
                    lodedAvatar = await loadImage(avatar)
                } catch (e) {
                    lodedAvatar = await loadImage(defaultAvatar)
                }
                const arcAvatar = cutArcImage(lodedAvatar)

                // 截取中间部分
                image = cutImageCenter(image, 750 / 500)
                const canvas = document.createElement('canvas')
                canvas.width = 654
                canvas.height = 1156
                const ctx = canvas.getContext('2d')

                ctx.drawImage(bg, 0, 0, 654, 1156)
                ctx.drawImage(arcAvatar, 280, 192, 96, 96)

                // 用户名
                ctx.font = '28px Microsoft YaHei UI'
                ctx.fillStyle = '#333'
                ctx.textAlign = 'center'
                createText(ctx, 327, 360, userName, 40, 542, 1)

                ctx.font = 'bold 32px Microsoft YaHei UI'
                ctx.fillStyle = '#ff8400'
                ctx.textAlign = 'center'
                ctx.fillText('邀请你一起参与公益助力活动', 327, 408)

                ctx.moveTo(56, 448)
                ctx.lineTo(598, 448)
                ctx.lineWidth = 2
                ctx.strokeStyle = '#e7e7e7'
                ctx.stroke()

                // 商品
                ctx.drawImage(image, 0, 0, image.width, image.height, 56, 470, 240, 160)
                drawRectWithText(ctx, 56, 470, 100, 30, 0, '#75a4ff', '#75a4ff')('公益助力', '22px Microsoft YaHei UI', '#fff', 23, 'center')
                // 商品名称
                ctx.font = 'bold 28px Microsoft YaHei UI'
                ctx.fillStyle = '#333'
                ctx.textAlign = 'left'
                createText(ctx, 312, 506, courseName, 40, 278, 1)
                // 商品价格
                drawRectWithText(ctx, 312, 529, 68, 26, 4, '#fe7700', '#fe7700')('活动价', '20px Microsoft YaHei UI', '#fff', 20, 'center')
                if (price) {
                    ctx.font = '24px Microsoft YaHei UI'
                    ctx.fillStyle = '#fe7700'
                    ctx.fillText('¥', 388, 551)
                    ctx.font = '40px Helvetica'
                    createText(ctx, 406, 555, String(price), 40, 188, 1)
                } else {
                    ctx.font = '40px Helvetica'
                    ctx.fillStyle = '#fe7700'
                    createText(ctx, 406, 555, '免费', 40, 188, 1)
                }
                // 商品公益金
                ctx.font = '24px Microsoft YaHei UI'
                const text = `${ 999 }元公益金`
                const textWidth = ctx.measureText(text).width > 174 ? 184 : ctx.measureText(text).width
                const padding = 10
                const left = 84
                const right = textWidth + padding * 2
                drawRoundRect(ctx, 312, 583, left + right, 34, 8, '#fe582a', '#fff')
                drawRoundRect(ctx, 312, 583, 80, 34, 8, '#fe582a', '#fe582a')
                drawRectWithText(ctx, 318, 583, 80, 34, 0, '#fe582a', '#fe582a')('可捐赠', '24px Microsoft YaHei UI', '#fff', 25, 'left')
                ctx.fillStyle = '#fe582a'
                createText(ctx, 407, 608, text, 40, 174, 1)
                ctx.fillText(text, 407, 608)

                // 二维码
                const qrcode = await generateQrcode(380, share, 20, image, 0, 'canvas')
                console.log(qrcode)
                ctx.drawImage(qrcode, 0, 0, qrcode.width, qrcode.height, 134, 676, 380, 380)
                ctx.font = 'bold 24px Microsoft YaHei UI'
                ctx.fillStyle = '#333'
                ctx.textAlign = 'center'
                ctx.fillText('长按识别或保存二维码，分享给朋友吧！', 327, 1076)

                this.poster = canvas.toDataURL('image/jpeg', 0.9)
                this.$emit('done', this.poster)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" module>
.poster {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 10000;
}
.content {
    position: relative;
    width: max-content;
    height: max-content;
    > img {
        width: 654px;
        object-fit: cover;
    }
    > svg {
        position: absolute;
        left: 50%;
        bottom: -64px;
        transform: translateX(-50%);
        width: 48px;
        height: 48px;
        color: #fff;
    }
}

</style>
