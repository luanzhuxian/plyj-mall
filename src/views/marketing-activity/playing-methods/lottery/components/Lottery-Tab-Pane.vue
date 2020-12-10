<template>
    <div :class="$style.lotteryTab">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'LotteryTabs',
    props: {
        label: {
            type: [String, Number],
            default: ''
        }
    }
}
</script>

<style module lang="scss">
    .lotteryTab {}
</style>
