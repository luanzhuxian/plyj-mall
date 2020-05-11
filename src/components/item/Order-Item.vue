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
            :src="img + '?x-oss-process=style/thum-middle'"
            v-imgError
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
        <div
            v-if="[2,3,4,5,6,7].includes(activeProduct) && preActive === 2"
            :class="{
                [$style.activeTag]: true,
                [$style.publicBenefitTag]: activeProduct === 7
            }">
            {{ skuSourceMap[activeProduct] }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { skuSourceMap } from '../../assets/js/constant'
export default {
    name: 'OrderItem',
    data () {
        return {
            loading: false,
            // 2团购 3限时秒杀 4预购 6-组合聚惠学 --> 暂不支持退换货 + 不支持线上发票
            notSupportActiveProductStatus: [2, 3, 4, 6],
            skuSourceMap
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
        // 2团购 3限时秒杀 4预购 5春耘 6组合课
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

        orderType: {
            type: String,
            default: ''
        },
        supportRefund: {
            type: Number,
            default: -1
        },
        allowInvoice: {
            type: Number,
            default: -1
        },
        hidePrice: Boolean,
        // 所属活动状态  0删除，1正常，2关闭
        activityStatus: {
            type: Number,
            default: 0
        },
        // 所属活动 id
        activityId: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['userId', 'agentUser'])
    },
    methods: {
        handleClick (e) {
            if (this.productId) {
                e.stopPropagation()
                const query = {}
                // 公益活动
                if (Number(this.activeProduct) === 7 && this.activityStatus === 1) {
                    query.currentProductStatus = 7
                    query.activityId = this.activityId
                }
                this.$router.push({
                    name: this.routeName,
                    params: {
                        productId: this.productId,
                        brokerId: this.userId || null
                    },
                    query
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
  .public-benefit-tag {
      color: #FFFFFF;
      background-color: #75A4FF;
  }

</style>
