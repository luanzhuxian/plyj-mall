<template>
  <div :class="$style.titleWomenDay">
    <div :class="$style.title" v-text="data" />
  </div>
</template>

<script>
export default {
  name: 'TitleWomenDay',
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
.title-women-day {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 145px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/women-day/title.png") no-repeat center bottom;
  background-size: 570px auto;
}
.title {
  margin-bottom: 18px;
  max-width: 310px;
  line-height: 68px;
  text-align: center;
  font-size: 40px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #FFEEE5;
}
</style>
