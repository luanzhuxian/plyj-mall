<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    type="animation"
  >
    <div
      class="pl-toast"
      v-show="show"
    >
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  components: {
  },
  data () {
    return {
      show: false,
      message: '',
      duration: '',
      timer: 0
    }
  }
}
</script>

<style lang="scss">
  .pl-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: max-content;
    height: max-content;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 30px;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    white-space: wrap;
    text-align: center;
    border-radius: 20px;
    z-index: 9999;
    svg {
      width: 72px;
      fill: #fff;
    }
    span {
      font-size: 28px;
    }
  }
</style>
