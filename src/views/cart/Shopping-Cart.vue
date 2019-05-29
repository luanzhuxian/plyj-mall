<template>
  <div class="Shopping-Cart">
    <div :class="$style.top">
      <span :class="$style.count">
        购物车宝贝 <i>10</i> 件
      </span>
      <span>管理</span>
    </div>

    <div :class="$style.productList">
      <pl-checkbox-group
        v-model="checkedList"
        ref="checkboxGroup"
        @change="selectedChange"
      >
        <pl-checkbox
          v-for="item of products"
          :key="item.pId"
          :data="item"
          :gap-column="24"
        >
          <template v-slot:suffix>
            <CartItem
              :name="item.productName"
              :img="item.img"
              :count="item.count"
              :specifications="item.priceModels"
            />
          </template>
        </pl-checkbox>
      </pl-checkbox-group>
    </div>

    <div :class="$style.settlement">
      <pl-checkbox
        v-model="checkedAll"
        @change="checkAll"
      >
        <span
          slot="suffix"
          class="fz-24 gray-2 ml-10"
        >
          全选
        </span>
      </pl-checkbox>
      <div>
        <span class="fz-22 gray-3 mr-10">不含运费</span>
        <span class="fz-24 mr-10">
          合计：<i class="rmb fz-28 primary-color">0.00</i>
        </span>
        <button
          :class="$style.settlementBtn"
        >
          结算(0)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CartItem from '../../components/item/Cart-Item.vue'
export default {
  name: 'ShoppingCart',
  components: {
    CartItem
  },
  data () {
    return {
      checkedAll: false,
      products: [
        {
          productName: '衣服',
          pId: 1,
          img: 'https://img.alicdn.com/imgextra/i4/196993935/O1CN01JfsFGC1ewH389ksVG_!!196993935.jpg',
          count: 12,
          priceModels: [
            {
              optionCode: 1,
              optionName: '衣服1',
              minBuyNum: 2,
              originPrice: 123,
              price: 12
            },
            {
              optionCode: 2,
              optionName: '衣服2',
              minBuyNum: 2,
              originPrice: 123,
              price: 13
            }
          ]
        },
        {
          productName: '鞋子',
          pId: 2,
          img: 'https://img.alicdn.com/imgextra/i4/196993935/O1CN01JfsFGC1ewH389ksVG_!!196993935.jpg',
          count: 1,
          priceModels: [
            {
              optionCode: 1,
              optionName: '鞋子1',
              minBuyNum: 3,
              originPrice: 211,
              price: 21
            },
            {
              optionCode: 2,
              optionName: '鞋子2',
              minBuyNum: 3,
              originPrice: 222,
              price: 22
            }
          ]
        },
        {
          productName: '手机',
          pId: 3,
          img: 'https://img.alicdn.com/imgextra/i4/196993935/O1CN01JfsFGC1ewH389ksVG_!!196993935.jpg',
          count: 3,
          priceModels: [
            {
              optionCode: 1,
              optionName: '手机1',
              minBuyNum: 1,
              originPrice: 333,
              price: 33
            },
            {
              optionCode: 2,
              optionName: '手机2',
              minBuyNum: 1,
              originPrice: 111,
              price: 11
            }
          ]
        }
      ],
      checkedList: []
    }
  },
  methods: {
    selectedChange (selected) {
      if (selected.length === this.products.length) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
    },
    checkAll () {
      this.$refs.checkboxGroup.changeAll(this.checkedAll)
    }
  }
}
</script>

<style module lang="scss">
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
  .settlement-btn {
    width: 176px;
    height: 70px;
    font-size: 24px;
    color: #fff;
    background-color: $--warning-color;
    border-radius: $--radius2;
  }
</style>
