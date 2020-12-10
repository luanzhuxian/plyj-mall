<template>
    <div :class="$style.tabs">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'LotteryTabs'
}
</script>

<style module lang="scss">
    .tabs {}
</style>
