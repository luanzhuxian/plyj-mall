<template>
  <div :class="$style.plIcon" @click="handleClick">
    <i
      v-if="type === 'icon'"
      :class="'iconfont ' + name"
      :style="{
        color: color,
        fontSize: size / 7.5 + 'vw'
      }"
    />
    <svg
      v-if="type === 'svg'"
      class="iconfont"
      aria-hidden="true"
      :style="{
        fill: fill,
        width: width / 7.5 + 'vw',
        height: height / 7.5 + 'vw'
      }"
    >
      <use :xlink:href="'#'+ name" />
    </svg>
  </div>
</template>

<script>
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
      type: Boolean,
      default: true
    },
    // 图标类型 icon 或 svg
    type: {
      type: String,
      default: 'icon'
    },
    // 宽 （svg时有用）
    width: {
      type: Number,
      default: 30
    },
    // 高（svg时有用）
    height: {
      type: Number,
      default: 30
    },
    // 字体大小（icon时有用）
    size: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    setTheme () {
    },
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
  }
</style>
