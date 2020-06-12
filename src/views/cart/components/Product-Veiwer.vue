<template>
    <div class="submit-products-viewer">
        <!-- 实体商品 -->
        <div
            v-if="products.length > 0"
            :class="$style.productBox"
        >
            <div
                :class="$style.orderItemBox"
                v-for="item of products"
                :key="item.sku1 + item.sku2 + '_' + item.count"
            >
                <OrderItem
                    :img="item.goodsImage"
                    :name="item.goodsName"
                    :count="item.count"
                    :option="item.skuName2 ? `${item.skuName},${item.skuName2}` : item.skuName"
                    :price="item.sellingPrice / 100"
                    :support-refund="item.supportAfterSales"
                    :gap="32"
                    :product-type="1"
                    :pre-active="preActivity"
                    :active-product="activeProduct"
                    :allow-invoice="item.supportInvoice"
                    border
                />
                <OtherInfo>
                    <!--虚拟/正式课/体验课 显示 使用时间-->
                    <InfoItem v-if="['VIRTUAL_GOODS', 'FORMAL_CLASS', 'EXPERIENCE_CLASS'].includes(item.goodsType)">
                        <template slot="label">使用时间</template>
                        <span slot="content" class="gray-1" v-if="item.redeemCodeStartTime">{{ item.redeemCodeStartTime | dateFormat('YYYY.MM.DD') }}-{{ item.redeemCodeEndTime | dateFormat('YYYY.MM.DD') }}</span>
                        <span slot="content" class="gray-1" v-else>长期有效</span>
                    </InfoItem>
                    <InfoItem
                        v-if="item.needStudents"
                        :id="item.sku1 + item.sku2"
                    >
                        <template slot="label">学员信息</template>
                        <template slot="content">
                            <StudentInline
                                :product="item"
                                :checked-students="CHECKED_STUDENT"
                                :count="item.count"
                                @inited="students => studentInited(students, item)"
                            />
                        </template>
                    </InfoItem>

                    <InfoItem v-if="item.skuCustoms.length" :id="'custom_' + item.sku1 + item.sku2" has-collapse>
                        <template slot="label">{{ item.goodsType === 'PHYSICAL_GOODS' ? '用户信息' : '学员信息' }}</template>
                        <CustomInline
                            slot="footer"
                            :product="item"
                            :label="item.goodsType === 'PHYSICAL_GOODS' ? '用户信息' : '学员信息'"
                            ref="CustomInline"
                        />
                    </InfoItem>

                    <!--知识课程 + 购物车的确认订单 不支持修改数量-->
                    <InfoItem v-if="activeProduct === 1 && !isCart && [orderTypeKeyMap.KNOWLEDGE_COURSE, orderTypeKeyMap.SERIES_OF_COURSE].indexOf(item.goodsType) === -1">
                        <template slot="label">购买数量</template>
                        <template slot="content">
                            <Count
                                :min="item.minBuyNum || 1"
                                :max="item.purchaseQuantity > 0 ? item.purchaseQuantity : item.stock"
                                :count="item.count"
                                @change="(count, next) => { countChange(count, item, next) }"
                                @maxOverflow="maxOverflow"
                            />
                        </template>
                    </InfoItem>

                    <InfoItem v-if="(activeProduct === 5 || activeProduct === 6) && item.discount < 100">
                        <template slot="label" v-if="activeProduct === 5">春耘折扣</template>
                        <template slot="label" v-else-if="activeProduct === 6">组合折扣</template>
                        <span slot="content" class="primary-color">
                            {{ item.discount / 10 }}折
                        </span>
                    </InfoItem>

                    <!--<InfoItem v-if="activeProduct === 6 && item.discount !== 100">
                        <template slot="label">组合折扣</template>
                        <span slot="content">{{ item.discount / 10 }}折 -¥{{ ((item.sellingPrice - item.amount) / 100).toFixed(2) }}</span>
                    </InfoItem>-->
                    <!--TODO.当前仅支持单个商品时使用兑换码-->
                    <InfoItem v-if="activeProduct === 1 && products.length === 1 && (exchangeCodeMap[item.goodsId] && exchangeCodeMap[item.goodsId].length || exchangeCode.isDefault)">
                        <ExchangeCode
                            slot="footer"
                            :exchange-code="exchangeCode"
                            :exchange-code-list="exchangeCodeMap[item.goodsId]"
                            @change="chooseExchangeCode"
                        />
                    </InfoItem>

                    <InfoItem v-if="false && item.couponAmount > 0">
                        <template slot="label">优惠券</template>
                        <span slot="content" class="gray-1">-¥{{ item.couponAmount | formatAmount }}</span>
                    </InfoItem>

                    <InfoItem v-if="false && item.scholarship > 0">
                        <template slot="label">奖学金</template>
                        <span slot="content" class="gray-1">-¥{{ item.scholarship | formatAmount }}</span>
                    </InfoItem>

                    <InfoItem v-if="false && item.postageAmount > 0">
                        <template slot="label">普通快递</template>
                        <span slot="content" style="color: red;">+ ¥{{ item.postageAmount | formatAmount }}</span>
                    </InfoItem>

                    <!--产品建议: 确认订单页面，不显示详细优惠信息，防止产品再变，前台先手动计算-->
                    <InfoItem>
                        <template slot="label">小计</template>
                        <span slot="content" class="gray-1">¥ {{ (item.amount + item.couponAmount + item.scholarship - item.postageAmount) | formatAmount }}</span>
                    </InfoItem>
                </OtherInfo>
            </div>
        </div>
    </div>
</template>

<script>
import OtherInfo from './Other-Info.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import InfoItem from './Info-Item.vue'
import StudentInline from './Student-Inline.vue'
import CustomInline from './Custom-Inline.vue'
import ExchangeCode from './Exchange-Code'
import Count from '../../../components/common/Count.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'SubmitProductsViewer',
    components: {
        OtherInfo,
        OrderItem,
        InfoItem,
        StudentInline,
        Count,
        CustomInline,
        ExchangeCode
    },
    props: {
        products: {
            type: Array,
            default () {
                return []
            }
        },
        isCart: {
            type: Boolean
        },
        // 兑换码列表
        /**
        * {
            productId1: [{exchangeCode1}, {exchangeCode2}]
            productId2: []
            productId3: []
            productId4: []
         * }
        */
        exchangeCodeMap: {
            type: Object,
            default () {
                return {}
            }
        },
        // 当前选定的兑换码信息
        exchangeCode: {
            type: Object,
            default () {
                return {}
            }
        },
        preActivity: {
            type: [Number, String],
            default: ''
        },
        activeProduct: {
            type: Number,
            default: 1
        }
    },
    computed: {
        ...mapGetters({
            CHECKED_STUDENT: 'submitOrder/checkedStudents',
            orderTypeKeyMap: 'orderTypeKeyMap'
        })
    },
    methods: {
        studentInited (students, product) {
            this.$emit('studentInited', { students, product })
        },

        /**
         * 修改商品
         * @param count {Number} 数量
         * @param product {Object} 商品
         * @param next {Function} 执行成功后调用，否则按钮处于禁用状态
         */
        countChange (count, product, next) {
            this.$emit('countChange', { count, product, next })
        },

        /**
         * 超出最大购买数量
         * @param val {number} 当前值
         * @param max {number} 最大值
         */
        maxOverflow (val, max) {
            this.$error(`购买数量不能超过 ${ max } 个`)
        },
        checkStudents () {
            for (const pro of this.products) {
                const students = this.CHECKED_STUDENT[pro.sku1 + pro.sku2] || []
                if (pro.needStudents && students.length < pro.count) {
                    if (students.length) {
                        this.$warning(`请再选择${ pro.count - students.length }名学员信息`)
                    } else {
                        this.$warning(`请选择${ pro.count }名学员信息`)
                    }
                    const EL = document.getElementById(pro.sku1 + pro.sku2)
                    EL.classList.add(this.$style.infoItemError)
                    EL.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    })
                    return false
                }
            }
            return true
        },
        // 检查自定义表单
        checkCustom () {
            for (const item of this.$refs.CustomInline || []) {
                if (!item.checkForm()) {
                    const EL = document.getElementById(`custom_${ item.product.sku1 + item.product.sku2 }`)
                    EL.classList.add(this.$style.infoItemError)
                    EL.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    })
                    return false
                }
            }
            return true
        },
        chooseExchangeCode (item) {
            this.$emit('exchangeCodeChange', item)
        }
    }
}
</script>

<style module lang="scss">
    .productBox {
        width: 100%;
        box-sizing: border-box;
        .orderItemBox {
            padding: 32px 24px;
            margin: 0 0 20px 0;
            border-radius: $--radius1;
            background-color: #fff;
        }
    }
    .info-item-error {
        animation: bordrFlicker .15s ease 8;
        animation-fill-mode: forwards;
    }
    @keyframes bordrFlicker {
        0% { border-color: #F24724 }
        50% { border-color: transparent }
        100% { border-color: #F24724 }
    }
</style>
