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
                <div :class="$style.rightTop">
                    <div
                        :class="$style.name"
                        v-text="name"
                    />
                    <div :class="$style.priceWrapper">
                        <div
                            v-if="!hidePrice"
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
                        v-if="supportRefund === 0 || notSupportActiveProductStatus.indexOf(activeProduct) !== -1"
                    >
                        暂不支持退换货
                    </span>
                    <span
                        :class="$style.tip"
                        v-if="allowInvoice === 0 || notSupportActiveProductStatus.indexOf(activeProduct) !== -1"
                    >
                        不支持线上发票
                    </span>
                </div>
                <span
                    v-if="status"
                    :class="$style.status"
                    v-text="status"
                />
            </div>
        </div>
        <div v-if="activeProduct === 3 && preActive === 2" :class="$style.activeTag">限时秒杀</div>
        <div v-else-if="activeProduct === 2 && preActive === 2" :class="$style.activeTag">团购</div>
        <div v-else-if="activeProduct === 4 && preActive === 2" :class="$style.activeTag">预购</div>
        <div v-else-if="activeProduct === 5 && preActive === 2" :class="$style.activeTag">春耘</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'OrderItem',
    data () {
        return {
            loading: false,
            // 2团购 3限时秒杀 4预购 这三种状态的商品 --> 暂不支持退换货 + 不支持线上发票
            notSupportActiveProductStatus: [2, 3, 4]
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
        activeProduct: {
            type: [String, Number],
            default: 1
        },
        preActive: {
            type: [String, Number],
            default: 0
        },
        productId: {
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

        // 商品类型（1:实体, 2:虚拟）
        productType: {
            type: Number,
            default: 0
        },
        supportRefund: {
            type: Number,
            default: -1
        },
        allowInvoice: {
            type: Number,
            default: -1
        },
        hidePrice: Boolean
    },
    computed: {
        ...mapGetters(['userId', 'agentUser'])
    },
    created () {
    },
    watch: {
        activeProduct (val) {
            // console.log(val)
        }
    },
    methods: {
        handleClick (e) {
            if (this.productId) {
                e.stopPropagation()
                this.$router.push({
                    name: this.routeName,
                    params: {
                        productId: this.productId,
                        brokerId: this.userId || null
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
      border-radius: 4px;
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
      height: 52px;
      .name {
        flex: 1;
        line-height: 26px;
        padding-right: 10px;
        color: #454553;
        font-size: 22px;
        @include elps-wrap(2);
      }
      .price-wrapper {
        width: max-content;
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
      padding-right: 100px;
      color: #999;
      font-size: 20px;
    }
    .specification {
      width: 100%;
      font-size: 20px;
      padding: 0 8px;
      line-height: 44px;
      background-color: #f9f9f9;
      border-radius: $--radius2;
    }
    .refund-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 8px;
      > .status {
        color: #F2B036;
        font-size: 24px;
      }
      .tip {
        font-size: 22px;
        color: #999;
        &:nth-of-type(1) {
          margin-right: 10px;
        }
      }
    }
    &.medium {
      position: relative;
      > img {
        width: 244px;
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
      position: relative;
      > img {
        width: 208px;
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
  .active-tag {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 8px;
    line-height: 30px;
    text-align: center;
    color: #FF3323;
    font-size: 22px;
    background-color: #EFE0C3;
  }
</style>
