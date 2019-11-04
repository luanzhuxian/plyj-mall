<template>
  <div>
    <img
      :class="$style.img"
      src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/moon-cake/%E4%B8%93%E9%A2%98%E9%A1%B5.jpg" alt=""
      @click="$router.push({ name: 'Lesson', params: { productId: '1156515687099793408' } })"
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MoonCake',
  computed: {
    ...mapGetters(['agentUser', 'userId'])
  }
}
</script>

<style module lang="scss">
  .img {
    width: 100%;
  }
</style>
