<template>
    <div :class="$style.courses">
        <keep-alive>
            <router-view :key="$route.path" />
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'VideoCourses'
}
</script>

<style module lang='scss'>
  .courses {

  }
</style>
