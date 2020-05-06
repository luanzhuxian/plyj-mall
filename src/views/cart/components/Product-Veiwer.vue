<template>
    <div class="submit-products-viewer">
        <!-- 实体商品 -->
        <div
            v-if="products.length > 0"
            :class="$style.productBox"
        >
            <div :class="$style.orderItemBox">
                <OrderItem
                    v-for="(item, index) of products"
                    :key="index"
                    :img="item.goodsImage"
                    :name="item.goodsName"
                    :count="item.count"
                    :option="item.skuName2 ? `${item.skuName},${item.skuName2}` : item.skuName"
                    :price="(activeProduct === 5 || activeProduct === 6 ? item.originPrice : item.amount) / 100"
                    :support-refund="item.supportAfterSales"
                    :gap="32"
                    :product-type="1"
                    :pre-active="preActivity"
                    :active-product="activeProduct"
                    :allow-invoice="item.supportInvoice"
                    border
                />
                <OtherInfo>
                    <slot />
                </OtherInfo>
            </div>
            <!--<OtherInfo>
                <slot name="physical" />
            </OtherInfo>-->
        </div>

        <!--<template v-if="virtualProducts.length > 0">
            <div
                v-for="(item, index) of virtualProducts"
                :key="item.skuCode1 + item.skuCode2"
                :class="$style.productBox"
            >
                <div :class="$style.orderItemBox">
                    <OrderItem
                        :key="index"
                        :img="item.productImg"
                        :name="item.productName"
                        :count="item.count"
                        :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
                        :price="activeProduct === 5 || activeProduct === 6 ? item.originPrice : item.sellingPrice"
                        :support-refund="item.supportRefund"
                        is-submit
                        :gap="32"
                        :product-type="2"
                        :active-product="activeProduct"
                        :allow-invoice="item.showInvoice"
                        :pre-active="preActivity"
                        border
                    />
                </div>
                <OtherInfo>
                    <slot name="noPhysical" type="virtual" :product="item" />
                </OtherInfo>
            </div>
        </template>

        <template v-if="lessonList.length > 0">
            <div
                v-for="(item, index) of lessonList"
                :key="item.skuCode1 + item.skuCode2"
                :class="$style.productBox"
            >
                <div :class="$style.orderItemBox">
                    <OrderItem
                        :key="index"
                        :img="item.productImg"
                        :name="item.productName"
                        :count="item.count || 1"
                        :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
                        :price="activeProduct === 5 || activeProduct === 6 ? item.originPrice : item.price"
                        :support-refund="item.supportRefund"
                        is-submit
                        :gap="32"
                        :product-type="2"
                        :active-product="activeProduct"
                        :pre-active="preActivity"
                        :allow-invoice="item.showInvoice"
                        border
                    />
                </div>
                <OtherInfo>
                    <slot name="noPhysical" type="lesson" :product="item" />
                </OtherInfo>
            </div>
        </template>-->
    </div>
</template>

<script>
import OtherInfo from './Other-Info.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
export default {
    name: 'SubmitProductsViewer',
    components: {
        OtherInfo,
        OrderItem
    },
    props: {
        products: {
            type: Array,
            default () {
                return []
            }
        },
        // physicalProducts: {
        //     type: Array,
        //     default () {
        //         return []
        //     }
        // },
        // virtualProducts: {
        //     type: Array,
        //     default () {
        //         return []
        //     }
        // },
        // lessonList: {
        //     type: Array,
        //     default () {
        //         return []
        //     }
        // },
        preActivity: {
            type: [Number, String],
            default: ''
        },
        activeProduct: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style module lang="scss">
    .productBox {
        width: 100%;
        margin: 0 0 20px 0;
        padding: 32px 0 24px 0;
        border-radius: $--radius1;
        background-color: #fff;
        box-sizing: border-box;
        .orderItemBox {
            padding: 0 24px;
        }
    }
</style>
