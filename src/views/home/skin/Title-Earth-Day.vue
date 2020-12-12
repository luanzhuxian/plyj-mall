<template>
    <div :class="$style.titleEarthDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleEarthDay',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-earth-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 128px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/earth-day/title.png') no-repeat center bottom;
    background-size: 595px auto;
    .title {
        position: relative;
        top: 18px;
        max-width: 310px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
