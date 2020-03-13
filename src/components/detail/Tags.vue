<template>
    <ul :class="$style.tags">
        <li
            v-for="(tag, index) of tags"
            :key="index"
            v-text="tag.labelName"
        />
    </ul>
</template>

<script>
export default {
    name: 'DetailTags',
    props: {
        tags: {
            type: Array,
            default () {
                return []
            }
        }
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
      word-break: break-all;
      background-color: #f6f7fa;
      border-radius: 4px;
      border: 1px solid #e1e2e6;
    }
  }
</style>
