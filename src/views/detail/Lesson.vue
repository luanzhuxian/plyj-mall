<template>
  <div :class="$style.lesson">
    <DetailBanner :banners="banners" />
    <DetailInfoBox :loading="loading">
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
        :current="currentModel"
        ref="specification"
        @click="showSpecifica = true"
      />
      <!-- helper 润笔价格 -->
      <helper-price
        v-if="agentProduct"
        :current="currentModel"
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
        :broker-id="brokerId"
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
      ref="buyNow"
      :image="detail.productImage ? detail.productImage[0].mediaUrl : ''"
      :current-model.sync="currentModel"
      :price-models="detail.priceModels"
    />
    <specification-pop
      :default-code="currentModel.optionCode"
      :default-count="currentModel.count"
      :data="detail.priceModels"
      :product-image="detail.productImage ? detail.productImage[0].mediaUrl : ''"
      :visible.sync="showSpecifica"
      @change="specChanged"
    >
      <template v-slot:footer="{ selected }">
        <div :class="$style.buttons">
          <button
            :class="$style.add"
            :disabled="adding"
            @click="addToCart(selected)"
          >
            加入购物车
          </button>
          <button
            :class="$style.buy"
            :disabled="adding"
            @click="buyNow(selected)"
          >
            立即购买
          </button>
        </div>
      </template>
    </specification-pop>
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
import MaybeYouLike from '../../components/Maybe-You-Like.vue'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters } from 'vuex'
import { addToCart } from '../../apis/shopping-cart'

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
      showSpecifica: false,
      currentModel: {}, // 当前选中的规格
      commentForm: {
        current: 1,
        size: 3,
        productSeq: ''
      },
      agentProduct: false,
      loading: false,
      adding: false
    }
  },
  props: {
    productSeq: {
      type: String,
      default: null
    },
    brokerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId'])
  },
  watch: {
    productSeq () {
      this.getDetail()
    }
  },
  activated () {
    this.getDetail()
  },
  mounted () {
    // 进入页面后，存储brokerId，只要页面不关闭，这期间，购买的任何营销商品都算作helper的分享
    // 详情页只做存储，具体判断过程在点击立即购买和加入购物车时判断
    sessionStorage.setItem('shareBrokerId', this.brokerId)
  },
  methods: {
    async getDetail () {
      this.loading = true
      this.resetState() // 重置一些状态
      try {
        let { result } = await getProductDetail(this.productSeq)
        result.salesVolume = 0
        if (result.productStatus !== 'ON_SALE') {
          this.loading = false
          return this.$router.replace({ name: 'SoldOut' })
        }
        let { sequenceNbr, agentProduct, priceModels, productImage } = result
        this.commentForm.productSeq = sequenceNbr
        this.agentProduct = agentProduct
        // 计算总销量 添加count属性
        for (let item of priceModels) {
          item.count = 1
          result.salesVolume += item.salesVolume
        }
        // 所有图片
        for (let item of productImage) {
          this.banners.push(item.mediaUrl)
        }
        this.detail = result
        share({
          appId: this.appId,
          title: result.productName,
          desc: result.productDesc,
          link: window.location.href,
          imgUrl: result.productImage[0].mediaUrl + '?x-oss-process=image/resize,w_200'
        })
        this.loading = false
      } catch (e) {
        this.$router.replace({ name: 'SoldOut' })
        throw e
      }
    },
    // 选中规格
    specChanged (option) {
      this.currentModel = option
    },
    resetState () {
      this.currentModel = {}
      this.banners.splice(0, 1000000)
    },
    addToCart (selected) {
      this.adding = true
      const { productSeq, count, optionCode } = selected
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId')
      return new Promise(async (resolve, reject) => {
        try {
          await addToCart({
            productId: productSeq,
            productCount: count,
            skuCode: optionCode,
            agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
          })
          this.$success('加入成功')
          this.showSpecifica = false
        } catch (e) {
          reject(e)
        } finally {
          this.adding = false
        }
      })
    },
    buyNow (selected) {
      const { productSeq, count, optionCode } = selected
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId')
      localStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: productSeq,
        optionCode: optionCode,
        count: count,
        agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
      }]))
      this.showSpecifica = false
      this.$router.push({
        name: 'SubmitOrder',
        query: {
          isCart: false
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
</style>
