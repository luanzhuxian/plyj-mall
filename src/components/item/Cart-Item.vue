<template>
  <div
    :class="$style.cartItem"
    v-if="data"
  >
    <img
      :class="$style.cartItemImage"
      :src="currentImage + '?x-oss-process=style/thum'"
      alt=""
      @click="goDetail"
    >

    <div :class="$style.cartItemContent">
      <div :class="$style.productName" v-text="data.productName" />
      <span :class="$style.unshelve" v-if="noSold">
        该商品已失效
      </span>

      <template v-else-if="!allDisabled && currentSkuModel.id">
        <div :class="{ [$style.currentSku]: true, [$style.disabled]: disabled }" @click.stop="skuClick">
          <div v-if="currentSkuModel">
            <span v-text="currentSkuModel.skuCode1Name" />
            <template v-if="currentSkuModel.skuCode2Name">
              ,<span v-text="currentSkuModel.skuCode2Name" />
            </template>
          </div>
          <pl-svg :class="$style.arrow" name="right" color="#ccc" />
        </div>
        <CountDown
          v-if="notStart"
          :class="$style.countDown"
          :data="data"
          :fields="{ start: 'serverTime', end: 'shoppingTimeLong'}"
          @done="countDownFinished"
        />
        <div :class="$style.priceCount" v-if="!overflowStock && !notStart">
          <i :class="$style.price + ' rmb'" v-text="currentSkuModel.price" />
          <!--<div :class="$style.count">
            <button
              :class="$style.subtract"
              @click.stop="subtract"
              :disabled="localCount <= minBuyNum || loading || disabled"
            />
            &lt;!&ndash; 用number会导致神奇的问题 &ndash;&gt;
            <input
              type="tel"
              :class="$style.input"
              :value="localCount"
              :disabled="disabled"
              @change="valueChange"
            >
            <button
              :class="$style.add"
              @click.stop="add"
              :disabled="localCount >= stock || loading || disabled"
            />
          </div>-->
          <count
            :max="stock"
            :min="minBuyNum"
            :count="count"
            :disabled="disabled"
            @change="countChange"
          />
        </div>
      </template>
      <span :class="$style.unshelve" v-if="allDisabled">
        全部售罄
      </span>
      <div
        v-if="overflowStock && !allDisabled && !noSold || !currentSkuModel.id"
        :class="$style.reelect"
      >
        <span>请重新选择商品规格</span>
        <pl-button
          round
          plain
          size="mini"
          type="primary"
          @click.stop="skuClick"
        >
          重选
        </pl-button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateCartProductCount } from '../../apis/shopping-cart'
import Count from '../Count.vue'
import { mapGetters } from 'vuex'
import CountDown from '../../components/product/Count-Down.vue'
export default {
  name: 'CartItem',
  components: {
    Count,
    CountDown
  },
  data () {
    return {
      loading: false,
      localCount: 1
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
    },
    // 下架或删除
    noSold () {
      return this.data.productStatus === 1 || this.data.productStatus === 0
    },
    // 为开始开抢
    notStart () {
      return this.data.serverTime - this.data.shoppingTimeLong < 0 && this.data.shoppingStatus === 1
    },
    currentSkuModel () {
      return this.data.skuModels.find(item => {
        return item.skuCode1 === this.data.cartSkuCode && item.skuCode2 === this.data.cartSkuCode2
      }) || {}
    },
    stock () {
      return this.currentSkuModel.stock || 1
    },
    minBuyNum () {
      return this.currentSkuModel.minBuyNum || 1
    },
    currentImage () {
      let cartSkuCode = this.data.cartSkuCode
      try {
        let currentSkuAttr = this.data.productAttributes[0].productAttributeValues.find(item => item.id === cartSkuCode)
        return currentSkuAttr.productAttributeImage[0] || this.data.productImg
      } catch (e) {
        return this.data.productImg
      }
    }
  },
  watch: {
  },
  methods: {
    async goDetail () {
      const productId = this.data.cartProductId
      this.$router.push({
        name: 'Lesson',
        params: {
          productId: productId,
          brokerId: this.userId || null
        }
      })
    },
    countDownFinished () {
      this.$emit('change')
    },
    skuClick (e) {
      if (this.disabled || this.notStart) {
        return
      }
      this.$emit('skuClick', e)
    },
    async countChange (count, next) {
      this.loading = true
      try {
        const { result } = await updateCartProductCount({
          id: this.id,
          number: count
        })
        if (result) {
          // 直接修改父组件的数据，也可以在父组件中监听change事件，通过接口来刷新数据，但是会导致接口调用频繁
          this.data.cartProductCount = count
          next()
          this.$emit('countChange', count)
        }
      } catch (err) {
        throw err
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style module lang="scss">
  .cartItem {
    display: flex;
    flex: 1;
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
  .count-down {
    position: relative;
    right: 0;
    top: 0;
    margin: 10px 0;
    padding: 0;
    background: none;
    color: #D2524C;
    opacity: 1;
  }
  .currentSku{
    position: relative;
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
    > div {
      @include elps();
    }
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
