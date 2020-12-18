<template>
    <Panel
        custom-class="double-12-2020-popular-panel"
        :title="title"
        subtitle="双十二特色课程，推荐学子必学榜单"
        hide-button
    >
        <ul :class="$style.popularList" v-if="data.values.length">
            <ProductItemLarge
                v-if="isOdd"
                :class="[$style.popularListItem, $style.marginT0]"
                :data="first"
                :rank="1"
                price-label="双十二价"
            />
            <ProductItemSmall
                :class="[$style.popularListItem, (!isOdd && (i === 0 || i === 1)) ? $style.marginT0 : '']"
                v-for="(item, i) of (isOdd ? rest : data.values)"
                :key="i"
                :data="item"
                :rank="isOdd ? i + 2 : i + 1"
                price-label="双十二价"
            />
        </ul>
    </Panel>
</template>

<script>
import { mapGetters } from 'vuex'
import Panel from './Panel.vue'
import ProductItemLarge from './items/Product-Item-Large.vue'
import ProductItemSmall from './items/Product-Item-Small.vue'

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
        ...mapGetters(['mallDomain']),
        title () {
            return this.mallDomain === 'pljs' ? '君学严选' : '学子推荐榜HOT'
        },
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
.double-12-2020-popular-panel {
    .double-12-panel-container {
        margin-top: 0;
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
