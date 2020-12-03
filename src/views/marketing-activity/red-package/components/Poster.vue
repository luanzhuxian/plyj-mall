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
    cutArcImage,
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
                const CVS = document.createElement('canvas')
                const CTX = CVS.getContext('2d')
                const DPR = window.devicePixelRatio
                CVS.width = 750 * DPR
                CVS.height = 1334 * DPR
                // 背景色
                let bgc = ''
                // 背景图
                let bgi = ''
                let bgHeight
                if (showCoupon) {
                    switch (bgIndex) {
                        case 0:
                            bgc = '#077ce6'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-blue.png'
                            bgHeight = 468 * DPR
                            break
                        case 1:
                            bgc = '#7e2ef1'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-purple.png'
                            bgHeight = 458 * DPR
                            break
                        case 2:
                            bgc = '#f5b72f'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-yellow.png'
                            bgHeight = 466 * DPR
                            break
                        default:
                            bgc = '#ff634d'
                            bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-red.png'
                            bgHeight = 467 * DPR
                            break
                    }
                } else {
                    bgc = '#fd644c'
                    bgi = 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-main.png'
                    bgHeight = 420 * DPR
                }

                // 绘制背景
                CTX.fillStyle = bgc
                CTX.fillRect(0, 0, CVS.width, CVS.height)
                const BGI = await loadImage(bgi)
                CTX.drawImage(BGI, 0, 0, 750 * DPR, bgHeight)

                // 左上角图标
                if (showLogo && logoUrl) {
                    CTX.beginPath()
                    CTX.lineTo(0, 0)
                    CTX.lineTo(146 * DPR, 0)
                    CTX.lineTo(0, 126 * DPR)
                    CTX.closePath()
                    CTX.fillStyle = '#fff'
                    CTX.fill()
                    CTX.beginPath()
                    CTX.arc(41 * DPR, 39 * DPR, 33 * DPR, 0, 2 * Math.PI)
                    CTX.fillStyle = '#FE461F'
                    CTX.closePath()
                    CTX.fill()
                    const LOGO = await loadImage(logoUrl)
                    CTX.drawImage(cutArcImage(LOGO), 8 * DPR, 6 * DPR, 66 * DPR, 66 * DPR)
                    // CTX.save()
                    // CTX.arc(41, 39, 33, 0, 2 * Math.PI)
                    // CTX.clip()
                    // CTX.drawImage(LOGO, 0, 0, 66, 66)
                    // CTX.restore()
                }

                // 内容
                drawRoundRect({
                    ctx: CTX,
                    x: (showCoupon ? 25 : 55) * DPR,
                    y: (showCoupon ? 470 : 500) * DPR,
                    width: (showCoupon ? 700 : 640) * DPR,
                    height: (showCoupon ? 794 : 734) * DPR,
                    radius: 20 * DPR,
                    fillStyle: '#fff'
                })
                if (showCoupon) {
                    // 绘制优惠券
                    const CONPON_BG = await loadImage('https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/coupon.png')
                    CTX.drawImage(CONPON_BG, 45 * DPR, 500 * DPR, 660 * DPR, 190 * DPR)
                    CTX.font = `bold ${ 22 * DPR }px sans-serif`
                    // 总额
                    CTX.fillStyle = '#F23D00'
                    CTX.textBaseline = 'hanging'
                    createText({
                        ctx: CTX,
                        x: 94 * DPR,
                        y: (114 + 470) * DPR,
                        text: '￥',
                        lineHeight: 20 * DPR
                    })
                    CTX.font = `bold ${ 42 * DPR }px sans-serif`
                    const AMOUNT_WIDTH = createText({
                        ctx: CTX,
                        x: (94 + 20) * DPR,
                        y: (96 + 470) * DPR,
                        text: `${ amount }`,
                        lineHeight: 54 * DPR
                    })
                    // 剩余
                    CTX.font = `normal ${ 20 * DPR }px sans-serif`
                    CTX.fillStyle = '#F19874'
                    let COUNT_WIDTH = 0
                    if (status === 1) {
                        COUNT_WIDTH = createText({
                            ctx: CTX,
                            x: 116 * DPR,
                            y: (150 + 470) * DPR,
                            text: `仅剩${ issueVolume - claimVolume }张`,
                            lineHeight: 28 * DPR
                        })
                    }
                    // 虚线的横坐标
                    const LINE_START = Math.max(AMOUNT_WIDTH, COUNT_WIDTH)
                    // 虚线
                    CTX.beginPath()
                    CTX.lineWidth = 2 * DPR
                    CTX.setLineDash([2 * DPR, 5 * DPR])
                    CTX.moveTo(LINE_START + (116 + 35) * DPR, (62 + 470) * DPR)
                    CTX.lineTo(LINE_START + (116 + 35) * DPR, (62 + 470 + 128) * DPR)
                    CTX.strokeStyle = '#FDAC85'
                    CTX.closePath()
                    CTX.stroke()
                    CTX.setLineDash([])

                    // 满减额
                    CTX.font = `bold ${ 24 * DPR }px sans-serif`
                    CTX.fillStyle = '#F23D00'
                    createText({
                        ctx: CTX,
                        x: LINE_START + (116 + 2 + 35 * 2) * DPR,
                        y: (85 + 470) * DPR,
                        text: `满${ useLimitAmount }可抵${ amount }`,
                        lineHeight: 32 * DPR
                    })
                    // 名称
                    CTX.font = `normal ${ 20 * DPR }px sans-serif`
                    CTX.fillStyle = '#F19874'
                    createText({
                        ctx: CTX,
                        x: LINE_START + (116 + 2 + 35 * 2) * DPR,
                        y: (118 + 470) * DPR,
                        text: name,
                        lineHeight: 28 * DPR
                    })
                    // 使用时间
                    createText({
                        ctx: CTX,
                        x: LINE_START + (116 + 2 + 35 * 2) * DPR,
                        y: (152 + 470) * DPR,
                        text: `使用时间：${ useStartTime.split(' ')[0].replace(/-/g, '.') }-${ useEndTime.split(' ')[0].replace(/-/g, '.') }`,
                        lineHeight: 28 * DPR
                    })
                    // 按钮
                    const grd = CTX.createLinearGradient(76 * DPR, 725 * DPR, 76 * DPR, (725 + 80) * DPR)
                    grd.addColorStop(0, '#F58A2D')
                    grd.addColorStop(1, '#EC3E01')
                    CTX.fillStyle = grd
                    drawRoundRect({
                        ctx: CTX,
                        x: 75 * DPR,
                        y: 720 * DPR,
                        width: 600 * DPR,
                        height: 80 * DPR,
                        radius: 40 * DPR,
                        fillStyle: grd
                    })
                    CTX.font = `normal ${ 30 * DPR }px sans-serif`
                    CTX.fillStyle = '#fff'
                    CTX.textAlign = 'center'
                    CTX.fillText('数量有限  立即领取', 375 * DPR, 745 * DPR)
                    CTX.font = `normal ${ 36 * DPR }px sans-serif`
                    CTX.fillStyle = '#ffef7e'
                    CTX.fillText('小金额 大额券 边逛边优惠', 375 * DPR, 145 * DPR)
                }
                // 二维码
                CTX.lineWidth = 5 * DPR
                drawRoundRect({
                    ctx: CTX,
                    x: (showCoupon ? 225 : 176) * DPR,
                    y: (showCoupon ? 838 : 620) * DPR,
                    width: (showCoupon ? 300 : 400) * DPR,
                    height: (showCoupon ? 300 : 400) * DPR,
                    radius: 20 * DPR,
                    strokeStyle: '#F23D00',
                    fillStyle: '#fff'
                })
                const QR = await generateQrcode({ size: (showCoupon ? 220 : 320) * DPR, text: shareUrl, type: 'canvas' })
                showCoupon
                    ? CTX.drawImage(QR, 266 * DPR, 880 * DPR, 220 * DPR, 220 * DPR)
                    : CTX.drawImage(QR, 216 * DPR, 660 * DPR, 320 * DPR, 320 * DPR)
                CTX.font = `normal ${ 30 * DPR }px sans-serif`
                CTX.fillStyle = '#333'
                CTX.textAlign = 'center'
                CTX.fillText('长按识别领取优惠', 375 * DPR, (showCoupon ? 1170 : 1130) * DPR)

                // 生成图片
                this.poster = CVS.toDataURL('image/jpeg')
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
