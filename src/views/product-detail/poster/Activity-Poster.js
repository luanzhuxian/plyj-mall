import Poster from './Poster'
import { loadImage } from '../../../assets/js/util'

/**
 * 活动海报的抽象类，不允许实例化
 */
export default class ActivityPoster extends Poster {
    // 商品名称颜色
    nameColor = '#fff'
    // 头部背景图片
    headerBg = ''
    constructor ({ headerBg, ...params }) {
        if (new.target.name === 'ActivityPoster') {
            throw new Error('ActivityPoster类不允许实例化，请实例化其子类')
        }
        super({ ...params })
        this.headerBg = headerBg
    }
    drawInfoBg () {
        this.CTX.fillStyle = '#FA4D2F'
        this.CTX.fillRect(0, 938, 1120, 408)
    }

    /**
     * 绘制头部
     */
    drawHeader (avatar) {
        loadImage(this.headerBg)
            .then(res => {
                this.CTX.drawImage(res, 0, 0, 1120, 192)
            })
            .catch(() => {})
    }
}
