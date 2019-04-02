<template>
  <ul :class="$style.tags">
    <li v-for="(tag, index) of tags" :key="index" v-text="tag" />
  </ul>
</template>

<script>
export default {
  name: 'DetailTags',
  props: {
    tags: Array
  }
}
</script>

<style module lang="scss">
  .tags {
    display: flex;
    flex-wrap: wrap;
    li {
      position: relative;
      margin: 0 12px 12px 0;
      padding: 6px 12px;
      color: #666;
      font-size: 20px;
      background-color: #f6f7fa;
      border-radius: 4px;
      &:after {
        @include border-half(#e1e2e6, 8px)
      }
    }
  }
</style>
