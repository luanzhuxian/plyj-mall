<template>
    <div :class="$style.center">
        <CodeItem
            :id="codeId"
            :name="detail.name"
            :product-total="detail.exchangeTotal"
            :use-total="detail.useTotal"
            :total="detail.useTotal + detail.stock"
            :start-time="detail.startTime"
            :end-time="detail.endTime"
            :instruction="detail.activityRule"
            :is-used="detail.isUsed"
            :is-expired="detail.isExpired"
            :show-instruction-control="false"
            :is-show-instruction="true"
            button-text="查看兑换商品"
            @codeItemClick="codeItemClick"
        />
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
                    :cover-img="item.productMainImg"
                    :product-name="item.productName"
                    :lecturer-name="item.lecturer"
                    :selling-price="item.sellingPrice"
                    :origin-price="item.originalPrice"
                    :status="item.status"
                    :is-max-limit="isMaxLimit"
                    @receive="receive"
                />
            </template>
        </div>
    </div>
</template>

<script>
import CodeItem from './components/Code-Item'
import ProductItem from './components/Product-Item'
import {
    getProductByCodeId
} from '../../../../apis/my-redemption'
export default {
    name: 'RedemptionCenter',
    props: {
        codeId: {
            type: String,
            default: ''
        }
    },
    components: {
        CodeItem,
        ProductItem
    },
    data () {
        return {
            // 兑换码详情
            detail: {},

            /**
             * productId: '12123', // 商品ID
             * productType: 1, // 商品类型 1商品 2 单课 3 系列课
             * productMainImg: '',// 商品主图
             * productName: '', // 商品名称
             * priceType: 0, // 价格类型int： 0-免费；1-付费
             * lecturer: '打算洞口ask打扫打扫街道山坡地普林斯顿',
             * sellingPrice: '',
             * originalPrice: '',
             * status: 1
            */
            productList: []
        }
    },
    computed: {
        // 已无可兑换次数
        isMaxLimit () {
            return !this.detail.stock
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
                const { result } = await getProductByCodeId(this.codeId)
                const {
                    name,
                    startTime,
                    endTime,
                    activityRule,
                    exchangeTotal,
                    useTotal,
                    stock,
                    codeStatus,
                    codeProductList
                } = result
                const isUsed = codeStatus === 2
                const isExpired = codeStatus === 0
                this.detail = {
                    name,
                    exchangeTotal,
                    startTime,
                    endTime,
                    activityRule,
                    useTotal,
                    stock,
                    isUsed,
                    isExpired
                }
                this.productList = codeProductList || []
            } catch (e) {
                throw e
            }
        },
        codeItemClick () {
            this.$router.push({ name: 'RedeemedProductList', params: { codeId: this.codeId } })
        },
        findIndexById (id) {
            return this.productList.findIndex(item => item.id === id)
        },
        // 兑换商品
        receive (productId) {
            if (!this.detail.stock) return
            // 设置当前兑换码id信息
            localStorage.setItem('currentRedeemCode', JSON.stringify({ id: this.codeId, name: this.detail.name }))
            this.$router.push({ name: 'Curriculum', params: { productId } })
        }
    }
}
</script>

<style module lang="scss">
  .center {
    margin: 0 24px;
  }
  .list {
    margin-top: 20px;
  }
  .noContent {
    margin-top: 60px;
    text-align: center;
    font-size: 32px;
    color: #999;
  }

</style>
