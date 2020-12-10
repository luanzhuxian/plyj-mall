<template>
    <Panel
        custom-class="double-12-2020-yugou-panel"
        title="定金翻翻翻"
        subtitle="双十二特惠大礼来袭，定金翻倍享不停"
        @click="$router.push({ name: 'PurchaseInAdvance' })"
    >
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
    </Panel>
</template>

<script>
import Panel from './Panel.vue'
import YugouItemLarge from './components/Yugou-Item-Large.vue'
import YugouItemSmall from './components/Yugou-Item-Small.vue'

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
.double-12-2020-yugou-panel {
    .double-12-panel-container {
        background-color: #F16F00;
        padding: 40px 44px;
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
