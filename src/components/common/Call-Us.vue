<template>
  <div :class="$style.callUs">
    <a :href="`tel:${tel}`" :class="$style.call">
      <pl-svg name="call-us2" />
    </a>
    <transition name="fade">
      <div @click="setCurrent" :class="$style.top" v-show="scrollY > 100">
        <pl-svg name="right" />
      </div>
    </transition>
  </div>
</template>

<script>
import { Quad } from '../../assets/js/animation-timing-function'
const EaseOut = Quad.easeOut
let t = 0
let b = 0
let c = 0
let d = 60
export default {
  name: 'CallUs',
  data () {
    return {
      scrollY: 0,
      bscrollY: 0
    }
  },
  props: {
    tel: {
      type: String,
      default: ''
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
      this.scrollY = window.scrollY
    },
    setCurrent () {
      c = window.scrollY
      this.toTop()
    },
    toTop () {
      let to = EaseOut(t, b, c, d)
      t++
      if (t < d) {
        window.scrollTo(0, c - to)
        requestAnimationFrame(this.toTop)
      } else {
        window.scrollTo(0, 0)
        c = 0
        t = 0
      }
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
