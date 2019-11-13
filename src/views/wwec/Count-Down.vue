<template>
  <div>
    <span>{{ time }}s</span>
    <span>后返回首页</span>
  </div>
</template>

<script>
export default {
  name: 'CountDown',
  data () {
    return {
      time: 3,
      suffixText: '',
      prefixText: ''
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.time--
      if (this.time === 0) {
        clearInterval(this.timer)
      }
    }, 1000)
  }
}
</script>

<style module lang="scss">

</style>
