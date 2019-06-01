<template>
  <button
    :class="{
      'pl-button': true,
      [`pl-button__${type}`]: true,
      [`pl-button__${size}`]: true,
      'round': round,
      'plain': plain,
      'shadow': shadow
    }"
    :disabled="disabled || loading"
    @click.stop="handleClick"
  >
    <span>
      <pl-svg
        v-if="loading"
        class="pl-button__loading"
        name="btn-loading"
      />
      <pl-svg
        class="pl-button__prefix-icon"
        v-if="prefixIcon"
        :name="prefixIcon"
      />
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'PlButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: Boolean,
    // 是否圆角
    round: Boolean,
    // 是否朴素
    plain: Boolean,
    prefixIcon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    loading: Boolean,
    shadow: Boolean
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="scss">
  .pl-button {
    position: relative;
    border: none;
    outline: none;
    span {
      display: inline-block;
      vertical-align: bottom;
    }
    &:disabled {
      background-color: #ccc !important;
      color: #fefefe !important;
    }
    /* 朴素的 */
    &.plain {
      background: none !important;
      &:disabled {
        color: #999 !important;
      }
    }
    /* 有阴影的 */
    &.shadow {
      box-shadow: 0 4px 20px rgba(153, 153, 153, 0.2);
    }
    /* 默认的 */
    &.pl-button__default {
      background-color: $--font-color_gray3;
      color: #fff;
      &:active {
        background-color: $--font-color_gray3;
      }
      &.plain {
        color: $--font-color_gray3;
      }
    }
    /* 主色调 */
    &.pl-button__primary {
      background-color: $--primary-color;
      color: #fff;
      &:active {
        background-color: $--primary-color;
      }
      &.plain {
        color: $--primary-color;
      }
    }
    /* 警告色 */
    &.pl-button__warning {
      background-color: $--warning-color;
      color: #fff;
      &:active {
        background-color: $--warning-color-active;
        color: #ccc;
      }
      &.plain {
        color: $--warning-color
      }
    }
    &.pl-button__text {
      background-color: transparent;
      font-size: 26px;
      color: $--primary-color;
      padding: 0 !important;
      margin: 0 !important;
    }
    /* small */
    &.pl-button__small {
      padding: 0 32px;
      height: 50px;
      font-size: 24px;
      border-radius: 10px;
      &.round {
        border-radius: 25px;
      }
      &.plain {
        &:after {
          @include border-half(currentColor, 50px)
        }
      }
      .pl-button__prefix-icon, .pl-button__loading {
        width: 24px;
        vertical-align: -1px;
        fill: currentColor;
      }
    }
    /* middle */
    &.pl-button__middle {
      padding: 0 22px;
      line-height: 60px;
      font-size: 28px;
      border-radius: 12px;
      &.round {
        border-radius: 31px;
      }
      .pl-button__prefix-icon, .pl-button__loading {
        width: 26px;
        fill: currentColor;
      }
      &.plain {
        &:after {
          @include border-half(currentColor, 24px)
        }
      }
    }
    /* large */
    &.pl-button__large {
      width: 100%;
      height: 80px;
      font-size: 28px;
      border-radius: 20px;
      text-align: center;
      .pl-button__prefix-icon, .pl-button__loading {
        width: 35px;
        margin-right: 5px;
        vertical-align: -7px;
        fill: currentColor;
      }
    }
    /* huge */
    &.pl-button__huge {
      width: 100%;
      height: 108px;
      font-size: 36px;
      border-radius: 20px;
      text-align: center;
      .pl-button__prefix-icon, .pl-button__loading {
        width: 35px;
        margin-right: 5px;
        vertical-align: -5px;
        fill: currentColor;
      }
    }
     /* larger */
    &.pl-button__larger {
      width: 100%;
      height: 90px;
      font-size: 32px;
      border-radius: 10px;
      text-align: center;
      .pl-button__prefix-icon, .pl-button__loading {
        width: 35px;
        margin-right: 5px;
        vertical-align: -5px;
        fill: currentColor;
      }
    }

  }

  .pl-button__loading {
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate {
    from { transform: rotate(0) }
    to { transform: rotate(180deg) }
  }
</style>
