<template>
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
                />
            </template>
        </LoadMore>
    </div>
</template>

<script>
import ProductItem from './components/Product-Item'
import LoadMore from '../../../../components/common/Load-More.vue'
import { getProductByCodeId } from '../../../../apis/my-redemption'
export default {
    name: 'Redeemed',
    components: {
        LoadMore,
        ProductItem
    },
    data () {
        return {
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
                    isRedeemed: true,
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
                    isRedeemed: true,
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
        onRefresh (list, total) {
        // TODO.数据
            list = this.productList
            list.forEach(item => {
                item.isNoStock = !item.stock
            })
            this.productList = list
        }
    }
}
</script>

<style  module lang="scss">
  .list {
    margin: 30px 24px 0;
  }
</style>
