<template>
  <div :class="$style.cartItem">
    <img
      :class="$style.cartItemImage"
      :src="img"
      alt=""
    >

    <div :class="$style.cartItemContent">
      <div
        :class="$style.productName"
        v-text="name"
      />

      <div
        :class="$style.specification"
        @click="showSpecifica = true"
      >
        <span>123123</span>
        <pl-svg
          :class="$style.arrow"
          name="right"
          color="#ccc"
        />
      </div>

      <div :class="$style.priceCount">
        <i :class="$style.price + ' rmb'">10000.00</i>
        <count
          :count="count"
        />
      </div>
    </div>

    <SpecificationPop
      :data="specifications"
      :product-image="img"
      :visible.sync="showSpecifica"
      @confirm="specChanged"
    />
  </div>
</template>

<script>
import Count from '../../components/Count.vue'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
export default {
  name: 'CartItem',
  components: {
    Count,
    SpecificationPop
  },
  data () {
    return {
      showSpecifica: false
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    },
    // 规格列表数据
    specifications: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    // 改变规格
    specChanged (current) {
      console.log(current)
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
  .specification {
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
