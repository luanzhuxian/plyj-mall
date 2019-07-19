<template>
  <div :class="$style.hotItem">
    <div :class="$style.top">
      <span :class="$style.title">热销单品</span>
      <p :class="$style.more">
        <span>查看更多</span>
        <pl-svg name="right" color="#ccc" />
      </p>
    </div>

    <div :class="$style.proBox">
      <div :class="$style.first">
        123
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotItem'
}
</script>

<style module lang="scss">
  .hot-item {
    margin-top: 34px;
    padding: 0 24px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
      .title {
        font-size: 36px;
      }
      .more {
        font-size: 24px;
        color: #999;
        > svg {
          width: 20px;
          margin-left: 6px;
          vertical-align: -2px;
        }
      }
    }
  }
  .pro-box {
    .first {}
  }
</style>
