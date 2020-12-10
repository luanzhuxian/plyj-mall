<template>
    <Panel
        custom-class="spring-2021-popular-panel"
        title="GO新春上好课"
        subtitle="新春开学季 精品课程大集结"
        hide-button
    >
        <ul :class="$style.popularList" v-if="data.values.length">
            <ProductItemLarge
                v-if="isOdd"
                :class="[$style.popularListItem, $style.marginT0]"
                :data="first"
                :rank="1"
            />
            <ProductItemSmall
                :class="[$style.popularListItem, (!isOdd && (i === 0 || i === 1)) ? $style.marginT0 : '']"
                v-for="(item, i) of (isOdd ? rest : data.values)"
                :key="i"
                :data="item"
                :rank="isOdd ? i + 2 : i + 1"
            />
        </ul>
    </Panel>
</template>

<script>
import Panel from './Panel.vue'
import ProductItemLarge from '../double-12-2020/components/Product-Item-Large.vue'
import ProductItemSmall from '../double-12-2020/components/Product-Item-Small.vue'

export default {
    name: 'Popular',
    components: {
        Panel,
        ProductItemLarge,
        ProductItemSmall
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
.spring-2021-popular-panel {
    .spring-2021-panel-title > b {
        position: relative;
        left: 16px;
    }
    .spring-2021-panel-container {
        padding: 40px 44px;
    }
}
</style>

<style lang="scss" module>
.popular-list {
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
