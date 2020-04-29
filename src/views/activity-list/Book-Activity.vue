<template>
    <div :class="$style.book">
        <main>
            <div :class="$style.top" />
            <div :class="$style.content">
                <template v-if="loaded && !noContent">
                    <section v-if="ongoingList.length">
                        <div :class="$style.status">
                            <div :class="$style.icon">
                                <pl-svg name="icon-lightening-orange-bad83" width="26" height="26" />
                            </div>
                            正在进行中
                        </div>
                        <ul>
                            <template v-for="(item, i) of ongoingList">
                                <product-item :key="'ongoing-' + i" :data="item" />
                            </template>
                        </ul>
                    </section>
                    <section v-if="incomingList.length">
                        <div :class="$style.status">
                            <div :class="$style.icon">
                                <pl-svg name="icon-clock-orange-3e84b" width="26" height="26" />
                            </div>
                            即将开始
                        </div>
                        <ul>
                            <template v-for="(item, i) of incomingList">
                                <product-item :key="'incoming-' + i" :data="item" />
                            </template>
                        </ul>
                    </section>
                </template>
                <div v-if="loaded && noContent" :class="$style.noContent">
                    <pl-svg
                        name="icon-no-content"
                        width="300"
                        height="200"
                    />
                    <p>当前没有预购商品</p>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import ProductItem from './components/Book-Product-Item.vue'
import { bookActivityPage } from '../../apis/product'

export default {
    name: 'BookActivity',
    components: {
        ProductItem
    },
    data () {
        return {
            loaded: false,
            ongoingList: [],
            incomingList: []
        }
    },
    computed: {
        noContent () {
            return !this.ongoingList.length && !this.incomingList.length
        }
    },
    created () {
        try {
            this.loaded = false
            this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getList () {
            try {
                const { result = { 0: [], 1: [] } } = await bookActivityPage()
                this.loaded = true

                if (!result[0].length && !result[1].length) {
                    return this.$alert({
                        message: '暂无预购商品',
                        viceMessage: '再逛逛吧~',
                        confirmText: '再逛逛'
                    }).finally(() => {
                        this.$router.go(-1)
                    })
                }

                for (const list of [result[0], result[1]]) {
                    for (const item of list) {
                        item.goodsInfo = {
                            ...item,
                            id: item.productId,
                            activityInfo: {
                                status: item.status,
                                multiple: item.multiple,
                                multipleNumber: item.multipleNumber,
                                price: item.price,
                                activityPrice: item.price * item.multipleNumber,
                                activityStartTime: item.activityStartTime,
                                activityEndTime: item.activityEndTime
                            },
                            productSkuModels: [{
                                price: item.productPrice,
                                originalPrice: item.productOriginPrice
                            }]
                        }
                    }
                }
                this.ongoingList = result[0]
                this.incomingList = result[1]
                return result
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" module>
.book {
    box-sizing: border-box;
    padding: 30px 20px 56px;
    min-height: 100vh;
    background-color: #ffde8a;
    > main {
        box-sizing: border-box;
        min-height: calc(100vh - 30px - 56px);
        background-color: #fff8eb;
        border-radius: 20px;
        overflow: hidden;
    }
    .top {
        width: 100%;
        height: 210px;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/yu-gou-top.png') no-repeat center;
        background-size: 100%;
    }
    .content {
        padding-bottom: 24px;
        > section {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 24px 0;
            > ul {
                width: 100%;
            }
        }
    }
    .status {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 32px;
        width: 290px;
        height: 60px;
        background-color: #ff772b;
        border-radius: 60px;
        font-size: 30px;
        color: #fff;
    }
    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 14px;
        width: 40px;
        height: 40px;
        background: #fff;
        border-radius: 50%;
    }
}
.no-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
    p {
        margin-top: 20px;
        font-size: 32px;
        color: #999;
    }
}

</style>
