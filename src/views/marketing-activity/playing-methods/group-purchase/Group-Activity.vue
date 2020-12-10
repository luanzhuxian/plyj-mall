<template>
    <div :class="$style.group">
        <main>
            <div :class="$style.top" />
            <div :class="$style.content">
                <template v-if="loaded && !noContent">
                    <section v-if="ongoingList.length">
                        <div :class="$style.status">
                            <div :class="$style.icon">
                                <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/lightening-orange.png" style="width: 3.5vw;" alt="">
                            </div>
                            正在进行中
                        </div>
                        <ul>
                            <template v-for="(item, i) of ongoingList">
                                <product-item :key="'ongoing-' + i" :data="item" size="long" />
                            </template>
                        </ul>
                    </section>
                    <section v-if="incomingList.length">
                        <div :class="$style.status">
                            <div :class="$style.icon">
                                <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/clock-orange.png" style="width: 3.5vw;" alt="">
                            </div>
                            即将开始
                        </div>
                        <ul>
                            <template v-for="(item, i) of incomingList">
                                <product-item :key="'incoming-' + i" :data="item" size="long" />
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
                    <p>当前没有团购商品</p>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import ProductItem from './components/Group-Product-Item.vue'
import { groupActivityPage } from '../../../../apis/product'

export default {
    name: 'GroupActivity',
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
    async created () {
        try {
            this.loaded = false
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getList () {
            try {
                const { result = { map0: [], map1: [] } } = await groupActivityPage()

                if (!result.map0.length && !result.map1.length) {
                    return this.$alert({
                        message: '暂无团购商品',
                        viceMessage: '再逛逛吧~',
                        confirmText: '再逛逛'
                    }).finally(() => {
                        this.$router.go(-1)
                    })
                }

                for (const list of [result.map0, result.map1]) {
                    for (const item of list) {
                        item.goodsInfo = {
                            ...item,
                            id: item.productId,
                            pageviews: item.pageViews,
                            activityInfo: {
                                status: item.status,
                                prizePool: item.prizePool,
                                number: item.number,
                                activityPrice: item.price,
                                activityStartTime: item.activityStartTime,
                                activityEndTime: item.activityEndTime
                            }
                        }
                    }
                }
                this.ongoingList = result.map0
                this.incomingList = result.map1
                return result
            } catch (e) {
                throw e
            } finally {
                this.loaded = true
            }
        }
    }
}
</script>

<style lang="scss" module>
.group {
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
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/pin-tuan-top.png') no-repeat center;
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
