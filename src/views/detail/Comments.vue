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
      text="立即购买"
      @click="buyNow"
      ref="buyNow"
    />
    <specification-pop
      :visible.sync="showPop"
      :data="priceModels"
      @confirm="popConfirm"
    />
  </div>
</template>

<script>
import Comment from '../../components/detail/Comment.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'
import SpecificationPop from '../../components/detail/Specification-Pop'
import TopText from '../../components/Top-Text.vue'
import loadMore from '../../components/Load-More.vue'
import { getComments } from '../../apis/comment'
import { mapGetters } from 'vuex'
import { getProductDetail, createBrokerShare } from '../../apis/product'

export default {
  name: 'Comments',
  components: {
    Comment,
    BuyNow,
    TopText,
    loadMore,
    SpecificationPop
  },
  data () {
    return {
      form: {
        current: 1,
        size: 10,
        mallSeq: '',
        productSeq: ''
      },
      getComments,
      showPop: false,
      isSupplierProduct: false,
      priceModels: [],
      detail: {},
      $refresh: null
    }
  },
  computed: {
    ...mapGetters(['mallSeq']),
    img: function () {
      return this.detail.productImage ? this.detail.productImage[0].mediaUrl : ''
    }
  },
  props: ['productSeq'],
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.$nextTick(() => {
      this.form.productSeq = this.productSeq
      this.form.mallSeq = this.mallSeq
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
    async popConfirm (option) {
      let { result } = await createBrokerShare(this.productSeq)
      result = result || {}
      this.$refs.buyNow.jumpSubmit(option, this.isSupplierProduct, result.sequenceNbr || null)
    },
    buyNow () {
      this.showPop = true
    }
  }
}
</script>

<style module lang="scss">
  .comments {
    padding: 28px 40px 120px;
    height: 100vh;
    overflow: scroll;
    box-sizing: border-box;
  }
  .content {
  }
</style>
