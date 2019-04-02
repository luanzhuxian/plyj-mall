<template>
  <transition
    enter-active-class="animated bounceIn"
    leave-active-class="animated bounceOut"
    type="animation"
  >
    <div class="pl-toast" v-show="show">
      <span>{{message}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'toast',
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
    /*left: 50%;*/
    /*top: 50%;*/
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: max-content;
    height: max-content;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 30px;
    margin: auto;
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
