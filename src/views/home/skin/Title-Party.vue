<template>
    <div :class="$style.titleParty">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleParty',
    props: {
        data: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" module>
.title-party {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: url(https://mallcdn.youpenglai.com/static/admall/skin/party/title.png) no-repeat center;
    background-size: auto 100%;
    .title {
        position: relative;
        top: 8px;
        max-width: 200px;
        text-align: center;
        font-size: 40px;
        font-family: Microsoft YaHei;
        color: #FB712B;
    }
}

</style>
