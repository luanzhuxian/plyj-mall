<template>
    <pl-mask :show="show" @close="close">
        <img style="height: 70vh;" v-if="!loading" :src="poster" alt="">
        <pl-svg v-else class="loading" name="icon-loading" fill="#fff" height="45" />
    </pl-mask>
</template>

<script>
import { loadImage, createCanvas, generateQrcode, drawRoundRect, cutArcImage, createText } from '../../../assets/js/util'
import { mapGetters } from 'vuex'
export default {
    name: 'SignPoster',
    data () {
        return {
            poster: '',
            loading: false
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        // 海报背景图片，建议尺寸 1500 * 2269, 格式为jpg
        posterUrl: {
            type: String,
            default: ''
        },
        isShowLog: {
            type: Number,
            default: 0
        },
        logImgUrl: {
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
    computed: {
        ...mapGetters(['avatar', 'userName'])
    },
    watch: {
        async show (val) {
            if (val) {
                this.loading = true
                if (!this.poster) {
                    await this.createPoster()
                }
                this.loading = false
            }
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        async createPoster () {
            const { cvs, ctx } = createCanvas(this.w, this.h)
            // 白色背景
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, this.w, this.h)

            // 绘制海报图片
            const bg = await loadImage(this.posterUrl)
            ctx.drawImage(bg, 0, 0, this.w, 2269)

            // 绘制企业logo
            if (this.isShowLog) {
                let logo = await loadImage(this.logImgUrl)
                logo = await cutArcImage(logo)
                ctx.drawImage(logo, 30, 30, 160, 160)
            }

            // 绘制头像边框
            drawRoundRect({ ctx, x: 102, y: 2349, width: 264, height: 264, radius: 132, strokeStyle: '#fc4e15' })

            // 绘制圆形头像
            let userImg = await loadImage(this.avatar)
            userImg = await cutArcImage(userImg)
            ctx.drawImage(userImg, 128, 2372, 215, 215)
            // 绘制用户名、绘制文本
            ctx.font = '46px Microsoft YaHei'
            ctx.fillStyle = '#070707'
            ctx.fillText(`${ this.userName }`, 393, 2425)
            createText({ ctx, x: 393, y: 2499, text: '邀您一起打卡聪明年，领取奖励', lineHeight: 72, width: 320, lineNumber: 2 })

            // 绘制二维码边框
            drawRoundRect({ ctx, x: 793, y: 2349, width: 264, height: 264, radius: 28, strokeStyle: '#fc4e15', fillStyle: '#fff' })
            const qrcode = await generateQrcode({
                size: 300,
                text: location.href,
                type: 'canvas'
            })
            ctx.drawImage(qrcode, 822, 2374, 210, 210)

            // 绘制文本
            ctx.font = '46px Microsoft YaHei'
            ctx.fillStyle = '#070707'
            createText({ ctx, x: 1090, y: 2425, text: '长按识别或保存图片，分享给你的好友吧！', lineHeight: 72, width: 310, lineNumber: 3 })
            this.poster = cvs.toDataURL('image/jpeg', 0.8)
        }
    }
}
</script>

<style scoped lang="scss">
  .loading {
    &:global {
      animation: rotate 2s linear infinite;
    }
  }
</style>
