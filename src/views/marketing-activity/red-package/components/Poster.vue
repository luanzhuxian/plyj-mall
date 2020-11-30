<template>
    <PlMask :show.sync="isShow">
        <div :class="$style.poster">
            <img :src="poster" alt="">
        </div>
    </PlMask>
</template>

<script>
import {
    loadImage,
    drawRoundRect,
    createText,
    generateQrcode
} from '../../../../assets/js/util'

export default {
    name: 'Poster',
    props: {
        show: Boolean,
        // 是否显示优惠券，详情展示
        showCoupon: Boolean,
        showLogo: Boolean,
        // 活动详情模板id: 0, 1, 2, 3
        bgIndex: {
            type: Number,
            default: 0
        },
        shareUrl: {
            type: String,
            default: ''
        },
        logoUrl: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        // 活动状态
        status: {
            type: Number,
            default: 0
        },
        amount: {
            type: Number,
            default: 0
        },
        useLimitAmount: {
            type: Number,
            default: 0
        },
        issueVolume: {
            type: Number,
            default: 0
        },
        claimVolume: {
            type: Number,
            default: 0
        },
        useStartTime: {
            type: String,
            default: ''
        },
        useEndTime: {
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
    watch: {
        show (val) {
            this.isShow = !!val
            if (val) {
                this.createPoster()
            }
        }
    },
    beforeDestroy () {
        this.poster = ''
    },
    deactivated () {
        this.poster = ''
    },
    methods: {
        close () {
            this.isShow = false
            this.$emit('update:show', false)
        },

        // 生成海报
        async createPoster () {
            if (this.poster) {
                this.isShow = true
                return
            }

            try {
                const {
                    showLogo,
                    logoUrl,
                    showCoupon,
                    bgIndex,
                    status,
                    name,
                    amount,
                    useLimitAmount,
                    issueVolume,
                    claimVolume,
                    useStartTime,
                    useEndTime,
                    shareUrl
                } = this

                // 背景色
                let bgc = ''
                // 背景图
                let bgi = ''
                let bgHeight
                if (showCoupon) {
                    switch (bgIndex) {
                        case 1:
                            bgc = '#077ce6'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-blue.png'
                            bgHeight = 468
                            break
                        case 2:
                            bgc = '#7e2ef1'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-purple.png'
                            bgHeight = 458
                            break
                        case 3:
                            bgc = '#f5b72f'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-yellow.png'
                            bgHeight = 466
                            break
                        default:
                            bgc = '#ff634d'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-red.png'
                            bgHeight = 467
                            break
                    }
                } else {
                    bgc = '#fd644c'
                    bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-main.png'
                    bgHeight = 420
                }

                const CVS = document.createElement('canvas')
                const CTX = CVS.getContext('2d')
                CVS.width = 750
                CVS.height = 1334

                // 绘制背景
                CTX.fillStyle = bgc
                CTX.fillRect(0, 0, CVS.width, CVS.height)
                const BGI = await loadImage(bgi)
                CTX.drawImage(BGI, 0, 0, 750, bgHeight)

                // 左上角图标
                if (showLogo && logoUrl) {
                    CTX.beginPath()
                    CTX.lineTo(0, 0)
                    CTX.lineTo(146, 0)
                    CTX.lineTo(0, 126)
                    CTX.closePath()
                    CTX.fillStyle = '#fff'
                    CTX.fill()
                    CTX.beginPath()
                    CTX.arc(41, 39, 33, 0, 2 * Math.PI)
                    CTX.fillStyle = '#FE461F'
                    CTX.closePath()
                    CTX.fill()
                    const LOGO = await loadImage(logoUrl)
                    CTX.drawImage(LOGO, 16, 12, 50, 50)
                }

                // 内容
                drawRoundRect({
                    ctx: CTX,
                    x: showCoupon ? 25 : 55,
                    y: showCoupon ? 470 : 500,
                    width: showCoupon ? 700 : 640,
                    height: showCoupon ? 794 : 734,
                    radius: 20,
                    fillStyle: '#fff'
                })
                if (showCoupon) {
                    // 绘制优惠券
                    const CONPON_BG = await loadImage('https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/coupon.png')
                    CTX.drawImage(CONPON_BG, 45, 500, 660, 190)

                    const unitWidth = CTX.measureText('￥').width
                    const amountWidth = CTX.measureText(amount).width
                    const unitStartX = (75 + Math.max(amountWidth, 100) / 2) - (unitWidth + amountWidth) / 2

                    CTX.font = 'bold 22px sans-serif'
                    CTX.fillStyle = '#F23D00'
                    CTX.textBaseline = 'hanging'
                    createText({
                        ctx: CTX,
                        x: unitStartX,
                        y: 114 + 470,
                        text: '￥',
                        lineHeight: 20
                    })
                    CTX.font = 'bold 42px sans-serif'
                    const W2 = createText({
                        ctx: CTX,
                        x: unitStartX + 20,
                        y: 96 + 470,
                        text: `${ amount }`,
                        lineHeight: 54
                    })
                    // 虚线
                    CTX.beginPath()
                    CTX.setLineDash([2, 5])
                    CTX.moveTo(Math.max(W2, 100) + 115 + 20, 62 + 470)
                    CTX.lineTo(Math.max(W2, 100) + 115 + 20, 62 + 470 + 128)
                    CTX.strokeStyle = '#FDAC85'
                    CTX.closePath()
                    CTX.stroke()
                    CTX.font = 'bold 24px sans-serif'
                    createText({
                        ctx: CTX,
                        x: 115 + Math.max(W2, 100) + 1 + 20 + 35,
                        y: 85 + 470,
                        text: `满${ useLimitAmount }可抵${ amount }`,
                        lineHeight: 32
                    })
                    CTX.font = 'normal 20px sans-serif'
                    CTX.fillStyle = '#F19874'
                    if (status === 1) {
                        createText({
                            ctx: CTX,
                            x: 116,
                            y: 150 + 470,
                            text: `仅剩${ issueVolume - claimVolume }张`,
                            lineHeight: 28
                        })
                    }
                    createText({
                        ctx: CTX,
                        x: 115 + Math.max(W2, 100) + 1 + 20 + 35,
                        y: 118 + 470,
                        text: name,
                        lineHeight: 28
                    })
                    createText({
                        ctx: CTX,
                        x: 115 + Math.max(W2, 100) + 1 + 20 + 35,
                        y: 152 + 470,
                        text: `使用时间：${ useStartTime.split(' ')[0].replace(/-/g, '.') }-${ useEndTime.split(' ')[0].replace(/-/g, '.') }`,
                        lineHeight: 28
                    })
                    // 按钮
                    const grd = CTX.createLinearGradient(0, 0, 0, 80)
                    grd.addColorStop(0, '#F58A2D')
                    grd.addColorStop(1, '#EC3E01')
                    CTX.fillStyle = grd

                    drawRoundRect({
                        ctx: CTX,
                        x: 75,
                        y: 720,
                        width: 600,
                        height: 80,
                        radius: 40,
                        fillStyle: grd
                    })
                    CTX.font = 'normal 30px sans-serif'
                    CTX.fillStyle = '#fff'
                    CTX.textAlign = 'center'
                    CTX.fillText('数量有限  立即领取', 375, 745)
                    CTX.font = 'normal 36px sans-serif'
                    CTX.fillStyle = '#ffef7e'
                    CTX.fillText('小金额 大额券 边逛边优惠', 375, 145)
                }
                // 二维码
                CTX.setLineDash([])
                CTX.lineWidth = 5
                drawRoundRect({
                    ctx: CTX,
                    x: showCoupon ? 225 : 176,
                    y: showCoupon ? 838 : 620,
                    width: showCoupon ? 300 : 400,
                    height: showCoupon ? 300 : 400,
                    radius: 20,
                    strokeStyle: '#F23D00',
                    fillStyle: '#fff'
                })
                const QR = await generateQrcode({ size: showCoupon ? 220 : 320, text: shareUrl, type: 'canvas' })
                showCoupon ? CTX.drawImage(QR, 266, 880, 220, 220) : CTX.drawImage(QR, 216, 660, 320, 320)
                CTX.font = 'normal 30px sans-serif'
                CTX.fillStyle = '#333'
                CTX.textAlign = 'center'
                CTX.fillText('长按识别领取优惠', 375, showCoupon ? 1170 : 1130)

                // 生成图片
                this.poster = CVS.toDataURL('image/jpeg', 0.9)
                this.isShow = true
                this.$emit('done', this.poster)
                return this.poster
            } catch (error) {
                throw error
            }
        }
    }
}
</script>

<style lang="scss" module>
.poster {
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
