<template>
    <div :class="$style.titleArts">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleArts',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-arts {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/art/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        left: 4px;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
    }
}

</style>
