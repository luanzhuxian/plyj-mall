<template>
  <div :class="$style.service">
    <div :class="$style.allService">
      <div>
        <pl-svg name="time" />
        <span>随时退</span>
      </div>
      <div>
        <pl-svg name="time" />
        <span>过期退</span>
      </div>
    </div>
    <div :class="$style.count">
      <pl-svg name="selled" />
      <span>已售123</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Service'
}
</script>

<style module lang="scss">
  .service {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
  }
  .all-service {
    display: inline-flex;
    > div {
      margin-right: 16px;
      color: #F2B036;
      font-size: 24px;
      svg {
        width: 26px;
        margin-right: 8px;
        vertical-align: -4px;
        path {
          fill: #F2B036;
        }
      }
    }
  }
  .count {
    display: inline-flex;
    align-items: center;
    font-size: 24px;
    color: #999;
    svg {
      width: 24px;
      margin-right: 10px;
    }
  }
</style>
