<template>
    <div
        class="refund-apply"
        :class="$style.refundApply"
    >
        <!--订单详情-->
        <section :class="$style.orderInfo">
            <order-item
                :img="refundGoodsInfo.img"
                :name="refundGoodsInfo.name"
                :count="refundGoodsInfo.count"
                :option="refundGoodsInfo.subSku ? `${refundGoodsInfo.sku},${refundGoodsInfo.subSku}` : refundGoodsInfo.sku"
                :product-id="refundGoodsInfo.goodId"
                hide-price
                route-name="Product"
            />
        </section>
        <!--售后详情-->
        <section :class="$style.content">
            <div :class="[$style.panel, $style.panelTop]">
                <pl-fields
                    class="right-text--bold"
                    text="服务类型："
                    :right-text="refundTypeMap[form.type] || '请选择'"
                    show-right-icon
                    @click="chooseRefundType"
                />
                <!--<pl-fields
                    text="货物状态："
                    v-if="form.goodsType === orderTypeKeyMap.PHYSICAL_GOODS"
                    show-right-icon
                    @click="showGoodsType = true"
                />-->
                <pl-fields
                    :text="refundGoodsInfo.orderType === orderTypeKeyMap.PHYSICAL_GOODS ? '退货原因：' : '退款原因'"
                    :right-text="form.reasonForReturn ? form.reasonForReturn : '请选择'"
                    show-right-icon
                    @click="chooseRefundReason"
                />
                <div :class="$style.item">
                    <div :class="$style.itemLeft">
                        退款金额：
                    </div>
                    <div :class="$style.itemRight">
                        <div :class="$style.priceWrapper">
                            <div
                                id="edit"
                                :class="$style.price + ' rmb'"
                                contenteditable
                                v-text="form.amount"
                                @blur="onInput"
                            />
                        </div>
                        <div :class="$style.tips">
                            运费不可退，如有疑问，请联系商家协商
                        </div>
                    </div>
                </div>
            </div>
            <div :class="[$style.panel, $style.panelBottom]">
                <div :class="$style.reson">
                    <div>
                        原因描述：
                        <pl-input
                            type="textarea"
                            placeholder="请填写您的原因"
                            :min-rows="8"
                            :maxlength="500"
                            v-model="form.content"
                        />
                    </div>
                </div>
                <div :class="$style.images">
                    <pl-upload-img
                        :count="9"
                        :size="0.5"
                        multiple
                        v-model="form.images"
                    />
                </div>
            </div>
        </section>
        <!--提交申请-->
        <div :class="$style.footer">
            <pl-button
                size="larger"
                type="warning"
                :loading="loading"
                @click="submitApply"
            >
                提交申请
            </pl-button>
        </div>

        <!--选择售后类型-->
        <pl-popup
            title="售后类型"
            :show.sync="showRefundType"
        >
            <div :class="$style.popupContentWrapper">
                <pl-radio-group v-model="temporaryRefundType">
                    <pl-radio
                        v-for="k of Object.keys(refundTypeMap)"
                        :label="k"
                        :key="k"
                    >
                        <div :class="$style.popupItem" v-text="refundTypeMap[k]" />
                    </pl-radio>
                </pl-radio-group>
                <pl-button class="mt-22" size="large" type="warning" @click="changetRefundType">
                    确定
                </pl-button>
            </div>
        </pl-popup>

        <!--选择货物状态-->
        <pl-popup
            title="货物状态"
            :show.sync="showGoodsType"
        >
            <div :class="$style.popupContentWrapper">
                <pl-radio-group v-model="form.goodType">
                    <pl-radio
                        v-for="item of goodsStatusPopupOptions"
                        :label="item.dictDataValue"
                        :key="item.dictDataKey"
                    >
                        <div :class="$style.popupItem" v-text="item.dictDataValue" />
                    </pl-radio>
                </pl-radio-group>
                <pl-button class="mt-22" size="large" type="warning" @click="showRefundType = false">
                    确定
                </pl-button>
            </div>
        </pl-popup>

        <!--选择退款原因-->
        <pl-popup
            :show.sync="showRefundReason"
            title="退款原因"
        >
            <div :class="$style.popupContentWrapper">
                <pl-radio-group v-model="temporaryRefundReason">
                    <pl-radio
                        v-for="(item, i) of refundReasonList"
                        :label="item.dictDataValue"
                        :key="i"
                    >
                        <div :class="$style.popupItem" v-text="item.dictDataValue" />
                    </pl-radio>
                </pl-radio-group>
                <pl-button size="large" type="warning" @click="changetRefundReason">
                    确定
                </pl-button>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import {
    applyRefund,
    getMap as getRefundReasonMap,
    getMaxRefund
} from '../../../apis/order-manager'
import { mapGetters } from 'vuex'
export default {
    name: 'RefundApply',
    components: {
        OrderItem
    },
    props: {
        orderId: {
            type: String,
            default: null
        },
        orderStatus: {
            type: String,
            default: null
        },
        refundId: {
            type: String,
            default: null
        },
        // APPLY, MODIFY
        type: {
            type: String,
            default: 'APPLY'
        },
        // 1: '退款', 2: '退款退货'
        refundType: {
            type: [String, Number],
            default: null
        }
    },
    data () {
        return {
            // 页面加载中
            loading: false,
            // 是否显示 选择售后类型 弹框
            showRefundType: false,
            // TODO.当前货物状态不显示
            // 是否显示 货物状态 弹框
            showGoodsType: false,
            // 是否显示 选择退款原因 弹框
            showRefundReason: false,
            // 临时存储售后类型
            temporaryRefundType: '',
            // 临时退款原因
            temporaryRefundReason: '',
            // 退款原因列表
            refundReasonList: [],
            // 货物状态字典
            goodsStatusPopupOptions: [
                {
                    dictDataKey: '1',
                    dictDataValue: '已收到货'
                },
                {
                    dictDataKey: '2',
                    dictDataValue: '未收到货'
                }
            ],
            // 最大退款金额
            maxRefundAmount: 0,
            // 提交申请时的参数
            form: {
                // 原订单id
                orderId: '',
                // 售后类型 1-仅退款 2-退款退货
                type: '',
                // 退款原因
                reasonForReturn: '',
                // 售后图片信息
                images: [],
                // 售后描述
                content: '',
                // 申请退款金额
                amount: ''
            }
        }
    },
    computed: {
        ...mapGetters(['refundTypeMap', 'refundGoodsInfo', 'orderTypeKeyMap', 'orderStatuskeyMap']),
        refundReasonCode () {
            if (this.refundGoodsInfo.orderType !== this.orderTypeKeyMap.PHYSICAL_GOODS) return 'REASONREFUNDVIRTURALANDCLASS'
            if (this.orderStatus === this.orderStatuskeyMap.WAIT_SHIP) return 'REASONBUYERPAID'
            if (![this.orderStatuskeyMap.FINISHED, this.orderStatuskeyMap.WAIT_RECEIVE].includes(this.orderStatus)) return ''
            if (this.form.refundType !== '1') return 'REASONSRECEIVEDGOODS'
            if ([this.orderStatuskeyMap.WAIT_RECEIVE, this.orderStatuskeyMap.FINISHED].includes(this.orderStatus)) return 'REASONSRECEIVEDGOODS'
            return 'REASONSNOTRECEIVEDGOODS'
        }
    },
    async created () {
        this.form.type = String(this.refundType)
        this.form.orderId = this.orderId
        try {
            // 获取退款原因字典
            ({ result: this.refundReasonList } = await getRefundReasonMap(this.refundReasonCode));
            // 获取最大可退金额
            ({ result: this.maxRefundAmount } = await getMaxRefund(this.orderId, this.form.type))
            this.maxRefundAmount /= 100
            this.form.amount = this.maxRefundAmount
        } catch (e) {
            setTimeout(() => {
                this.$router.replace({ name: 'OrderDetail', params: { id: this.orderId } })
            }, 2000)
            throw e
        }
    },
    methods: {
        chooseRefundType () {
            this.temporaryRefundType = this.form.type
            this.showRefundType = true
        },
        changetRefundType () {
            this.form.type = this.temporaryRefundType
            this.showRefundType = false
        },
        chooseRefundReason () {
            this.temporaryRefundReason = this.form.reasonForReturn
            this.showRefundReason = true
        },
        changetRefundReason () {
            this.form.reasonForReturn = this.temporaryRefundReason
            this.showRefundReason = false
        },
        onInput (e) {
            if (Number.isNaN(Number(e.target.innerText))) {
                document.getElementById('edit').innerText = '0'
                this.form.amount = 0
            } else {
                this.form.amount = Number(e.target.innerText)
                if (this.form.amount > this.maxRefundAmount) {
                    this.form.amount = this.maxRefundAmount
                    document.getElementById('edit').innerText = this.maxRefundAmount
                    this.$warning(`最大退款金额为${ this.maxRefundAmount }`)
                }
            }
            e.target.innerText = this.form.amount
        },
        checkData () {
            if (!this.form.reasonForReturn) {
                this.$warning('请选择退款原因')
                return false
            }
            if (!this.form.amount) {
                this.$warning('退款金额必须大于0')
                return false
            }
            return true
        },
        async submitApply () {
            if (!this.checkData()) {
                return
            }
            try {
                this.loading = true
                const form = JSON.parse(JSON.stringify(this.form))
                form.amount = form.amount * 100
                const { result: refundId } = await applyRefund(form)
                if (refundId) {
                    this.$warning('申请成功')
                    setTimeout(() => {
                        this.loading = false
                        this.$router.replace({ name: 'RefundDetail', params: { id: refundId } })
                    }, 2000)
                }
            } catch (e) {
                setTimeout(() => {
                    this.loading = false
                    this.$router.replace({ name: 'OrderDetail', params: { id: this.orderId } })
                }, 2000)
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
    .refund-apply {
        box-sizing: border-box;
        min-height: 100vh;
        padding-bottom: 122px;
    }

    .order-info {
        padding: 24px;
        background-color: #FFF;
        display: flex;
    }

    .content {
        padding: 20px 24px;
    }

    .panel {
        border-radius: 20px;
        background-color: #fff;
        overflow: hidden;
        margin-bottom: 20px;
    }

    .panel-top {
        padding-left: 28px;
    }

    .panel-bottom {
        padding: 20px 28px;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 28px;
        color: #666666;
        line-height: 40px;
        padding: 34px 28px 34px 0;

        .item-right {
            display: block;
            text-align: right;
        }
    }

    .reson {
        margin-bottom: 20px;
        > div {
            font-size: 28px;
            color: #666;
            line-height: 40px;
        }
    }

    .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px 24px;
        background-color: #FFF;
    }

    .popup-content-wrapper {
        padding: 28px 24px;
        background-color: #FFF;
        overflow-y: scroll;
    }

    .popup-button-wrapper {
        padding: 16px 24px;
        background-color: #FFF;
        border-top: 1px solid #F0F0F0;
    }

    .popup-item {
        display: flex;
        align-items: center;
        flex: 1;
        font-size: 30px;
        color: #000000;
        line-height: 88px;
        border-bottom: 1px solid #F0F0F0;
        padding-right: 24px;

        &:nth-last-of-type(1) {
            border-bottom: none;
        }
    }

    .popup-item-text {
        flex: 1;
    }

    .tips {
        font-size: 22px;
        line-height: 32px;
        margin-top: 10px;
        color: #999999;
    }

    .price {
        display: inline-block;
        width: max-content !important;
        color: #FE7700;
        font-weight: 500;
        outline: none;
    }
</style>

<style lang="scss">
    .refund-apply {
        .pl-fields {
            &:nth-last-of-type(1):after {
                display: block;
            }
        }

        .pl-fields_box {
            &.large {
                height: 108px;
            }
        }

        .pl-fields_text {
            color: #666;
        }

        .pl-fields_right > .pl-fields_right_icon {
            fill: #DEDEDE;
        }

        .right-text--bold {
            .pl-fields_right > .pl-fields_right_text {
                color: #000;
                font-weight: bold;
            }
        }

        .pl-input.pl-input-small {
            min-height: auto;
        }

        .pl-input > .pl-input_box > input {
            text-align: right;
            color: #FE7700;
            font-family: HelveticaNeue-Medium;
            font-weight: 500;
        }

        .pl-textarea_box {
            padding-left: 0;

            > .pl-input-textarea {
                &::-webkit-input-placeholder {
                    font-size: 28px;
                    color: #CCCCCC;
                    line-height: 38px;
                }
            }

            > .pl-input__word-count {
                color: #CCCCCC !important;

                > i {
                    color: #CCCCCC !important;
                }
            }
        }
    }
</style>
