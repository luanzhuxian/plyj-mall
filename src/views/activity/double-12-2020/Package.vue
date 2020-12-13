<template>
    <Panel
        custom-class="double-12-2020-package-panel"
        :title="title"
        subtitle="双十二组合产品特惠，折扣不停歇"
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
import { mapGetters } from 'vuex'
import Panel from './Panel.vue'
import PackageItem from './items/Package-Item.vue'

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
    },
    computed: {
        ...mapGetters(['mallDomain']),
        title () {
            return this.mallDomain === 'pljs' ? '组合聚惠购' : '组合聚惠学'
        }
    }
}
</script>

<style lang="scss">
.double-12-2020-package-panel {
    .double-12-panel-container {
        margin-top: 0;
        padding: 40px 44px;
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
