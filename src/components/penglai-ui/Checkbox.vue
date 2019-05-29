<template>
  <label :class="$style.plCheckbox">
    <input
      type="checkbox"
      v-show="false"
    >
    <span :class="$style.plCheckboxInner" />
  </label>
</template>

<script>
export default {
  name: 'PlCheckbox'
}
</script>

<style module lang="scss">
  .pl-checkbox {
    display: flex;
  }
  .pl-checkbox-inner {
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: $--primary-color;
  }
</style>
