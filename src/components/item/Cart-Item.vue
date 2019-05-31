<template>
  <div
    :class="$style.cartItem"
    v-if="data"
  >
    <img
      :class="$style.cartItemImage"
      :src="data.productImg[0]"
      alt=""
      @click="goDetail"
    >

    <div :class="$style.cartItemContent">
      <div
        :class="$style.productName"
        v-text="data.productName"
        @click.stop="goDetail"
      />

      <div
        :class="$style.currentSku"
        @click.stop="showSpecifica = true"
      >
        <span v-text="currentSkuModel.optionName" />
        <pl-svg
          :class="$style.arrow"
          name="right"
          color="#ccc"
        />
      </div>

      <div :class="$style.priceCount">
        <i
          :class="$style.price + ' rmb'"
          v-text="currentSkuModel.price"
        />
        <count
          :count="count"
          ref="count"
          :max="currentSkuModel.stock"
          :min="currentSkuModel.minBuyNum"
          @change="countChange"
        />
      </div>
    </div>

    <SpecificationPop
      :data="skuList"
      :product-image="data.productImg[0]"
      :visible.sync="showSpecifica"
      @confirm="specChanged"
      :default-count="count"
      :default-code="currentSkuCode"
    />
  </div>
</template>

<script>
import Count from '../../components/Count.vue'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import {
  updateCartProductCount,
  updateCartProductSku
} from '../../apis/shopping-cart'
import { createBrokerShare } from '../../apis/product'
export default {
  name: 'CartItem',
  components: {
    Count,
    SpecificationPop
  },
  data () {
    return {
      showSpecifica: false,
      currentSkuModel: {},
      skuList: [],
      id: '',
      productId: '',
      count: 0,
      currentSkuCode: ''
    }
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  watch: {
    data: {
      handler (val) {
        if (val) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init () {
      this.skuList = this.data ? this.data.skuModels : []
      this.id = this.data ? this.data.id : ''
      this.productId = this.data ? this.data.cartProductId : ''
      this.count = this.data ? this.data.cartProductCount : 0
      this.currentSkuCode = this.data ? this.data.cartSkuCode : 0
      this.currentSkuModel = this.skuList.find(item => item.optionCode === this.data.cartSkuCode) || {}
    },
    // 改变规格
    async specChanged (option) {
      try {
        const isUpdateSku = await updateCartProductSku({
          id: this.id,
          skuCode: option.optionCode
        })
        const isUpdateCount = await updateCartProductCount({
          id: this.id,
          number: option.count
        })
        if (isUpdateSku.result) {
          this.currentSkuModel = option
          this.currentSkuCode = option.optionCode
        }
        if (isUpdateCount.result) {
          this.count = option.count
        }
        this.$emit('optionChange')
      } catch (e) {
        throw e
      }
    },
    async countChange (count, next) {
      try {
        const { result } = await updateCartProductCount({
          id: this.id,
          number: count
        })
        if (result) {
          next()
          this.count = count
        }
      } catch (err) {
        next(err)
        throw err
      }
    },
    async goDetail () {
      const productSeq = this.data.cartProductId
      try {
        let { result } = await createBrokerShare(productSeq)
        this.$router.push({ name: 'Lesson', params: { productSeq, brokerId: result.sequenceNbr || null } })
      } catch (e) {

      }
    }
  }
}
</script>

<style module lang="scss">
  .cartItem {
    display: flex;
    flex: 1;
    margin-left: 24px;
    padding: 22px 20px;
    border-radius: $--radius1;
    background-color: #fff;
  }
  .cartItemImage {
    width: 164px;
    height: 164px;
    object-fit: cover;
  }
  .cartItemContent {
    display: inline-flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 24px;
  }
  .productName {
    font-size: 22px;
    height: 64px;
    line-height: 32px;
    @include elps-wrap(2);
  }
  .currentSku{
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 358px;
    padding: 0 16px 0 8px;
    line-height: 44px;
    border-radius: $--radius2;
    background-color: #f9f9f9;
    @include elps();
    > .arrow {
      width: 10px;
      height: 18px;
      transform: rotate(90deg) scaleY(1.2);
    }
  }
  .priceCount {
    display: flex;
    justify-content: space-between;
    > .price {
      font-size: 28px;
      color: $--primary-color;
    }
  }
</style>
