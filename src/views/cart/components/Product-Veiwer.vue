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

                    <InfoItem v-if="activeProduct === 1">
                        <template slot="label">修改数量</template>
                        <template slot="content">
                            <Count
                                :min="item.minBuyNum"
                                :max="item.purchaseQuantity > 0 ? item.purchaseQuantity : item.stock"
                                :count="item.count"
                                @change="(count, next) => { countChange(count, item, next) }"
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

                    <InfoItem v-if="item.couponAmount > 0">
                        <template slot="label">优惠券</template>
                        <span slot="content" class="gray-1">-¥{{ item.couponAmount / 100 }}</span>
                    </InfoItem>

                    <InfoItem v-if="item.scholarship > 0">
                        <template slot="label">奖学金</template>
                        <span slot="content" class="gray-1">-¥{{ item.scholarship / 100 }}</span>
                    </InfoItem>

                    <InfoItem v-if="item.postageAmount > 0">
                        <template slot="label">普通快递</template>
                        <span slot="content" style="color: red;">+ ¥{{ item.postageAmount / 100 }}</span>
                    </InfoItem>

                    <InfoItem>
                        <template slot="label">商品金额</template>
                        <span slot="content" class="gray-1">¥ {{ item.amount / 100 }}</span>
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
        CustomInline
    },
    props: {
        products: {
            type: Array,
            default () {
                return []
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
            CHECKED_STUDENT: 'submitOrder/checkedStudents'
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
