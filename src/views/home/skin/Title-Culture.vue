<template>
    <div :class="$style.titleCulture">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleCulture',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-culture {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 110px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/culture/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        left: 10px;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
    }
}

</style>
