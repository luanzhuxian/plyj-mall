<template>
    <div :class="$style.titleNationalDay">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleNationalDay',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-national-day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/national-day/title.png') no-repeat center;
    background-size: 100%;
    .title {
        position: relative;
        top: -10px;
        max-width: 400px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #BA0909;
    }
}

</style>
