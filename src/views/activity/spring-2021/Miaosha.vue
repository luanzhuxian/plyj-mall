<template>
    <Panel
        title="福利秒杀"
        subtitle="新春福利来袭 特色课程限时秒杀"
        @click="$router.push({ name: 'SecKillActivity' })"
    >
        <ul :class="$style.miaoshaList" v-if="data.values.length">
            <MiaoshaItem
                :class="$style.miaoshaListItem"
                v-for="(item, index) of data.values"
                :key="index"
                :data="item"
            />
        </ul>
    </Panel>
</template>

<script>
import Panel from './Panel.vue'
import MiaoshaItem from '../double-12-2020/items//Miaosha-Item.vue'

export default {
    name: 'Miaosha',
    components: {
        Panel,
        MiaoshaItem
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

<style lang="scss" module>
.miaosha-list-item {
    margin-top: 40px;
    &:nth-of-type(1) {
        margin-top: 0;
    }
}

</style>
