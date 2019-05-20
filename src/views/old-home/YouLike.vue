<template>
  <div
    :class="$style.like"
    v-if="likeProduct.length > 0"
  >
    <div :class="$style.title">
      猜你喜欢
    </div>
    <div :class="$style.likeGoodsList">
      <CategoryItem
        v-for="(item, index) in likeProduct"
        :key="index"
        :product-id="item.sequenceNbr"
        :price="item.productPriceModel && item.productPriceModel[0].price"
        :img="item.mediaInfoModel && item.mediaInfoModel[0].mediaUrl"
        :product-name="item.productName"
        :product-desc="item.productDesc"
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
import { mapGetters } from 'vuex'
import { getYouLikeData } from '../../apis/base-api'
import CategoryItem from './CategoryItem.vue'
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
      getYouLikeData({ userId: this.userId, productSeq: this.productSeq || '' })
        .then(res => {
          for (let r of res.result) {
            r.productPriceModel.sort((a, b) => {
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
  .like-goods-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }
</style>
