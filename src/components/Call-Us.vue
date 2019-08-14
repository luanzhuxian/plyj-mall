<template>
  <div :class="$style.callUs">
    <a href="tel:18500686005" :class="$style.call">
      <pl-svg name="call-us2" />
    </a>
    <transition name="fade">
      <a href="#" :class="$style.top" v-show="scrollY > 100">
        <pl-svg name="right" />
      </a>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CallUs',
  data () {
    return {
      scrollY: 0
    }
  },
  activated () {
    window.addEventListener('scroll', this.scrollHandler)
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    scrollHandler (e) {
      this.scrollY = scrollY
    }
  }
}
</script>

<style module lang="scss">
  .call-us {
    position: fixed;
    bottom: 194px;
    right: 24px;
    display: inline-flex;
    flex-direction: column;
    z-index: 99;
    .call, .top {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 90px;
      height: 90px;
      border-radius: 45px;
      background-color: #fff;
      box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
      > svg {
        width: 46px;
      }
    }
    .top {
      position: absolute;
      bottom: -110px;
      margin-top: 24px;
      transform: rotate(-90deg);
      > svg {
        width: 40px;
      }
    }
  }
</style>
