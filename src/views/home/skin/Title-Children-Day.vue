<template>
    <div :class="$style.titleChildrenDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleChildrenDay',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-children-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 130px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/children-day/title.png') no-repeat center bottom;
    background-size: 400px auto;
    .title {
        position: relative;
        top: 6px;
        max-width: 310px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #4ccacf;
    }
}

</style>
