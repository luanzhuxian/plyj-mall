<template>
    <div :class="$style.answer">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/答题.png" alt="">
        <span :class="$style.title">答题</span>
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss' module>

.answer {
    > .icon {
        width: 102px;
        height: 102px;
    }
    > .title {
        display: block;
        margin-top: 16px;
        text-align: center;
        font-size: 24px;
    }
}

</style>
