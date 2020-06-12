<template>
    <div
        class="refund-apply"
        :class="$style.refundApply"
    >
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

        <section :class="$style.content">
            <div :class="[$style.panel, $style.panelTop]">
                <pl-fields
                    class="right-text--bold"
                    text="服务类型："
                    :right-text="refundTypeMap[refundType] || '请选择'"
                    show-right-icon
                    @click="showRefundType = true"
                />
                <pl-fields
                    text="货物状态："
                    v-if="refundGoodsInfo.orderType === 'PHYSICAL'"
                    show-right-icon
                />
                <pl-fields
                    :text="refundGoodsInfo.orderType === 'PHYSICAL' ? '退货原因：' : '退款原因'"
                    show-right-icon
                    :right-text="form.reasonForReturn ? form.reasonForReturn : '请选择'"
                    @click="showRefundReason = true"
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

        <pl-popup
            :show.sync="showRefundReason"
            title="退款原因"
        >
            <div :class="$style.popupContentWrapper">
                <pl-radio-group v-model="form.reasonForReturn">
                    <pl-radio
                        v-for="(item, i) of refundReasonList"
                        :label="item.dictDataValue"
                        :key="i"
                    >
                        <div :class="$style.popupItem" v-text="item.dictDataValue" />
                    </pl-radio>
                </pl-radio-group>
                <pl-button size="large" type="warning" @click="showRefundReason = false">
                    确定
                </pl-button>
            </div>
        </pl-popup>

        <pl-popup
            title="售后类型"
            :show.sync="showRefundType"
        >
            <div :class="$style.popupContentWrapper">
                <pl-radio-group v-model="form.type">
                    <pl-radio
                        v-for="k of Object.keys(refundTypeMap)"
                        :label="k"
                        :key="k"
                    >
                        <div :class="$style.popupItem" v-text="refundTypeMap[k]" />
                    </pl-radio>
                </pl-radio-group>
                <pl-button size="large" type="warning" @click="showRefundType = false">
                    确定
                </pl-button>
            </div>
        </pl-popup>
    </div>
</template>

<script>
/* eslint-disable */
    import OrderItem from '../../../components/item/Order-Item.vue'
    import {
        getOrderDetail,
        getRefundOrderDetail,
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

            // 1: '退款', 2: '退款退货'
            refundType: {
                type: [String, Number],
                default: null
            },

            // APPLY, MODIFY
            type: {
                type: String,
                default: 'APPLY'
            },
            refundId: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                showRefundType: false,
                showRefundReason: false,
                loading: false,
                refundReasonList: [],
                // 最大退款金额
                maxRefundAmount: 0,
                form: {
                    images: [],
                    reasonForReturn: '',
                    // 描述
                    content: '',
                    orderId: '',
                    // 退款类型
                    type: '',
                    amount: ''
                }
            }
        },
        computed: {
            ...mapGetters(['refundTypeMap', 'refundGoodsInfo']),
            refundReasonCode() {
                return this.refundGoodsInfo.orderType !== 'PHYSICAL'
                    ? 'REASONREFUNDVIRTURALANDCLASS'
                    : (this.orderStatus === 'WAIT_SHIP'
                        ? 'REASONBUYERPAID'
                        : (this.orderStatus === 'WAIT_RECEIVE' || this.orderStatus === 'FINISHED')
                            ? this.radio.refundType === '1'
                                ? this.radio.goodsStatus === '1'
                                    ? 'REASONSRECEIVEDGOODS'
                                    : 'REASONSNOTRECEIVEDGOODS'
                                : 'REASONSRECEIVEDGOODS'
                            : '')
            }
        },
        async created () {
            this.form.type = String(this.refundType);
            this.form.orderId = this.orderId
            try {
                ({result: this.refundReasonList} = await getRefundReasonMap(this.refundReasonCode));
                ({result: this.maxRefundAmount} = await getMaxRefund(this.orderId, this.form.type));
                this.form.amount = this.maxRefundAmount / 100;
            } catch (e) {
                setTimeout(() => {
                    this.$router.replace({ name: 'OrderDetail', params: { id: this.orderId } })
                }, 2000)
                throw e
            }
        },
        methods: {
            async submitApply() {
                if (!this.checkData()) {
                    return
                }
                try {
                    this.loading = true
                    let form = JSON.parse(JSON.stringify(this.form))
                    form.amount = form.amount * 10
                    const { result } = await applyRefund(form)
                    if (result) {
                        this.$warning('申请成功')
                        setTimeout(() => {
                            this.loading = false
                            this.$router.replace({ name: 'OrderDetail', params: { id: this.orderId } })
                        }, 2000)
                    }
                } catch (e) {
                    setTimeout(() => {
                        this.loading = false
                        this.$router.replace({ name: 'OrderDetail', params: { id: this.orderId } })
                    }, 2000)
                    throw e
                }
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
            onInput(e) {
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
