<template>
    <div :class="$style.center">
        <CodeItem
            :id="codeId"
            :name="detail.name"
            :product-total="detail.productTotal"
            :use-total="detail.useTotal"
            :total="detail.useTotal + detail.stock"
            :start-time="detail.startTime"
            :end-time="detail.endTime"
            :current-time="detail.currentTime"
            :instruction="detail.activituRule"
            :is-used="detail.isUsed"
            :is-expired="detail.isExpired"
            :show-instruction-control="false"
            :is-show-instruction="true"
            button-text="查看兑换商品"
            @codeItemClick="codeItemClick"
        />
        <div :class="$style.list">
            <LoadMore
                ref="loadMore"
                :form="form"
                :loading.sync="loading"
                :request-methods="getProductByCodeId"
                @refresh="onRefresh"
                @more="onRefresh"
                no-content-tip="暂无数据"
            >
                <template>
                    <ProductItem
                        v-for="item in productList"
                        :key="item.id"
                        :id="item.id"
                        :product-type="item.productType"
                        :cover-img="item.coverImg"
                        :product-name="item.productName"
                        :lecturer-name="item.lecturerName"
                        :selling-price="item.sellingPrice"
                        :origin-price="item.originPrice"
                        :is-redeemed="item.isRedeemed"
                        :is-no-stock="item.isNoStock"
                        @receive="receive"
                    />
                </template>
            </LoadMore>
        </div>
    </div>
</template>

<script>
import CodeItem from './components/Code-Item'
import ProductItem from './components/Product-Item'
import LoadMore from '../../../../components/common/Load-More.vue'
import moment from 'moment'
import {
    getRedemptiontDetail,
    getProductByCodeId,
    exchangeProduct
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
        LoadMore,
        ProductItem
    },
    data () {
        return {
            detail: {
                name: '龙门节兑换码',
                productTotal: 12,
                startTime: '2020.12.18 12:30:00',
                endTime: '2020.12.20 12:30:00',
                currentTime: '2020.12.23 12:30:00',
                activituRule: '骄傲打开大苏打撒旦',
                useTotal: 12,
                stock: 23
            },
            getProductByCodeId,
            loading: false,
            form: {
                current: 1,
                size: 10,
                codeId: '',
                status: ''
            },
            productList: [
                {
                    id: '12123',
                    productType: 1,
                    coverImg: 'https://mallcdn.youpenglai.com/static/mall/icons/olds/live.png',
                    productName: '我的名族忒阿姐大姐大街的多久啊三大矿山的安静的',
                    lecturerName: '打算洞口ask打扫打扫街道山坡地普林斯顿',
                    sellingPrice: '12123',
                    originPrice: '12123',
                    isRedeemed: true,
                    stock: 1
                },
                {
                    id: '12123223',
                    productType: 2,
                    coverImg: 'https://mallcdn.youpenglai.com/static/mall/icons/olds/live.png',
                    productName: '我的名族忒阿姐大姐大街的多久啊三大矿山的安静的',
                    lecturerName: '打算洞口ask打扫打扫街道山坡地普林斯顿',
                    sellingPrice: 0,
                    originPrice: '12123',
                    isRedeemed: true,
                    stock: 100
                },
                {
                    id: 'edasda',
                    productType: 1,
                    coverImg: 'https://mallcdn.youpenglai.com/static/mall/icons/olds/live.png',
                    productName: '我的名族忒阿姐大姐大街的多久啊三大矿山的安静的',
                    lecturerName: '打算洞口ask打扫打扫街道山坡地普林斯顿',
                    sellingPrice: '12123',
                    originPrice: '12123',
                    isRedeemed: false,
                    stock: 23
                },
                {
                    id: '121ddd23',
                    productType: 1,
                    coverImg: 'https://mallcdn.youpenglai.com/static/mall/icons/olds/live.png',
                    productName: '我的名族忒阿姐大姐大街的多久啊三大矿山的安静的',
                    lecturerName: '打算洞口ask打扫打扫街道山坡地普林斯顿',
                    sellingPrice: '12123',
                    originPrice: '12123',
                    isRedeemed: false,
                    stock: 0
                }
            ]
        }
    },
    mounted () {
        this.$refresh = this.$refs.loadMore.refresh
    },
    activated () {
        this.form.codeId = this.codeId
        this.$refresh()
    },
    methods: {
        async getDetail () {
            try {
                const { result: data } = await getRedemptiontDetail(this.codeId)
                // todo.
                console.log(data)
                const result = this.detail
                result.isUsed = !result.stock
                result.isExpired = moment(result.currentTime).valueOf() >= moment(result.endTime).valueOf()
                this.detail = result
            } catch (e) {
                throw e
            }
        },
        codeItemClick () {
            this.$router.push({ name: 'RedeemedProductList', params: { codeId: this.codeId } })
        },
        onRefresh (list, total) {
            // TODO.数据
            list = this.productList
            list.forEach(item => {
                item.isNoStock = !item.stock
            })
            this.productList = list
        },
        findIndexById (id) {
            return this.productList.findIndex(item => item.id === id)
        },
        // 兑换商品
        async receive (productId) {
            try {
                const index = this.findIndexById(productId)
                if (index < 0) return
                await exchangeProduct({ codeId: this.codeId, productId })
                const currentItem = this.productList.splice(index, 1)[0]
                currentItem.checked = currentItem.stock - 1
                currentItem.isNoStock = !currentItem.stock
                currentItem.isRedeemed = true
                this.productList.splice(index, 0, currentItem)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
  .center {
    margin: 0 24px;
  }

</style>
