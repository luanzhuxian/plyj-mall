<template>
  <div
    :class="{
      [$style[size]]: true,
      [$style.orderItem]: true
    }"
    :style="{
      marginBottom: gap / 7.5 + 'vw'
    }"
    @click="handleClick"
  >
    <img
      v-lazy="img"
      :key="img"
      alt="商品图片"
    >
    <div :class="$style.right">
      <div>
        <div
          :class="$style.rightTop"
          :style="{ paddingRight: hidePrice ? '0px' : '' }"
        >
          <div
            :class="$style.name"
            v-text="name"
          />
          <div
            v-if="!hidePrice"
            :class="$style.priceWrapper"
          >
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
            :class="{
              [$style.specification]: true,
              [$style.isSubmit]: isSubmit
            }"
            v-text="option"
          />
          <div
            v-if="time"
            :class="$style.date"
          >
            <span>时间：</span>
            <span v-text="time" />
          </div>
        </div>
      </div>
      <div :class="$style.refundInfo">
        <div>
          <span
            :class="$style.tip"
            v-if="productType !== 0 && productType === 1"
          >
            支持开具发票
          </span>
          <span
            :class="$style.tip"
            v-if="productType !== 0 && productType === 2"
          >
            不支持开具发票
          </span>
          <span
            :class="$style.tip"
            v-if="productType !== 0 && productType === 2"
          >
            暂不支持退换货
          </span>
        </div>

        <span
          v-if="status"
          :class="$style.status"
          v-text="status"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OrderItem',
  data () {
    return {
      loading: false
    }
  },
  props: {
    // 两个item之间的间距
    gap: {
      type: Number,
      default: 30
    },
    size: {
      type: String,
      default: 'medium'
    },
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
    },
    time: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    // 是否在提交订单处展示，这里样式有所不同
    isSubmit: {
      type: Boolean
    },
    // 商品类型（1:实体, 2:虚拟）
    productType: {
      type: Number,
      default: 0
    },
    hidePrice: Boolean
  },
  computed: {
    ...mapGetters(['userId', 'agentUser'])
  },
  watch: {
  },
  methods: {
    handleClick (e) {
      if (this.productSeq) {
        e.stopPropagation()
        this.$router.push({
          name: this.routeName,
          params: {
            productSeq: this.productSeq,
            brokerId: this.agentUser ? this.userId : null
          }
        })
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
    &:nth-last-of-type(1) {
      margin-bottom: 0 !important;
    }
    > img {
      border-radius: $--radius2;
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
      color: #999;
      font-size: 20px;
      @include elps-wrap(2);
      &.isSubmit {
        padding: 0 8px;
        line-height: 44px;
        background-color: #f9f9f9;
        border-radius: $--radius2;
      }
    }
    .refund-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > .status {
        color: #F2B036;
        font-size: 24px;
      }
      .tip {
        font-size: 22px;
        color: #999;
      }
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
        .refund-info > .status {
          font-size: 24px;
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
        .refund-info > .status {
          font-size: 24px;
        }
      }
    }
  }
</style>
