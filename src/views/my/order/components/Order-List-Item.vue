<template>
    <div :class="$style.listItem">
        <div>
            <div :class="$style.listItemLeft">
                <span
                    :class="$style.tag"
                    v-text="orderTypeMap[orderType]"
                />
                <pl-list
                    title="订单编号："
                    :content="orderId"
                />
            </div>
            <p
                :class="$style.status"
                v-text="orderStatusMap[orderStatus]"
            />
        </div>
        <order-item
            :img="goodsImages"
            :name="goodsName"
            :option="subSkuName ? `${skuName},${subSkuName}` : skuName"
            :count="count"
            :price="unitPrice"
            :status="refundStatusMap[businessStatus] || ''"
            :active-product="skuSource"
            :pre-active="skuSource !== 1 ? 2 : ''"
            border
        />
        <div :class="$style.listItemBottom">
            <div :class="$style.priceWrapper">
                <span :class="$style.totalCount">{{ `共${count}件商品` }}</span>
                <span :class="$style.bold">总价：</span>
                <span :class="$style.price">{{ amount }}</span>
            </div>
            <div :class="$style.buttons">
                <!--正常待付款 支持 付款(目前只区别于预购的待付尾款)-->
                <pl-button
                    v-if="orderStatus === orderStatuskeyMap.WAIT_PAY"
                    type="warning"
                    round
                    :loading="isPayloading"
                    :disabled="isPayloading"
                    @click="doOperation('pay')"
                >
                    去付款
                </pl-button>
                <!--预购 待付尾款-->
                <pl-button
                    v-if="orderStatus === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY"
                    type="warning"
                    round
                    :loading="isPayloading"
                    :disabled="isPayloading || !isStart || pastDue"
                    @click="doOperation('pay')"
                >
                    {{ pastDue ? '已过期' : isStart ? '去付尾款' : '未开始付尾款' }}
                </pl-button>
                <!-- 待付款/待付尾款 支持 取消订单-->
                <pl-button
                    v-if="[orderStatuskeyMap.WAIT_PAY, orderStatuskeyMap.WAIT_PAY_TAIL_MONEY].includes(orderStatus)"
                    round
                    plain
                    @click="doOperation('cancelOrder')"
                >
                    取消订单
                </pl-button>
                <!--订单完成/关闭 支持删除订单-->
                <pl-button
                    v-if="[orderStatuskeyMap.FINISHED, orderStatuskeyMap.CLOSED].includes(orderStatus)"
                    round
                    plain
                    @click="doOperation('deleteOrder')"
                >
                    删除订单
                </pl-button>
                <!--TODO.当前不支持查看物流 实体 + 待收货/订单完成 支持查看物流-->
                <pl-button
                    v-if="false && orderType === orderTypeKeyMap.PHYSICAL_GOODS && [orderStatuskeyMap.WAIT_RECEIVE, orderStatuskeyMap.FINISHED].includes(orderStatus)"
                    round
                    plain
                    @click="$router.push({ name: 'Freight', params: { orderId: orderId }, query: { img: goodsImages } })"
                >
                    查看物流
                </pl-button>
                <!--实体 + 待收货 支持确认收货-->
                <pl-button
                    v-if="orderType === orderTypeKeyMap.PHYSICAL_GOODS && (orderStatus === orderStatuskeyMap.WAIT_RECEIVE)"
                    type="warning"
                    round
                    @click="doOperation('confirmReceipt')"
                >
                    确认收货
                </pl-button>
                <!--知识课程 + 订单完成 支持 去学习-->
                <pl-button
                    v-if="orderType === orderTypeKeyMap.KNOWLEDGE_COURSE && (orderStatus === orderStatuskeyMap.FINISHED)"
                    type="warning"
                    round
                    @click="$router.push({ name: 'Courses', params: { courseType: '1' } })"
                >
                    去学习
                </pl-button>
                <!--虚拟商品/正式课/体验课 + 待收货 支持 去使用-->
                <pl-button
                    v-if="[orderTypeKeyMap.PHYSICAL_GOODS, orderTypeKeyMap.FORMAL_CLASS, orderTypeKeyMap.EXPERIENCE_CLASS].includes(orderType) && orderStatus === orderStatuskeyMap.WAIT_RECEIVE"
                    type="warning"
                    round
                    @click="$router.push({ name: 'OrderDetail', params: { orderId: orderId } })"
                >
                    去使用
                </pl-button>
                <!--订单完成 + 未评论 支持 去评价-->
                <pl-button
                    v-if="orderStatus === orderStatuskeyMap.FINISHED && commentStatus === 0"
                    round
                    plain
                    @click="$router.push({ name: 'OrderDetail', params: { orderId: orderId } })"
                >
                    去评价
                </pl-button>
            </div>
            <!--付款倒计时-->
            <div class="fz-24 gray-3 mt-28" v-if="[orderStatuskeyMap.WAIT_PAY_TAIL_MONEY, orderStatuskeyMap.WAIT_PAY].includes(orderStatus) && isStart && !pastDue">
                <span v-show="isStart">剩余{{ orderStatus === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY? '尾款': '' }}支付时间：</span>
                <span v-show="!isStart">距离开始支付时间：</span>
                <span v-show="countDown.d !== '00'">{{ countDown.d }}天</span>
                <span v-show="countDown.h !== '00'">{{ countDown.h }}时</span>
                <span>{{ countDown.m }}分</span>
                <span>{{ countDown.s }}秒</span>
            </div>
        </div>
    </div>
</template>

<script>
import OrderItem from '../../../../components/item/Order-Item.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'OrderListItem',
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
        // 售后状态 NO_AFTER_SALES:无售后 PROCESSING:处理中 PROCESSING_COMPLETED:处理完成
        aftersaleStatus: {
            type: String,
            default: ''
        },
        // 商品来源 1-普通商品 2-团购 3-限时秒杀 4-预购 5-春耘计划 6-组合聚惠学 7-公益助力
        skuSource: {
            type: Number,
            default: 0
        },
        // 订单总价
        amount: {
            type: [Number, String],
            default: 0
        },
        // 是否正在支付
        isPayloading: {
            type: Boolean,
            default: false
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
        //  是否评论
        commentStatus: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters(['skuSourceKeyMap', 'orderTypeMap', 'orderTypeKeyMap', 'orderStatusMap', 'orderStatuskeyMap', 'refundStatusMap', 'aftersaleStatusKeyMap'])
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

<style module lang="scss">
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
