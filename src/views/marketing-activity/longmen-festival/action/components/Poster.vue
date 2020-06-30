<template>
    <pl-mask :show.sync="isShow">
        <div :class="$style.content">
            <img :src="poster" alt="">
        </div>
    </pl-mask>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    generateQrcode,
    cutArcImage,
    loadImage,
    createText
} from '../../../../../assets/js/util'

export default {
    name: 'Poster',
    props: {
        show: Boolean,
        share: {
            type: String,
            default: ''
        },
        showLogo: Boolean,
        logoUrl: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            isShow: false,
            poster: ''
        }
    },
    computed: {
        ...mapGetters(['userName', 'avatar'])
    },
    watch: {
        show (val) {
            this.isShow = !!val
            if (val) {
                this.createPoster()
            }
        }
    },
    methods: {
        close () {
            this.isShow = false
            this.$emit('update:show', false)
        },

        // 生成海报
        async createPoster (type) {
            if (this.poster) {
                this.isShow = true
                return
            }
            try {
                const defaultAvatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
                const background = 'https://mallcdn.youpenglai.com/static/mall/2.9.0/公益行动海报.png'
                const { avatar, userName, share } = this

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
                const canvas = document.createElement('canvas')
                canvas.width = 654
                canvas.height = 982
                const ctx = canvas.getContext('2d')

                // 背景、头像
                ctx.drawImage(bg, 0, 0, 654, 982)
                ctx.drawImage(arcAvatar, 280, 292, 96, 96)

                // logo
                if (this.showLogo) {
                    const img = await loadImage(this.logoUrl)
                    ctx.save()
                    ctx.arc(50, 48, 34, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, 16, 14, 68, 68)
                    ctx.restore()
                }

                // 用户名
                ctx.font = '28px Microsoft YaHei UI'
                ctx.fillStyle = '#333'
                ctx.textAlign = 'center'
                createText({
                    ctx,
                    x: 327,
                    y: 460,
                    text: userName,
                    lineHeight: 40,
                    width: 542
                })

                ctx.font = 'bold 32px Microsoft YaHei UI'
                ctx.fillStyle = '#ff8400'
                ctx.textAlign = 'center'
                ctx.fillText('邀请你一起参与公益助力活动', 327, 508)

                // 二维码
                const qrcode = await generateQrcode({ size: 330, text: share, centerPadding: 10, type: 'canvas', imageSize: 150 })
                ctx.drawImage(qrcode, 218, 595, 220, 220)

                this.poster = canvas.toDataURL('image/jpeg', 0.9)
                this.isShow = true

                this.$emit('done', this.poster)
                return this.poster
            } catch (e) { throw e }
        }
    }
}
</script>

<style lang="scss" module>

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
