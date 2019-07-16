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
      <div :class="$style.productList" v-if="!loading">
        <pl-checkbox-group
          v-model="checkedList"
          ref="checkboxGroup"
          @change="selectedChange"
        >
          <pl-checkbox
            v-for="(item, i) of products"
            :key="i"
            :data="item"
            :gap-column="24"
            border
          >
            <template v-slot:suffix="{ data }">
              <CartItem
                :data="data"
                :disabled="isManage"
                @countChange="computeMoney"
                @skuClick="skuClick(data)"
              />
            </template>
          </pl-checkbox>
        </pl-checkbox-group>
      </div>
      <!-- 结算或删除 -->
      <div :class="$style.settlement">
        <pl-checkbox :checked="checkedAll" @change="checkAll" border>
          <span slot="suffix" class="fz-24 gray-2 ml-10">
            全选
            <i v-if="isManage" :class="$style.selectedCount">
              (共{{ checkedList.length }}件)
            </i>
          </span>
        </pl-checkbox>

        <div :class="$style.control">
          <span v-show="!isManage" class="fz-22 gray-3">
            不含运费
          </span>
          <span v-show="!isManage" class="fz-24">
            合计：
            <i :class="$style.summation + ' rmb'" v-text="summation" />
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
            :disabled="checkedList.length === 0 || removing"
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
    <CartItemSkeleton v-if="loading" />
    <SpecificationPop
      :default-count="cartProductCount"
      :visible.sync="showSpecifica"
      :sku-attr-list="productAttributes"
      :sku-list="skuModels"
      :product-image="productImg"
      :sku="currentSku"
    >
      <template v-slot:footer="{ currentSku, revert }">
        <pl-button
          type="warning"
          size="large"
          :loading="updating"
          @click="specChanged(currentSku, revert)"
        >
          确定
        </pl-button>
      </template>
    </SpecificationPop>
  </div>
</template>

<script>
/* eslint-disable */
import CartItem from '../../components/item/Cart-Item.vue'
import NoContent from '../../components/No-Content.vue'
import CartItemSkeleton from '../../components/skeleton/Cart-Item.vue'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import {
  getCartList,
  deleteCartProducts,
  updateCartProductSku
} from '../../apis/shopping-cart'
export default {
  name: 'ShoppingCart',
  components: {
    CartItem,
    CartItemSkeleton,
    NoContent,
    SpecificationPop
  },
  data () {
    return {
      checkedAll: false,
      products: [],
      checkedList: [],
      isManage: false,
      total: 0,
      loading: false,
      updating: false,
      removing: false,
      showSpecifica: false,
      currentPro: {},
      currentSku: {},
      summation: 0 // 合计
    }
  },
  computed: {
    productAttributes () {
      return this.currentPro.productAttributes || []
    },
    skuModels () {
      return this.currentPro.skuModels || []
    },
    cartProductCount () {
      return this.currentPro.cartProductCount || 1
    },
    productImg () {
      return this.currentPro.productImg || ''
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
          const currentSku = item.skuModels.find(sku => {
            return sku.skuCode1 === item.cartSkuCode && sku.skuCode2 === item.cartSkuCode2
          })
          item.disabled = currentSku ? (currentSku.stock < item.cartProductCount || item.productStatus !== 2) : true
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
        this.currentPro = this.products[0] || {}
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    skuClick (data) {
      this.currentPro = data
      this.currentSku = this.currentPro.skuModels.find(item => {
        return item.skuCode1 === this.currentPro.cartSkuCode && item.skuCode2 === this.currentPro.cartSkuCode2
      }) || {}
      if (this.currentSku.id) {
        this.currentSku.count = data.cartProductCount
      }
      this.showSpecifica = true
      this.$nextTick(() => {
        this.$nextTick(() => {
        })
      })
    },
    // 改变规格
    async specChanged (option, revert) {
      try {
        // 请求修改
        this.updating = true
        const { skuCode1, count, skuCode2 } = option
        const isUpdateSku = await updateCartProductSku({
          id: this.currentPro.id,
          skuCode: skuCode1,
          skuCode2: skuCode2,
          number: count
        })
        // 刷新显示
        if (isUpdateSku.result) {
          // 直接修改父组件的数据，也在父组件中监听change事件，通过接口来刷新数据。但是会导致接口调用频繁
          // 直接修改可以触发计算属性，使得数据真实一致
          this.currentPro.cartSkuCode = skuCode1
          this.currentPro.cartSkuCode2 = skuCode2
          this.currentPro.cartProductCount = count
          if (this.currentPro.hasOwnProperty('disabled')) {
            // 修改完成后，取消禁用，如果禁用的话
            this.currentPro.disabled = false
          }
          this.showSpecifica = false
          this.$set(this.products, this.products.indexOf(this.currentPro), this.currentPro)
          this.computeMoney()
          this.isDouble(option)
        } else {
          // 修改失败，回滚选框中的值
          revert()
        }
      } catch (e) {
        // 修改失败，回滚选框中的值
        revert()
        throw e
      } finally {
        this.updating = false
      }
    },
    selectedChange (selected) {
      if (!this.isManage) {
        this.checkedAll = selected.length === this.products.filter(item => !item.disabled).length
        this.computeMoney()
      }
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
        this.removing = true
        await deleteCartProducts(ids)
        this.checkedList.splice(0, 500)
        this.getList()
      } catch (e) {
        throw e
      } finally {
        this.removing = false
      }
    },
    // 结算
    settlement () {
      let confirmList = []
      if (this.checkedList.length === 0) return
      for (let pro of this.checkedList) {
        const { cartProductCount, cartProductId, cartSkuCode, cartSkuCode2, agentUser } = pro
        confirmList.push({
          productId: cartProductId,
          skuCode1: cartSkuCode,
          skuCode2: cartSkuCode2,
          count: cartProductCount,
          agentUser
        })
      }
      localStorage.setItem('CONFIRM_LIST', JSON.stringify(confirmList))
      this.$router.push({
        name: 'SubmitOrder',
        query: {
          isCart: true
        }
      })
    },
    // 根据id查找规格id
    computeMoney () {
      let total = 0
      for (let item of this.checkedList) {
        const skuCode1 = item.cartSkuCode
        const skuCode2 = item.cartSkuCode2
        const skuModels = item.skuModels
        const count = item.cartProductCount
        const currentSku = skuModels.find(item => item.skuCode1 === skuCode1 && item.skuCode2 === skuCode2)
        total += currentSku.price * 100 * count
      }
      this.summation = total / 100
    },
    // 判断当前规格是否已经存在于购物车中，如果存在，删之
    isDouble (options) {
      // 查找此规格对应的商品
      let currentSkuCount = this.products.filter(cartPro => {
        return cartPro.cartSkuCode === options.skuCode1 && cartPro.cartSkuCode2 === options.skuCode2
      })
      if (currentSkuCount.length >= 2) {
        this.products.splice(this.products.indexOf(currentSkuCount[0]), 1)
        this.checkedList.splice(this.checkedList.indexOf(currentSkuCount[0]), 1)
      }
    }
  },
  beforeRouteEnter (to, form, next) {
    next(vm => {
      if (!vm.$store.getters.mobile) {
        vm.$confirm('您还没有绑定手机，请先绑定手机')
          .then(() => {
            localStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
              name: form.name,
              params: form.params,
              query: form.query
            }))
            this.$router.replace({ name: 'BindMobile' })
          })
          .catch(() => {
            vm.$router.replace({
              name: form.name,
              params: form.params,
              query: form.query
            })
          })
      }
    })
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
    border-bottom: 1px solid #e7e7e7;
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
