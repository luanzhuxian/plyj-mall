<template>
  <div :class="$style.lesson">
    <template v-if="productStatus !== 0">
      <!-- 海报按钮 -->
      <div :class="$style.haibao" @click="createHaibao">
        <pl-svg name="haibao" />
        <p>分享海报</p>
      </div>
      <DetailBanner @slideChange="slideChange" :banners="banners" />
      <DetailInfoBox :loading="loading">
        <div :class="$style.priceBox">
          <div :class="$style.priceLeft">
            <div :class="$style.price">
              <i v-text="minPrice" />
              <template v-if="minPrice !== maxPrice">
                ~ <i v-text="maxPrice" />
              </template>
            </div>
            <div :class="$style.count">
              <del v-text="maxOriginalPrice" />
              <span v-if="detail.salesVolume === 0 && detail.productStatus === 2">正在热销中</span>
              <template v-else-if="detail.salesVolume > 0 && detail.salesVolume < 10 || detail.productStatus === 1">
                <span v-text="detail.pageviews" />人关注
              </template>
              <template v-else-if="detail.salesVolume >= 10">
                <span v-text="detail.salesVolume" />人购买
              </template>
            </div>
          </div>
          <div :class="$style.priceRight" v-if="agentUser && (minRebate || maxRebate)">
            <p class="fz-22 gray-1">
              <span :class="$style.returnRunbi">
                润笔
              </span>
              <i v-if="minRebate" v-text="minRebate" />
              <i v-if="minRebate && maxRebate && minRebate !== maxRebate">~</i>
              <i v-if="maxRebate && minRebate !== maxRebate" v-text="maxRebate" />
            </p>
            <p class="fz-22 gray-3">
              分享下单即可获得润笔
            </p>
          </div>
        </div>
        <DetailTitle v-text="detail.productName" />
        <DetailDesc v-text="detail.productDesc" />
        <Tags :tags="detail.labelModels" />
      </DetailInfoBox>

      <Field v-if="productType === 'PHYSICAL_GOODS'" label="发货" content="普通快递" />
      <Field
        label="选择"
        :can-click="!noStock && detail.productStatus === 2"
        @click="showSpecifica = true"
      >
        <template v-if="currentModel.skuCode1Name">
          已选择：<span v-text="currentModel.skuCode1Name" />
        </template>
        <template v-if="currentModel.skuCode2Name">
          ,<i v-text="currentModel.skuCode2Name" />
        </template>
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
          <Comments v-show="tab === 1" :product-id="productId" :show="tab === 1" />
          <!--<Comment v-show="tab === 1" :size="3" :product-id="productId" :broker-id="brokerId" />-->
          <DetailInfo
            v-show="tab === 2"
            :content="detail.detail || '暂无详情'"
          />
        </div>
      </div>
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
            立即购买
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
import Price from '../../components/Price.vue'
import Field from '../../components/detail/Field.vue'
import { getProductDetail } from '../../apis/product'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters, mapActions } from 'vuex'
import { GET_CART_COUNT } from '../../store/mutation-type'
import { addToCart } from '../../apis/shopping-cart'
import youLike from './../old-home/YouLike.vue'
import SoldOut from './Sold-Out.vue'
import { generateQrcode, cutImageCenter } from '../../assets/js/util'
import Comments from './Comments.vue'

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
    Comments
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
      tab: 2
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
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId']),
    currentPrice () {
      return this.currentModel.price || this.productSkuModels[0].price
    },
    currentOriginalPrice () {
      return this.currentModel.originalPrice || this.productSkuModels[0].originalPrice
    },
    noStock () {
      return this.productSkuModels.every(item => item.stock < item.minBuyNum)
    },
    defaultCount () {
      return this.currentModel.count
    },
    limiting () {
      return Number(this.detail.purchaseQuantity) || 0
    },
    rebateList () {
      return this.productSkuModels.map(item => item.realRebate) || []
    },
    maxRebate () {
      return Math.max(...this.rebateList)
    },
    minRebate () {
      return Math.min(...this.rebateList)
    },
    priceList () {
      return this.productSkuModels.map(item => item.price) || []
    },
    originalPriceList () {
      return this.productSkuModels.map(item => item.originalPrice) || []
    },
    maxPrice () {
      return Math.max(...this.priceList)
    },
    minPrice () {
      return Math.min(...this.priceList)
    },
    maxOriginalPrice () {
      return Math.max(...this.originalPriceList)
    },
    productType () {
      return this.detail.productType
    }
  },
  watch: {
    productId () {
      this.showSpecifica = false
      this.currentModel = {}
      this.haibao = ''
      this.getDetail()
    }
  },
  activated () {
    this.getDetail()
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
        this.productStatus = productStatus
        this.commentForm.productId = id
        this.agentProduct = agentProduct
        // 所有图片
        this.banners = mediaInfoIds
        this.detail = result
        this.productSkuModels = result.productSkuModels
        share({
          appId: this.appId,
          title: result.productName,
          desc: result.productDesc,
          link: window.location.href,
          imgUrl: result.productMainImage + '?x-oss-process=style/thum'
        })
        // 加载一张图片，为生成海报备用
        this.haibaoImg = await this.loadImage(this.detail.mediaInfoIds[0])
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async slideChange (index) {
      if (!this.showHaibao) {
        this.haibaoImg = await this.loadImage(this.detail.mediaInfoIds[index])
        this.haibao = ''
      }
    },
    resetState () {
      this.currentModel = {}
      this.banners.splice(0, 1000000)
    },
    addToCart (selected) {
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
            agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
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
      this.currentModel = selected
      const { skuCode1, count, skuCode2 } = selected
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId')
      localStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: this.productId,
        count: count,
        skuCode1: skuCode1,
        skuCode2,
        agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
      }]))
      this.showSpecifica = false
      this.$router.push({
        name: 'SubmitOrder',
        query: {
          isCart: false
        }
      })
    },
    async createHaibao () {
      let img = this.haibaoImg
      if (!img) {
        this.$error('图片加载错误')
        return
      }
      this.showHaibao = true
      if (this.haibao) {
        return
      }
      // 截取中间部分
      img = cutImageCenter(img)
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = 1120
      canvas.height = 1528
      try {
        let min = Math.min(img.width, img.height)
        let qrcode = await generateQrcode(300, window.location.href, null, 'canvas')
        ctx.drawImage(img, 0, 0, min, min, 0, 0, 1120, 1120)
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 1120, 1120, 408)
        ctx.drawImage(qrcode, 750, 1160, 320, 320)
        ctx.font = '56px Microsoft YaHei UI'
        ctx.fillStyle = '#000'
        ctx.textBaseline = 'top'
        // 填充商品名称
        let str = this.detail.productName
        let charArr = []
        let strArr = []
        let txtWidth = 0
        let lineCount = 0 // 文字行数
        for (let i = 0; i < str.length; i++) {
          let char = str[i]
          charArr.push(char)
          txtWidth += ctx.measureText(char).width
          if (txtWidth >= 620 || i === str.length - 1) {
            lineCount++
            // 行数等于2时，停止循环，并将最后一个字符替换为...
            if (lineCount === 2) charArr.splice(-1, 1, '...')
            // 文本换行
            strArr.push(charArr.join(''))
            if (lineCount === 2) break
            txtWidth = 0
            charArr = []
          }
        }
        let lineHeight = 80
        for (let [i, str] of strArr.entries()) {
          ctx.fillText(str, 48, 1160 + lineHeight * i)
        }
        // 填充价钱
        let minSku = this.detail.productSkuModels[0]
        let price = minSku.price
        let originalPrice = minSku.originalPrice
        ctx.fillStyle = '#FE7700'
        // 1372 + (76 - 56) / 2 文字距离顶部的距离 + 行高的一半，下同
        ctx.fillText('¥', 48, 1372 + (76 - 56) / 2)
        ctx.font = 'bold 88px Microsoft YaHei UI'
        ctx.fillText(price, 96, 1352 + (104 - 88) / 2)
        if (originalPrice) {
          let priceWidth = ctx.measureText(price).width
          ctx.fillStyle = '#999'
          ctx.font = '56px Microsoft YaHei UI'
          ctx.fillText(`¥${originalPrice}`, 96 + priceWidth + 44, 1372 + (80 - 56) / 2)
          let originalPriceWidth = ctx.measureText(`¥${originalPrice}`).width
          ctx.save()
          // 设置删除线
          ctx.strokeStyle = '#999'
          ctx.beginPath()
          ctx.lineWidth = '4'
          ctx.moveTo(96 + priceWidth + 44, 1372 + (80 - 56) / 2 + 80 / 3)
          ctx.lineTo(96 + priceWidth + 44 + originalPriceWidth, 1372 + (80 - 56) / 2 + 80 / 3)
          ctx.stroke()
        }
        this.haibao = canvas.toDataURL('image/jpeg', 0.7)
      } catch (e) {
        throw e
      }
    },
    loadImage (src) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.crossOrigin = ''
        img.src = src
        img.onload = () => {
          resolve(img)
        }
        img.onerror = (e) => {
          console.log(e)
          reject(e)
        }
      })
    }
  }
}
</script>

<style module lang="scss">
  .lesson {
    padding-bottom: 120px;
  }
  .priceBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: start;

  }
  .priceLeft {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
  }
  .price {
    line-height: 48px;
    margin-bottom: 4px;
    color: #FE7700;
    font-size: 40px;
    &:before {
      content: '¥';
      font-size: 24px;
    }
  }
  .priceRight {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 5px;
    > p {
      margin-top: 6px;
    }
    .returnRunbi {
      display: inline-block;
      width: 60px;
      height: 28px;
      line-height: 28px;
      margin-right: 10px;
      text-align: center;
      color: #fff;
      font-size: 18px;
      background-color: #FE7700;
      border-radius: 13px;
    }
  }
  .count {
    font-size: 24px;
    color: #999999;
    del {
      margin-right: 32px;
      &:before {
        content: '¥';
      }
    }
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
    &:before {
      position: absolute;
      left: 78px;
      bottom: -26px;
      content: '';
      border: 13px solid transparent;
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
        height: 764px;
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
