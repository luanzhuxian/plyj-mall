<template>
  <div :class="$style.lesson">
    <template v-if="productStatus !== 0">
      <!-- 海报按钮 -->
      <div :class="$style.haibao" @click="createHaibao(detail.activeProduct)">
        <pl-svg name="haibao" />
        <p>分享海报</p>
      </div>
      <!-- 商品banner -->
      <DetailBanner :banners="banners" />
      <!-- 团购倒计时条 -->
      <TogetherBar :detail="detail" v-if="detail.activeProduct === 2 && detail.preActivity !== 0" />
      <!-- 秒杀倒计时条 -->
      <SecondBar :detail="detail" v-if="detail.activeProduct === 3 && detail.preActivity !== 0" />
      <!-- 预购倒计时条 -->
      <BookingBar :detail="detail" v-if="detail.activeProduct === 4 && detail.preActivity !== 0" />
      <!-- 商品基本信息 -->
      <DetailInfoBox :loading="loading">
        <!-- 加个 润笔 购买数量，关注人数 登信息 -->
        <info-header :detail="detail" v-if="detail.activeProduct === 1" />
        <!-- 团购信息 -->
        <TogetherPrice :detail="detail" v-if="detail.activeProduct === 2 && detail.preActivity !== 0" />
        <!-- 秒杀信息 -->
        <SecondPrice :detail="detail" v-if="detail.activeProduct === 3 && detail.preActivity !== 0" />
        <!-- 预购信息 -->
        <BookingPrice :detail="detail" v-if="detail.activeProduct === 4 && detail.preActivity !== 0" />
        <!-- 开售倒计时 -->
        <count-down
          size="large"
          @done="countFinished"
          :class="$style.countDown"
          v-if="detail.shoppingStatus === 1 && detail.activeProduct === 1"
          :starttime="detail.serverTime"
          :endtime="detail.shoppingTimeLong"
        />
        <!-- 商品名称 -->
        <DetailTitle :active-product="detail.activeProduct" :activity-tag="detail.activityProductModel && detail.activityProductModel.activityTag" :product-name="detail.productName" />
        <!-- 商品描述 -->
        <DetailDesc v-text="detail.productDesc" />
        <!-- 商品标签 -->
        <Tags :tags="detail.labelModels" />
        <!-- 使用期限 -->
        <useful-life
          v-if="productType === 'FORMAL_CLASS' || productType === 'EXPERIENCE_CLASS' || productType === 'VIRTUAL_GOODS'"
          :start="detail.activeProduct === 4 ? detail.activityProductModel.useStartTime : detail.validityPeriodStart"
          :end="detail.activeProduct === 4 ? detail.activityProductModel.useEndTime : detail.validityPeriodEnd"
        />
      </DetailInfoBox>

      <Field
        v-if="productType === 'PHYSICAL_GOODS'"
        label="发货"
        :label-width="120"
        content="普通快递"
      />

      <Field
        label="选择"
        :label-width="120"
        :can-click="!noStock && detail.productStatus === 2"
        @click="showSpecifica = true; activeType = 1"
      >
        <template v-if="currentModel.skuCode1Name">
          已选择：“<span v-text="currentModel.skuCode1Name" />
        </template>
        <template v-if="currentModel.skuCode2Name">，<i v-text="currentModel.skuCode2Name" /></template>”
        <span v-if="!currentModel.id">请选择规格</span>
      </Field>

      <Field
        v-if="couponList.length && detail.preActivity !== 2"
        label="优惠券"
        can-click
        :label-width="120"
        @click="showCoupon = true"
      >
        <span style="color: #FE7700;" v-text="couponText" />
      </Field>

      <TogetherRule v-if="detail.activeProduct === 2 || detail.activeProduct === 4" :active-product="detail.activeProduct" :activity-brief="detail.activityProductModel.activityBrief" />

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

      <!-- 使用说明 -->
      <Instructions
        v-if="productType === 'FORMAL_CLASS' || productType === 'EXPERIENCE_CLASS' || productType === 'VIRTUAL_GOODS'"
        :content="detail.useDesc"
      />

      <!-- 品宣入口 -->
      <div v-if="showBranding" :class="$style.pingxuan" @click="$router.push({ name: 'Appointment', query: { showStatus: 'ALL' } })">
        <div :class="$style.pingxuanLeft">
          <div :class="$style.mallName" v-text="mallName" />
          <div :class="$style.mallDesc" v-text="mallDesc" />
        </div>
        <div :class="$style.pingxuanMiddle">
          <img :src="logoUrl" alt="">
        </div>
        <div :class="$style.pingxuanRight">
          <pl-icon name="icon-arrow-right" color="#ccc" :size="20" />
        </div>
      </div>
    </template>

    <!-- 售罄 -->
    <SoldOut v-else />
    <!-- 猜你喜欢 -->
    <div style="background-color: #f4f5f9;">
      <you-like :product-id="productId" :is-my="true" />
    </div>

    <!--底部购买按钮  -->
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
      :disable-confrim="confirmText === '暂未开售'"
      :limiting="limiting"
      :active-product="detail.activeProduct"
      :activity-product-model="detail.activityProductModel || null"
      :pre-activity="detail.preActivity"
    />

    <!-- 规格弹框 -->
    <specification-pop
      :default-count="defaultCount"
      :sku-list="detail.productSkuModels"
      :sku-attr-list="detail.productAttributes"
      :product-image="detail.productMainImage"
      :visible.sync="showSpecifica"
      :sku.sync="currentModel"
      :limiting="limiting"
      :active-product="detail.activeProduct"
      :activity-product-model="detail.activityProductModel || null"
      :pre-activity="detail.preActivity"
      :active-type="activeType"
    >
      <template v-slot:footer="{ currentSku }">
        <div :class="$style.buttons" v-if="detail.activeProduct === 2 && detail.preActivity === 2">
          <button
            :class="$style.add"
            :disabled="adding || noStock"
            @click="buyNow(currentSku, 1)"
          >
            单独购买
            <div :class="$style.btnText">¥ {{ currentSku.price }}</div>
          </button>
          <button
            :class="$style.buy"
            :disabled="adding || noStock || (detail.serverTime - detail.shoppingTimeLong < 0)"
            @click="buyNow(currentSku, 2)"
          >
            我要参团
            <div :class="$style.text">¥ {{ detail.activityProductModel.price }}</div>
          </button>
        </div>
        <!-- 秒杀商品下单 -->
        <div :class="$style.buttons" v-else-if="detail.activeProduct === 3 && detail.preActivity === 2">
          <button
            :class="$style.add"
            :disabled="adding || noStock"
            @click="buyNow(currentSku, 1)"
          >
            原价购买
            <div :class="$style.btnText">¥ {{ currentSku.price }}</div>
          </button>
          <button
            :class="$style.buy"
            :disabled="adding || noStock || (detail.serverTime - detail.shoppingTimeLong < 0)"
            @click="buyNow(currentSku, 3)"
          >
            立即秒杀
            <div :class="$style.text">¥ {{ detail.activityProductModel.price }}</div>
          </button>
        </div>
        <!-- 预购商品下单 -->
        <div :class="$style.button" v-else-if="detail.activeProduct === 4 && detail.preActivity === 2">
          <button
            :class="$style.preBtn"
            :disabled="adding || noStock || (detail.serverTime - detail.shoppingTimeLong < 0)"
            @click="buyNow(currentSku, 4)"
          >
            定金购买
            <div :class="$style.btnText">¥ {{ detail.activityProductModel.price }}</div>
          </button>
        </div>
        <div :class="$style.buttons" v-else>
          <button
            :class="$style.add"
            :disabled="adding || noStock"
            @click="addToCart(currentSku)"
          >
            加入购物车
          </button>
          <button
            :class="$style.buy"
            :disabled="adding || noStock || (detail.serverTime - detail.shoppingTimeLong < 0)"
            @click="buyNow(currentSku, 1)"
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
    <!-- 海报弹框 -->
    <transition name="fade">
      <div :class="$style.saveHaibao" v-if="showHaibao">
        <div :class="$style.saveHaibaoContent">
          <img :src="haibao" alt="">
          <div :class="$style.saveButton" v-if="detail.activeProduct === 1">
            长按识别或保存二维码，分享给朋友吧！
          </div>
          <div :class="$style.saveButton1" v-else>
            长按识别或保存二维码，分享给朋友吧！
          </div>
          <pl-svg name="close3" color="#fff" @click="showHaibao = false;" />
        </div>
      </div>
    </transition>

    <!-- 优惠券弹框 -->
    <pl-popup
      :show.sync="showCoupon"
      title="领取优惠券"
      title-align="left"
    >
      <div :class="$style.coupon">
        <p class="fz-28 gray-3">先领优惠券，购物更划算</p>
        <div :class="$style.couponList">
          <template v-for="(item, i) of couponList">
            <CouponItem
              :key="i"
              :name="item.couponName"
              :amount="item.amount"
              :full="item.useLimitAmount"
              :subtract="item.amount"
              :instruction="item.brief"
              :use-end-time="item.useEndTime"
              :use-start-time="item.useStartTime"
              :receive-count="item.count"
              @couponClick="couponClick(item.id)"
            />
          </template>
        </div>
      </div>
    </pl-popup>
  </div>
</template>

<script>
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
import Field from '../../components/detail/Field.vue'
import { getProductDetail, getCouponInDetail } from '../../apis/product'
import { receiveCoupon } from '../../apis/my-coupon'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters, mapActions } from 'vuex'
import { GET_CART_COUNT } from '../../store/mutation-type'
import { addToCart } from '../../apis/shopping-cart'
import youLike from './../home/components/YouLike.vue'
import SoldOut from './Sold-Out.vue'
import { generateQrcode, cutImageCenter, cutArcImage } from '../../assets/js/util'
import Comments from './Comments.vue'
import CountDown from '../../components/product/Count-Down.vue'
import CouponItem from '../../components/item/Coupon-Item.vue'
import TogetherBar from './together/Together-Bar'
import SecondBar from './second/Second-Bar'
import BookingBar from './booking/Booking-Bar'
import TogetherRule from './together/Together-Rule'
import TogetherPrice from './together/Together-Price'
import SecondPrice from './second/Second-Price'
import BookingPrice from './booking/Booking-Price'
const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
export default {
  name: 'Lesson',
  components: {
    TogetherPrice,
    SecondPrice,
    BookingPrice,
    TogetherRule,
    TogetherBar,
    SecondBar,
    BookingBar,
    DetailBanner,
    DetailTitle,
    DetailDesc,
    DetailInfo,
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
    Instructions,
    CountDown,
    CouponItem
  },
  data () {
    return {
      banners: [],
      couponList: [],
      productStatus: 2,
      detail: {},
      productSkuModels: [],
      showSpecifica: false,
      showCoupon: false,
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
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
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
      if (this.detail.serverTime - this.detail.shoppingTimeLong < 0) {
        return '暂未开售'
      }
      return textMap[this.productType] || '立即购买'
    },
    showBranding () {
      return this.detail.showBranding === 1
    },
    couponText () {
      let text = ''
      this.couponList.map((item, index) => {
        text += `满${item.useLimitAmount}减¥${item.amount}${index === this.couponList.length - 1 ? '' : '、'}`
      })
      return text
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
  async activated () {
    try {
      await this.getDetail()
      await this.getCouponList()
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
    this.showCoupon = false
  },
  async mounted () {
    // 其他人的分享id
    let otherShareId = sessionStorage.getItem('shareBrokerId') || ''
    let { brokerId, userId, mallDomain, productId } = this
    let { protocol, host } = location
    let selfUrl = `${protocol}//${host}/${mallDomain}/detail/lesson/${productId}/${userId}`
    // 本地没有分享id，设置本地分享id，设置的本地分享id可以是他人的，也可以是自己的
    if (!otherShareId) {
      if (brokerId && brokerId !== userId) {
        // 携带有他人分享id时，先把他人的id保存起来，然后再替换成当前用户的id
        // 既能保证分享出去的时当前用户，又能保证购买的时他人分享的
        sessionStorage.setItem('shareBrokerId', brokerId || '')
        location.replace(selfUrl)
      } else if (brokerId === userId) {
        sessionStorage.setItem('shareBrokerId', userId || '')
      } else {
        location.replace(selfUrl)
      }
    } else {
      if (!brokerId) {
        location.replace(selfUrl)
        return
      }
      if (brokerId !== userId) {
        sessionStorage.setItem('shareBrokerId', brokerId || '')
        location.replace(selfUrl)
      }
    }
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
    // 获取优惠券
    async getCouponList () {
      try {
        let { result } = await getCouponInDetail()
        this.couponList = result
      } catch (e) {
        throw e
      }
    },
    async couponClick (id) {
      try {
        await receiveCoupon({ couponId: id })
        this.$success('领取成功')
        await this.getCouponList()
      } catch (e) {
        throw e
      }
    },
    resetState () {
      this.currentModel = {}
      this.banners.splice(0, 1000000)
    },
    hasBind () {
      if (!this.mobile) {
        this.$confirm('您还没有绑定手机，请先绑定手机')
          .then(() => {
            sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
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
            agentUser: shareBrokerId || this.userId || null // 如果当前用户是经纪人，则覆盖其他经纪人的id
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
    buyNow (selected, activeType) {
      if (!this.hasBind()) {
        return
      }
      this.currentModel = selected
      const { skuCode1, count, skuCode2, price } = selected
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId')
      sessionStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: this.productId,
        count: count,
        skuCode1: skuCode1,
        skuCode2,
        price,
        agentUser: shareBrokerId || this.userId || null // 如果当前用户是经纪人，则覆盖其他经纪人的id
      }]))
      this.showSpecifica = false
      this.$router.push({
        name: 'SubmitOrder',
        query: {
          isCart: 'NO',
          activeProduct: activeType,
          activityId: this.detail.activeProduct === 1 ? '' : this.detail.activityProductModel.activityId
        }
      })
    },
    async createHaibao (type) {
      if (this.loading) {
        return
      }
      let img = this.haibaoImg
      if (!img) {
        this.$error('图片加载错误')
        return
      }
      if (this.haibao) {
        this.showHaibao = true
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
      const allImgs = [
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/poster3.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/poster2.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/poster1.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/dikou-1571393161453.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/original_price-1571393161453.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/second_price-1571393161453.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/tuan_price-1571393161453.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yuan-1571393161453.png'),
        this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yujiao-1571393161453.png')
      ]
      const res = await Promise.all(allImgs)
      const tuanBg = res[0]
      const miaoBg = res[1]
      const yugouBg = res[2]
      const dikou = res[3]
      const original_price = res[4]
      const second_price = res[5]
      const tuan_price = res[6]
      const yuan = res[7]
      const yujiao = res[8]
      // 截取中间部分
      img = cutImageCenter(img)
      let canvas = document.createElement('canvas')
      canvas.width = 1120
      canvas.height = 1720
      let ctx = canvas.getContext('2d')
      if (type === 1) {
        // 绘制头部
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, 1120, 192)
        ctx.drawImage(arcAvatar, 32, 32, 128, 128)
        fontStyle(ctx, 'bold 48px Microsoft YaHei UI', '#000', 'top')(ctx, 192, 74, this.userName, 68, 800, 1)
        // fontStyle(ctx, '48px Microsoft YaHei UI', '#666', 'top')(ctx, 192 + 32 + textWidth, 74, '发现了好东西要与你分享', 68)
      }
      if (type === 2) {
        ctx.drawImage(tuanBg, 0, 0, 1120, 192)
      }
      if (type === 3) {
        ctx.drawImage(miaoBg, 0, 0, 1120, 192)
      }
      if (type === 4) {
        ctx.drawImage(yugouBg, 0, 0, 1120, 192)
      }
      try {
        let min = Math.min(img.width, img.height)
        // 二维码
        let qrcode = await generateQrcode(300, window.location.href, 15, img, 10, 'canvas')
        ctx.drawImage(img, 0, 0, min, min, 0, 192, 1120, 1120)
        if (type === 1) {
          ctx.fillStyle = '#fff'
        } else {
          ctx.fillStyle = '#FA4D2F'
        }
        ctx.fillRect(0, 1312, 1120, 408)
        ctx.drawImage(qrcode, 750, 1352, 320, 320)
        // 填充商品名称
        let str = this.detail.productName
        fontStyle(ctx, '56px Microsoft YaHei UI', type === 1 ? '#000' : '#fff', 'top')(ctx, 48, 1352, str, 80, 620, 2)
        let priceList = this.detail.productSkuModels.map(item => item.price)
        let originalPriceList = this.detail.productSkuModels.map(item => item.originalPrice)
        let price = Math.min(...priceList)
        let originalPrice = Math.max(...originalPriceList)
        if (type === 1) {
          // 填充价钱
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
        } else if (type === 2) {
          let priceWidth = ctx.measureText(`¥${this.detail.activityProductModel.price}`).width
          let originalPriceWidth = ctx.measureText(`¥${price}`).width
          ctx.drawImage(tuan_price, 48, 1464, 440, 122)
          fontStyle(ctx, '112px Microsoft YaHei UI', '#fff', 'top')
          ctx.fillText(this.detail.activityProductModel.price, 350, 1454)
          ctx.drawImage(yuan, 450 + priceWidth, 1464, 68, 68)
          ctx.drawImage(original_price, 48, 1584, 220, 78)
          fontStyle(ctx, '112px Microsoft YaHei UI', '#fff', 'top')
          ctx.fillText(price, 260, 1564)
          ctx.drawImage(yuan, 350 + originalPriceWidth, 1584, 68, 68)
        } else if (type === 3) {
          let priceWidth = ctx.measureText(`¥${this.detail.activityProductModel.price}`).width
          let originalPriceWidth = ctx.measureText(`¥${price}`).width
          ctx.drawImage(second_price, 48, 1464, 440, 122)
          fontStyle(ctx, '112px Microsoft YaHei UI', '#fff', 'top')
          ctx.fillText(this.detail.activityProductModel.price, 350, 1454)
          ctx.drawImage(yuan, 450 + priceWidth, 1474, 68, 68)
          ctx.drawImage(original_price, 48, 1584, 220, 78)
          fontStyle(ctx, '112px Microsoft YaHei UI', '#fff', 'top')
          ctx.fillText(price, 260, 1564)
          ctx.drawImage(yuan, 350 + originalPriceWidth, 1584, 68, 68)
        } else if (type === 4) {
          let priceWidth = ctx.measureText(`¥${this.detail.activityProductModel.price}`).width
          let originalPriceWidth = ctx.measureText(`¥${price}`).width
          ctx.drawImage(yujiao, 48, 1464, 316, 116)
          fontStyle(ctx, '112px Microsoft YaHei UI', '#fff', 'top')
          ctx.fillText(this.detail.activityProductModel.price, 300, 1454)
          ctx.drawImage(yuan, 350 + priceWidth, 1474, 68, 68)
          ctx.drawImage(dikou, 48, 1584, 220, 78)
          fontStyle(ctx, '112px Microsoft YaHei UI', '#fff', 'top')
          ctx.fillText(price, 280, 1564)
          ctx.drawImage(yuan, 350 + originalPriceWidth, 1584, 68, 68)
        }
        this.haibao = canvas.toDataURL('image/jpeg', 0.7)
        this.showHaibao = true
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
    },
    countFinished () {
      this.$set(this.detail, 'serverTime', '')
      this.$set(this.detail, 'shoppingTimeLong', '')
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
  return ctx.measureText(strArr[0]).width
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
      line-height: 40px;
      color: #fff;
      font-size: 30px;
      border-radius: $--radius2;
    }
    .add {
      background-color: $--warning-color;
    }
    .buy {
      background-color: $--primary-color;
      &:disabled {
        color: #fea455;
      }
    }
    .add, .buy {
      height: 80px;
      color: #fff;
      font-size: 30px;
      &:disabled {
        color: rgba(255, 255, 255, .4);
      }
    }
    .btn-text{
      margin: 4px auto 0;
      width: 100px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      background: #ffffff;
      border-radius: 304px;
      font-size: 20px;
      line-height: 28px;
      color: #FE7700;
    }
  }
  .preBtn{
    width: 100%;
    height: 80px;
    margin-right: 16px;
    color: #fff;
    font-size: 30px;
    background: #FE7700;
    border-radius: 10px;
    &:disabled {
      color: rgba(255, 255, 255, .4);
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
      > .saveButton1{
        width: 560px;
        margin-top: -4px;
        text-align: center;
        line-height: 66px;
        font-size: 28px;
        color: #FA4D2F;
        background-color: #FEDB63;
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
  .count-down {
    top: 0;
    left: 0;
    transform: translateY(-100%);
    width: 100%;
  }
  .pingxuan {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 24px;
    background-color: #fff;
    .pingxuan-left {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding-right: 96px;
    }
    .mall-name {
      font-size: 36px;
      font-weight: bold;
      line-height: 50px;
    }
    .mall-desc {
      margin-top: 16px;
      font-size: 24px;
      color: #999;
      line-height: 35px;
      @include elps-wrap(2);
    }
    .pingxuan-middle {
      margin-right: 40px;
      display: flex;
      flex-direction: column;
      > img {
        width: 128px;
        height: 128px;
        object-fit: cover;
        border-radius: 64px;
      }
    }
    .pingxuan-right {
      display: flex;
      flex-direction: column;
    }
  }
  .coupon {
    padding: 0 24px;
    > .coupon-list {
      margin-top: 48px;
    }
  }
</style>
