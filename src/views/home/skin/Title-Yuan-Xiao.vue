<template>
  <div
    :class="[
      $style.titleYuanXiao,
      data.split('').length > 2 ? $style.large : $style.small
    ]"
  >
    <div :class="$style.title" v-text="data" />
  </div>
</template>

<script>
export default {
  name: 'TitleYuanXiao',
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
.title-yuan-xiao {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 128px;
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/bbeede14-32d5-49f8-b2d0-87c545216143.png") no-repeat center;
  background-size: 100%;
  &.large > .title {
    width: 470px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/aea27816-d663-45eb-bc52-7fb90be39070.png") no-repeat center;
    background-size: 100%;
  }
  &.small > .title {
    width: 382px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/82c660db-2fc7-4592-911e-310f39ae31a5.png") no-repeat center;
    background-size: 100%;
  }
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 110px;
  font-size: 52px;
  font-family: FZQingKeBenYueSongS-R-GB;
  color: #F75519;
  letter-spacing: 8px;
}
</style>
