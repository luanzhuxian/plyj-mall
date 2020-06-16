<template>
    <div :class="$style.listItem">
        <div>
            <div :class="$style.listItemLeft">
                <span :class="$style.tag">预购</span>
                <pl-list title="订单编号：" :content="orderId" />
            </div>
            <p :class="$style.status" v-text="orderStatusMap[orderStatus]" />
        </div>
        <order-item
            :img="goodsImages"
            :name="goodsName"
            :option="subSkuName ? `${skuName},${subSkuName}` : skuName"
            :count="count"
            :price="unitPrice"
            :status="refundStatusMap[businessStatus]"
            border
        />
        <div :class="$style.listItemBottom">
            <div :class="$style.priceWrapper">
                <span :class="$style.totalCount">共{{ count }}件商品</span>
                <span :class="$style.bold">定金：</span>
                <span :class="$style.price">{{ orderIntentionAmount | formatAmount }}</span>
            </div>
            <div :class="$style.priceWrapper">
                <span :class="$style.bold">待付尾款：</span>
                <span :class="$style.price">{{ orderAmountTailMoney | formatAmount }}</span>
            </div>
            <div :class="$style.buttons">
                <div :class="$style.time">
                    <template v-if="!pastDue">
                        <span>{{ isStart? '剩余尾款支付时间' : '距离开始支付时间' }}</span>
                        <span v-show="countDown.d !== '00'">{{ countDown.d }}天</span>
                        <span v-show="countDown.h !== '00'">{{ countDown.h }}时</span>
                        <span>{{ countDown.m }}分</span>
                        <span>{{ countDown.s }}秒</span>
                    </template>
                </div>
                <!--未开始/已过期/实体商品 不支持 去付尾款-->
                <pl-button
                    type="warning"
                    round
                    :disabled="!isStart || pastDue || (orderType === 'PHYSICAL_GOODS')"
                    :loading="isPayloading"
                    @click.stop="doOperation('pay')"
                >
                    {{ pastDue ? '已过期' : isStart ? '去付尾款' : '未开始支付' }}
                </pl-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OrderItem from '../../../../components/item/Order-Item.vue'
export default {
    name: 'WaitPayListItem',
    components: {
        OrderItem
    },
    computed: {
        ...mapGetters(['refundStatusMap', 'orderStatusMap', 'orderStatuskeyMap'])
    },
    props: {
        index: {
            type: Number,
            default: 0
        },
        // 订单id
        orderId: {
            type: String,
            default: ''
        },
        // 订单类型
        orderType: {
            type: String,
            default: ''
        },
        // 订单状态
        orderStatus: {
            type: String,
            default: ''
        },
        // 商品图片
        goodsImages: {
            type: String,
            default: ''
        },
        // 商品名称
        goodsName: {
            type: String,
            default: ''
        },
        // 一级规格
        skuName: {
            type: String,
            default: ''
        },
        // 二级规格
        subSkuName: {
            type: String,
            default: ''
        },
        // 商品单价
        unitPrice: {
            type: Number,
            default: 0
        },
        // 商品数量
        count: {
            type: Number,
            default: 0
        },
        // 售后状态
        businessStatus: {
            type: Number,
            default: 0
        },
        // 定金
        orderIntentionAmount: {
            type: Number,
            default: 0
        },
        // 尾款
        orderAmountTailMoney: {
            type: Number,
            default: 0
        },
        // 是否开始二次支付时间
        isStart: {
            type: Boolean,
            default: false
        },
        // 二次支付时间是否过期
        pastDue: {
            type: Boolean,
            default: false
        },
        // 二次支付倒计时信息
        countDown: {
            type: Object,
            default () {
                return {}
            }
        },
        // 是否正在支付
        isPayloading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
    // 取消订单
        async doOperation (operationName) {
            try {
                this.$emit(operationName, this.index)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style  module lang="scss">
  .list-item {
    margin-bottom: 20px;
    padding: 0 24px 28px;
    border-radius: 20px;
    background-color: #fff;
    > div {
      &:nth-of-type(1) {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 22px 0 36px;
      }
    }
    .status {
      color: $--primary-color;
      font-size: 24px;
      line-height: 34px;
    }
  }
  .list-item-bottom {
    margin-top: 16px;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
    }
    .price-wrapper {
      display: flex;
      align-items: center;
    }
    .total-count {
      font-size: 20px;
      font-family: MicrosoftYaHeiUI;
      color: #999999;
      margin-right: 12px;
    }
    .bold {
      font-size: 30px;
      font-weight: bold;
      color: #333333;
    }
    .price {
      align-self: flex-end;
      font-size: 32px;
      color: #FE7700;
      &:before {
        // margin-right: 10px;
        padding-bottom: 4px;
        font-size: 20px;
        content: '¥';
      }
    }
    .buttons {
      margin-top: 24px;
      > button {
        margin-left: 24px;
      }
    }
  }
  .list-item-left {
    display: inline-flex;
    align-items: center;
    .tag {
      width: 104px;
      height: 28px;
      background: #F2B036;
      border-radius: 14px;
      font-size: 20px;
      color: #FFFFFF;
      line-height: 28px;
      margin-right: 12px;
      text-align: center;
    }
  }
  .time {
    font-size: 24px;
    color: #999;
  }
</style>
