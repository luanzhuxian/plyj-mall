<template>
    <div :class="$style.center">
        <CodeItem
            :id="codeId"
            :name="detail.name"
            :code="detail.exchangeCode"
            :product-total="detail.exchangeTotal"
            :use-total="detail.useTotal"
            :total="detail.useTotal + detail.stock"
            :start-time="detail.startTime"
            :end-time="detail.endTime"
            :instruction="detail.activityRule"
            :is-used="detail.isUsed"
            :is-expired="detail.isExpired"
            is-show-instruction
            is-show-button
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
                    :cover-img="item.productImg"
                    :product-name="item.productName"
                    :lecturer-name="item.lecturer"
                    :selling-price="item.sellingPrice"
                    :origin-price="item.originalPrice"
                    :exhcange-status="item.exhcangeStatus"
                    :is-max-limit="isMaxLimit"
                    :is-expired="detail.isExpired"
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
                    exchangeCode,
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
                    exchangeCode,
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
            return this.productList.findIndex(item => item.productId === id)
        },
        // 兑换商品时，设置参数
        receive (productId) {
            if (!this.detail.stock) return
            const index = this.findIndexById(productId)
            if (index < 0) return
            const detail = this.productList[index]
            // 兑换状态 : 1-已购买 2-已兑换 3-未开售 4-立即兑换
            if (detail.exhcangeStatus !== 4 || this.isMaxLimit) return
            // 设置当前兑换码id信息
            localStorage.setItem('currentRedeemCode', JSON.stringify({
                id: this.codeId,
                name: this.detail.name,
                exchangeCode: this.detail.exchangeCode
            }))
        }
    },
    deactivated () {
        this.detail = {}
        this.productList = []
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
