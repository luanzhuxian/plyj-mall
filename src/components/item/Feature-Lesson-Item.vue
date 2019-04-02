<template>
  <div :class="$style.feature + ' radius-20'" @click="handleClick">
    <!-- 特色课组件 -->
    <img v-lazy="img" :key="img" alt="">
    <div :class="$style.right">
      <div>
        <h3 v-text="title" />
        <div :class="$style.sellCount" v-if="time && count">
          <pl-svg name="time2" />
          <span><i v-text="time"></i>小时</span>
          <span>已售 <i v-text="count" /></span>
        </div>
        <div :class="$style.desc" v-if="desc" v-text="desc"></div>
      </div>
      <price :price="price" :original-price="originalPrice" size="small" />
    </div>
    <pl-svg :class="$style.cart" name="shopping-cart" />
  </div>
</template>

<script>
import Price from '../Price.vue'
import { createBrokerShare } from '../../apis/product'
export default {
  name: 'Feature-Lesson-Item',
  components: {
    Price
  },
  props: {
    img: String,
    title: String,
    time: String,
    count: [String, Number],
    price: [String, Number],
    originalPrice: [String, Number],
    productSeq: String,
    desc: String
  },
  methods: {
    async handleClick () {
      let { result } = await createBrokerShare(this.productSeq)
      // this.$router.push({ name: 'FeatureLesson', params: { productSeq: this.productSeq, brokerId: result ? result.sequenceNbr : null } })
      this.$router.push({ name: 'Lesson', params: { productSeq: this.productSeq, brokerId: result ? result.sequenceNbr : null } })
    }
  }
}
</script>

<style module lang="scss">
.feature {
  position: relative;
  display: flex;
  height: 180px;
  margin-top: 28px;
  background-color: #fff;
  overflow: hidden;
  img {
    width: 270px;
    height: 100%;
    object-fit: cover;
    border: none;
  }
}
.right {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 16px 20px;
  h3 {
    width: 260px;
    font-size: 28px;
    line-height: 38px;
    color: #000;
    font-weight: bold;
    @include elps-wrap(1);
  }
}
  .sell-count {
    display: inline-flex;
    align-items: center;
    margin-top: 10px;
    color: #999;
    font-size: 20px;
    span {
      margin-right: 20px;
    }
    svg {
      width: 20px;
      margin-right: 6px;
      fill: #999;
    }
  }
  .desc {
    display: inline-flex;
    width: 270px;
    align-items: center;
    margin-top: 10px;
    color: #999;
    font-size: 20px;
    @include elps-wrap(1);
  }
  .cart {
    position: absolute;
    top: 50%;
    right: 48px;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    padding: 10px;
    fill: var(--warning-color);
  }
</style>
