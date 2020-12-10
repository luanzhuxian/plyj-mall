<template>
    <div @click="clickHandler">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'LotteryTabPane',
    props: {
        label: {
            type: [String, Number],
            default: ''
        }
    },
    methods: {
        clickHandler (e) {
            this.$emit('pane-click', e)
        }
    }
    // created () {
    //     // 可用来动态新增tab,暂时用不到
    //     this.$emit('lottery-pane-updated')
    // }
}
</script>
