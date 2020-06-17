<template>
    <div :class="$style.poster">活动海报</div>
</template>

<script>
export default {
    name: 'Rules'
}
</script>

<style module lang="scss">
    .poster {
        position: fixed;
        right: 0;
        top: 276px;
        width: 128px;
        line-height: 50px;
        color: #fff;
        font-size: 24px;
        text-align: center;
        border-radius: 25px 0 0 25px;
        background-color: #FA8E59;
    }
</style>
