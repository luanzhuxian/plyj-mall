<template>
  <div :class="$style.infoItem">
    <div :class="$style.content">
      <div :class="$style.itemLabel">
        <slot name="label" />
      </div>
      <div :class="$style.itemContent">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoItem'
}
</script>

<style module lang="scss">
  .infoItem {
    display: flex;
    padding-left: 68px;
    padding-right: 28px;
    justify-content: space-between;
    line-height: 88px;
    font-size: 24px;
    border: 2px solid #fff;
    &.lessonError {
      animation: bordrFlicker .15s ease;
      animation-iteration-count: 5;
      border: 2px solid #F24724;
      .lessonErrorTip {
        flex: 1;
        display: inline-flex;
        align-items: center;
        margin-left: 22px;
        color: #F24724;
        > svg {
          width: 32px;
        }
      }
    }
    .content {
      flex: 1;
      display: inline-flex;
      justify-content: space-between;
      &.hasFreight{
        justify-content: flex-start;
      }
      .itemLabel {
        width: max-content;
        color: #333;
      }
      .itemContent {
        color: #666;
        margin-left: 24px;
      }
    }
    .freight {
      text-align: right;
    }
    .remark {
      flex: 1;
      height: 100%;
      padding: 0;
      margin-left: 22px;
      font-size: 24px;
    }
  }
</style>
