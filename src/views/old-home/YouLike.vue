<template>
  <div v-if="likeProduct.length > 0" :class="$style.like">
    <div v-if="isMy" :class="$style.titleMy">
      <img src="../../assets/images/my/youLike.png">
    </div>
    <div v-else :class="$style.title">
      猜你喜欢
    </div>
    <div :class="$style.likeGoodsList">
      <CategoryItem
        v-for="(item, index) in likeProduct"
        :key="index"
        :img="item.productMainImage + '?x-oss-process=style/thum-middle'"
        :product-id="item.id"
        :product-name="item.productName"
        :product-desc="item.productDesc"
        :price="item.productSkuModels.length && item.productSkuModels[0].price"
        :origin-price="item.productSkuModels.length && item.productSkuModels[0].originalPrice"
      />
    </div>
  </div>
</template>
<script>
import CategoryItem from './CategoryItem.vue'
import { getYouLikeData } from '../../apis/base-api'
import { mapGetters } from 'vuex'

export default {
  name: 'YouLike',
  components: {
    CategoryItem
  },
  data () {
    return {
      likeProduct: []
    }
  },
  props: {
    productId: {
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
    productId () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      getYouLikeData(this.productId)
        .then(res => {
          for (let list of res.result) {
            list.productSkuModels.sort((a, b) => a.price - b.price)
          }
          this.likeProduct = res.result
        }).catch(e => {
          throw e
        })
    }
  }
}
</script>
<style module lang="scss">
  .like {
    margin-top: 60px;
    padding: 0 32px;
    background-color: transparent;
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
