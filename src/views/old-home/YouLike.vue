<template>
  <div
    :class="$style.like"
    v-if="likeProduct.length > 0"
  >
    <div
      v-if="isMy"
      :class="$style.titleMy"
    >
      <img src="../../assets/images/my/youLike.png">
    </div>
    <div
      v-else
      :class="$style.title"
    >
      猜你喜欢
    </div>
    <div :class="$style.likeGoodsList">
      <CategoryItem
        v-for="(item, index) in likeProduct"
        :key="index"
        :product-id="item.id"
        :product-name="item.productName"
        :product-desc="item.productDesc"
        :img="item.productMainImage + '?x-oss-process=style/thum-middle'"
        :price="item.productSkuModels.length && item.productSkuModels[0].price"
        :origin-price="item.productSkuModels.length && item.productSkuModels[0].originalPrice"
      />
      <!--<router-link-->
      <!--tag="li"-->
      <!--v-for="(item, index) in likeProduct" :key="index"-->
      <!--:to="{name: 'Product', params: {id: item.sequenceNbr}}">-->
      <!--<div class="goods335"><img :src="item.mediaInfoModel && item.mediaInfoModel[0].mediaUrl" /></div>-->
      <!--&lt;!&ndash;<div class="goods-desc">-->
      <!--{{item.productDesc}}-->
      <!--</div>&ndash;&gt;-->
      <!--<div class="goods-title">-->
      <!--{{item.productName}}-->
      <!--</div>-->
      <!--<div class="goods-price">-->
      <!--¥{{item.productPriceModel && item.productPriceModel[0].price}}-->
      <!--</div>-->
      <!--</router-link>-->
    </div>
  </div>
</template>
<script>
import CategoryItem from './CategoryItem.vue'
import { getYouLikeData } from '../../apis/base-api'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      likeProduct: []
    }
  },
  props: {
    productSeq: {
      type: String,
      default: ''
    },
    isMy: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  watch: {
    productSeq () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getYouLikeData()
        .then(res => {
          for (let list of res.result) {
            list.productSkuModels.sort((a, b) => {
              return a.price - b.price
            })
          }
          this.likeProduct = res.result
        }).catch(e => {
          throw e
        })
    }
  },
  components: {
    CategoryItem
  }
}
</script>
<style module lang="scss">
  .like {
    margin-top: 60px;
    padding: 0 32px;
  }
  .title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 28px;
  }
  .title-my{
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
    img{
      width: 256px;
      height: 40px;
    }
  }
  .like-goods-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }
</style>
