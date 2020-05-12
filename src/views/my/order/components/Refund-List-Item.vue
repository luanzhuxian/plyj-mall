<template>
    <div :class="$style.listItem">
        <div>
            <div :class="$style.listItemLeft">
                <span
                    :class="$style.tag"
                    v-text="orderTypeMap[orderType]"
                />
                <pl-list
                    title="退单号："
                    :content="orderId"
                />
            </div>
            <p
                :class="$style.status"
                v-text="orderStatusMap[orderStatus]"
            />
        </div>
        <OrderItem
            :img="goodsImages"
            :name="goodsName"
            :option="subSkuName ? `${skuName},${subSkuName}` : skuName"
            :count="count"
            :price="unitPrice"
            border
        />
        <div :class="$style.listItemBottom">
            <div :class="$style.priceWrapper">
                <span :class="$style.totalCount">{{ `共${count}件商品` }}</span>
                <span :class="$style.bold">总价：</span>
                <span :class="$style.price">{{ actualRefund }}</span>
            </div>
            <div :class="$style.buttons">
                <span
                    :class="$style.reundType"
                    v-text="refundTypeMap[refundType]"
                />
                <pl-button
                    v-if="refundStatus === 'WAIT_CHECK'"
                    round
                    plain
                    @click="doOperation('cancelApplication')"
                >
                    取消申请
                </pl-button>
                <pl-button
                    v-if="~['FINISHED', 'CLOSED', 'CANCEL', 'REJECT'].indexOf(refundStatus)"
                    round
                    plain
                    @click="doOperation('deleteOrder')"
                >
                    删除
                </pl-button>
                <pl-button
                    v-if="~['WAIT_CHECK', 'REFUND_PRODUCT', 'FINISHED', 'REFUNDING'].indexOf(refundStatus)"
                    round
                    plain
                    @click="$router.push({ name: 'RefundDetail', params: { id: orderId } })"
                >
                    查看详情
                </pl-button>
                <pl-button
                    :class="$style.large"
                    v-if="refundStatus === 'REFUND_PRODUCT_WAIT_RETURN'"
                    type="warning"
                    plain
                    round
                    @click="$router.push({ name: 'RefundDetail', params: { id: orderId } })"
                >
                    寄件运单号
                </pl-button>
            </div>
        </div>
    </div>
</template>

<script>
import OrderItem from '../../../../components/item/Order-Item.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'RefundListItem',
    components: {
        OrderItem
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
        // 退换货类型 1:仅退款 2:退款退货
        refundType: {
            type: Number,
            default: 0
        },
        // 退换货状态
        refundStatus: {
            type: Number,
            default: 0
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
        // 实际退款金额
        actualRefund: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters(['orderTypeMap', 'orderStatusMap', 'refundTypeMap'])
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
  button {
    box-sizing: border-box;
    margin-left: 24px;
    width: 136px;
    padding: 0;
  &:nth-of-type(1) {
     margin-left: 40px;
   }
  }
  .large {
    width: auto;
    padding: 0 25px;
  // background-color: #FFF !important;
  // border: 1px solid #FE7700 !important;
  // color: #FE7700 !important;
  }
  }
  .reund-type {
    font-size: 24px;
    color: #FE7700;
    line-height: 32px;
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
</style>
