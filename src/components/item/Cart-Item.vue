<template>
  <div
    :class="$style.cartItem"
    v-if="data"
  >
    <img
      :class="$style.cartItemImage"
      :src="data.productImg + '?x-oss-process=style/thum'"
      alt=""
      @click="goDetail"
    >

    <div :class="$style.cartItemContent">
      <div :class="$style.productName" v-text="data.productName" />

      <span :class="$style.unshelve" v-if="data.productStatus === 1">
        该商品已失效
      </span>

      <template v-else-if="!allDisabled">
        <div :class="{ [$style.currentSku]: true, [$style.disabled]: disabled }" @click.stop="skuClick">
          <div v-if="currentSkuModel">
            <span v-text="currentSkuModel.skuCode1Name" />
            <template v-if="currentSkuModel.skuCode2Name">
              / <span v-text="currentSkuModel.skuCode2Name" />
            </template>
          </div>
          <pl-svg :class="$style.arrow" name="right" color="#ccc" />
        </div>
        <div :class="$style.priceCount" v-if="!overflowStock">
          <i :class="$style.price + ' rmb'" v-text="currentSkuModel.price" />
          <count
            :count="count"
            ref="count"
            :disabled="disabled"
            :max="currentSkuModel.stock"
            :min="currentSkuModel.minBuyNum"
            @change="countChange"
          />
        </div>
      </template>
      <span :class="$style.unshelve" v-if="allDisabled">
        全部售罄
      </span>
      <div
        v-if="overflowStock && !allDisabled"
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
  </div>
</template>

<script>
import Count from '../../components/Count.vue'
import {
  updateCartProductCount
} from '../../apis/shopping-cart'
import { mapGetters } from 'vuex'
export default {
  name: 'CartItem',
  components: {
    Count
  },
  data () {
    return {
      loading: false,
      currentSkuModel: {}
    }
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    disabled: Boolean
  },
  computed: {
    ...mapGetters(['agentUser', 'userId']),
    count () {
      return this.data.cartProductCount || 0
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
    },
    // 所有规格禁用状态
    allDisabled () {
      return this.data.skuModels.every(item => item.stock < item.minBuyNum)
    }
  },
  watch: {
    data: {
      handler (val) {
        if (val) {
          this.currentSkuModel = val.skuModels.find(item => {
            return item.skuCode1 === this.data.cartSkuCode && item.skuCode2 === this.data.cartSkuCode2
          }) || {}
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
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
      const productId = this.data.cartProductId
      this.$router.push({
        name: 'Lesson',
        params: {
          productId: productId,
          brokerId: this.agentUser ? this.userId : null
        }
      })
    },
    skuClick (e) {
      if (this.disabled) {
        return
      }
      this.$emit('skuClick', e)
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
    &.disabled {
      color: #999;
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
