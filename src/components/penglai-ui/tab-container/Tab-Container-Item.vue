<template>
    <div
        v-show="$parent.swiping || id === $parent.currentTab"
        class="pl-tab-container-item"
    >
        <slot />
    </div>
</template>

<script>

/**
 * tab-container-item
 * @desc 搭配 tab-container 使用
 * @module components/tab-container-item
 *
 * @param {number|string} [id] - 该项的 id
 *
 * @example
 * <tab-container v-model="selected">
 *   <tab-container-item id="1"> 内容A </tab-container-item>
 *   <tab-container-item id="2"> 内容B </tab-container-item>
 *   <tab-container-item id="3"> 内容C </tab-container-item>
 * </tab-container>
 */
export default {
    name: 'PlTabContainerItem',
    props: {
        id: {
            type: [String, Number],
            default: ''
        }
    }
}
</script>

<style lang="scss">
  .pl-tab-container-item {
      flex-shrink: 0;
      width: 100%;
  }
</style>
