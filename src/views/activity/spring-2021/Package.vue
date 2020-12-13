<template>
    <Panel
        custom-class="spring-2021-package-panel"
        title="组合聚惠学"
        subtitle="新春组合产品特惠 折扣不停歇"
        @click="$router.push({ name: 'CoursePackage' })"
    >
        <ul :class="$style.packageList" v-if="data.values.length">
            <PackageItem
                :class="$style.packageListItem"
                v-for="(item, i) of data.values"
                :key="i"
                :data="item"
            />
        </ul>
    </Panel>
</template>

<script>
import Panel from './Panel.vue'
import PackageItem from '../double-12-2020/items/Package-Item.vue'

export default {
    name: 'Package',
    components: {
        Panel,
        PackageItem
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    }
}
</script>

<style lang="scss">
.spring-2021-package-panel {
    .spring-2021-panel-container {
        padding: 40px 44px;
    }
    .package-item-btn {
        background: #FF570C;
    }
}
</style>

<style lang="scss" module>
.package-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
        margin-top: 40px;
        &:nth-of-type(1) {
            margin-top: 0;
        }
    }
}
</style>
