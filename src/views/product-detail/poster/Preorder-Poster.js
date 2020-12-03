import ActivityPoster from './Activity-Poster'
import { createText, loadImage } from '../../../assets/js/util'

/**
 * 预购海报
 */
export default class PreorderPoster extends ActivityPoster {
    // “预交”两个字
    yujiaoIcon = ''
    // “元”字
    yuanIcon = ''
    // "抵扣"两个字
    dikouIcon = ''
    constructor ({ yujiaoIcon, yuanIcon, dikouIcon, ...params }) {
        super({ ...params })
        this.yujiaoIcon = yujiaoIcon
        this.yuanIcon = yuanIcon
        this.dikouIcon = dikouIcon
    }
    drawInfoBg () {
        this.CTX.fillStyle = '#FA4D2F'
        this.CTX.fillRect(0, 938, 1120, 408)
    }
    async drawPrice () {
        try {
            const CTX = this.CTX
            const yujiaoIcon = await loadImage(this.yujiaoIcon)
            const yuanIcon = await loadImage(this.yuanIcon)
            const dikouIcon = await loadImage(this.dikouIcon)
            CTX.drawImage(yujiaoIcon, 48, 1090, 144, 104)
            CTX.font = 'bolder 88px Arial'
            CTX.fillStyle = '#F9E687'
            CTX.textBaseline = 'hanging'
            const priceWidth = createText({
                ctx: CTX,
                x: 48 + 144 + 10,
                y: 1110,
                text: String(this.price)
            })
            CTX.drawImage(yuanIcon, 48 + 144 + priceWidth + 10, 1090, 72, 104)
            CTX.drawImage(dikouIcon, 48, 1210, 134, 96)
            CTX.fillStyle = '#fff'
            const originalPriceWidth = createText({
                ctx: CTX,
                x: 48 + 144 + 10,
                y: 1225,
                text: String(this.originalPrice)
            })
            CTX.drawImage(yuanIcon, 48 + 144 + 10 + originalPriceWidth + 10, 1210, 66, 96)
        } catch (e) {
            throw e
        }
    }
}
