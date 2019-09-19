<template>
  <i
    v-if="type === 'icon'"
    :class="$style.plIcon + ' iconfont ' + name"
    :style="{
      color: color,
      fontSize: size / 7.5 + 'vw',
      fontWeight: fontWeight
    }"
    @click="handleClick"
  />
  <svg
    v-else-if="type === 'svg'"
    :class="$style.plIcon + ' ' + $style.svg + ' iconfont'"
    aria-hidden="true"
    :style="{
      '--fill': fill,
      '--width': width === 'auto' ? width : width / 7.5 + 'vw',
      '--height': height === 'auto' ? height : height / 7.5 + 'vw'
    }"
    @click="handleClick"
  >
    <use :xlink:href="'#'+ name" />
  </svg>
</template>

<script>
/* eslint-disable */
export default {
  name: 'PlIcon',
  props: {
    // 图标再iconfont上的字段名称
    name: {
      type: String,
      require: true,
      default: ''
    },
    // 颜色
    color: {
      type: String,
      default: ''
    },
    // svg 时使用的填充颜色
    fill: {
      type: String,
      default: ''
    },
    // 图标类型 icon 或 svg
    type: {
      type: String,
      default: 'icon'
    },
    // 宽 （svg时有用）
    width: {
      type: [Number, String],
      default: 'auto'
    },
    // 高（svg时有用）
    height: {
      type: [Number, String],
      default: 'auto'
    },
    // 字体大小（icon时有用）
    size: {
      type: [Number, String],
      default: 20
    },
    fontWeight: {
      type: String,
      default: 'normal'
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style module lang="scss">
  .pl-icon {
    display: inline-block;
    font-size: 16px;
    &.svg {
      display: inline-flex;
      height: var(--height);
      width: var(--width);
      fill: var(--fill);
    }
  }

</style>
