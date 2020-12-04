<template>
    <div :class="$style.redPacketDetail">
        <div :class="$style.status" v-text="orderStatusMap[detail.status]" />
        <div :class="$style.content">
            <div :class="$style.baseInfo">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-packet-order-icon.png" alt="">
                <div :class="$style.info">
                    <div :class="$style.name" v-text="goodsModel.name" />
                    <!-- 满减额 -->
                    <div :class="$style.price">
                        满 {{ goodsModel.sku }} 抵 {{ goodsModel.subSku }}
                    </div>
                    <div :class="$style.tips">
                        <p>暂不支持退换货  不支持开具发票</p>
                        <p>使用后发生退款，不予退回</p>
                    </div>
                    <div :class="$style.count">
                        <p class="gray-1">￥{{ goodsModel.amount }}</p>
                        <p>x{{ goodsModel.count }}</p>
                    </div>
                </div>
            </div>
            <div :class="$style.explain">
                <ModuleTitle
                    title="使用说明"
                    size="mini"
                />
                <pre
                    :class="$style.explainBox"
                    v-text="goodsModel.goodsDescription"
                />
            </div>
            <div :class="$style.amount">
                <span :class="$style.totalCount">{{ `共${detail.count}件` }}</span>
                <span class="fz-30">
                    总价：
                </span>
                <!-- 商品待付尾款时，总价 = 定金 + 尾款 -->
                <span :class="$style.totalMoney + ' fz-30 rmb'">{{ detail.amount | formatAmount }}</span>
            </div>
        </div>

        <!-- 交易信息 -->
        <div :class="[$style.otherInfo]">
            <div :class="$style.infoTop">
                <pl-list
                    title="下单时间："
                    :content="detail.createTime"
                />
                <pl-list
                    title="订单编号："
                    :content="orderId"
                />
                <pl-list
                    v-if="payMethod"
                    title="支付方式："
                    :content="payMethod.paymentMethod === 'WX' ? '微信支付' : '-'"
                />
            </div>
        </div>

        <div :class="$style.buttons">
            <pl-button type="default" round plain @click="isPopupShow = true">联系我们</pl-button>
            <pl-button type="warning" round @click="deleteOrder">删除订单</pl-button>
        </div>

    </div>
</template>

<script>
import { getOrderDetail, deleteOrder } from '../../../apis/order-manager'
import { mapGetters } from 'vuex'
import ModuleTitle from '../../../components/common/Module-Title.vue'

export default {
    name: 'RedPacketOrderDetail',
    components: {
        ModuleTitle
    },
    data () {
        return {
            detail: {},
            isPopupShow: false
        }
    },
    computed: {
        ...mapGetters(['orderStatusMap']),
        goodsModel () {
            return this.detail.goodsModel || {}
        },
        payMethod () {
            return this.detail.orderPayTransInfos && this.detail.orderPayTransInfos.slice(-1)[0]
        }
    },
    props: {
        orderId: {
            type: String,
            default: ''
        }
    },
    async activated () {
        await this.getOrderDetail()
    },
    methods: {
        async getOrderDetail () {
            const { result } = await getOrderDetail(this.orderId)
            this.detail = result
        },
        async deleteOrder () {
            await this.$confirm('是否删除当前订单？ 删除后不可找回')
            await deleteOrder(this.orderId)
            this.$success('删除成功')
            await this.$router.replace({ name: 'Orders' })
        }
    }
}
</script>

<style module lang="scss">
    .red-packet-detail {
        padding: 58px 24px 88px 24px;
    }
    .status {
        margin-bottom: 50px;
        font-size: 40px;
        font-weight: bold;
    }
    .content {
        padding: 26px 24px;
        background-color: #fff;
        border-radius: 20px;
    }
    .explain-box {
        margin-top: 14px;
        padding: 24px 30px;
        border-radius: $--radius2;
        font-size: 26px;
        white-space: pre-wrap;
        color: #666666;
        background-color: #f3f3f3;
    }
    .base-info {
        display: flex;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f0f0f0;
        > img {
            width: 244px;
        }
        > .info {
            position: relative;
            flex: 1;
            margin-left: 20px;
            font-size: 22px;
            > .name {
                width: 350px;
                line-height: 30px;
                @include elps();
            }
            > .price {
                margin-top: 14px;
                line-height: 30px;
                color: #F5882C;
            }
            > .tips {
                margin-top: 34px;
                font-size: 18px;
                color: #A8A8A8;
            }
            > .count {
                position: absolute;
                right: 0;
                top: 0;
                text-align: right;
                font-size: 22px;
                color: #999;
            }
        }
    }
    .buttons {
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 88px;
        background-color: #fff;
        > button {
            margin-right: 24px !important;
        }
    }

    .amount {
        position: relative;
        display: flex;
        margin-top: 24px;
        padding: 24px 0;
        justify-content: flex-end;
        align-items: center;
        border-top: 1px solid #e7e7e7;
        .totalCount {
            font-size: 24px;
            color: #999999;
            margin-right: 12px;
        }
        .totalMoney {
            color: $--primary-color;
        }
    }

    /** 交易信息 **/
    .other-info {
        position: relative;
        margin-top: 24px;
        line-height: 34px;
        font-size: 24px;
        border-radius: 20px;
        background-color: #fff;
        .info-top {
            padding: 24px;
            border-bottom: 1px solid #F0F0F0;
            > div {
                margin-bottom: 20px;
                &:nth-last-of-type(1) {
                    margin-bottom: 0;
                }
            }
        }
        .info-bottom {
            padding: 24px;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
        }
    }
</style>
