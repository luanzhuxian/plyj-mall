<template>
    <div :class="$style.titleMidAutumnFestival">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleAutumnFestival',
    props: {
        data: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    }
}
</script>

<style lang="scss" module>
.title-mid-autumn-festival {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 114px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        top: 10px;
        left: 30px;
        max-width: 200px;
        text-align: center;
        font-size: 36px;
        font-family: Microsoft YaHei;
        color:#D96B20;
    }
}

</style>
