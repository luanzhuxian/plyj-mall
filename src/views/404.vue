<template>
  <div :class="$style.notFound">
    {{ s }}秒后跳转回首页...
  </div>
</template>

<script>
export default {
  name: '404',
  data () {
    return {
      s: 3,
      timer: 0
    }
  },
  activated () {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.s--
      if (this.s === 0) {
        clearInterval(this.timer)
        this.$router.push({ name: 'Home' })
        this.s = 3
      }
    }, 1000)
  }
}
</script>

<style module lang="scss">
.not-found {
  width: 100%;
  height: 80vw;
  line-height: 150vw;
  font-size: 30px;
  text-align: center;
  background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/404.png") no-repeat center center;
  background-size: 50vw auto;
}
</style>
