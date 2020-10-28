<template>
    <div :class="$style.titleDouble12">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleDouble12',
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
.title-double-12 {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/double-12/title.png') no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color: #D12C19;
    }
}

</style>
