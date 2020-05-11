<template>
    <div
        :class="{ [$style.codeItem]: true, [$style.used]: statusCode !== 0 }"
        :key="i"
    >
        <div>
            <div :class="$style.codeBox">
                <code :class="$style.codeValue">
                    {{ redeemCode | separator(' ', 4) }}
                </code>
                <span :class="$style.codeStatus" v-text="status" />
            </div>
            <div :class="$style.whoUse" v-show="!collapseQrCode && name">
                <pl-svg name="icon-name-card" :fill="statusCode !== 0 ? '#e1e1e1' : '#ccc'" />
                <span :class="{ [$style.name]: true }" v-text="name" />
                <span :class="{ [$style.phone]: true }" v-text="mobile" />
            </div>
        </div>
        <div :class="$style.shareCode" v-if="statusCode === 0">
            <div :class="$style.shareButton" @click="drawPoster(detail)">分享</div>
        </div>
    </div>
</template>

<script>
import { generateQrcode } from '../../../../assets/js/util'
import { createText } from '../../../../assets/js/validate'
import filter from '../../../../filter/index'
export default {
    name: 'OrderCodeItem',
    props: {
        collapseQrCode: Boolean,
        detail: {
            type: Object,
            default () {
                return {}
            }
        },
        goodsModel: {
            type: Object,
            default () {
                return {}
            }
        },
        status: {
            type: Number,
            default: 0
        },
        statusCode: {
            type: Number,
            default: 0
        },
        redeemCode: {
            type: Number,
            default: 0
        },
        name: {
            type: String,
            default: ''
        },
        mobile: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            isPosterShow: false,
            poster: ''
        }
    },
    methods: {
        async drawPoster () {
            const start = this.goodsModel.validityPeriodStart.split(' ')[0]
            const end = this.goodsModel.validityPeriodEnd.split(' ')[0]
            const qrcode = await generateQrcode({ size: 300, text: `${ this.detail.redeemCode }` })
            const mulitImg = [
                `https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/1.9.4/0C18FB91-C64E-4364-A391-1532CD691009.png?time=${ Date.now() }`,
                `${ qrcode }`,
                `${ this.goodsModel.img }?time=${ Date.now() }&x-oss-process=style/thum`
            ]
            const promiseAll = []; const img = []; const imgTotal = mulitImg.length
            for (let i = 0; i < imgTotal; i++) {
                promiseAll[i] = new Promise((resolve, reject) => {
                    img[i] = new Image()
                    img[i].crossOrigin = ''
                    img[i].src = mulitImg[i]
                    img[i].onload = function () {
                        // 第i张加载完成
                        resolve(img[i])
                    }
                })
            }
            Promise.all(promiseAll).then(img => {
                // 全部加载完成
                const canvas = document.createElement('canvas')
                canvas.width = img[0].width
                canvas.height = img[0].height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img[0], 0, 0, canvas.width, canvas.height)
                ctx.font = 'bold 42px Microsoft YaHei'
                ctx.fillStyle = '#666'
                if (!start && !end) {
                    ctx.fillText(`使用有效期 长期有效`, 65, 210)
                } else if (start === end) {
                    ctx.fillText(`使用有效期至 ${ start }`, 65, 210)
                } else {
                    ctx.fillText(`使用有效期 ${ start } 至 ${ end }`, 65, 210)
                }
                ctx.font = 'bold 78px Microsoft YaHei'
                ctx.fillStyle = '#333'
                ctx.textAlign = 'center'
                ctx.fillText(`${ filter.separator(this.detail.redeemCode, ' ', 4) }`, 526, 880)
                ctx.font = '42px Microsoft YaHei'
                ctx.fillStyle = '#666'
                ctx.textAlign = 'left'
                ctx.fillText(`学员姓名：`, 265, 990)
                ctx.font = '600 42px Microsoft YaHei'
                ctx.fillStyle = '#333'
                ctx.fillText(`${ this.detail.name }`, 475, 990)
                ctx.font = '42px Microsoft YaHei'
                ctx.fillStyle = '#666'
                ctx.textAlign = 'left'
                ctx.fillText(`学员电话：`, 265, 1070)
                ctx.font = '600 42px Microsoft YaHei'
                ctx.fillStyle = '#333'
                ctx.fillText(`${ this.detail.mobile }`, 475, 1070)
                ctx.font = '33px Microsoft YaHei'
                ctx.fillStyle = '#333'
                createText(ctx, 330, 1250, `${ this.goodsModel.name }`, 50, 500, 2)
                ctx.font = '33px Microsoft YaHei'
                ctx.fillStyle = '#333'
                ctx.textAlign = 'right'
                ctx.fillText(`￥${ this.goodsModel.sellingPrice }`, 990, 1250)
                ctx.fillStyle = '#999'
                ctx.fillText(`x${ this.goodsModel.count }`, 990, 1300)
                ctx.fillStyle = '#f9f9f9'
                ctx.fillRect(330, 1340, 600, 60)
                const skuText = this.goodsModel.subSku ? this.goodsModel.sku + this.goodsModel.subSku : this.goodsModel.sku
                ctx.textAlign = 'left'
                ctx.fillStyle = '#999'
                ctx.fillText(`${ skuText }`, 350, 1380)
                if (!this.detail.name) {
                    ctx.fillStyle = '#fff'
                    ctx.fillRect(210, 920, 700, 200)
                }
                ctx.drawImage(img[1], 330, 350, 400, 400)
                ctx.drawImage(img[2], 60, 1215, 248, 248)
                this.$emit('drawPoster', canvas.toDataURL('image/jpeg', 0.7))
            })
        }
    }
}
</script>

<style module lang="scss">
  .code-item {
    display: flex;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e7e7e7;

    .share-code {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20px;

      .share-button {
        color: #FFFFFF;
        font-size: 24px;
        font-weight: 400;
        padding: 2px 10px;
        background: #FE7700;
        border-radius: 4px;
      }
    }

    &:nth-last-of-type(1) {
      border-bottom: none;
      margin: 0;
      padding: 0;
    }

    .code-box {
      .code-value {
        font-size: 32px;
      }

      .code-status {
        margin-left: 5px;
        font-size: 24px;
        vertical-align: 2px;
      }
    }

    .who-use {
      margin-top: 6px;
      line-height: 34px;

      > svg {
        width: 34px;
        height: 34px;
        margin-right: 8px;
        vertical-align: -4px;
      }

      > span {
        font-size: 24px;
        color: #666;

        &.name {
          margin-right: 20px;
        }
      }
    }
  }

  .used {
    .code-value, .code-status {
      color: #ccc;
    }

    .who-use {
      > span {
        color: #ccc;
      }
    }
  }
</style>
