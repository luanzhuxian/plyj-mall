<template>
    <div :class="$style.springGroup">
        <div :class="$style.springGroupWrapper">
            <div :class="$style.springGroupTop">
                <div :class="$style.springGroupTopSide" />
                <div :class="$style.springGroupTopContent">
                    <h3>新春团购大联欢</h3>
                    <p>特色课程齐上阵</p>
                </div>
            </div>
            <div :class="$style.springGroupContent">
                <div :class="$style.current" v-if="listCurrent.length">
                    <div :class="$style.title">
                        <span>正在进行中</span>
                    </div>
                    <ul :class="$style.springGroupList">
                        <template v-for="(item, i) of listCurrent">
                            <item
                                :data="item"
                                :key="i"
                                @done="getData"
                            />
                        </template>
                    </ul>
                </div>

                <div :class="$style.preview" v-if="listPreview.length">
                    <div :class="$style.title">
                        <span>即将开始</span>
                    </div>
                    <ul :class="$style.springGroupList">
                        <template v-for="(item, i) of listPreview">
                            <item
                                :data="item"
                                :key="i"
                                @done="getData"
                            />
                        </template>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Item from '../activity/spring/Item-Pintuan'
import { tuanActivityPage } from '../../apis/product'

export default {
    name: 'SpringGroup',
    components: {
        Item
    },
    data () {
        return {
            listPreview: [],
            listCurrent: []
        }
    },
    activated () {
        this.getData()
    },
    methods: {
        async getData () {
            try {
                const { result } = await tuanActivityPage({ type: '2019_02' })
                if (!result[0].length && !result[1].length) {
                    this.$alert({
                        message: '暂无数据',
                        viceMessage: '逛逛主会场吧~',
                        confirmText: '再逛逛'
                    }).finally(() => {
                        this.$router.go(-1)
                    })
                    return
                }
                for (const key of Object.keys(result)) {
                    for (const item of result[key]) {
                        const obj = {
                            goodsInfo: {
                                id: item.productId,
                                pageviews: item.pageViews,
                                productMainImage: item.productMainImage,
                                productName: item.productName,
                                activityInfo: {
                                    status: item.status,
                                    number: item.number,
                                    prizePool: item.prizePool,
                                    activityPrice: item.price,
                                    activityStartTime: item.activityStartTime,
                                    activityEndTime: item.activityEndTime
                                }
                            }
                        }
                        Object.assign(item, obj)
                    }
                }
                this.listPreview = result[0]
                this.listCurrent = result[1]
                return result
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" module>
.spring-group {
    box-sizing: border-box;
    background: #f2d04a;
    padding-top: 32px;
    &-wrapper {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 32px);
    }
    &-top {
        &-side {
            border: 64px solid;
            border-bottom: 32px solid;
            border-top: none;
            border-color: transparent transparent #fe834f transparent;
        }
        &-content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 136px;
            border-top: 4px solid #ffb89a;
            background: #fd6c2f;
            font-size: 26px;
            font-family: Microsoft YaHei;
            color: #fff;
            text-shadow: 0 2px 2px rgba(0, 0, 0, .20);
            > h3 {
                font-size: 48px;
                font-weight: bold;
            }
            > p {
                margin-top: 8px;
                width: 230px;
                height: 40px;
                line-height: 40px;
                background: #feae8c;
                opacity: .8;
                border-radius: 96px;
                font-size: 26px;
                font-family: Microsoft YaHei;
                color: rgba(255, 255, 255, 1);
                text-shadow: 0 1px 1px rgba(0, 0, 0, .20);
                text-align: center;
            }
        }
    }
    &-content {
        flex: 1;
        padding: 0 32px 48px;
        background: #f6501d;
    }
    &-list {
        margin: 32px 0;
    }
    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 32px 0;
        font-size: 36px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        &:before,
        &:after {
            display: inline-block;
            content: '';
            width: 54px;
            height: 50px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/6a46ee61-8198-4315-a70d-c97a42a5782b.png') no-repeat center;
            background-size: 100%;
        }
        &:after {
            transform: rotate(180deg);
        }
        > span {
            margin: 0 32px;
        }
    }
}

</style>
