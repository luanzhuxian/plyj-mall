<template>
  <label class="pl-radio">
    <input
      :checked="label === value"
      type="radio"
      :value="value"
      @change="handleChange"
    >
    <span class="pl-radio-inner" />
    <span class="pl-radio-text">
      <slot />
    </span>
  </label>
</template>

<script>
export default {
  name: 'PlRadio',
  model: {
    event: 'change',
    value: 'value'
  },
  props: {
    value: [String, Boolean, Number],
    label: [String, Boolean, Number]
  },
  methods: {
    handleChange (e) {
      this.$emit('change', this.label)
    }
  }
}
</script>

<style lang="scss">
  .pl-radio {
    display: inline-block;
    margin-right: 30px;
    input {
      width: 0;
      height: 0;
      &:checked {
        ~ .pl-radio-text {
          color: #999!important;
        }
        + .pl-radio-inner {
          padding: 4px;
          border: 3px solid $--warning-color;
          background-color: $--warning-color;
          background-clip: content-box;
        }
      }
    }
    .pl-radio-text {
      font-size: 26px;
    }
  }
  .pl-radio-inner {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border: 1px solid #999;
    border-radius: 50%;
    box-sizing: border-box;
    vertical-align: -7px;
  }
</style>
