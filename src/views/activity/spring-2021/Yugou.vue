<template>
    <Panel custom-class="spring-2021-yugou-panel" @click="$router.push({ name: 'PurchaseInAdvance' })">
        <template slot="title">
            <div class="spring-2021-yugou-panel-title">
                <b>新春开学季 早定更优惠</b>
            </div>
        </template>
        <template slot="default">
            <ul :class="$style.yugouList" v-if="data.values.length">
                <YugouItemLarge
                    v-if="isOdd"
                    :class="[$style.yugouListItem, $style.marginT0]"
                    :data="first"
                />
                <YugouItemSmall
                    :class="[$style.yugouListItem, (!isOdd && (i === 0 || i === 1)) ? $style.marginT0 : '']"
                    v-for="(item, i) of (isOdd ? rest : data.values)"
                    :key="i"
                    :data="item"
                />
            </ul>
        </template>
    </Panel>
</template>

<script>
import Panel from './Panel.vue'
import YugouItemLarge from '../double-12-2020/items/Yugou-Item-Large.vue'
import YugouItemSmall from '../double-12-2020/items/Yugou-Item-Small.vue'

export default {
    name: 'Yugou',
    components: {
        Panel,
        YugouItemLarge,
        YugouItemSmall
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    computed: {
        isOdd () {
            return !!(this.data.values.length % 2)
        },
        first () {
            return this.data.values[0]
        },
        rest () {
            return this.data.values.slice(1)
        }
    }
}
</script>

<style lang="scss">
.spring-2021-yugou-panel {
    padding-top: 40px;
    background: #FFC70C;
    border-radius: 40px;
    &-title {
        position: relative;
        text-align: center;
        font-size: 40px;
        line-height: 54px;
        color: #D00C03;
        &::before {
            position: absolute;
            top: -12px;
            left: 56px;
            content: '';
            width: 89px;
            height: 60px;
            background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/book.png) no-repeat center;
            background-size: 100%;
        }
        &::after {
            position: absolute;
            top: -12px;
            right: 56px;
            content: '';
            width: 89px;
            height: 60px;
            background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/book.png) no-repeat center;
            background-size: 100%;
        }
    }
    .spring-2021-panel-container {
        padding: 24px 44px 40px;
    }
}
</style>

<style lang="scss" module>
.yugou-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
        margin-top: 40px;
        &.margin-t-0 {
            margin-top: 0;
        }
    }
}

</style>
