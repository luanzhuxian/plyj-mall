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
                    <slot />
                </OtherInfo>
            </div>
        </div>
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
