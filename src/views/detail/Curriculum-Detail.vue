<template>
  <div :class="$style.curriculum">
    <Banner :banners="banners" />
    <InfoBox>
      <info-header :detail="detail" />
      <!-- 商品名称 -->
      <DetailTitle :activity-tag="detail.activityProductModel && detail.activityProductModel.activityTag" :product-name="detail.productName" />
      <!-- 商品描述 -->
      <DetailDesc v-text="detail.productDesc" />
      <!-- 商品标签 -->
      <Tags :tags="detail.labelModels" />

      <div :class="$style.field">
        <div :class="$style.left">
          <pl-svg name="icon-teacher-d2398" width="30" />
          主讲人：
        </div>
        <div :class="$style.right">
          王老师
        </div>
      </div>

      <div :class="$style.field">
        <div :class="$style.left">
          <pl-svg name="icon-date" width="30" />
          有效期：
        </div>
        <div :class="$style.right">
          长期有效
        </div>
      </div>
    </InfoBox>

    <div :class="$style.detailOrComment">
      <div :class="$style.tabs">
        <div :class="{ [$style.activeTab]: tab === 2 }" @click="tab = 2">
          商品详情
        </div>
      </div>

      <div>
        <DetailInfo
          v-show="tab === 2"
          :content="detail.detail || '暂无详情'"
        />
      </div>
    </div>

    <div :class="$style.bottom">
      <div :class="$style.content">
        <router-link :class="$style.link" :to="{ name: 'Home' }">
          <pl-svg name="icon-home" width="38" height="70" />
        </router-link>
        <a :class="$style.link + ' ' + $style.callUs" @click="showContact = true">
          <pl-svg name="icon-call-us" width="80" height="72" />
        </a>
        <button
          :class="{
            [$style.clickMeBecauseYouAreYoung]: true,
            [$style.hasStudied]: studied
          }"
        >
          {{ studied ? '观看学习(2次)' : '立即学习' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '../../components/detail/Banner.vue'
import InfoBox from '../../components/detail/Info-Box.vue'
import InfoHeader from '../../components/detail/Info-Header.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import Tags from '../../components/detail/Tags.vue'
import { getProductDetail } from '../../apis/product'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters } from 'vuex'
// import { loadImage } from '../../assets/js/util'

export default {
  name: 'CurriculumDetail',
  components: {
    Banner,
    InfoBox,
    InfoHeader,
    DetailTitle,
    DetailDesc,
    Tags,
    DetailInfo
  },
  data () {
    return {
      banners: [
        'https://mallcdn.youpenglai.com/video/068q8YI4X-wql4F-1581511274025.mp4',
        'https://mallcdn.youpenglai.com/static/whats_helper_2.jpg'
      ],
      couponList: [],
      productStatus: 2,
      detail: {},
      productSkuModels: [],
      showSpecifica: false,
      currentModel: {}, // 当前选中的规格
      activityProductModel: {}, // 活动信息
      commentForm: {
        current: 1,
        size: 3,
        productId: ''
      },
      agentProduct: false,
      showHaibao: false,
      loading: false,
      adding: false,
      creating: false,
      haibao: '',
      tab: 2,
      imgels: [],
      // 活动类型
      qrcode: '',
      studied: true
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
    productActive () {
      return (this.$route.query && Number(this.$route.query.currentProductStatus)) || 1
    },
    ...mapGetters(['appId'])
  },
  async activated () {
    try {
      await this.refresh()
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
  async mounted () {
    sessionStorage.setItem('shareBrokerId', this.brokerId || '')
  },
  methods: {
    //  获取商品详情
    async getDetail (productActive) {
      try {
        this.loading = true
        this.resetState() // 重置一些状态
        // 此步是为了兼容处理，当当前产品的活动结束，重新刷新产品详情页面，当作普通商品
        productActive = productActive || this.productActive
        let { result } = await getProductDetail(this.productId, productActive)
        let { id, agentProduct, mediaInfoIds, productStatus } = result
        if (!result) {
          this.$error('该商品异常')
          this.$router.go(-1)
          return
        }
        this.productStatus = productStatus
        this.commentForm.productId = id
        this.agentProduct = agentProduct
        // 存储活动信息
        this.activityProductModel = result.activityProductModel
        // 所有图片
        this.banners = mediaInfoIds
        this.detail = result
        this.productSkuModels = result.productSkuModels
        this.currentModel = result.productSkuModels.find(item => item.minBuyNum <= item.stock) || result.productSkuModels[0]
        this.currentModel.count = result.productSkuModels[0].minBuyNum
        let shareUrl = ''
        if (this.userId) {
          shareUrl = `${this.mallUrl}/detail/product/${this.productId}/${this.userId}`
        } else {
          shareUrl = `${this.mallUrl}/detail/product/${this.productId}`
        }
        this.shareUrl = shareUrl
        let hide = []
        if (this.detail.activeProduct !== 1) {
          // 活动商品隐藏分享到朋友圈
          hide = ['menuItem:share:timeline']
        }
        share({
          appId: this.appId,
          title: result.productName,
          desc: result.productDesc,
          link: shareUrl,
          imgUrl: result.productMainImage,
          willHide: hide
        })
        // this.haibaoImg = await loadImage(result.productMainImage)
        // let img = await loadImage(result.productMainImage)
        // img = cutImageCenter(img)
        // let qrcode = await generateQrcode(300, window.location.href, 15, img, 10, 'url')
        // this.qrcode = qrcode
        return result
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    resetState () {
      this.currentModel = {}
      this.banners.splice(0, 1000000)
    },
    async refresh (productActive) {
      try {
        this.showSpecifica = false
        this.currentModel = {}
        this.haibao = ''
        this.tab = 2
        await this.getDetail(productActive)
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .curriculum {
    padding-bottom: 190px;
  }
  .field {
    display: flex;
    align-items: center;
    line-height: 78px;
    font-size: 24px;
    border-top: 1px solid #e7e7e7;
    > .left {
      color: #999;
      > svg {
        vertical-align: -6px;
      }
    }
    > .right {
      color: #000;
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
  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-top: 60px;
    background-color: #fff;
    > .content {
      display: flex;
      align-items: center;
      height: 110px;
      border-top: 1px solid #e7e7e7;
    }
    .link {
      margin-left: 42px;
      &.callUs {
        margin-left: 36px;
      }
    }
    .click-me-because-you-are-young {
      width: 496px;
      margin-left: 40px;
      line-height: 80px;
      font-size: 26px;
      text-align: center;
      color: #fff;
      background-color: #FE7700;
      border-radius: 10px;
      &.has-studied {
        background-color: #F2B036;
      }
    }
  }
</style>
