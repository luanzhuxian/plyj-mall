<template>
    <div>
        <div
            v-if="totalAmount > 0 && activeProduct === 1 && showInvoiceSelector"
            :class="$style.itemSelector" @click.capture="selectInvoice"
        >
            <pl-fields
                size="middle"
                text="发票"
                icon="icon-invoice"
                :icon-gap="12"
                show-right-icon
                :right-text="invioceType === 0 ? '不需要' : '纸质发票'"
                left-text-weight="bold"
            />
        </div>
        <pl-popup :show.sync="showPopup">
            <div :class="$style.invioceBox">
                <div :class="$style.title">
                    是否需要发票？
                </div>
                <div :class="$style.content">
                    <button @click="noNeed">
                        不需要
                    </button>
                    <button @click="need">
                        纸质发票
                    </button>
                </div>
            </div>
        </pl-popup>
    </div>
</template>

<script>
export default {
    name: 'SubmitOrderInvoice',
    data () {
        return {
            showPopup: false,
            invioceType: 0
        }
    },
    props: {
        totalAmount: {
            type: Number,
            default: 0
        },
        activeProduct: {
            type: Number,
            default: 1
        },
        physicalProducts: {
            type: Array,
            default () {
                return []
            }
        },
        contactInfoModel: {
            type: Object,
            default () {
                return {}
            }
        },
        products: {
            type: Array,
            default () {
                return []
            }
        }
    },
    computed: {
        showInvoiceSelector () {
            return this.products.some(item => item.supportInvoice === 1)
        }
    },
    mounted () {
        const INVOICE_MODEL = this.$store.getters['submitOrder/invoiceInfo']
        if (INVOICE_MODEL && INVOICE_MODEL.invoiceType !== undefined) {
            this.$emit('selected', INVOICE_MODEL)
            this.invioceType = 1
        }
    },
    methods: {
        selectInvoice () {
            if (!this.physicalProducts.length && !this.contactInfoModel.name) {
                this.$warning('请先填写联系人信息')
                return
            }
            this.showPopup = true
        },
        noNeed () {
            this.invioceType = 0
            this.showPopup = false
            this.$storm.commit('submitOrder/removeInvoiceInfo')
            this.$emit('selected', null)
        },
        need () {
            this.$store.commit('submitOrder/setInvoiceProducts', {
                products: [
                    // 只有 支持申请发票 并且 商品实付款不为0 才可被选择申请发票
                    ...this.products.filter(item => item.amount !== 0 && item.supportInvoice === 1)
                ],
                fromRoute: {
                    name: this.$route.name,
                    params: this.$route.params,
                    query: this.$route.query
                }
            })
            if (this.contactInfoModel.mobile) {
                this.$router.push({
                    name: 'ApplyInvoice',
                    query: {
                        receiveMobile: this.contactInfoModel.mobile,
                        receiveName: this.contactInfoModel.name
                    }
                })
            } else {
                this.$router.push({ name: 'ApplyInvoice' })
            }
            this.showPopup = false
        }
    }
}
</script>

<style module lang="scss">
    .item-selector {
        margin-bottom: 20px;
        padding-left: 24px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
    }
    .invioceBox {
        .title {
            position: relative;
            height: 114px;
            line-height: 114px;
            font-size: 36px;
            padding: 0 40px;
            border-bottom: 1px solid #e7e7e7;
        }
        .content {
            padding: 62px 40px;
            > button {
                width: 100%;
                height: 88px;
                margin-bottom: 28px;
                font-size: 32px;
                color: #387AF6;
                font-weight: 500;
                background-color: #F1F0F7;
                border-radius: $--radius2;
            }
        }
    }
</style>
