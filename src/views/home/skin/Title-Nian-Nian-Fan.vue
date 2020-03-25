<template>
    <div :class="$style.titleNianNianFan">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleNianNianFan',
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
.title-nian-nian-fan {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96px;
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/title.png') no-repeat center bottom;
    background-size: 595px auto;
    .title {
        position: relative;
        top: 4px;
        max-width: 310px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
    }
}

</style>
