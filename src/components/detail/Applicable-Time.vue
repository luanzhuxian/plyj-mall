<template>
  <div :class="$style.applicableTime + ' radius-20'">
    <div>
      <pl-svg name="time3" />
      <span>使用时间</span>
    </div>
    <div v-text="time" />
  </div>
</template>

<script>
export default {
  name: 'ApplicableTime',
  props: {
    time: String
  }
}
</script>

<style module lang="scss">
  .applicable-time {
    display: flex;
    align-items: center;
    height: 88px;
    padding: 0 34px;
    background-color: #fff;
    div {
      &:nth-of-type(1) {
        font-size: 30px;
        font-weight: bold;
        color: #666;
        svg {
          width: 32px;
          margin-right: 8px;
          vertical-align: -4px;
        }
      }
      &:nth-of-type(2) {
        font-size: 30px;
        color: #999;
        &:before {
          content: '|';
          margin: 0 28px;
          color: #e7e7e7;
        }
      }
    }
  }
</style>
