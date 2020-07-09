<template>
    <div :class="$style.questions">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/提问.png" alt="">
        <span :class="$style.title">提问</span>
    </div>
</template>

<script>
export default {
    name: 'Questions'
}
</script>

<style lang='scss' module>

.questions {
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
