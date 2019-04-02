<template>
  <div :class="$style.topText">
    <div :class="$style.left">
      <h2 v-text="title"></h2>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <p v-if="tip" v-text="tip"></p>
      </transition>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopText',
  props: {
    title: String,
    tip: String
  }
}
</script>

<style module lang="scss">
  .top-text {
    .left {
      h2 {
        font-size: 40px;
      }
      > p {
        margin-top: 14px;
        color: #999;
        font-size: 28px;
      }
    }
  }
</style>
