<template>
  <div :class="$style.lesson">
    <DetailBanner :banners="banners" />
    <DetailInfoBox>
      <DetailTitle v-text="detail.productName" />
      <DetailDesc v-text="detail.productDesc" />
      <div :class="$style.price">
        <Price
          v-if="detail.priceModels && detail.priceModels[0]"
          size="huge"
          :price="detail.priceModels[0].price"
          :original-price="detail.supplierProduct ? '' : detail.priceModels[0].originPrice"
        />
        <div :class="$style.count">
          <pl-svg name="selled" />
          <span>已售 {{ detail.salesVolume }}</span>
        </div>
      </div>

      <!-- 当前选择的规格 -->
      <specification-box
        :current="currentSpec"
        @click="showSpecifica = true"
        ref="specification"
      />
      <!-- helper 润笔价格 -->
      <helper-price
        v-if="agentProduct"
        :current="currentSpec"
      />
      <!--<DetailOtherInfo type="lesson" />-->
    </DetailInfoBox>

    <DetailInfo
      v-if="detail.detailContent"
      title="详情信息"
      :content="detail.detailContent || '暂无详情'"
    />

    <!--<div class="slide-padding mt-80">-->
    <!--<ModuleTitle title="商品详情" />-->
    <!--<Specific total-price="500" />-->
    <!--</div>-->

    <!--<div class="slide-padding mt-80">-->
    <!--<ModuleTitle title="购买须知" />-->
    <!--<MustKnow />-->
    <!--</div>-->

    <!--<div class="slide-padding mt-80">-->
    <!--<ModuleTitle title="授课老师" />-->
    <!--<Teaching />-->
    <!--</div>-->

    <div class="slide-padding mt-80">
      <ModuleTitle title="雅客评论" />
      <Comment
        :size="3"
        :product-seq="productSeq"
      />
    </div>

    <!--<div class="slide-padding mt-80">-->
    <!--<ModuleTitle title="品牌介绍" />-->
    <!--<BrandIntro />-->
    <!--</div>-->

    <!--<div class="slide-padding mt-28">-->
    <!--<ApplicableTime time="请购买后向商家咨询！" />-->
    <!--</div>-->
    <div class="slide-padding mt-80">
      <MaybeYouLike
        title="商家推荐"
        :product-id="productSeq"
      />
    </div>

    <buy-now
      type="warning"
      text="立即购买"
      @click="buyNow"
      ref="buyNow"
    />
    <specification-pop
      :data="detail.priceModels"
      :product-image="detail.productImage"
      :visible.sync="showSpecifica"
      @confirm="specChanged"
    />
  </div>
</template>

<script>
import DetailBanner from '../../components/detail/Banner.vue'
import DetailInfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
// import DetailOtherInfo from '../../components/detail/Other-Info.vue'
import DetailInfo from '../../components/detail/Detail.vue'
// import MustKnow from '../../components/detail/Must-Know.vue'
// import Specific from '../../components/detail/Specific.vue'
// import Teaching from '../../components/detail/Teaching.vue'
import Comment from '../../components/detail/Comment.vue'
import HelperPrice from '../../components/detail/Helper-Price.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'
// import BrandIntro from '../../components/detail/Brand-Intro.vue'
// import ApplicableTime from '../../components/detail/Applicable-Time.vue'
import SpecificationBox from '../../components/detail/Specification-Box.vue'
import ModuleTitle from '../../components/Module-Title.vue'
import Price from '../../components/Price.vue'
import { getProductDetail } from '../../apis/product'
import { Indicator } from 'mint-ui'
import MaybeYouLike from '../../components/Maybe-You-Like.vue'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters } from 'vuex'
export default {
  name: 'Lesson',
  components: {
    DetailBanner,
    DetailTitle,
    DetailDesc,
    // DetailOtherInfo,
    DetailInfo,
    // MustKnow,
    // Specific,
    // Teaching,
    Comment,
    HelperPrice,
    // BrandIntro,
    // ApplicableTime,
    ModuleTitle,
    Price,
    BuyNow,
    DetailInfoBox,
    SpecificationBox,
    SpecificationPop,
    MaybeYouLike
  },
  data () {
    return {
      banners: [],
      detail: {},
      currentSpec: {}, // 当前选中的规格
      buyNowHasClicked: false, // 是否点击过购买按钮
      commentForm: {
        current: 1,
        size: 3,
        mallSeq: '',
        productSeq: ''
      },
      isSupplierProduct: false,
      agentProduct: false,
      showSpecifica: false
    }
  },
  props: {
    productSeq: {
      type: String,
      default: null
    },
    brokerId: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['appId', 'mallDomain'])
  },
  watch: {
    productSeq () {
      this.getDetail()
    }
  },
  activated () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      this.resetState() // 重置一些状态
      Indicator.open({ spinnerType: 'fading-circle' })
      try {
        let { result } = await getProductDetail(this.productSeq)
        if (result.productStatus !== 'ON_SALE') {
          Indicator.close()
          return this.$router.replace({ name: 'SoldOut' })
        }
        let { mallSeq, sequenceNbr, supplierProduct, agentProduct, priceModels, productImage } = result
        this.commentForm.mallSeq = mallSeq
        this.commentForm.productSeq = sequenceNbr
        this.isSupplierProduct = supplierProduct
        this.agentProduct = agentProduct
        result.salesVolume = 0
        // 按价格从低到高排序
        priceModels.sort((a, b) => {
          return a.price - b.price
        })
        // 总销量
        for (let item of priceModels) {
          result.salesVolume += item.salesVolume
        }
        // 所有图片
        for (let item of productImage) {
          this.banners.push(item.mediaUrl)
        }
        // 统计销售数量
        this.detail = result
        this.currentSpec = priceModels[0]
        Indicator.close()
        // 配置分享
        share({
          appId: this.appId,
          title: result.productName,
          desc: result.productDesc,
          link: window.location.href,
          imgUrl: result.productImage[0].mediaUrl + '?x-oss-process=image/resize,w_200'
        })
      } catch (e) {
        Indicator.close()
        this.$router.replace({ name: 'SoldOut' })
        throw e
      }
    },
    // 选中规格
    specChanged (option) {
      this.currentSpec = option
      if (this.buyNowHasClicked) this.jumpSubmit(option)
    },
    // 立即购买
    buyNow () {
      if (!this.currentSpec.count) {
        this.buyNowHasClicked = true
        this.showSpecifica = true
        return
      }
      this.jumpSubmit(this.currentSpec)
    },
    jumpSubmit (option) {
      this.$refs.buyNow.jumpSubmit(option, this.isSupplierProduct, this.brokerId)
    },
    resetState () {
      this.buyNowHasClicked = false
      this.currentSpec = {}
      this.banners.splice(0, 1000000)
    }
  }
}
</script>

<style module lang="scss">
  .lesson {
    margin-bottom: 120px;
  }
  .price {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 30px;
  }
  .count {
    display: inline-flex;
    align-items: center;
    font-size: 24px;
    color: #999;
    svg {
      width: 24px;
      margin-right: 10px;
    }
  }
</style>
