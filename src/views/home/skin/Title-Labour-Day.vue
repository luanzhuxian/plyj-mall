<template>
    <div :class="$style.titleLabourDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleLabourDay',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-labour-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/labour-day/title.png') no-repeat center;
    background-size: auto 100%;
    ::before {
        position: absolute;
        top: 16px;
        left: -70px;
        content: '';
        width: 58px;
        height: 27px;
        background: url('https://mallcdn.youpenglai.com/static/admall/skin/labour-day/title-left.png') no-repeat center;
        background-size: 100%;
    }
    ::after {
        position: absolute;
        top: 16px;
        right: -70px;
        content: '';
        width: 58px;
        height: 27px;
        background: url('https://mallcdn.youpenglai.com/static/admall/skin/labour-day/title-right.png') no-repeat center;
        background-size: 100%;
    }
    .title {
        position: relative;
        max-width: 310px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #792a1d;
    }
}

</style>
