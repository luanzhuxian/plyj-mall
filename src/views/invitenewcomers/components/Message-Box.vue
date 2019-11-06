<template>
  <transition name="fade">
    <div :class="$style.messageBox" v-show="show">
      <div :class="$style.wrap">
        <div :class="$style.title" v-text="title" />
        <div
          :class="$style.message"
          v-text="message"
          :style="{ width: messageWidth / 7.5 + 'vw' }"
        />
        <div>
          <slot />
        </div>
        <button :class="$style.confirmText" v-text="confirmText" @click="confirm" />
      </div>
      <pl-icon @click="close" :class="$style.close" name="icon-close1" size="48" color="#fff" />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'GiftMessageBox',
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    messageWidth: {
      type: [Number, String],
      default: 500
    },
    confirmText: {
      type: String,
      default: ''
    },
    show: Boolean
  },
  methods: {
    close () {
      this.$emit('update:show', false)
      this.$emit('close')
    },
    confirm (e) {
      this.$emit('confirm', e)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style module lang="scss">
  .message-box {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
    z-index: 10;
  }
  .close {
    margin-top: 64px;
  }
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 16px;
    text-align: center;
    background: #FA4D2F url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/got-success%402x.png") no-repeat center top;
    border-radius: 20px;
    > .title {
      font-size: 60px;
      color: #fff;
      font-weight: bold;
    }
    > .message {
      margin-top: 20px;
      margin-bottom: 32px;
      font-size: 20px;
      color: #eee;
      white-space: pre-wrap;
    }
    > .confirmText {
      min-width: 346px;
      color: #A56113;
      line-height: 74px;
      text-align: center;
      font-weight: bold;
      font-size: 26px;
      background-color: #FECD4C;
      border-radius: 37px;
    }
  }
</style>
