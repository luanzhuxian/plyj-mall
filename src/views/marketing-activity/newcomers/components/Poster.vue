<template>
    <div :class="$style.poster">
        <div :class="$style.entry" @click="generate">
            <pl-svg v-show="loading" name="icon-btn-loading" width="20" fill="#fff" class="rotate" />
            活动海报
        </div>
        <pl-mask :show.sync="show">
            <img :class="$style.posterImage" :src="poster" alt="">
        </pl-mask>
    </div>
</template>

<script>
import { loadImage, cutArcImage, drawRoundRect, createText, generateQrcode } from '../../../../assets/js/util'
import { mapGetters } from 'vuex'
export default {
    name: 'Rules',
    data () {
        return {
            show: false,
            poster: '',
            loading: false
        }
    },
    props: {
        showLogo: Boolean,
        logo: {
            type: String,
            default: ''
        },
        shareUrl: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['logoUrl', 'avatar', 'userName', 'mallUrl'])
    },
    methods: {
        async generate () {
            if (this.poster) {
                this.show = true
                return
            }
            try {
                this.loading = true
                const CVS = document.createElement('canvas')
                const CTX = CVS.getContext('2d')
                const BG = await loadImage('https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser-bg.jpg')
                CVS.width = 540
                CVS.height = 900

                // 绘制背景
                CTX.fillStyle = '#FA8E59'
                CTX.fillRect(0, 0, 540, 900)
                CTX.drawImage(BG, 0, 0, 540, 468)

                // 绘制logo
                if ((this.logo || this.logoUrl) && this.showLogo) {
                    CTX.beginPath()
                    CTX.lineWidth = 24
                    CTX.strokeStyle = '#fbefd7'
                    CTX.moveTo(-10, 94)
                    CTX.lineTo(94, -10)
                    CTX.stroke()
                    CTX.lineWidth = 1
                    let logo = await loadImage(this.logo || this.logoUrl)
                    logo = cutArcImage(logo)
                    CTX.drawImage(logo, 10, 10, 66, 66)
                }

                // 绘制顶部文字
                CTX.font = `40px Micorsoft Yahei`
                CTX.textAlign = 'center'
                CTX.textBaseline = 'hanging'
                CTX.fillStyle = '#fff'
                CTX.fillText(this.name, CVS.width / 2, 85)
                drawRoundRect({
                    ctx: CTX,
                    fillStyle: '#FBEFD7',
                    radius: 20,
                    width: 318,
                    height: 48,
                    x: 116,
                    y: 155
                })
                CTX.font = `20px Micorsoft Yahei`
                CTX.fillStyle = '#FC6E1F'
                createText({
                    ctx: CTX,
                    x: CVS.width / 2,
                    y: 170,
                    text: '新人优惠大礼包 惊喜派送',
                    lineHeight: 48
                })

                // 绘制白框
                drawRoundRect({
                    ctx: CTX,
                    fillStyle: '#fff',
                    radius: 20,
                    width: 456,
                    height: 400,
                    x: 42,
                    y: 464
                })
                // 绘制头像
                let avatar = await loadImage(this.avatar)
                avatar = cutArcImage(avatar)
                CTX.drawImage(avatar, 72, 482, 60, 60)

                CTX.font = `bold 24px Micorsoft Yahei`
                CTX.fillStyle = '#FB5A18'
                CTX.textAlign = 'left'
                const TEXT = `${ this.userName }邀请你参与新人有礼活动`
                const TEXT_WIDTH = CTX.measureText(TEXT).width
                createText({
                    ctx: CTX,
                    text: TEXT,
                    width: 312,
                    lineHeight: 32,
                    x: 148,
                    y: TEXT_WIDTH > 312 ? 485 : 500,
                    lineNumber: 2
                })
                const qrcode = await generateQrcode({
                    size: 500,
                    correctLevel: 3,
                    text: this.shareUrl,
                    type: 'canvas'
                })
                CTX.drawImage(qrcode, 196, 574, 142, 142)
                CTX.font = `24px Micorsoft Yahei`
                CTX.fillStyle = '#707070'
                CTX.textAlign = 'center'
                createText({
                    ctx: CTX,
                    text: '长按保存图片/扫描二维码',
                    lineHeight: 32,
                    x: CVS.width / 2,
                    y: 756
                })
                createText({
                    ctx: CTX,
                    text: '参与新人有礼活动并分享给好友',
                    lineHeight: 32,
                    x: CVS.width / 2,
                    y: 794
                })

                this.poster = CVS.toDataURL('image/jpeg', 0.9)
                this.loading = false
                this.show = true
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style module lang="scss">
    .poster {
        position: absolute;
        right: 0;
        top: 276px;
        > .entry {
            width: max-content;
            padding: 0 15px;
            line-height: 50px;
            color: #fff;
            font-size: 24px;
            text-align: center;
            border-radius: 25px 0 0 25px;
            background-color: #FA8E59;
            > svg {
                vertical-align: -2px;
            }
        }
        .posterImage {
            width: 540px;
        }
    }
</style>
