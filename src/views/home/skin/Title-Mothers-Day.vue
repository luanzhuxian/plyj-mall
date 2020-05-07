<template>
    <div :class="$style.titleMothersDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleMothersDay',
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
.title-mothers-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 135px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/title.png') no-repeat center bottom;
    background-size: 595px auto;
    .title {
        position: relative;
        top: 12px;
        max-width: 310px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
