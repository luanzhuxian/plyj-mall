<template>
    <div :class="$style.lotteryTab">
        <div :class="$style.tabItem">
            {{ label }}
        </div>
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
    }
}
</script>

<style module lang="scss">
    .lotteryTab {}
</style>
