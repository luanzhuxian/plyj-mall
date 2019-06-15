<template>
  <div :class="$style.shoppingCart">
    <div :class="$style.top">
      <span :class="$style.count">
        购物车宝贝 <i v-text="total" /> 件
      </span>
      <span
        v-if="products.length > 0"
        :class="$style.manage"
        @click="manage"
        v-text="isManage ? '完成' : '管理'"
      />
    </div>

    <template v-if="products.length > 0">
      <div
        :class="$style.productList"
        v-if="!loading"
      >
        <pl-checkbox-group
          v-model="checkedList"
          ref="checkboxGroup"
          @change="selectedChange"
        >
          <pl-checkbox
            v-for="item of products"
            :key="item.id"
            :data="item"
            :gap-column="24"
            border
          >
            <template v-slot:suffix="{ data }">
              <CartItem
                :data="data"
                :key="data.id"
                :cart-list="products"
                @skuChange="skuChange"
                @countChange="computeMoney"
              />
            </template>
          </pl-checkbox>
        </pl-checkbox-group>
      </div>
      <!-- 结算或删除 -->
      <div :class="$style.settlement">
        <pl-checkbox
          :checked="checkedAll"
          @change="checkAll"
          border
        >
          <span
            slot="suffix"
            class="fz-24 gray-2 ml-10"
          >
            全选
            <i
              v-if="isManage"
              :class="$style.selectedCount"
            >
              (共{{ checkedList.length }}件)
            </i>
          </span>
        </pl-checkbox>

        <div :class="$style.control">
          <span
            v-show="!isManage"
            class="fz-22 gray-3"
          >
            不含运费
          </span>
          <span
            v-show="!isManage"
            class="fz-24"
          >
            合计：
            <i
              :class="$style.summation + ' rmb'"
              v-text="summation"
            />
          </span>
          <button
            :class="$style.settlementBtn"
            @click="settlement"
            :disabled="checkedList.length === 0"
            v-show="!isManage"
          >
            结算({{ checkedList.length }})
          </button>
          <button
            v-show="isManage"
            :class="$style.delete"
            :disabled="checkedList.length === 0"
            @click="removePro"
          >
            删除
          </button>
        </div>
      </div>
    </template>

    <NoContent
      v-else-if="!loading"
      text="那么多好商品，你都不加入购物车吗？"
    />

    <!--<CartItemSkeleton v-if="loading" />-->
    <!--<CartItemSkeleton v-if="loading" />-->
  </div>
</template>

<script>
import CartItem from '../../components/item/Cart-Item.vue'
import NoContent from '../../components/No-Content.vue'
// import CartItemSkeleton from '../../components/skeleton/Cart-Item.vue'
import {
  getCartList,
  deleteCartProducts
} from '../../apis/shopping-cart'
export default {
  name: 'ShoppingCart',
  components: {
    CartItem,
    // CartItemSkeleton,
    NoContent
  },
  data () {
    return {
      checkedAll: false,
      products: [],
      checkedList: [],
      isManage: false,
      total: 0,
      loading: false,
      summation: 0 // 合计
    }
  },
  created () {
    try {
      this.getList()
    } catch (e) {
      throw e
    }
  },
  methods: {
    resetState () {
      this.checkedAll = false
      this.total = 0
      this.summation = 0
    },
    async getList () {
      this.loading = true
      try {
        const { result } = await getCartList()
        this.resetState()
        const disabledList = []
        for (let item of result) {
          // 如果商品已下架或当前规格商品数量不足，禁用
          const currentSku = item.skuModels.find(sku => sku.optionCode === item.cartSkuCode)
          item.disabled = currentSku.stock < item.cartProductCount || item.productStatus === 'UNSHELVE'
          if (item.disabled) {
            disabledList.push(item)
          }
        }
        // 将禁用的挪到最后
        for (let item of disabledList) {
          result.splice(result.indexOf(item), 1)
          result.push(item)
        }
        this.products = result
        this.total = result.length
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    selectedChange (selected) {
      this.checkedAll = selected.length === this.products.filter(item => !item.disabled).length
      this.computeMoney()
    },
    // 管理
    manage () {
      this.checkAll(false)
      this.isManage = !this.isManage
      for (let item of this.products) {
        if (this.isManage) {
          // 管理时，所有项都可选中，同时记录原有禁用状态
          item.tempDisabled = item.disabled
          item.disabled = false
        } else {
          item.disabled = item.tempDisabled
          delete item.tempDisabled
        }
      }
    },
    checkAll (val) {
      this.checkedAll = val
      this.$refs.checkboxGroup.changeAll(val)
    },
    async removePro () {
      let ids = []
      for (let item of this.checkedList) {
        ids.push(item.id)
      }
      await this.$confirm(`确定将这${ids.length}个宝物删除？`)
      try {
        await deleteCartProducts(ids)
        this.checkedList.splice(0, 500)
        this.getList()
      } catch (e) {
        throw e
      }
    },
    // 结算
    settlement () {
      let confirmList = []
      if (this.checkedList.length === 0) return
      for (let pro of this.checkedList) {
        const { cartProductCount, cartProductId, cartSkuCode, agentUser } = pro
        confirmList.push({
          productId: cartProductId,
          optionCode: cartSkuCode,
          count: cartProductCount,
          agentUser
        })
      }
      localStorage.setItem('CONFIRM_LIST', JSON.stringify(confirmList))
      this.$router.push({ name: 'SubmitOrder' })
    },
    computeMoney () {
      let total = 0
      for (let item of this.checkedList) {
        const skuCode = item.cartSkuCode
        const skuModels = item.skuModels
        const count = item.cartProductCount
        const currentSku = skuModels.find(item => item.optionCode === skuCode)
        total += currentSku.price * 100 * count
      }
      this.summation = total / 100
    },
    // 规格变化
    skuChange (data) {
      this.isDouble(data)
      this.computeMoney()
    },
    // 判断当前规格是否已经存在于购物车中，如果存在，删之
    isDouble (data) {
      let currentSkuCount = this.products.filter(cartPro => cartPro.cartSkuCode === data.cartSkuCode)
      if (currentSkuCount.length >= 2) {
        this.products.splice(this.products.indexOf(data), 1)
        this.checkedList.splice(this.checkedList.indexOf(data), 1)
      }
    }
  }
}
</script>

<style module lang="scss">
  .shoppingCart {
    padding-bottom: 200px;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 24px;
    font-size: 24px;
    color: #fff;
    background-color: $--warning-color;
    .count > i {
      font-weight: bold;
    }
  }
  .manage {
    font-size: 28px;
  }
  .productList {
    padding:  20px 24px;
  }
  .settlement {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 92px;
    padding: 0 24px;
    left: 0;
    bottom: 88px;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 4;
    &:after {
      @include border-half-bottom(#e7e7e7)
    }
  }
  .selectedCount {
    font-size: 22px;
    color: #b0b0b0;
  }
  .control {
    display: inline-flex;
    align-items: center;
    line-height: 50px;
    > span {
      margin-right: 12px;
    }
    .settlement-btn {
      width: 176px;
      height: 70px;
      font-size: 24px;
      color: #fff;
      background-color: $--warning-color;
      border-radius: $--radius2;
      &:disabled {
        color: #fff;
        background-color: #ccc;
      }
    }
    .summation {
      color: $--primary-color;
    }
  }
  .delete {
    width: 120px;
    height: 58px;
    font-size: 24px;
    color: $--primary-color;
    border: 2px solid $--primary-color;
    border-radius: $--radius2;
    &:disabled {
      color: #ccc;
      border-color: #cfcfcf;
    }
  }
</style>
