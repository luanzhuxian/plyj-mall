<template>
  <ul
    :class="{
      [$style.tags]: true,
      [$style.small]: size === 'small',
      [$style.middle]: size === 'middle'
    }"
  >
    <li
      :class="$style.tag" v-for="(item, i) of tags"
      :key="i"
      v-text="item"
      :style="{ color: color[i] }"
    />
  </ul>
</template>

<script>
export default {
  name: 'Tags',
  data () {
    return {
      color: [
        '#E83B27',
        '#92B1E5',
        '#F3BE41',
        '#60C684'
      ]
    }
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    tags: {
      type: Array,
      default () {
        return [
          '线下',
          '智能白板',
          '智能白板智能白板智能',
          '白板'
        ]
      }
    }
  }
}
</script>

<style module lang="scss">
  .tags {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 8px;
    .tag {
      border: 1px solid currentColor;
      box-sizing: border-box;
    }
    &.middle > .tag {
      margin-right: 12px;
      padding: 0 12px;
      font-size: 24px;
      line-height: 36px;
      border-radius: 8px;
    }
    &.small > .tag {
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 0 12px;
      font-size: 20px;
      line-height: 28px;
      border-radius: 6px;
    }
  }
</style>
