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
                v-text="auditStatusMap[auditStatus] || refundStatusMap[refundStatus]"
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
                <span :class="$style.price">{{ refundAmount }}</span>
            </div>
            <div :class="$style.buttons">
                <span
                    :class="$style.reundType"
                    v-text="refundTypeMap[refundType]"
                />
                <!--商家确认之前，即在 1:待退货 2:待收货 3:退货完成 4:待退款 支持 取消申请 -->
                <pl-button
                    v-if="[1, 2, 3, 4].includes(refundStatus)"
                    round
                    plain
                    @click="doOperation('cancelApplication')"
                >
                    取消申请
                </pl-button>
                <!-- 退款成功/失败 支持删除 -->
                <pl-button
                    v-if="[6, 7].includes(refundStatus)"
                    round
                    plain
                    @click="doOperation('deleteOrder')"
                >
                    删除
                </pl-button>
                <!--任何状态都 支持 查看详情-->
                <pl-button
                    round
                    plain
                    @click="$router.push({ name: 'RefundDetail', params: { id: orderId } })"
                >
                    查看详情
                </pl-button>
                <!--待退货 支持去填写 寄件运单号(根据后台返回的退换货状态，1-为待退货)-->
                <pl-button
                    :class="$style.large"
                    v-if="refundStatus === 1"
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
        auditStatus: {
            type: Number,
            default: 0
        },
        // 退换货状态 1:待退货 2:待收货 3:退货完成 4:待退款 5:退款中 6:退款成功 7:退款失败
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
        refundAmount: {
            type: [Number, String],
            default: 0
        }
    },
    computed: {
        ...mapGetters(['orderTypeMap', 'orderTypeKeyMap', 'auditStatusMap', 'orderStatusMap', 'orderStatuskeyMap', 'refundTypeMap'])
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
