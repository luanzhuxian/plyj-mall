<template>
    <div :class="$style.infoItem" @click="clickHandler">
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
    name: 'InfoItem',
    methods: {
        clickHandler (e) {
            this.$emit('click', e)
        }
    }
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
