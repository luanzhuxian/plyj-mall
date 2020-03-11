<template>
  <div :class="$style.otherInfo">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'OtherInfo'
}
</script>

<style module lang="scss">
  .other-info {
    margin-top: 44px;
  }
</style>
