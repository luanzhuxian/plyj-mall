<template>
    <Panel
        custom-class="double-12-2020-pintuan-panel"
        title="众志成团"
        subtitle="邀请好友一起瓜分奖励"
        @click="$router.push({ name: 'GroupActivity' })"
    >
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <PintuanItem
                :class="$style.pintuanListItem"
                v-for="(item, i) of data.values"
                :key="i"
                :data="item"
            />
        </ul>
    </Panel>
</template>

<script>
import Panel from './Panel.vue'
import PintuanItem from './components/Pintuan-Item.vue'

export default {
    name: 'Pintuan',
    components: {
        Panel,
        PintuanItem
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
.double-12-2020-pintuan-panel {
    .double-12-panel-container {
        margin-top: 0;
    }
}
</style>

<style lang="scss" module>
.pintuan-item {
    margin-top: 40px;
    &:nth-of-type(1) {
        margin: 0;
    }
}

</style>
