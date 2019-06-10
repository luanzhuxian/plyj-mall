<template>
  <div :class="$style.comments">
    <TopText
      title="评论专区"
      tip="这里有你想看的"
    />
    <load-more
      :request-methods="getComments"
      :form="form"
      ref="loadMore"
      no-content-tip="暂无评论"
    >
      <template v-slot="{ list }">
        <Comment :list="list" />
      </template>
    </load-more>
    <buy-now
      type="warning"
      ref="buyNow"
      :current-model.sync="currentModel"
      :price-models="detail.priceModels"
      :is-supplier-product="isSupplierProduct"
    />
  </div>
</template>

<script>
import Comment from '../../components/detail/Comment.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'
import TopText from '../../components/Top-Text.vue'
import loadMore from '../../components/Load-More.vue'
import { getComments } from '../../apis/comment'
import { getProductDetail } from '../../apis/product'

export default {
  name: 'Comments',
  components: {
    Comment,
    BuyNow,
    TopText,
    loadMore
  },
  data () {
    return {
      form: {
        current: 1,
        size: 10,
        productSeq: ''
      },
      getComments,
      showSpecifica: false,
      isSupplierProduct: false,
      priceModels: [],
      detail: {},
      $refresh: null,
      loading: false,
      currentModel: null
    }
  },
  computed: {
    img: function () {
      return this.detail.productImage ? this.detail.productImage[0].mediaUrl : ''
    }
  },
  props: {
    productSeq: {
      type: String,
      default: null
    }
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.reset()
    this.$nextTick(() => {
      this.form.productSeq = this.productSeq
      this.$refresh()
      this.getdetail()
    })
  },
  methods: {
    async getdetail () {
      try {
        let { result } = await getProductDetail(this.productSeq)
        this.detail = result
        this.priceModels = result.priceModels
        this.isSupplierProduct = result.supplierProduct
      } catch (e) {
        throw e
      }
    },
    reset () {
      this.currentModel = null
      this.isSupplierProduct = false
      this.form.current = 1
      this.form.size = 10
      this.form.productSeq = ''
    }
  }
}
</script>

<style module lang="scss">
  .comments {
    padding: 28px 40px 120px;
    box-sizing: border-box;
  }
  .content {
  }
</style>
