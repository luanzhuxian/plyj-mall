<template>
    <div :class="$style.titleDragonBoat">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleDragonBoat',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-dragon-boat {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 110px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/title.png') no-repeat center;
    background-size: auto 110px;
    .title {
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
