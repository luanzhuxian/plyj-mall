<template>
    <div :class="$style.courses">
        <router-view :key="$route.path" />
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
