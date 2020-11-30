<template>
    <div :class="$style.redPacketDetail">
        <div :class="$style.status" v-text="orderStatusMap[detail.status]" />
        <div :class="$style.content">
            <div :class="$style.baseInfo">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-packet-order-icon.png" alt="">
                <div :class="$style.info">
                    <div :class="$style.name" v-text="goodsModel.name" />
                    <!-- 满减额 -->
                    <div :class="$style.price" v-text="goodsModel.sku" />
                    <div :class="$style.tips">
                        <p>暂不支持退换货  不支持开具发票</p>
                        <p>使用后发生退款，不予退回</p>
                    </div>
                    <span :class="$style.count">x{{ goodsModel.count }}</span>
                </div>
            </div>
            <div :class="$style.intro">
                <span>使用时间</span>
                <i>{{ detail.startExpire | dateFormat('YYYY-MM-DD') }} - {{ detail.endExpire | dateFormat('YYYY-MM-DD') }}</i>
            </div>
            <div :class="$style.intro">
                <span>使用说明</span>
                <pre :class="$style.explain" v-text="goodsModel.goodsDescription" />
            </div>
        </div>

        <div :class="$style.buttons">
            <pl-button type="default" round plain>联系我们</pl-button>
            <pl-button type="warning" round @>删除订单</pl-button>
        </div>
    </div>
</template>

<script>
import { getOrderDetail, deleteOrder } from '../../../apis/order-manager'
import { mapGetters } from 'vuex'
export default {
    name: 'RedPacketOrderDetail',
    data () {
        return {
            detail: {}
        }
    },
    computed: {
        ...mapGetters(['orderStatusMap']),
        goodsModel () {
            return this.detail.goodsModel || {}
        }
    },
    props: {
        orderId: {
            type: String,
            default: ''
        }
    },
    async created () {
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
            await this.$router.replace({ name: 'OrderList' })
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
                font-size: 22px;
                color: #999;
            }
        }
    }
    .intro {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 26px;
        font-size: 26px;
        > .explain {
            width: 654px;
            word-break: break-all;
            white-space: pre-wrap;
            margin-top: 16px;
            padding: 24px 30px;
            color: #666;
            background-color: #f3f3f3;
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
</style>
