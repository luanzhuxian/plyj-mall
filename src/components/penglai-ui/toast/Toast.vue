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
      <i
        v-if="type === 'warning'"
        class="pl-icon icon-jinggao"
      />
      <i
        v-if="type === 'success'"
        class="pl-icon icon-chenggong"
      />
      <i
        v-if="type === 'error'"
        class="pl-icon icon-shibai"
      />
      <span class="toast-message">{{ message }}</span>
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
      timer: 0,
      type: ''
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
    max-width: 80%;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 58px 62px;
    word-break: keep-all;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    text-align: center;
    border-radius: 4px;
    z-index: 9999;
    svg {
      width: 72px;
      fill: #fff;
    }
    .toast-message {
      margin-top: 16px;
      font-size: 28px;
      max-width: 80vw;
      word-break: break-all;
    }
    .pl-icon {
      font-size: 72px;
    }
  }
</style>
