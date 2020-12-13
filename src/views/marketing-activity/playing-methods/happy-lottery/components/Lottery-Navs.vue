<template>
    <div class="lottery-tabs__nav">
        <slot />
    </div>
</template>
<script lang="jsx">
export default {
    name: 'LotteryNavs'
}
</script>

<style scoped lang="scss">
    .lottery-tabs__nav {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
</style>
