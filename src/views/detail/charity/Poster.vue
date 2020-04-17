<template>
    <div :class="$style.poster" v-if="show">
        <div :class="$style.content">
            <img :src="poster" alt="">
            <pl-svg name="icon-close3" fill="#fff" width="48" @click="close" />
        </div>
    </div>
</template>

<script>
import {
    generateQrcode,
    cutImageCenter,
    cutArcImage,
    loadImage
    // createText
} from '../../../assets/js/util'

const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
const background = 'https://mallcdn.youpenglai.com/static/mall/2.9.0/charity-product-poster.png'

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
        poster: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
        share: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },

        // 生成海报
        async createPoster (type) {
            let img = this.poster

            const bg = await loadImage(background)

            // 截取头像
            let lodedAvatar
            try {
                lodedAvatar = await loadImage(this.avatar)
            } catch (e) {
                lodedAvatar = await loadImage(avatar)
            }
            const arcAvatar = cutArcImage(lodedAvatar)

            // 截取中间部分
            img = cutImageCenter(img, 750 / 500)
            const canvas = document.createElement('canvas')
            canvas.width = 1120
            canvas.height = 1346
            const ctx = canvas.getContext('2d')

            // 绘制头部
            // ctx.fillStyle = '#fff'
            // ctx.fillRect(0, 0, 1120, 192)
            ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, 654, 1156)
            ctx.font = 'bold 48px Microsoft YaHei UI'
            // ctx.fillStyle = '#000'
            // createText(ctx, 192, 120, this.userName, 68, 800, 1)
            try {
                // 二维码
                const qrcode = await generateQrcode(380, this.share, 20, img, 0, 'canvas')
                console.log(arcAvatar, qrcode)

                // // 商品图片
                // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 192, 1120, 746)
                // if (type !== 1 && this.preActivity === 2) {
                //     ctx.fillStyle = '#FA4D2F'
                // } else {
                //     ctx.fillStyle = '#fff'
                // }
                // ctx.fillRect(0, 938, 1120, 408)
                // ctx.drawImage(qrcode, 750, 978, 320, 320)

                // // 填充商品名称
                // // let str = this.detail.courseName
                // const line = ((type !== 1 && this.preActivity === 2) || this.courseType === 2) ? 1 : 2
                // const { sellingPrice: price, originalPrice, totalLiveNumber } = this.detail
                // ctx.textBaseline = 'top'
                // ctx.font = '56px Microsoft YaHei UI'
                // ctx.fillStyle = '#000'

                // // 商品名称
                // createText(ctx, 49, 978, this.detail.courseName, 80, 620, line)
                // if (this.courseType === 2) {
                //     ctx.font = '48px Microsoft YaHei UI'
                //     ctx.fillStyle = '#999'
                //     ctx.fillText(`包含${ totalLiveNumber }节课程`, 48, 1058)
                // }

                // // 填充价钱
                // if (price) {
                //     ctx.fillStyle = '#FE7700'
                //     ctx.fillText('¥', 48, 1190 + (76 - 56) / 2)
                //     ctx.font = 'bold 88px Microsoft YaHei UI'
                //     createText(ctx, 96, 1170 + (104 - 88) / 2, String(price), 104)
                // } else {
                //     ctx.fillStyle = '#FE7700'
                //     ctx.font = 'bold 88px Microsoft YaHei UI'
                //     createText(ctx, 48, 1190 + (76 - 56) / 2, '免费', 104)
                // }

                // // 绘制原价
                // if (originalPrice && originalPrice !== price) {
                //     const priceWidth = ctx.measureText(price).width
                //     ctx.fillStyle = '#999'
                //     ctx.font = '56px Microsoft YaHei UI'
                //     ctx.fillText(`¥${ originalPrice }`, 96 + priceWidth + 44, 1190 + (80 - 56) / 2)
                //     const originalPriceWidth = ctx.measureText(`¥${ originalPrice }`).width
                //     ctx.save()

                //     // 设置删除线
                //     ctx.strokeStyle = '#999'
                //     ctx.beginPath()
                //     ctx.lineWidth = '4'
                //     ctx.moveTo(96 + priceWidth + 44, 1190 + (80 - 56) / 2 + 80 / 3)
                //     ctx.lineTo(96 + priceWidth + 44 + originalPriceWidth, 1190 + (80 - 56) / 2 + 80 / 3)
                //     ctx.stroke()
                // }
                this.haibao = canvas.toDataURL('image/jpeg', 0.7)
                this.showHaibao = true
            } catch (e) {
                throw e
            } finally {
                this.creating = false
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
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
    width: max-content;
    height: max-content;
    > img {
        width: 654px;
        object-fit: cover;
    }
    > svg {
        position: absolute;
        top: -64px;
        right: 0;
        width: 48px;
        height: 48px;
        color: #fff;
    }
}

</style>
