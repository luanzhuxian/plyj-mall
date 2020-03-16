<template>
    <div :class="$style.titleXmas">
        <div :class="$style.title" v-text="data" />
    </div>
</template>

<script>
export default {
    name: 'TitleXmas',
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
.title-xmas {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 126px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/xmas/298790c8-dd14-40a0-b1b6-e80995652dc5.png") no-repeat center;
  background-size: 100%;
  .title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 270px;
    height: 66px;
    background: #23814D;
    border: 3px solid #FFFFFF;
    border-radius: 26px;
    font-size: 36px;
    font-family: Adobe Heiti Std;
    color: #FFFFFF;
    &::before {
      position: absolute;
      left: -33px;
      bottom: -6px;
      content: '';
      width: 80px;
      height: 96px;
      background: url("https://mallcdn.youpenglai.com/static/admall/skin/xmas/7393611f-65e9-4aa7-ad55-5dedc1241183.png") no-repeat center;
      background-size: 100%;
      z-index: 1;
    }
  }
}
</style>
