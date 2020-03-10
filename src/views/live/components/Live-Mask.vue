<template>
  <div :class="$style.liveMask">
    <img :src="imgSrc" alt="">
    <div :class="$style.timer">
      <span>直播暂未开始</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiveMask',
  props: {
    imgSrc: {
      type: String,
      default: 'https://mallcdn.youpenglai.com/static/mall/2.5.0/live/live-off.png'
    }
  }
}
</script>

<style lang='scss' module>

  .live-mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
    > .timer {
      display: flex;
      position: absolute;
      left: 0;
      bottom: 0;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 20%;
      font-size: 36px;
      font-weight: 600;
      color: #FFFFFF;
      background: url('https://mallcdn.youpenglai.com/static/mall/2.5.0/live/组 919@2x.png') top/100% no-repeat;
    }
  }

</style>
