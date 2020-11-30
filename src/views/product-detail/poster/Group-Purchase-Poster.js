import ActivityPoster from './Activity-Poster'
import { createText, loadImage } from '../../../assets/js/util'

/**
 * 团购海报
 */
export default class GroupPurchasePoster extends ActivityPoster {
    // 最大价格
    maxPrice = 0
    // “团购价”三个字
    tuanIcon = ''
    // “元”字
    yuanIcon = ''
    // "原价"两个字
    originalPriceIcon = ''
    constructor ({ maxPrice, tuanIcon, yuanIcon, originalPriceIcon, ...params }) {
        super({ ...params })
        this.maxPrice = maxPrice
        this.tuanIcon = tuanIcon
        this.yuanIcon = yuanIcon
        this.originalPriceIcon = originalPriceIcon
    }
    drawInfoBg () {
        this.CTX.fillStyle = '#FA4D2F'
        this.CTX.fillRect(0, 938, 1120, 408)
    }
    async drawPrice () {
        try {
            const CTX = this.CTX
            const tuanIcon = await loadImage(this.tuanIcon)
            const yuanIcon = await loadImage(this.yuanIcon)
            const originalPriceIcon = await loadImage(this.originalPriceIcon)
            CTX.drawImage(tuanIcon, 48, 1090, 240, 104)
            CTX.font = 'bolder 88px Arial'
            CTX.fillStyle = '#F9E687'
            CTX.textBaseline = 'hanging'
            const priceWidth = createText({
                ctx: CTX,
                x: 48 + 240 + 10,
                y: 1105,
                text: String(this.price)
            })
            CTX.drawImage(yuanIcon, 48 + 240 + priceWidth + 10, 1090, 72, 104)
            CTX.drawImage(originalPriceIcon, 48, 1210, 134, 96)
            CTX.fillStyle = '#fff'
            const originalPriceWidth = createText({
                ctx: CTX,
                x: 48 + 144 + 10,
                y: 1220,
                text: String(this.maxPrice)
            })
            CTX.drawImage(yuanIcon, 48 + 144 + 10 + originalPriceWidth + 10, 1210, 66, 96)
        } catch (e) {
            throw e
        }
    }
}
