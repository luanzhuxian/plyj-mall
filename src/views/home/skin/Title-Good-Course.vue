<template>
    <div :class="$style.titleGoodCourse">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleGoodCourse',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-good-course {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 94px;
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/good-course/title.png) no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color: #F33C45;
    }
}

</style>
