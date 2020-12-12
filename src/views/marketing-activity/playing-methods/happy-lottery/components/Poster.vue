<template>
    <div>
        <div :class="$style.poster">分享海报</div>
    </div>
</template>

<script>
export default {
    name: 'HappyLotteryPoster'
}
</script>

<style module lang="scss">
    @import "top-button";
    .poster {
        @include fixedTop();
        background: linear-gradient(180deg, #FFF0A2, #FFEFC6) no-repeat;
        color: #C36304;
    }
</style>
