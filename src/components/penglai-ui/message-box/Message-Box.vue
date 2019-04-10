<template>
  <transition name="fade">
    <div
      :class="$style.messageBox"
      v-if="showMask"
      @click.self="handleCancel"
    >
      <transition
        enter-active-class="animated bounceInDown"
        leave-active-class="animated bounceOutDown"
      >
        <div
          :class="$style.messageBoxContent"
          v-show="showBox"
        >
          <div :class="$style.message">
            <pl-svg
              :class="$style.icon"
              v-if="icon"
              :name="icon"
            />
            <p
              :class="$style.mainMessage"
              v-text="message"
            />
            <p
              :class="$style.viceMessage"
              v-if="viceMessage"
              v-text="viceMessage"
            />
          </div>
          <div :class="$style.buttons">
            <button
              @click="handleCancel"
              v-if="type === 'confirm'"
              :class="$style.cancel"
              v-text="cancelText"
            />
            <button
              @click="handleConfirm"
              :class="$style.confirm"
              v-text="confirmText"
            />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MessageBox',
  data () {
    return {
      show: false,
      showMask: false,
      showBox: false,
      resolve: null,
      reject: null
    }
  },
  props: {
    cancelText: String,
    confirmText: String,
    message: String,
    viceMessage: String,
    icon: String,
    type: {
      type: String,
      default: 'confirm'
    }
  },
  watch: {
    show: function (val) {
      if (val) {
        this.showMask = true
        setTimeout(() => {
          this.showBox = true
        }, 200)
      } else {
        this.showBox = false
        setTimeout(() => {
          this.showMask = false
        }, 600)
      }
    }
  },
  methods: {
    handleCancel () {
      this.show = false
      this.$emit('cancel')
    },
    handleConfirm () {
      this.show = false
      this.$emit('confirm')
    }
  }
}
</script>

<style module lang="scss">
  .message-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
    z-index: 9999;
  }
  .icon {
    width: 180px;
    height: 180px;
    margin-bottom: 24px;
  }
  .message-box-content {
    position: relative;
    top: calc(30vh);
    width: 490px;
    margin: 0 auto;
    background-color: #fff;
    text-align: center;
    border-radius: 20px;
    overflow: hidden;
    .message {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      min-height: 100px;
      .vice-message {
        margin-top: 24px;
        font-size: 28px;
        color: #b4b4b4;
      }
      .main-message {
        padding: 0 10px;
        color: #333;
        font-size: 32px;
        font-weight: bold;
      }
    }
  }
  .buttons {
    display: flex;
    border-top: 1px solid #d3d1d2;
    button {
      flex: 1;
      border: none;
      height: 88px;
      font-size: 34px;
      font-weight: bold;
      background-color: #fff;
      &.confirm {
        color: #1890FF;
      }
      &.cancel {
        position: relative;
        color: #999;
        font-weight: normal;
        &:after {
          @include border-half-right(#efefef)
        }
      }
    }
  }
</style>
