<template>
  <div :class="$style.lesson">
    <DetailBanner :banners="banners" />
    <DetailInfoBox :loading="loading">
      <div :class="$style.price">
        <div :class="$style.priceLeft">
          <Price
            v-if="productSkuModels.length"
            size="huge"
            :price="currentPrice"
            :original-price="currentOriginalPrice"
          />
          <div :class="$style.count">
            <span v-text="detail.showSalesVolume" />人购买
          </div>
        </div>
        <div :class="$style.priceRight" v-if="currentModel.realRebate">
          <p class="fz-22 gray-1">
            <span :class="$style.returnRunbi">返还</span><i v-text="currentModel.realRebate" />润笔
          </p>
          <p class="fz-22 gray-3">
            分享下单即可获得R币
          </p>
        </div>
      </div>
      <DetailTitle v-text="detail.productName" />
      <DetailDesc v-text="detail.productDesc" />
      <Tags :tags="detail.labelModels" />
    </DetailInfoBox>

    <Field label="发货" content="普通快递" />
    <Field
      label="选择"
      can-click
      @click="showSpecifica = true"
    >
      <span v-if="currentModel.skuCode1Name" v-text="currentModel.skuCode1Name" />
      <template v-if="currentModel.skuCode2Name">
        / <i v-text="currentModel.skuCode2Name" />
      </template>
      <span v-if="!currentModel.id">请选择规格</span>
    </Field>

    <div :class="$style.detailOrComment">
      <div :class="$style.tabs">
        <div :class="{ [$style.activeTab]: tab === 1 }" @click="tab = 1">
          雅客评论(1)
        </div>
        <div :class="{ [$style.activeTab]: tab === 2 }" @click="tab = 2">
          商品详情
        </div>
      </div>

      <div>
        <Comment v-show="tab === 1" :size="3" :product-id="productId" :broker-id="brokerId" />
        <DetailInfo
          v-show="tab === 2"
          :content="detail.detail || '暂无详情'"
        />
      </div>
    </div>

    <!--<div class="slide-padding mt-80">
      <ModuleTitle title="雅客评论" />
    </div>-->

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
        :product-id="productId"
      />
    </div>

    <buy-now
      type="warning"
      ref="buyNow"
      :image="detail.productMainImage"
      :product-id="productId"
      :sku-list="detail.productSkuModels"
      :sku-attr-list="detail.productAttributes"
      :current-sku.sync="currentModel"
    />
    <specification-pop
      :default-count="currentModel.count"
      :sku-list="detail.productSkuModels"
      :sku-attr-list="detail.productAttributes"
      :product-image="detail.productMainImage"
      :visible.sync="showSpecifica"
      :sku="currentModel"
    >
      <template v-slot:footer="{ currentSku }">
        <div :class="$style.buttons">
          <button
            :class="$style.add"
            :disabled="adding"
            @click="addToCart(currentSku)"
          >
            加入购物车
          </button>
          <button
            :class="$style.buy"
            :disabled="adding"
            @click="buyNow(currentSku)"
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
import DetailInfo from '../../components/detail/Detail.vue'
import Comment from '../../components/detail/Comment.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'
import Tags from '../../components/detail/Tags.vue'
import Price from '../../components/Price.vue'
import Field from '../../components/detail/Field.vue'
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
    DetailInfo,
    Comment,
    Price,
    Field,
    Tags,
    BuyNow,
    DetailInfoBox,
    SpecificationPop,
    MaybeYouLike
  },
  data () {
    return {
      banners: [],
      detail: {
        assessmentModelPage: {}
      },
      productSkuModels: [],
      showSpecifica: false,
      currentModel: {}, // 当前选中的规格
      commentForm: {
        current: 1,
        size: 3,
        productId: ''
      },
      agentProduct: false,
      loading: false,
      adding: false,
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
    }
  },
  watch: {
    productId () {
      this.getDetail()
    }
  },
  activated () {
    this.getDetail()
  },
  deactivated () {
    this.showSpecifica = false
  },
  mounted () {
    // 进入页面后，存储brokerId，只要页面不关闭，这期间，购买的任何营销商品都算作helper的分享
    // 详情页只做存储，具体判断过程在点击立即购买和加入购物车时判断
    sessionStorage.setItem('shareBrokerId', this.brokerId || '')
  },
  methods: {
    async getDetail () {
      this.loading = true
      this.resetState() // 重置一些状态
      try {
        let { result } = await getProductDetail(this.productId)
        if (result.productStatus !== 2) {
          this.loading = false
          return this.$router.replace({ name: 'SoldOut' })
        }
        let { id, agentProduct, mediaInfoIds } = result
        this.commentForm.productId = id
        this.agentProduct = agentProduct
        // 所有图片
        for (let item of mediaInfoIds) {
          this.banners.push(item.mediaUrl)
        }
        this.detail = result
        this.productSkuModels = result.productSkuModels
        share({
          appId: this.appId,
          title: result.productName,
          desc: result.productDesc,
          link: window.location.href,
          imgUrl: result.productMainImage + '?x-oss-process=image/resize,w_200'
        })
        this.loading = false
      } catch (e) {
        this.$router.replace({ name: 'SoldOut' })
        throw e
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
      this.currentModel = selected
      const { productId, count, id } = selected
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId')
      localStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: productId,
        optionCode: id,
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
    align-items: start;
    margin-bottom: 30px;
  }
  .priceLeft {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
  }
  .priceRight {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 8px;
    > p {
      margin-top: 6px;
    }
    .returnRunbi {
      display: inline-block;
      width: 58px;
      height: 26px;
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
    color: #FE7700;
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
    margin-bottom: 20px;
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
</style>
