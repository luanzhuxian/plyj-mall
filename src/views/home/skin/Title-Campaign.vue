<template>
    <div :class="$style.titleCampaign">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleCampaign',
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
.title-campaign {
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    background: linear-gradient(0deg,#0B97FF 0%,#57A1FF 100%);
    font-size: 36px;
    font-family: HYLiLiangHeiJ;
    color: #FFF;
    text-shadow: 0px 3px 4px rgba(17,17,17,0.41);
    letter-spacing: 8px;
  }
}
</style>
