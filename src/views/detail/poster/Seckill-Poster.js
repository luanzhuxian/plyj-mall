import ActivityPoster from './Activity-Poster'
import { createText, loadImage } from '../../../assets/js/util'

/**
 * 秒杀海报
 */
export default class SeckillPoster extends ActivityPoster {
    // 最大价格
    maxPrice = 0
    // “秒杀价”三个字
    sekillIcon = ''
    // “元”字
    yuanIcon = ''
    // "原价"两个字
    originalPriceIcon = ''
    constructor ({ maxPrice, sekillIcon, yuanIcon, originalPriceIcon, ...params }) {
        super({ ...params })
        this.maxPrice = maxPrice
        this.sekillIcon = sekillIcon
        this.yuanIcon = yuanIcon
        this.originalPriceIcon = originalPriceIcon
    }
    async drawPrice () {
        try {
            const CTX = this.CTX
            const sekillIcon = await loadImage(this.sekillIcon)
            const yuanIcon = await loadImage(this.yuanIcon)
            const originalPriceIcon = await loadImage(this.originalPriceIcon)
            CTX.drawImage(sekillIcon, 48, 1090, 240, 104)
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
