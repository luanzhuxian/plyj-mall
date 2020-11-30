import {
    createText,
    loadImage,
    generateQrcode,
    cutArcImage
} from '../../../assets/js/util'

/**
 * 商品海报类，用于生成海报
 */
export default class Poster {
    // 封面
    cover = ''
    // 商品名称
    productName = ''
    // 价格
    price = 0
    // 原价
    originalPrice = 0
    // 默认头像
    defaultAvatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
    // 头像URL
    avatar = ''
    // 昵称
    nickname = ''
    // 生成二维码链接
    shareUrl = ''
    // 商品名称颜色
    nameColor = '#000'
    constructor ({ cover, productName, price, originalPrice, avatar, nickname, shareUrl }) {
        this.cover = cover
        this.productName = productName
        this.price = price
        this.originalPrice = originalPrice
        this.avatar = avatar
        this.nickname = nickname
        this.shareUrl = shareUrl
        this.CVS = document.createElement('canvas')
        this.CVS.width = 1120
        this.CVS.height = 1346
        this.CTX = this.CVS.getContext('2d')
    }

    // 创建
    async create () {
        try {
            const cover = await this.drawCover()
            const avatar = await this.getAvatar()
            this.drawHeader(avatar)
            this.drawInfoBg()
            await this.drawName()
            const qrcode = await this.generateQrcode(cover)
            await this.drawQrCode(qrcode)
            await this.drawPrice()
            return this.CVS.toDataURL('image/jpeg', 1)
        } catch (e) {
            throw e
        }
    }

    /**
     * 绘制封面
     * @return {Promise<CanvasImageSource>}
     */
    async drawCover () {
        try {
            const cover = await loadImage(this.cover)
            this.CTX.drawImage(cover, 0, 0, cover.width, cover.height, 0, 192, 1120, 746)
            return cover
        } catch (e) {
            throw e
        }
    }

    /**
     * 绘制头部
     */
    drawHeader (avatar) {
        const CTX = this.CTX
        CTX.fillStyle = '#fff'
        CTX.fillRect(0, 0, 1120, 192)
        CTX.drawImage(avatar, 32, 32, 128, 128)
        CTX.font = 'bold 48px Microsoft YaHei UI'
        CTX.fillStyle = '#000'
        CTX.textBaseline = 'top'
        createText({
            ctx: CTX,
            x: 192,
            y: 74,
            text: this.nickname,
            lineHeight: 68,
            width: 800
        })
    }

    /**
     * 绘制商品名称
     */
    drawName () {
        const CTX = this.CTX
        CTX.font = '56px Microsoft YaHei UI'
        CTX.fillStyle = this.nameColor
        CTX.textBaseline = 'top'
        createText({
            ctx: CTX,
            x: 48,
            y: 978,
            text: this.productName,
            lineHeight: 80,
            width: 620,
            lineNumber: 2
        })
    }

    /**
     * 绘制底部背景
     */
    drawInfoBg () {
        this.CTX.fillStyle = '#fff'
        this.CTX.fillRect(0, 938, 1120, 408)
    }

    /**
     * 绘制二维码
     * @param qrcode {CanvasImageSource}
     */
    async drawQrCode (qrcode) {
        try {
            const CTX = this.CTX
            CTX.drawImage(qrcode, 750, 978, 320, 320)
        } catch (e) {
            throw e
        }
    }

    /**
     * 绘制价格
     */
    drawPrice () {
        const CTX = this.CTX
        let priceWidth = 0
        CTX.fillStyle = '#FE7700'
        CTX.textBaseline = 'top'
        if (Number(this.price) > 0) {
            CTX.fillText('¥', 48, 1190 + (76 - 56) / 2)
            CTX.font = 'bold 88px Microsoft YaHei UI'
            priceWidth = createText({
                ctx: CTX,
                x: 96,
                y: 1170 + (104 - 88) / 2,
                text: String(this.price),
                lineHeight: 104
            })
        } else {
            CTX.font = 'bold 88px Microsoft YaHei UI'
            priceWidth = createText({
                ctx: CTX,
                x: 48,
                y: 1170 + (76 - 56) / 2,
                text: '免费',
                lineHeight: 104
            })
        }

        // 绘制原价
        if (this.originalPrice && this.originalPrice !== this.price) {
            CTX.fillStyle = '#999'
            CTX.font = '56px Microsoft YaHei UI'
            CTX.fillText(`¥${ this.originalPrice }`, priceWidth + 110, 1190 + (80 - 56) / 2)
            const originalPriceWidth = CTX.measureText(`¥${ this.originalPrice }`).width
            CTX.save()

            // 设置删除线
            CTX.strokeStyle = '#999'
            CTX.beginPath()
            CTX.lineWidth = '4'
            CTX.moveTo(priceWidth + 110, 1190 + (80 - 56) / 2 + 80 / 3)
            CTX.lineTo(priceWidth + 110 + originalPriceWidth, 1190 + (80 - 56) / 2 + 80 / 3)
            CTX.stroke()
        }
    }

    /**
     * 获取头像，如果头像加载失败，就加载默认的头像
     * @return {Promise<CanvasImageSource>}
     */
    async getAvatar () {
        return new Promise((resolve, reject) => {
            loadImage(this.avatar)
                .then(img => {
                    resolve(cutArcImage(img))
                })
                .catch(() => {
                    loadImage(this.defaultAvatar)
                        .then(img => {
                            resolve(cutArcImage(img))
                        })
                        .catch(e => {
                            reject(e)
                        })
                })
        })
    }

    /**
     * 生成二维码
     * @param img {CanvasImageSource}
     * @return {Promise<CanvasImageSource>}
     */
    async generateQrcode (img) {
        try {
            return generateQrcode({
                size: 300,
                text: this.shareUrl,
                padding: 15,
                img,
                centerPadding: 10,
                type: 'canvas'
            })
        } catch (e) {
            throw e
        }
    }
}
