<template>
    <div :class="$style.yugou">
        <router-link :class="$style.yugouTitle" tag="div" :to="{ name: 'PurchaseInAdvance' }">
            <div :class="$style.yugouTitleBtn">
                查看更多
            </div>
        </router-link>
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <YugouItem
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :data="item"
                    :key="i"
                />
            </template>
        </ul>
    </div>
</template>

<script>
import YugouItem from './item/Yugou-Item.vue'

export default {
    name: 'Yugou',
    components: {
        YugouItem
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    }
}
</script>

<style module lang="scss">
.yugou {
    background: #fff8eb;
    border-radius: 20px;
    overflow: hidden;
    &-title {
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        padding-top: 92px;
        height: 152px;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/title-yu-gou.png') no-repeat center;
        background-size: 100%;
        &-btn {
            width: 222px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            background: #f2b036;
            border-radius: 280px;
            font-size: 24px;
            font-family: Microsoft YaHei;
            color: #fff;
        }
    }
    .list {
        padding: 30px 20px 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
}

</style>
