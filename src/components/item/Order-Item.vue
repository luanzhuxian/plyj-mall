<template>
  <div
    :class="{
      [$style[size]]: true,
      [$style.orderItem]: true,
      [$style.border]: border
    }"
    @click="handleClick"
  >
    <img
      v-lazy="img"
      :key="img"
      alt="商品图片"
    >
    <div :class="$style.right">
      <div class="">
        <div :class="$style.rightTop">
          <div
            :class="$style.name"
            v-text="name"
          />
          <div :class="$style.priceWrapper">
            <div
              :class="$style.price + ' rmb'"
              v-text="price"
            />
            <div
              :class="$style.count"
              v-text="count"
            />
          </div>
        </div>
        <div :class="$style.rightBottom">
          <div
            :class="$style.specification"
            v-text="option"
          />
          <div :class="$style.date">
            <span>时间：</span>
            <span>2019.12.1</span>
          </div>
        </div>
      </div>
      <div :class="$style.refundInfo">
        退款中
      </div>
    </div>
  </div>
</template>

<script>
import { createBrokerShare } from '../../apis/product'
export default {
  name: 'OrderItem',
  data () {
    return {
      brokerId: '',
      loading: false
    }
  },
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    border: Boolean,
    img: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    option: {
      type: String,
      default: ''
    },
    price: {
      type: [String, Number],
      default: 0
    },
    count: {
      type: [String, Number],
      default: 0
    },
    productSeq: {
      type: String,
      default: ''
    },
    routeName: {
      type: String,
      default: ''
    }
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
      if (this.productSeq && !this.loading) {
        try {
          this.loading = true
          let share = await createBrokerShare(this.productSeq)
          share.result = share.result || {}
          this.brokerId = share.result.sequenceNbr || null
        } catch (e) {
          throw e
        } finally {
          this.loading = false
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
      // &:after {
      //   @include border-half-bottom(#e7e7e7);
      // }
      padding-bottom: 30px;
    }
    > img {
      object-fit: cover;
    }
    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
    }
    .right-top {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding-right: 100px;
      height: 52px;
      .name {
        flex: 1;
        line-height: 26px;
        color: #454553;
        font-size: 22px;
        @include elps-wrap(2);
      }
      .price-wrapper {
        position: absolute;
        right: 0;
        top: 0;
      }
      .price {
        font-size: 24px;
      }
      .count {
        text-align: right;
        color: #999;
        font-size: 22px;
        &::before {
          content: 'x';
        }
      }
    }
    .right-bottom {
      display: flex;
      color: #999;
      font-size: 20px;
    }
    .specification {
      // width: 290px;
      @include elps-wrap(2)
    }
    .refund-info {
      text-align: right;
      color: #F2B036;
    }
    &.medium {
      > img {
        width: 164px;
        height: 164px;
      }
      .right {
        padding-left: 24px;
      }
      .right-top {
        .refund-info {
          font-size: 24px;
          line-height: 32px;
        }
      }
    }
    &.small {
      > img {
        width: 140px;
        height: 140px;
      }
      .right {
        padding-left: 16px;
      }
      .right-top {
        .refund-info {
          font-size: 24px;
          line-height: 32px;
        }
      }
    }
  }
</style>
