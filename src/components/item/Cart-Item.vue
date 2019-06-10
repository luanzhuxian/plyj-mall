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

      <span
        :class="$style.unshelve"
        v-if="data.productStatus === 'UNSHELVE'"
      >
        该商品已失效
      </span>

      <template v-else>
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

        <div
          :class="$style.priceCount"
          v-if="!overflowStock"
        >
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
      </template>
      <div
        v-if="overflowStock"
        :class="$style.reelect"
      >
        <span>请重新选择商品规格</span>
        <pl-button
          round
          plain
          size="mini"
          type="primary"
          @click.stop="showSpecifica = true"
        >
          重选
        </pl-button>
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
import { mapGetters } from 'vuex'
export default {
  name: 'CartItem',
  components: {
    Count,
    SpecificationPop
  },
  data () {
    return {
      loading: false,
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
  computed: {
    // 已选数量是否超出库存
    overflowStock () {
      return this.data.cartProductCount > this.currentSkuModel.stock
    },
    ...mapGetters(['agentUser', 'userId'])
  },
  methods: {
    init () {
      const data = this.data
      this.skuList = data ? data.skuModels : []
      this.id = data ? data.id : ''
      this.productId = data ? data.cartProductId : ''
      this.count = data ? data.cartProductCount : 0
      this.currentSkuCode = data ? data.cartSkuCode : 0
      this.currentSkuModel = this.skuList.find(item => item.optionCode === data.cartSkuCode) || {}
    },
    // 改变规格
    async specChanged (option, old) {
      try {
        // 请求修改
        const isUpdateSku = await updateCartProductSku({
          id: this.id,
          skuCode: option.optionCode,
          number: option.count
        })
        // 刷新显示
        if (isUpdateSku.result) {
          this.currentSkuModel = option
          // 直接修改父组件的数据，也在父组件中建投change事件，通过接口来刷新数据。但是会导致接口调用频繁
          this.data.cartSkuCode = this.currentSkuCode = option.optionCode
          this.data.cartProductCount = this.count = option.count
          this.$emit('change')
          this.$emit('skuChange')
        } else {
          // 修改失败，回滚
          this.currentSkuModel = old
          this.currentSkuCode = old.optionCode
          this.count = old.count
        }
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
          // 直接修改父组件的数据，也在父组件中建投change事件，通过接口来刷新数据。但是会导致接口调用频繁
          this.data.cartProductCount = count
          this.count = count
          this.$emit('change')
          this.$emit('countChange')
        }
      } catch (err) {
        next(err)
        throw err
      }
    },
    async goDetail () {
      const productSeq = this.data.cartProductId
      this.$router.push({ name: 'Lesson', params: { productSeq: productSeq, brokerId: this.agentUser ? this.userId : null } })
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
    border-radius: $--radius2;
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
  .unshelve {
    font-size: 20px;
    color: #999;
    margin-bottom: 56px;
  }
  .currentSku{
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 358px;
    margin-bottom: 4px;
    padding: 0 16px 0 8px;
    line-height: 44px;
    border-radius: $--radius2;
    background-color: #f9f9f9;
    font-size: 20px;
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
  .reelect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }
</style>
