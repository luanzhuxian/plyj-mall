<template>
    <div :class="$style.titleCampusSupply" class="title-campus-supply">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleCampusSupply',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-campus-supply {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 124px;
    .title {
        position: relative;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color: #fff;
    }
}
</style>

<style lang="scss">
.title-campus-supply-1 {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/campus-supply/title-1.jpg) no-repeat center;
    background-size: 100%;
    > div {
        top: 4px;
    }
}
.title-campus-supply-2 {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/campus-supply/title-2.jpg) no-repeat center;
    background-size: 100%;
    > div {
        top: 12px;
    }
}
.title-campus-supply-3 {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/campus-supply/title-3.jpg) no-repeat center;
    background-size: 100%;
    > div {
        top: 8px;
    }
}
</style>
