<template>
    <div class="submit-products-viewer">
        <!-- 实体商品 -->
        <div
            v-if="products.length > 0"
            :class="$style.productBox"
        >
            <div
                :class="$style.orderItemBox"
                v-for="(item, index) of products"
                :key="index"
            >
                <OrderItem
                    :img="item.goodsImage"
                    :name="item.goodsName"
                    :count="item.count"
                    :option="item.skuName2 ? `${item.skuName},${item.skuName2}` : item.skuName"
                    :price="(activeProduct === 5 || activeProduct === 6 ? item.originPrice : item.sellingPrice) / 100"
                    :support-refund="item.supportAfterSales"
                    :gap="32"
                    :product-type="1"
                    :pre-active="preActivity"
                    :active-product="activeProduct"
                    :allow-invoice="item.supportInvoice"
                    border
                />
                <OtherInfo>
                    <InfoItem v-if="item.needStudents">
                        <template slot="label">学员信息</template>
                        <template slot="content">
                            <StudentInline
                                :product="item"
                                :count="item.count"
                                @inited="students => studentInited(students, item)"
                            />
                        </template>
                    </InfoItem>

                    <InfoItem>
                        <template slot="label">修改数量</template>
                        <template slot="content">
                            <Count
                                :min="item.minBuyNum"
                                :max="(activeProduct !== 1 && preActivity === 2) ? (item.activityLimit ? item.activityLimitNumber : item.activeStock) : (item.purchaseQuantity || item.stock)"
                                :count="item.count"
                                @change="(count, next) => { countChange(count, item, next) }"
                            />
                        </template>
                    </InfoItem>

                    <InfoItem v-if="activeProduct === 5 && item.discount !== 100">
                        <template slot="label">春耘折扣</template>
                        <template slot="content">
                            {{ item.discount / 100 }}折 -¥{{ 0 }}
                        </template>
                    </InfoItem>

                    <InfoItem v-if="activeProduct === 6 && item.discount !== 10">
                        <template slot="label">组合折扣</template>
                        <span slot="content">{{ item.discount }}折 -¥{{ (physicalProductOriginalPrice - physicalProductPrice).toFixed(2) }}</span>
                    </InfoItem>

                    <InfoItem v-if="item.couponAmount > 0">
                        <template slot="label">优惠券</template>
                        <span slot="content" class="gray-1">-¥{{ item.couponAmount / 100 }}</span>
                    </InfoItem>

                    <InfoItem v-if="item.scholarship > 0">
                        <template slot="label">奖学金</template>
                        <span slot="content" class="gray-1">-¥{{ item.scholarship / 100 }}</span>
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
import Count from '../../../components/common/Count.vue'
export default {
    name: 'SubmitProductsViewer',
    components: {
        OtherInfo,
        OrderItem,
        InfoItem,
        StudentInline,
        Count
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
</style>
