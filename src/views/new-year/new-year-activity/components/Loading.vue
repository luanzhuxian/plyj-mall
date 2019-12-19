<template>
  <div class="bg-gray" v-if="show">
    <pl-svg class="loading" name="icon-loading" fill="#FFF" width="90" />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .bg-gray {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.65);
  }

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
    animation: rotate 1.2s linear infinite;
  }
</style>
