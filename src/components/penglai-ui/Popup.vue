<template lang="html">
  <div
    v-if="showPopup"
    class="pl-popup"
  >
    <div
      class="pl-popup__mask"
      :class="{ show: showMask }"
      @click="close"
    />
    <div
      class="pl-popup__box"
      :class="{ show: showBox }"
    >
      <div
        v-if="title"
        class="pl-popup__title"
      >
        {{ title }}
      </div>
      <slot
        v-else
        name="title"
      />
      <div class="pl-popup__content">
        <slot />
      </div>
      <div
        v-if="showCloseIcon"
        class="pl-popup__close-wrapper"
        @click="close"
      >
        <pl-svg
          class="pl-popup__close"
          name="close2"
          color="#ccc"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlPopup',
  props: {
    title: {
      type: String,
      default: ''
    },
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean
    }
  },
  watch: {
    show: {
      handler: function (val) {
        if (val) {
          // 显示dialog
          this.showPopup = true
          // 显示mask
          this.showMask = true
          setTimeout(() => {
            this.showBox = true
          }, 200)
        } else {
          this.showBox = false
          // 隐藏mask
          setTimeout(() => {
            this.showMask = false
            // 隐藏dialog
            setTimeout(() => {
              this.showPopup = false
              this.$emit('update:show', false)
            }, 200)
          }, 300)
        }
      },
      immediate: true
    }
  },
  created () {
    console.log(123)
  },
  data () {
    return {
      showPopup: false,
      showMask: false,
      showBox: false
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss">
.pl-popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;

  &__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
    z-index: 1;
    opacity: 0;
    transition: opacity .2s ease-in-out;
    &.show {
      opacity: 1;
    }
  }

  &__box {
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    width: 100%;
    // max-height: 70%;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    transition: transform .3s ease-in-out;
    z-index: 2;
    overflow: hidden;
    &.show {
      transform: translateY(0);
    }
  }

  &__title {
    box-sizing: border-box;
    padding: 28px 0;
    font-size: 30px;
    color: #333;
    text-align: center;
  }

  &__content {
    max-height: 70%;
  }

  &__close-wrapper {
    position: absolute;
    top: 24px;
    right: 26px;
    > svg {
      width: 46px;
      height: 46px;
    }
  }

  &__close {
    width: 19px;
    height: 19px;
  }
}
</style>
