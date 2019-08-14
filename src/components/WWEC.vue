<template>
  <!-- 820 -->
  <transition name="fade">
    <div
      :class="$style.pop"
      v-show="show && status !== 2"
      @click="close"
    >
      <img
        @click="jump"
        src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/820-haibao.jpg"
        alt=""
      >
      <pl-svg name="close3" color="#fff" />
    </div>
  </transition>
</template>

<script>
import { wasRegist } from '../apis/wwec'
export default {
  name: 'WWEC',
  props: {
    show: Boolean
  },
  data () {
    return {
      status: 0
    }
  },
  async activated () {
    try {
      let { result } = await wasRegist()
      this.status = result.status
    } catch (e) {
      throw e
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    },
    jump () {
      if (this.status === 1) {
        this.$router.push({ name: 'Code820' })
      } else if (this.status === 0) {
        this.$router.push({ name: 'SignUp' })
      } else if (this.status === 2) {
        this.$router.push({ name: 'GetSuccess' })
      }
    }
  }
}
</script>

<style module lang="scss">
  .pop {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
    z-index: 5;
    > img {
      width: 560px;
    }
    > svg {
      width: 48px;
      margin-top: 64px;
    }
  }
</style>
