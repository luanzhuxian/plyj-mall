<template>
  <div :class="{
      [$style.orderItem]: true,
      [$style.border]: border
    }"
       @click="handleClick"
  >
    <img v-lazy="img" :key="img" alt="商品图片">
    <div :class="$style.right">
      <div :class="$style.rightTop">
        <div :class="$style.name" v-text="name"></div>
        <div :class="$style.price+' rmb'" v-text="price" />
      </div>
      <div :class="$style.rightBottom">
        <div :class="$style.specification" v-text="option" />
        <div :class="$style.count" v-text="count" />
      </div>
    </div>
  </div>
</template>

<script>
import { createBrokerShare } from '../../apis/product'
export default {
  name: 'order-item',
  data () {
    return {
      brokerId: ''
    }
  },
  props: {
    border: Boolean,
    img: String,
    name: String,
    option: String,
    price: [String, Number],
    count: [String, Number],
    productSeq: String,
    routeName: String
  },
  watch: {
    productSeq (val) {
      this.getBorkerId()
    }
  },
  created () {
    this.getBorkerId()
  },
  methods: {
    handleClick (e) {
      if (this.productSeq) {
        e.stopPropagation()
        this.$router.push({
          name: this.routeName,
          params: {
            productSeq: this.productSeq,
            brokerId: this.brokerId
          }
        })
      }
    },
    async getBorkerId () {
      if (this.productSeq) {
        try {
          let share = await createBrokerShare(this.productSeq)
          share.result = share.result || {}
          this.brokerId = share.result.sequenceNbr || null
        } catch (e) {
          throw e
        }
      }
    }
  }
}
</script>

<style module lang="scss">
  .order-item {
    position: relative;
    display: flex;
    width: 100%;
    &.border {
      &:after {
        @include border-half-bottom(#e7e7e7);
      }
      padding-bottom: 30px;
    }
    > img {
      width: 140px;
      height: 140px;
      object-fit: cover;
    }
  }
  .right {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 28px 0 18px;
  }
  .right-top {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    .name {
      width: 290px;
      color: #454553;
      @include elps-wrap(2);
    }
    .price {
      margin-left: 20px;
    }
  }
  .specification {
    width: 290px;
    @include elps-wrap(2)
  }
  .right-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    color: #999;
    font-size: 22px;
    .count:before {
      content: 'x';
    }
  }
</style>
