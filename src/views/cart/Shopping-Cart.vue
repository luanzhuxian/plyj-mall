<template>
  <div class="Shopping-Cart">
    <div :class="$style.top">
      <span :class="$style.count">
        购物车宝贝 <i>10</i> 件
      </span>
      <span>管理</span>
    </div>

    <div :class="$style.productList">
      <pl-checkbox-group v-model="checkedList">
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
            />
          </template>
        </pl-checkbox>
      </pl-checkbox-group>
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
      checked: true,
      products: [
        {
          productName: '衣服',
          pId: 1,
          img: 'https://img.alicdn.com/imgextra/i4/196993935/O1CN01JfsFGC1ewH389ksVG_!!196993935.jpg'
        },
        {
          productName: '鞋子',
          pId: 2,
          img: 'https://img.alicdn.com/imgextra/i4/196993935/O1CN01JfsFGC1ewH389ksVG_!!196993935.jpg'
        },
        {
          productName: '手机',
          pId: 3,
          img: 'https://img.alicdn.com/imgextra/i4/196993935/O1CN01JfsFGC1ewH389ksVG_!!196993935.jpg'
        }
      ],
      checkedList: []
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
</style>
