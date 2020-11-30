<template>
    <div :class="$style.list">
        <div :class="$style.noContent" v-if="!productList.length">
            暂无数据
        </div>
        <template v-else>
            <ProductItem
                v-for="item in productList"
                :key="item.productId"
                :id="item.productId"
                :product-type="item.productType"
                :cover-img="item.productImg"
                :product-name="item.productName"
                :lecturer-name="item.lecturer"
                :selling-price="item.sellingPrice"
                :origin-price="item.originalPrice"
                :exhcange-status="2"
            />
        </template>
    </div>
</template>

<script>
import ProductItem from '../../../components/my/redemption/Product-Item'
import { getProductByCodeId } from '../../../apis/my-redemption'
export default {
    name: 'Redeemed',
    props: {
        codeId: {
            type: String,
            default: ''
        }
    },
    components: {
        ProductItem
    },
    data () {
        return {
            productList: []
        }
    },
    async activated () {
        try {
            await this.init()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async init () {
            try {
                const { result: { myProductList } } = await getProductByCodeId(this.codeId)
                this.productList = myProductList || []
            } catch (e) {
                throw e
            }
        }
    },
    deactivated () {
        this.productList = []
    }
}
</script>

<style  module lang="scss">
  .list {
    margin: 30px 24px 0;
  }
  .noContent {
    margin-top: 60px;
    text-align: center;
    font-size: 32px;
    color: #999;
  }
</style>
