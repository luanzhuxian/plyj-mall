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
                v-text="orderStatusDesc"
            />
        </div>
        <order-item
            :img="orderType === 'RED_ENVELOPE' ? 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-packet-order-icon.png' : goodsImages"
            :name="goodsName"
            :option="orderType === 'RED_ENVELOPE' ? `满${skuName}抵${subSkuName}` : (subSkuName ? `${skuName},${subSkuName}` : skuName)"
            :count="count"
            :price="localFormatAmount(unitPrice)"
            :status="refundStatusDesc"
            :active-product="skuSource"
            :pre-active="skuSource !== 1 ? 2 : ''"
            border
        />
        <div :class="$style.listItemBottom">
            <div :class="$style.priceWrapper">
                <span :class="$style.totalCount">{{ `共${count}件` }}</span>
                <span :class="$style.bold">总价：</span>
                <!-- 商品待付尾款时，总价 = 定金 + 尾款 -->
                <span :class="$style.price + ' fz-30 rmb'">{{ (orderStatus === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY ? amount + orderAmountTailMoney : amount) | formatAmount }}</span>
            </div>
            <div :class="$style.buttons">
                <!--正常待付款 支持 付款(目前只区别于预购的待付尾款), 组合聚惠学 + 春耘 不支持二次付款-->
                <pl-button
                    v-if="skuSource !== skuSourceKeyMap.SPRINGPLOUGHING && skuSource !== skuSourceKeyMap.COURSEPACKAGE && orderStatus === orderStatuskeyMap.WAIT_PAY"
                    type="warning"
                    round
                    :loading="isPayloading"
                    :disabled="isPayloading || pastDue"
                    @click="doOperation('pay')"
                >
                    {{ pastDue ? '已过期' : '去付款' }}
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
                <!-- 待付款 支持 取消订单-->
                <pl-button
                    v-if="orderStatuskeyMap.WAIT_PAY === orderStatus"
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
                    v-if="[orderTypeKeyMap.KNOWLEDGE_COURSE, orderTypeKeyMap.SERIES_OF_COURSE].includes(orderType) && (orderStatus === orderStatuskeyMap.FINISHED)"
                    type="warning"
                    round
                    @click="$router.push({ name: 'VideoCourses', params: { courseType: orderTypeKeyMap.KNOWLEDGE_COURSE === orderType ? '1' : '2' } })"
                >
                    去学习
                </pl-button>
                <!--虚拟商品/正式课/体验课 + 待收货 支持 去使用-->
                <pl-button
                    v-if="[orderTypeKeyMap.VIRTUAL_GOODS, orderTypeKeyMap.FORMAL_CLASS, orderTypeKeyMap.EXPERIENCE_CLASS].includes(orderType) && orderStatus === orderStatuskeyMap.WAIT_RECEIVE"
                    type="warning"
                    round
                    @click="$router.push({ name: 'OrderDetail', params: { orderId: orderId } })"
                >
                    去使用
                </pl-button>
                <!-- 实体商品/虚拟商品/正式课/体验课 + 订单完成 + 未评论 支持 去评价-->
                <pl-button
                    v-if="isCommentBtnShow"
                    round
                    plain
                    @click="$router.push({ name: 'CommentOrder', params: { orderId: orderId, productImg: goodsImages } })"
                >
                    去评价
                </pl-button>
            </div>
            <!--付款倒计时-->
            <div class="fz-24 gray-3 mt-28"
                 v-if="(skuSource !== skuSourceKeyMap.SPRINGPLOUGHING && skuSource !== skuSourceKeyMap.COURSEPACKAGE) &&
                     (
                         (orderStatuskeyMap.WAIT_PAY === orderStatus && isStart && !pastDue)
                     || (orderStatuskeyMap.WAIT_PAY_TAIL_MONEY === orderStatus && !isStart && !pastDue)
                     )"
            >
                <span v-show="isStart">剩余{{ orderStatus === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY? '尾款': '' }}支付时间：</span>
                <span v-show="!isStart">距离开始支付时间：</span>
                <span v-show="d !== '00'">{{ d }}天</span>
                <span v-show="h !== '00'">{{ h }}时</span>
                <span>{{ m }}分</span>
                <span>{{ s }}秒</span>
            </div>
        </div>
    </div>
</template>

<script>
import OrderItem from '../../item/Order-Item.vue'
import { mapGetters } from 'vuex'
import filter from '../../../filter'
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
        // 商品单价（分）
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
            type: [Number, String],
            default: ''
        },
        // 售后单审核状态
        auditStatus: {
            type: [Number, String],
            default: ''
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
        // 核销码信息
        redeemCodeModels: {
            type: Array,
            default () {
                return []
            }
        },
        // 订单总价（分）
        amount: {
            type: [Number, String],
            default: 0
        },
        // 尾款金额
        orderAmountTailMoney: {
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
        // 二次支付倒计时信息: 天
        d: {
            type: String,
            default: '00'
        },
        // 二次支付倒计时信息: 小时
        h: {
            type: String,
            default: '00'
        },
        // 二次支付倒计时信息: 分
        m: {
            type: String,
            default: '00'
        },
        // 二次支付倒计时信息: 秒
        s: {
            type: String,
            default: '00'
        },
        //  是否评论
        commented: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            localFormatAmount: filter.formatAmount
        }
    },
    computed: {
        ...mapGetters(['skuSourceKeyMap', 'orderTypeMap', 'orderTypeKeyMap', 'orderStatusMap', 'orderStatuskeyMap', 'aftersaleStatusMap', 'aftersaleStatusKeyMap']),
        refundStatusDesc () {
            if (this.skuSource === this.skuSourceKeyMap.NORMAL && this.aftersaleStatus === this.aftersaleStatusKeyMap.PROCESSING && !(this.auditStatus === 2 && this.businessStatus === 1)) {
                return '售后中'
            }
            if (this.skuSource === this.skuSourceKeyMap.NORMAL && this.aftersaleStatus === this.aftersaleStatusKeyMap.PROCESSING_COMPLETED) {
                return '退款完成'
            }
            return ''
        },
        orderStatusDesc () {
            // 虚拟订单 待收货 改为 待使用； 订单完成 还未评价的 待评价
            return [this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(this.orderType) &&
                  this.orderStatuskeyMap.WAIT_RECEIVE === this.orderStatus
                ? this.orderStatusMap[this.orderStatuskeyMap.WAIT_RECEIVE_OF_VIRTUAL] : this.isCommentBtnShow ? '待评价' : this.orderStatusMap[this.orderStatus]
        },
        // 是否显示评价按钮 实体/虚拟/正式课/体验课 + 订单完成 + 无售后 + 未评论
        isCommentBtnShow () {
            return this.orderStatus === this.orderStatuskeyMap.FINISHED &&
              this.aftersaleStatus === this.aftersaleStatusKeyMap.NO_AFTER_SALES &&
              !this.commented &&
              [this.orderTypeKeyMap.PHYSICAL_GOODS, this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(this.orderType)
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
