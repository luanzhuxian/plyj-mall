<template>
  <div :class="$style.courses">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Courses'
}
</script>

<style module lang='scss'>
  .courses {

  }
</style>
