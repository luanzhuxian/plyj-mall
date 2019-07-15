<template>
  <div :class="$style.usefulLife">
    <div :class="$style.title">
      <pl-svg name="date" />
      <span>有效期：</span>
    </div>
    <div :class="$style.date">
      {{ start }}-{{ end }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsefulLife',
  props: {
    start: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .useful-life {
    display: flex;
    align-items: center;
    margin-top: 26px;
    padding: 20px 0 10px 0;
    font-size: 24px;
    border-top: 1px solid #e7e7e7;
  }
  .date {
    color: #000;
  }
  .title {
    display: inline-flex;
    align-items: center;
    color: #999;
    font-weight: bold;
    > svg {
      width: 30px;
      margin-right: 6px;
    }
  }
</style>
