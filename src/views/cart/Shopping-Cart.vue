<template>
  <div :class="$style.shoppingCart">
    <div :class="$style.top">
      <span :class="$style.count">
        购物车宝贝 <i>10</i> 件
      </span>
      <span
        :class="$style.manage"
        @click="isManage = !isManage"
        v-text="isManage ? '完成' : '管理'"
      />
    </div>

    <div :class="$style.productList">
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
        >
          <template v-slot:suffix>
            <CartItem
              :data="item"
              :key="item.id"
            />
          </template>
        </pl-checkbox>
      </pl-checkbox-group>
    </div>

    <div :class="$style.settlement">
      <pl-checkbox
        :checked="checkedAll"
        @change="checkAll"
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
      <div>
        <span
          v-if="!isManage"
          class="fz-22 gray-3 mr-10"
        >
          不含运费
        </span>
        <span
          v-if="!isManage"
          class="fz-24 mr-10"
        >
          合计：
          <i class="rmb fz-28 primary-color">0.00</i>
        </span>
        <button
          :class="$style.settlementBtn"
          @click="settlement"
          v-if="!isManage"
        >
          结算(0)
        </button>
        <button
          v-if="isManage"
          :class="$style.delete"
          :disabled="checkedList.length === 0"
          @click="removePro"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CartItem from '../../components/item/Cart-Item.vue'
import {
  getCartList,
  deleteCartProducts
} from '../../apis/shopping-cart'
export default {
  name: 'ShoppingCart',
  components: {
    CartItem
  },
  data () {
    return {
      checkedAll: false,
      products: [],
      checkedList: [],
      isManage: false
    }
  },
  activated () {
    this.getList()
  },
  deactivated () {
    this.isManage = false
  },
  methods: {
    async getList () {
      try {
        const { result } = await getCartList()
        this.$set(this, 'products', result)
        this.$forceUpdate()
      } catch (e) {
        throw e
      }
    },
    selectedChange (selected) {
      this.checkedAll = selected.length === this.products.length
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
        this.checkedList = []
        this.getList()
      } catch (e) {
        throw e
      }
    },
    // 结算
    settlement () {
      this.$router.push({ name: 'SubmitOrder' })
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
    &:after {
      @include border-half-bottom(#e7e7e7)
    }
  }
  .selectedCount {
    font-size: 22px;
    color: #b0b0b0;
  }
  .settlement-btn {
    width: 176px;
    height: 70px;
    font-size: 24px;
    color: #fff;
    background-color: $--warning-color;
    border-radius: $--radius2;
  }
  .delete {
    width: 120px;
    height: 58px;
    font-size: 24px;
    color: $--primary-color;
    border: 2px solid $--primary-color;
    border-radius: $--radius2;
    &:disabled {
      opacity: 0.5;
    }
  }
</style>
