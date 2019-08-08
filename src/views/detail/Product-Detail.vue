<template>
  <div :class="$style.lesson">
    <template v-if="productStatus !== 0">
      <!-- 海报按钮 -->
      <div :class="$style.haibao" @click="createHaibao">
        <pl-svg name="haibao" />
        <p>分享海报</p>
      </div>
      <DetailBanner
        :type="productType === 'FORMAL_CLASS' || productType === 'EXPERIENCE_CLASS' ? 'lesson' : 'product'"
        :banners="banners"
      />
      <DetailInfoBox :loading="loading">
        <info-header :detail="detail" />
        <DetailTitle v-text="detail.productName" />
        <DetailDesc v-text="detail.productDesc" />
        <Tags :tags="detail.labelModels" />
        <useful-life
          v-if="productType === 'FORMAL_CLASS' || productType === 'EXPERIENCE_CLASS' || productType === 'VIRTUAL_GOODS'"
          :start="detail.validityPeriodStart"
          :end="detail.validityPeriodEnd"
        />
      </DetailInfoBox>

      <Field v-if="productType === 'PHYSICAL_GOODS'" label="发货" content="普通快递" />
      <Field
        label="选择"
        :can-click="!noStock && detail.productStatus === 2"
        @click="showSpecifica = true"
      >
        <template v-if="currentModel.skuCode1Name">
          已选择：“<span v-text="currentModel.skuCode1Name" />
        </template>
        <template v-if="currentModel.skuCode2Name">，<i v-text="currentModel.skuCode2Name" /></template>”
        <span v-if="!currentModel.id">请选择规格</span>
      </Field>

      <div :class="$style.detailOrComment">
        <div :class="$style.tabs">
          <div :class="{ [$style.activeTab]: tab === 2 }" @click="tab = 2">
            商品详情
          </div>
          <div :class="{ [$style.activeTab]: tab === 1 }" @click="tab = 1">
            雅客评论({{ detail.assessmentCount }})
          </div>
        </div>

        <div>
          <Comments v-if="tab === 1" :product-id="productId" :show="tab === 1" />
          <DetailInfo
            v-if="tab === 2"
            :content="detail.detail || '暂无详情'"
          />
        </div>
      </div>
      <Instructions
        v-if="productType === 'FORMAL_CLASS' || productType === 'EXPERIENCE_CLASS' || productType === 'VIRTUAL_GOODS'"
        :content="detail.useDesc"
      />
    </template>

    <SoldOut v-else />

    <div style="background-color: #f4f5f9;">
      <you-like :product-id="productId" :is-my="true" />
    </div>

    <buy-now
      type="warning"
      ref="buyNow"
      :image="detail.productMainImage"
      :product-id="productId"
      :sku-list="detail.productSkuModels"
      :sku-attr-list="detail.productAttributes"
      :current-sku.sync="currentModel"
      :product-status="detail.productStatus"
      :confirm-text="confirmText"
      :limiting="limiting"
    />
    <specification-pop
      :default-count="defaultCount"
      :sku-list="detail.productSkuModels"
      :sku-attr-list="detail.productAttributes"
      :product-image="detail.productMainImage"
      :visible.sync="showSpecifica"
      :sku.sync="currentModel"
      :limiting="limiting"
    >
      <template v-slot:footer="{ currentSku }">
        <div :class="$style.buttons">
          <button
            :class="$style.add"
            :disabled="adding || noStock"
            @click="addToCart(currentSku)"
          >
            加入购物车
          </button>
          <button
            :class="$style.buy"
            :disabled="adding || noStock"
            @click="buyNow(currentSku)"
          >
            {{ confirmText }}
          </button>
        </div>
      </template>
    </specification-pop>

    <div :class="$style.buttomTip" v-if="!loading && productStatus === 1">
      该商品已下架
    </div>
    <div :class="$style.buttomTip" v-if="!loading && noStock">
      该商品已全部售罄，请选择其它商品购买
    </div>
    <transition name="fade">
      <div :class="$style.saveHaibao" v-if="showHaibao">
        <div :class="$style.saveHaibaoContent">
          <img :src="haibao" alt="">
          <div :class="$style.saveButton">
            长按识别或保存二维码，分享给朋友吧！
          </div>
          <pl-svg name="close3" color="#fff" @click="showHaibao = false;" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import DetailBanner from '../../components/detail/Banner.vue'
import DetailInfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'
import Tags from '../../components/detail/Tags.vue'
import UsefulLife from '../../components/detail/Useful-Life.vue'
import InfoHeader from '../../components/detail/Info-Header.vue'
import Instructions from '../../components/detail/Instructions.vue'
import Price from '../../components/Price.vue'
import Field from '../../components/detail/Field.vue'
import { getProductDetail } from '../../apis/product'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters, mapActions } from 'vuex'
import { GET_CART_COUNT } from '../../store/mutation-type'
import { addToCart } from '../../apis/shopping-cart'
import youLike from './../home/components/YouLike.vue'
import SoldOut from './Sold-Out.vue'
import { generateQrcode, cutImageCenter, cutArcImage } from '../../assets/js/util'
import Comments from './Comments.vue'
const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
export default {
  name: 'Lesson',
  components: {
    DetailBanner,
    DetailTitle,
    DetailDesc,
    DetailInfo,
    Price,
    Field,
    Tags,
    BuyNow,
    DetailInfoBox,
    SpecificationPop,
    youLike,
    SoldOut,
    Comments,
    UsefulLife,
    InfoHeader,
    Instructions
  },
  data () {
    return {
      banners: [],
      productStatus: 2,
      detail: {},
      productSkuModels: [],
      showSpecifica: false,
      currentModel: {}, // 当前选中的规格
      commentForm: {
        current: 1,
        size: 3,
        productId: ''
      },
      agentProduct: false,
      showHaibao: false,
      loading: false,
      adding: false,
      haibao: '',
      tab: 2,
      imgels: []
    }
  },
  props: {
    productId: {
      type: String,
      default: null
    },
    brokerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile']),
    noStock () {
      return this.productSkuModels.every(item => item.stock < item.minBuyNum)
    },
    defaultCount () {
      return this.currentModel.count || 1
    },
    limiting () {
      return this.detail.purchaseLimit ? (this.detail.purchaseQuantity) : 0
    },
    productType () {
      return this.detail.productType
    },
    confirmText () {
      let textMap = {
        FORMAL_CLASS: '立即学习',
        EXPERIENCE_CLASS: '立即报名'
      }
      return textMap[this.productType] || '立即购买'
    }
  },
  watch: {
    productId () {
      this.showSpecifica = false
      this.currentModel = {}
      this.haibao = ''
      this.tab = 2
      this.getDetail()
    }
  },
  activated () {
    try {
      this.getDetail()
    } catch (e) {
      throw e
    }
  },
  deactivated () {
    this.showSpecifica = false
    this.currentModel = {}
    this.haibao = ''
    this.showHaibao = false
    this.tab = 2
  },
  mounted () {
    // 进入页面后，存储brokerId，只要页面不关闭，这期间，购买的任何营销商品都算作helper的分享
    // 详情页只做存储，具体判断过程在点击立即购买和加入购物车时判断
    sessionStorage.setItem('shareBrokerId', this.brokerId || '')
  },
  methods: {
    ...mapActions({
      getCartCount: GET_CART_COUNT
    }),
    async getDetail () {
      try {
        this.loading = true
        this.resetState() // 重置一些状态
        let { result } = await getProductDetail(this.productId)
        let { id, agentProduct, mediaInfoIds, productStatus } = result
        if (!result) {
          this.$error('该商品异常')
          this.$router.go(-1)
          return
        }
        this.productStatus = productStatus
        this.commentForm.productId = id
        this.agentProduct = agentProduct
        // 所有图片
        this.banners = mediaInfoIds
        this.detail = result
        this.productSkuModels = result.productSkuModels
        this.currentModel = result.productSkuModels.find(item => item.minBuyNum <= item.stock) || result.productSkuModels[0]
        this.currentModel.count = result.productSkuModels[0].minBuyNum
        share({
          appId: this.appId,
          title: result.productName,
          desc: result.productDesc,
          link: window.location.href,
          imgUrl: result.productMainImage + '?x-oss-process=style/thum'
        })
        this.haibaoImg = await this.loadImage(result.productMainImage)
        // this.imgels = []
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    // async slideChange (imgs, index) {
    //   if (this.imgels.length < imgs.length) {
    //     for (let i of imgs) {
    //       i.crossOrigin = ''
    //       this.imgels.push(i.cloneNode(true))
    //     }
    //   }
    //   this.haibaoImg = this.imgels[0]
    //   // this.haibao = ''
    // },
    resetState () {
      this.currentModel = {}
      this.banners.splice(0, 1000000)
    },
    hasBind () {
      if (!this.mobile) {
        this.$confirm('您还没有绑定手机，请先绑定手机')
          .then(() => {
            localStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
              name: this.$route.name,
              params: this.$route.params,
              query: this.$route.query
            }))
            this.$router.push({ name: 'BindMobile' })
          })
          .catch(() => {})
        return false
      }
      return true
    },
    addToCart (selected) {
      if (!this.hasBind()) {
        return
      }
      this.currentModel = selected
      this.adding = true
      const { count, skuCode2 = '', skuCode1 } = selected
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId')
      return new Promise(async (resolve, reject) => {
        try {
          await addToCart({
            productId: this.productId,
            productCount: count,
            skuCode: skuCode1,
            skuCode2,
            agentUser: this.agentUser ? (shareBrokerId || this.userId) : (shareBrokerId || null) // 如果当前用户是经纪人，则覆盖其他经纪人的id
          })
          this.$success('已添加到购物车')
          this.showSpecifica = false
          this.getCartCount()
        } catch (e) {
          reject(e)
        } finally {
          this.adding = false
        }
      })
    },
    buyNow (selected) {
      if (!this.hasBind()) {
        return
      }
      this.currentModel = selected
      const { skuCode1, count, skuCode2 } = selected
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId')
      localStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: this.productId,
        count: count,
        skuCode1: skuCode1,
        skuCode2,
        agentUser: this.agentUser ? (shareBrokerId || this.userId) : (shareBrokerId || null) // 如果当前用户是经纪人，则覆盖其他经纪人的id
      }]))
      this.showSpecifica = false
      this.$router.push({
        name: 'SubmitOrder',
        query: {
          isCart: 'NO'
        }
      })
    },
    async createHaibao () {
      if (this.loading) {
        return
      }
      let img = this.haibaoImg
      if (!img) {
        this.$error('图片加载错误')
        return
      }
      this.showHaibao = true
      if (this.haibao) {
        return
      }
      // 截取头像
      let lodedAvatar
      try {
        lodedAvatar = await this.loadImage(this.avatar)
      } catch (e) {
        lodedAvatar = await this.loadImage(avatar)
      }
      const arcAvatar = cutArcImage(lodedAvatar)
      // 截取中间部分
      img = cutImageCenter(img)
      let canvas = document.createElement('canvas')
      canvas.width = 1120
      canvas.height = 1720
      let ctx = canvas.getContext('2d')
      // 绘制头部
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 1120, 192)
      ctx.drawImage(arcAvatar, 32, 32, 128, 128)
      fontStyle(ctx, 'bold 48px Microsoft YaHei UI', '#000', 'top')(ctx, 192, 74, this.userName, 68, 800, 1)
      // fontStyle(ctx, '48px Microsoft YaHei UI', '#666', 'top')(ctx, 192 + 32 + textWidth, 74, '发现了好东西要与你分享', 68)

      try {
        let min = Math.min(img.width, img.height)
        let qrcode = await generateQrcode(300, window.location.href, 0, img, 10, 'canvas')
        ctx.drawImage(img, 0, 0, min, min, 0, 192, 1120, 1120)
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 1312, 1120, 408)
        ctx.drawImage(qrcode, 750, 1352, 320, 320)
        // 填充商品名称
        let str = this.detail.productName
        fontStyle(ctx, '56px Microsoft YaHei UI', '#000', 'top')(ctx, 48, 1352, str, 80, 620, 2)
        // 填充价钱
        let priceList = this.detail.productSkuModels.map(item => item.price)
        let originalPriceList = this.detail.productSkuModels.map(item => item.originalPrice)
        let price = Math.min(...priceList)
        let originalPrice = Math.max(...originalPriceList)
        ctx.fillStyle = '#FE7700'
        ctx.fillText('¥', 48, 1564 + (76 - 56) / 2)
        fontStyle(ctx, 'bold 88px Microsoft YaHei UI', '#FE7700', 'top')(ctx, 96, 1544 + (104 - 88) / 2, String(price), 104)
        // 绘制原价
        if (originalPrice) {
          let priceWidth = ctx.measureText(price).width
          ctx.fillStyle = '#999'
          ctx.font = '56px Microsoft YaHei UI'
          ctx.fillText(`¥${originalPrice}`, 96 + priceWidth + 44, 1564 + (80 - 56) / 2)
          let originalPriceWidth = ctx.measureText(`¥${originalPrice}`).width
          ctx.save()
          // 设置删除线
          ctx.strokeStyle = '#999'
          ctx.beginPath()
          ctx.lineWidth = '4'
          ctx.moveTo(96 + priceWidth + 44, 1564 + (80 - 56) / 2 + 80 / 3)
          ctx.lineTo(96 + priceWidth + 44 + originalPriceWidth, 1564 + (80 - 56) / 2 + 80 / 3)
          ctx.stroke()
        }
        this.haibao = canvas.toDataURL('image/jpeg', 0.7)
      } catch (e) {
        throw e
      }
    },
    loadImage (src) {
      let img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = src + '?' + Date.now()
      return new Promise((resolve, reject) => {
        img.onload = () => {
          resolve(img)
        }
        img.onerror = (e) => {
          reject(new Error('图片加载错误'))
        }
      })
    }
  }
}

/**
 * 设置文字基本属性
 * @param ctx {CanvasRenderingContext2D} 2d context
 * @param font {String} 字体
 * @param color {String} 颜色
 * @param verticalAlign {String} 文字对齐方式
 * @returns {createText} {Function} 绘制文字的函数
 */
function fontStyle (ctx, font, color, verticalAlign) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textBaseline = verticalAlign
  return createText
}

/**
 * 绘制文本
 * @param ctx {CanvasRenderingContext2D} 2d context
 * @param x {Number} 文本开始的x坐标
 * @param y {Number} 文本开始的y坐标
 * @param width {Number} 每行文本的最大宽度
 * @param text {String} 文本
 * @param lineHeight {Number} 行高
 * @param lineNumber {Number} 行数（超过行数时，以...结尾）
 */
function createText (ctx, x, y, text, lineHeight, width, lineNumber) {
  // 填充商品名称
  let charArr = []
  let strArr = []
  let txtWidth = 0
  let lineCount = 0 // 文字行数
  let ellipsisWidth = ctx.measureText('...').width
  for (let i = 0; i < text.length; i++) {
    let char = text[i]
    charArr.push(char)
    txtWidth += ctx.measureText(char).width
    if (lineCount === lineNumber - 1 && txtWidth + ellipsisWidth >= width) {
      // 最后一行的文字
      charArr.push('...')
      strArr.push(charArr.join(''))
      break
    }
    // 文本换行
    if (txtWidth >= width || i === text.length - 1) {
      lineCount++
      strArr.push(charArr.join(''))
      txtWidth = 0
      charArr = []
    }
  }
  for (let [i, str] of strArr.entries()) {
    ctx.fillText(str, x, y + lineHeight * i)
  }
  return  ctx.measureText(strArr[0]).width
}
</script>

<style module lang="scss">
  .lesson {
    padding-bottom: 120px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    > button {
      width: 340px;
      line-height: 80px;
      color: #fff;
      font-size: 30px;
      border-radius: $--radius2;
    }
    .add {
      background-color: $--warning-color;
    }
    .buy {
      background-color: $--primary-color;
    }
  }
  .detailOrComment {
    margin-top: 20px;
    background-color: #fff;
  }
  .tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #e7e7e7;
    > div {
      width: max-content;
      font-size: 26px;
      color: #999;
      height: 90px;
      line-height: 90px;
      box-sizing: border-box;
      font-weight: bold;
      &.activeTab {
        color: #000;
        border-bottom: 2px solid #000;
      }
    }
  }
  .buttomTip {
    position: fixed;
    bottom: 130px;
    left: 50%;
    transform: translateX(-50%);
    width: 725px;
    line-height: 110px;
    background-color: rgba(0, 0, 0, .7);
    border-radius: 4px;
    font-size: 30px;
    text-align: center;
    color: #fff;
    z-index: 13;
    &:before {
      position: absolute;
      left: 78px;
      bottom: -28px;
      content: '';
      border: 14px solid transparent;
      border-top-color: rgba(0, 0, 0, .7);
    }
  }
  .haibao {
    position: fixed;
    right: 0;
    top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 84px;
    font-size: 16px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    z-index: 20;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    > svg {
      width: 33px;
    }
    > p {
      margin-top: 4px;
    }
  }
  .saveHaibao {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 10000;
    .saveHaibaoContent {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: max-content;
      height: max-content;
      > .saveButton {
        width: 560px;
        margin-top: -4px;
        text-align: center;
        line-height: 66px;
        font-size: 28px;
        color: #666;
        background-color: #FBFBFB;
      }
      > img {
        width: 560px;
        object-fit: cover;
      }
      > svg {
        position: absolute;
        top: -64px;
        right: 0;
        width: 48px;
        height: 48px;
        color: #fff;
      }
    }
  }
</style>
