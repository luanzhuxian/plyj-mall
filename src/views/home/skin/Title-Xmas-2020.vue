<template>
    <div :class="$style.titleXmas2020" class="title-xmas-2020">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleXmas2020',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-xmas-2020 {
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
.title-xmas-2020-man {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/xmas-2020/title-man.png) no-repeat center;
    background-size: 100%;
    > div {
        top: 4px;
    }
}
.title-xmas-2020-deer {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/xmas-2020/title-deer.png) no-repeat center;
    background-size: 100%;
    > div {
        top: 12px;
    }
}
.title-xmas-2020-penguin {
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/xmas-2020/title-penguin.png) no-repeat center;
    background-size: 100%;
    > div {
        top: 8px;
    }
}
</style>
