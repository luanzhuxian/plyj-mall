<template>
  <div
    :class="$style.cartItem"
    v-if="data"
  >
    <img
      :class="$style.cartItemImage"
      :src="data.productImg"
      alt=""
      @click="goDetail"
    >

    <div :class="$style.cartItemContent">
      <div
        :class="$style.productName"
        v-text="data.productName"
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
      :product-image="data.productImg"
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
      showSpecifica: false
    }
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    cartList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'userId']),
    count () {
      return this.data.cartProductCount || 0
    },
    skuList () {
      return this.data.skuModels || []
    },
    currentSkuCode () {
      return this.data.cartSkuCode || ''
    },
    currentSkuModel () {
      return this.skuList.find(item => item.optionCode === this.data.cartSkuCode) || {}
    },
    // 已选数量是否超出库存
    overflowStock () {
      return this.data.cartProductCount > this.currentSkuModel.stock
    },
    id () {
      return this.data.id || ''
    },
    productId () {
      return this.data.cartProductId || ''
    }
  },
  methods: {
    // 改变规格
    async specChanged (option, revert) {
      try {
        // 请求修改
        const isUpdateSku = await updateCartProductSku({
          id: this.id,
          skuCode: option.optionCode,
          number: option.count
        })
        // 刷新显示
        if (isUpdateSku.result) {
          // 直接修改父组件的数据，也在父组件中监听change事件，通过接口来刷新数据。但是会导致接口调用频繁
          // 直接修改可以触发计算属性，使得数据真实一致
          this.data.cartSkuCode = option.optionCode
          this.data.cartProductCount = option.count
          this.isDouble(option.optionCode)
          this.$emit('change')
          this.$emit('skuChange')
        } else {
          // 修改失败，回滚选框中的值
          revert()
        }
      } catch (e) {
        // 修改失败，回滚选框中的值
        revert()
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
          // 直接修改父组件的数据，也可以在父组件中监听change事件，通过接口来刷新数据，但是会导致接口调用频繁
          this.data.cartProductCount = count
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
    },
    // 修改规格成功后，判断当前规格是否已经存在于购物车中，如果存在，删之
    isDouble (optionCode) {
      for (let cartPro of this.cartList) {
        console.log(cartPro.cartSkuCode, optionCode)
        if (cartPro.cartSkuCode === optionCode && this.id !== cartPro.id) {
          this.cartList.splice(this.cartList.indexOf(this.data), 1)
          break
        }
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
