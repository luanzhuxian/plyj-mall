<template>
  <div :class="$style.liveList">
    <div :class="$style.liveItem" @click="goRoom">
      <div :class="$style.top">
        <img src="https://gdp.alicdn.com/imgextra/i4/2880132427/O1CN01usTKTU1TnbobpCK4k_!!2880132427.jpg" alt="">
        <div :class="$style.foreshow">
          <span>预告</span>
          <span>21小时9分钟后开始</span>
        </div>
      </div>
      <div :class="$style.bottom">
        圣诞快乐国际化
      </div>
    </div>

    <div :class="$style.liveItem">
      <div :class="$style.top">
        <img src="https://gdp.alicdn.com/imgextra/i4/2880132427/O1CN01usTKTU1TnbobpCK4k_!!2880132427.jpg" alt="">
        <div :class="$style.living">
          <span>直播中</span>
          <span>1123人观看</span>
        </div>
      </div>
      <div :class="$style.bottom">
        圣诞快乐国际化
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Live',
  methods: {
    goRoom () {
      this.$router.push({ name: 'LiveRoom' })
    }
  }
}
</script>
<style module lang="scss">
  .live-list{
    padding: 32px 24px;
  }
  .live-item {
    position: relative;
    margin-bottom: 24px;
    border-radius: 15px;
    overflow: hidden;
    > .top {
      position: relative;
      height: 394px;
      width: 702px;
      > img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
      > .foreshow {
        position: absolute;
        bottom: 16px;
        left: 16px;
        display: flex;
        line-height: 40px;
        border: 1px solid #fff;
        border-radius: 6px;
        > span {
          display: inline-block;
          color: #fff;
          font-size: 24px;
          &:nth-of-type(1) {
            width: 100px;
            color: #000;
            text-align: center;
            background-color: #fff;
          }
          &:nth-of-type(2) {
            padding: 0 14px;
          }
        }
      }
      > .living {
        position: absolute;
        bottom: 16px;
        left: 16px;
        line-height: 42px;
        > span {
          display: inline-block;
          color: #fff;
          font-size: 24px;
          &:nth-of-type(1) {
            width: 100px;
            color: #F2B036;
            text-align: center;
            background-color: #fff;
            border-radius: 6px;
          }
          &:nth-of-type(2) {
            padding: 0 14px;
          }
        }
      }
    }
    > .bottom {
      padding: 0 16px;
      line-height: 80px;
      font-size: 32px;
      background-color: #fff;
    }
  }
</style>
