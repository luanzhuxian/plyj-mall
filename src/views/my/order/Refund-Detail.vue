<template>
    <RefundDetailSkeleton v-if="detailLoading" />
    <div v-else :class="$style.refundDetail">
        <div :class="$style.title">
            <top-text
                :title="auditStatusMap[refundDetail.auditStatus] || refundStatusMap[refundStatus]"
                :tip="auditStatusSuggestionMap[refundDetail.auditStatus] || suggestionMap[refundStatus]"
            />
        </div>
        <!--实体订单,退换货状态 1:待退货 2:待收货 3:退货完成 4:待退款 5:退款中 6:退款成功 显示 退货物流 + 退货信息-->
        <section
            v-if="needReturnProduct && [1, 2, 3, 4, 5, 6].includes(refundStatus)"
            :class="[$style.panel, $style.expressPanel]"
        >
            <!--售后状态 非待退货1 显示退货物流信息-->
            <div v-if="refundStatus !== 1" :class="$style.expressItem">
                <pl-svg :class="$style.expressIcon" name="icon-express" />
                <div :class="$style.right">
                    <div :class="[$style.main, $style.bold]" v-text="refundDetail.logisticsCompany" />
                    <div :class="$style.sub" v-text="`运单号：${refundDetail.shipmentNumber}`" />
                </div>
            </div>
            <div :class="$style.expressItem">
                <pl-svg :class="$style.expressIcon" name="icon-express-receive" />
                <div :class="$style.right">
                    <div :class="$style.main">
                        <span :class="$style.name" v-text="`退货信息：${adressInfo.realName}`" />
                        <span :class="$style.phone" v-text="adressInfo.mobile" />
                    </div>
                    <div :class="$style.sub" v-text="adressInfo.addressPrefix" />
                </div>
            </div>
        </section>

        <!--实体订单,退款退货 + 待退货 填写物流信息, 由后台决定，待退货状态则显示-->
        <section
            v-if="refundStatus === 1"
            :class="[$style.panel, $style.expressInfoPanel]"
        >
            <pl-fields
                text="快递公司："
                :right-text="form.expressName || '请选择'"
                right-text-weight="bold"
                show-right-icon
                @click="isPickerShow=true"
            />
            <pl-form-item>
                <label for="expressNo" :class="$style.expressNo"> 快递单号：</label>
                <pl-input
                    type="text"
                    v-model="form.expressNo"
                    placeholder="请输入快递单号"
                    align="right"
                />
            </pl-form-item>
        </section>

        <!--退款金额-详情 + 退款进度-->
        <section :class="[$style.panel, $style.amountPanel]">
            <div :class="$style.top">
                <!--应退金额-->
                <div :class="$style.item">
                    <span :class="[$style.itemLeft, $style.bold]"> 应退金额：</span>
                    <span :class="$style.itemRight">
                        <div v-if="refundDetail.refundableAmount" :class="$style.price">
                            ￥{{ refundDetail.refundableAmount | formatAmount }}
                        </div>
                    </span>
                </div>
                <!--实退金额-->
                <div :class="[$style.item, $style.larger]">
                    <span :class="[$style.itemLeft, $style.bold]"> 实退金额：</span>
                    <span v-if="refundDetail.refundsAmount" :class="[$style.itemRight, $style.price]">
                        ￥{{ refundDetail.refundsAmount | formatAmount }}
                    </span>
                </div>
                <!--退款成功6/退款失败7 将不显示 不退还金额 内容, 即在钱到手后不再显示不退部分的信息-->
                <div v-if="![6, 7].includes(refundStatus)" :class="$style.tips">
                    <!--实体订单 + 发货后 + 运费不为0  运费不可退-->
                    <template v-if="needReturnProduct && orderDetails.freight">运费{{ orderDetails.freight | formatAmount }}不可退</template>
                    <template v-if="orderDetails.couponAmount">优惠劵{{ orderDetails.couponAmount | formatAmount }}元不可退，</template>
                    <template v-if="orderDetails.scholarship">红包(奖学金){{ orderDetails.scholarship | formatAmount }}元不可退，</template>
                    如有疑问，请联系商家协商
                </div>
                <!-- 4:待退款 5:退款中 6:退款成功-->
                <div v-if="[4, 5, 6].includes(refundStatus)" :class="$style.tips">
                    <div>退款返还您的实际付款金额，优惠劵、红包(奖学金)将不予退回</div>
                    <div>退款到帐时间，请查看您的付款账户</div>
                </div>
            </div>
            <div :class="$style.bottom">
                <collapse v-model="collepseActiveNames" :accordion="!!refundProgress.length">
                    <collapse-item name="1" title="退款进度">
                        <pl-timeline>
                            <pl-timeline-item
                                v-for="(item, i) of refundProgress"
                                :key="i"
                                :timestamp="item.createTime"
                            >
                                <div :class="$style.refundProgressContent" v-text="item.operatingLog" />
                            </pl-timeline-item>
                        </pl-timeline>
                    </collapse-item>
                </collapse>
            </div>
        </section>

        <!--订单详情 + 退款描述 + 上传凭证图片-->
        <div :class="[$style.panel, $style.refundInfoPanel]">
            <module-title title="退款信息" size="mini" />
            <div :class="$style.productInfo">
                <order-item
                    :img="goodsModel.img"
                    :name="goodsModel.name"
                    :price="goodsModel.sellingPrice"
                    :count="goodsModel.count"
                    :option="goodsModel.subSku ? `${goodsModel.sku},${goodsModel.subSku}` : goodsModel.sku"
                    :product-id="orderDetails.goodId"
                    :order-type="orderDetails.orderType"
                />
            </div>
            <div :class="$style.infoList">
                <pl-list title="退单编号：" :content="refundDetail.id" />
                <pl-list title="订单编号：" :content="orderDetails.id" />
                <pl-list title="服务类型：" :content="refundTypeMap[refundType]" />
                <pl-list
                    v-if="orderDetails.orderType === orderTypeKeyMap.PHYSICAL_GOODS"
                    title="货物状态："
                    :content="orderStatuskeyMap.FINISHED === orderDetails.status? '已收到货' : '未收到货'"
                />
                <pl-list
                    v-if="refundDetail.reasonForReturn"
                    title="退款原因："
                    :content="refundDetail.reasonForReturn"
                />
                <pl-list title="申请件数：" :content="`${orderDetails.count}件`" />
                <pl-list title="申请时间：" :content="refundDetail.createTime" />
            </div>
            <div :class="[$style.infoList, $style.borderTop]" v-if="refundDetail.urls.length || refundDetail.content">
                <pl-list
                    v-if="refundDetail.content"
                    title="问题描述："
                    :content="refundDetail.content"
                />
                <pl-list
                    v-if="refundDetail.urls.length"
                    :class="$style.imgListWrapper"
                    title="问题描述："
                >
                    <div :class="$style.imgList">
                        <img v-imgError
                             v-for="(img, i) of refundDetail.urls"
                             :key="i"
                             :src="img + '?x-oss-process=style/thum'"
                             v-img-error
                             v-imger:refundImg="img"
                             alt="退款图片"
                        >
                    </div>
                </pl-list>
            </div>
        </div>

        <!--退款退货1 + 待退货1 填写物流信息 后确认按钮-->
        <div v-if="refundStatus === 1" :class="$style.footerSubmit">
            <pl-button size="larger" type="warning" :loading="loading" :disabled="loading" @click="submit">
                提交申请
            </pl-button>
        </div>

        <div v-else :class="$style.footer">
            <!--6:退款成功 7:退款失败 可删除-->
            <pl-button
                v-if="[6, 7].includes(refundStatus)"
                round
                plain
                @click="deleteOrder"
            >
                删除
            </pl-button>
            <pl-button
                round
                plain
                @click="isPopupShow=true"
            >
                联系我们
            </pl-button>
            <!--auditStatus 0 取消售后 1 待审核 2 审核通过 3 退款驳回 -->
            <!--在售后单 待审核状态 才可修改退单-->
            <pl-button
                v-if="refundDetail.auditStatus === 1"
                round
                plain
                @click="modifyRefund"
            >
                更改退单
            </pl-button>
            <!--商家确认之前，即在 1:待退货 2:待收货 3:退货完成 4:待退款 支持 取消申请 -->
            <pl-button
                v-if="[1, 2, 3, 4].includes(refundStatus)"
                round
                plain
                @click="cancelApplication"
            >
                取消申请
            </pl-button>
        </div>

        <!--选择快递公司-->
        <pl-picker
            :show.sync="isPickerShow"
            :slots="pickerColumns"
            @confirm="onPickerConfirm"
        />

        <!-- 联系我们底部弹窗 -->
        <Contact :show.sync="isPopupShow" />
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import filter from '../../../filter/index'
import { resetForm } from '../../../assets/js/util'
import { isExpressNumber } from '../../../assets/js/validate'
import RefundDetailSkeleton from './components/Refund-Detail-Skeleton'
import TopText from '../../../components/common/Top-Text.vue'
import ModuleTitle from '../../../components/common/Module-Title.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import Collapse from '../../../components/penglai-ui/collapse/Collapse.vue'
import CollapseItem from '../../../components/penglai-ui/collapse/Collapse-Item.vue'
import Contact from '../../../components/common/Contact'
import {
    getRefundOrderDetail,
    getRefundAdress,
    getMap as getExpressMap,
    submitExpressInfo,
    cancelRefundApplication,
    deleteRefundOrder
} from '../../../apis/order-manager'

const expressMapCode = 'KYYQJKDGS'

const rebuildDate = list => {
    const array = list.split(' ')
    array[0] = array[0].slice(array[0].indexOf('-') + 1)
    array[1] = array[1].slice(0, array[1].lastIndexOf(':'))
    return array
}

const replaceMobile = mobile => mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

export default {
    name: 'RefundDetail',
    components: {
        RefundDetailSkeleton,
        TopText,
        ModuleTitle,
        OrderItem,
        Collapse,
        CollapseItem,
        Contact
    },
    props: {
        id: {
            type: String,
            default: null
        }
    },
    data () {
        return {
            loading: false,
            detailLoading: false,
            isPopupShow: false,
            isPickerShow: false,
            // 1: 待退货 2:待收货 3:退货完成 4:待退款 5:退款中 6:退款成功 7:退款失败
            refundStatus: '',
            // 1:仅退款 2:退款退货
            refundType: '',
            // 退换货详情
            refundDetail: {
                pictures: []
            },
            // 订单详情
            orderDetails: {},
            // 订单中商品详情
            goodsModel: {},
            // 退货地址
            adressInfo: {},
            form: {
                expressName: '',
                expressNo: ''
            },
            refundProgress: [],
            pickerColumns: [
                { flex: 1, textAlign: 'center', values: [] }
            ],
            collepseActiveNames: [],
            suggestionMap: {
                // 待退货
                1: '请根据商家收货地址，将商品寄回',
                // 待收货
                2: '请耐心等待商家收货',
                // 退货完成
                3: '请耐心等待商家审核，如有问题请联系客服',
                // 待退款
                4: '请耐心等待商家审核，如有问题请联系客服',
                // 退款中
                5: '请耐心等待商家审核，如有问题请联系客服',
                // 退款成功
                6: '您的退款申请已受理完成',
                // 退款失败
                7: '退款已关闭,如有问题请尽快与商家协商'
            },
            // auditStatus 0 取消售后 1 待审核 2 审核通过 3 退款驳回
            auditStatusMap: {
                0: '售后关闭',
                1: '待审核',
                // 审核通过显示业务状态
                2: '',
                3: '售后驳回'
            },
            auditStatusSuggestionMap: {
                0: '您的售后申请已取消，如有问题请联系客服；',
                1: '请耐心等待商家审核，如有问题请联系客服',
                // 审核通过显示业务状态
                2: '',
                3: '您的售后申请被驳回，如有问题请联系客服；'
            },
            expressMap: []
        }
    },
    computed: {
        ...mapGetters(['refundTypeMap', 'refundStatusMap', 'orderStatuskeyMap', 'orderStatuskeyMap', 'orderTypeKeyMap', 'orderActionMap']),
        // 卖家已将货物寄出
        needReturnProduct () {
            return this.orderDetails.orderType === this.orderTypeKeyMap.PHYSICAL_GOODS && [this.orderStatuskeyMap.WAIT_RECEIVE, this.orderStatuskeyMap.FINISHED].includes(this.orderDetails.status)
        }
    },
    activated () {
        this.getDetail()
        this.getExpressMap()
    },
    deactivated () {
        resetForm(this.form)
        this.collepseActiveNames = []
    },
    methods: {
        ...mapMutations(['setRefundOperatedList']),
        async getDetail () {
            try {
                this.detailLoading = true
                const { result } = await getRefundOrderDetail(this.id)
                this.id = result.id
                this.refundStatus = result.businessStatus
                this.refundType = result.serviceType
                this.refundDetail = result
                this.orderDetails = result.orderDetailsModel || {}
                this.orderDetails.goodsModel.sellingPrice = filter.formatAmount(this.orderDetails.goodsModel.sellingPrice)
                this.goodsModel = this.orderDetails.goodsModel || {}
                if (result.refundMobile) {
                    this.refundDetail.refundMobile = replaceMobile(result.refundMobile)
                }
                this.refundProgress = []
                result.operations && result.operations.map(item => {
                    item.createTimeArray = rebuildDate(item.createTime)
                    return item
                })
                this.refundDetail.pictures = []
                this.getRefundAdress(this.orderDetails.goodId)
                this.detailLoading = false
            } catch (e) {
                throw e
            }
        },
        async getRefundAdress (goodId) {
            try {
                const { result } = await getRefundAdress(goodId)
                this.adressInfo = result
            } catch (e) {
                throw e
            }
        },
        // 获取快递公司数据字典
        async getExpressMap () {
            const { result: expressMap } = await getExpressMap(expressMapCode)
            this.expressMap = expressMap
            this.pickerColumns[0].values = expressMap.map(item => item.dictDataValue)
        },
        onPickerConfirm (selected) {
            this.form.expressName = selected[0]
            this.isPickerShow = false
        },
        modifyRefund () {
            this.$store.commit('setRefundGoods', this.orderDetails.goodsModel)
            this.$router.push({ name: 'RefundApply',
                params: { orderId: this.orderDetails.id,
                    orderStatus: this.orderDetails.status,
                    refundId: this.refundDetail.id,
                    refundType: this.refundType,
                    type: 'MODIFY'
                } })
        },
        async cancelApplication () {
            try {
                const { id } = this
                await this.$confirm('退单正在审核中，确定要取消？')
                await cancelRefundApplication(id)
                this.$success('取消申请成功')
                this.getDetail()
                this.$store.commit('setRefundOperatedList', { id, action: this.orderActionMap.cancel })
            } catch (e) {
                throw e
            }
        },
        async deleteOrder () {
            try {
                const { id } = this
                await this.$confirm('是否删除当前订单？ 删除后不可找回')
                await deleteRefundOrder({ id })
                this.$success('删除成功')
                this.$store.commit('setRefundOperatedList', { id, action: this.orderActionMap.delete })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 2000)
            } catch (e) {
                throw e
            }
        },
        async submit () {
            try {
                if (!this.form.expressName) return this.$warning('请选择快递公司')
                if (!this.form.expressNo.trim()) return this.$warning('请输入快递单号')
                if (!isExpressNumber(this.form.expressNo)) return this.$warning('请输入正确的快递单号')
                this.loading = true
                const { dictDataKey: shipChannel } = this.expressMap.find(item => item.dictDataValue === this.form.expressName)
                const params = {
                    id: this.id,
                    shipChannel,
                    shipSn: this.form.expressNo
                }
                await submitExpressInfo(params)
                this.loading = false
                this.$success('提交申请成功')
                this.getDetail()
                this.$store.commit('setRefundOperatedList', { id: this.id, action: this.orderActionMap.ship })
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style module lang="scss">
  .refund-detail {
    padding: 28px 24px 140px;
  }
  .title {
    margin-bottom: 28px;
  }
  .panel {
    background-color: #fff;
    border-radius: $--radius1;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .express-panel {
    margin-top: 25px;
    .express-item {
      padding: 28px 24px;
      display: flex;
      align-items: center;
      border-top: 1px solid #F0F0F0;

      &:nth-of-type(1) {
        border: none;
      }
    }
    .express-icon {
      width: 64px;
      height: 64px;
    }
    .right {
      flex: 1;
      width: 64px;
      padding-left: 28px;
    }
    .main {
      font-size: 28px;
      color: #2E2E2E;
      line-height: 40px;
      margin-bottom: 10px;
    }
    .sub {
      font-size: 24px;
      color: #333333;
      line-height: 34px;
    }
    .phone {
      padding-left: 16px;
    }
    .bold {
      font-family: HelveticaNeue-Medium;
      font-weight: 500;
    }
  }

  .express-info-panel {
    padding-left: 28px;
    .express-no {
      margin-left: -16px;
      font-size: 28px;
      font-family: PingFangSC-Semibold;
      font-weight: 400;
      color: #333333;
      line-height: 40px;
    }
  }

  .amount-panel {
    .top {
      padding: 28px 24px;
    }
    .bottom {
      padding: 24px;
      border-top: 1px solid #F0F0F0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 30px;
      color: #333;
      line-height: 40px;
      .item-right {
        display: block;
        text-align: right;
      }
    }
    .larger {
      margin-top: 14px;
      font-size: 34px;
      .price {
        font-size: 36px;
      }
    }
    .tips {
      font-size: 22px;
      line-height: 32px;
      margin-top: 25px;
      color: #999999;
      text-align: right;
    }
    .price {
      color: #FE7700;
      font-family: HelveticaNeue-Medium;
      font-size: 34px;
      font-weight: 500;
    }
  }

  .refund-info-panel {
    padding: 20px 0 20px 24px;
    .product-info {
      position: relative;
      padding: 20px 24px 24px 0;
      margin-top: 20px;
      border-top: 1px solid #e7e7e7;
    }
    .info-list {
      padding-right: 24px;
    }
    .img-list-wrapper {
      padding-top: 22px;
      margin-top: 4px;
      > span {
        min-width: 120px!important;
      }
    }
    .img-list {
      display: inline-flex;
      flex-wrap: wrap;
      font-size: 0;
      padding-bottom: 20px;
      > img {
        width: 144px;
        height: 144px;
        margin-right: 14px;
        margin-bottom: 14px;
        object-fit: cover;
      }
    }
  }

  .footer-submit {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px 24px;
    background-color: #FFF;
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18px 24px 18px 0;
    background-color: #FFF;
    display: flex;
    justify-content: flex-end;
    > button {
      margin-left: 20px;
      box-sizing: border-box;
      width: 162px;
      padding: 0;
      &:nth-of-type(1) {
        margin-left: 0;
      }
    }
  }

  .border-top {
    position: relative;
    border-top: 1px solid #F0F0F0;
  }
  .bold {
    font-weight: bold;
  }

  /** popup start **/
  .popup-title {
    padding: 40px 42px 32px;
    display: flex;
    align-items: center;
    font-size:40px;
    font-weight: 600;
    color: #000000;
    line-height: 56px;
  }
  .popup-title-icon {
    width: 26px;
    margin-right: 26px
  }
  .popup-content {
    padding: 35px 30px;
  }
  .popup-address {
    padding: 20px 30px;
    margin-bottom: 20px;
    background-color: #F9F9F9;
    display: flex;
    align-items: center;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #000;
    line-height: 40px;
    border-radius: 10px;
  }
  .popup-address-text {
    flex: 1;
  }
  .popup-address-left-icon {
    width: 36px;
    margin-right: 24px
  }
  .popup-address-right-icon {
    width: 39px;
    margin-left: 40px
  }
  .refundProgressContent {
    font-size: 22px;
    line-height: 32px;
    color: #999;
  }
</style>

<style lang="scss">
.refund-detail {
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
    color: #333333;
    line-height: 40px;
  }
  .pl-fields_right > .pl-fields_right_icon {
    fill: #DEDEDE;
  }
  .pl-fields_right > .pl-fields_right_text {
    color: #000000;
  }

  .pl-form-item .pl-form-item_content {
    height: 108px;
    padding-right: 28px;
  }

  .pl-input > .pl-input_box > input {
    &::-webkit-input-placeholder {
      text-align: right;
      font-size: 26px;
      color: #CCCCCC;
      line-height: 36px;
    }
  }

  .pl-list {
    line-height: 34px;
    margin-bottom: 20px;
  }

  .pl-collapse-item__title {
    font-size: 24px;
    color: #666666;
    line-height: 34px;
  }
}
</style>
