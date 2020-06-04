<template>
    <div :class="$style.titleFathersDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleFathersDay',
    props: {
        data: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    }
}
</script>

<style lang="scss" module>
.title-fathers-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/title.png') no-repeat center;
    background-size: 576px 70px;
    .title {
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
