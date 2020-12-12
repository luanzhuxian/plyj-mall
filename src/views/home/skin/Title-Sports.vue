<template>
    <div :class="$style.titleSports">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleSports',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-sports {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 88px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/sports/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        left: 10px;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color:#FFFFFF;
    }
}

</style>
