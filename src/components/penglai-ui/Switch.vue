<template>
  <label :class="{
    'pl-switch': true,
    checked: value
  }">
    <input type="checkbox" :checked="value" @change="handleChange">
    <span
      :class="{
        'pl-switch_on_off': true,
        'pl-switch_on': value,
        'pl-switch_off': !value
      }">
    </span>
  </label>
</template>

<script>
export default {
  name: 'pl-switch',
  model: {
    event: 'change',
    value: 'value'
  },
  props: {
    value: Boolean
  },
  methods: {
    handleChange (e) {
      this.$emit('change', e.target.checked)
    }
  }
}
</script>

<style lang="scss">
  .pl-switch {
    position: relative;
    display: inline-block;
    > input {
      width: 0;
      height: 0;
    }
    width: 102px;
    height: 62px;
    border-radius: 32px;
    background-color: #fff;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, .3);
    transition: background-color .2s linear, box-shadow .2s linear;
    &.checked {
      background-color: $--primary-color;
      box-shadow: inset 0 0 0 rgba(0, 0, 0, .3);
    }

    .pl-switch_on_off {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 56px;
      height: 56px;
      margin: auto 0;
      border-radius: 28px;
      background-color: #fff;
      box-shadow: 0 3px 4px rgba(0, 0, 0, .3);
      transition: right .2s linear, left .2s linear;
      &.pl-switch_on {
        left: 42px;
      }
      &.pl-switch_off {
        left: 4px;
      }
    }
  }
</style>
