<template>
    <div :class="$style.titleWelcomeNew">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleWelcomeNew',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-welcome-new {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 94px;
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/welcome-new/title.png) no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        top: 5px;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
    }
}

</style>
