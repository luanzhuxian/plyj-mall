<template>
  <div :class="'pl-tab' + ` pl-tab__${size}`">
    <div
      v-for="(item, i) of tabs"
      :key="i"
      v-text="item[options.name]"
      :class="{ active: item[options.id] === currentId }"
      @click="handleClick(item)"
    />
  </div>
</template>

<script>
export default {
  name: 'PlTab',
  props: {
    tabs: Array,
    options: {
      type: Object,
      default: function () {
        return {
          name: 'name',
          id: 'id'
        }
      }
    },
    size: {
      type: String,
      default: 'large'
    },
    activeId: [String, Number]
  },
  data () {
    return {
      currentId: null
    }
  },
  watch: {
    activeId () {
      this.currentId = this.activeId
    }
  },
  mounted () {
    this.currentId = this.activeId
  },
  methods: {
    handleClick (item) {
      if (this.currentId !== item[this.options.id]) {
        this.currentId = item[this.options.id]
        this.$emit('change', item)
      }
      this.$emit('update:activeId', this.currentId)
    }
  }
}
</script>

<style lang="scss">
  .pl-tab {
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #333;
    background-color: #fff;
    &.pl-tab__small {
      font-size: 26px;
      > div {
        padding: 0;
        height: 80px;
        line-height: 80px;
      }
    }
    &.pl-tab__large {
      font-size: 32px;
      > div {
        padding: 0 30px;
        height: 100px;
        line-height: 100px;
      }
    }
    > div {
      position: relative;
      &:after {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3px;
        width: 100%;
        background-color: #F2B036;
      }
      &.active {
        color: #F2B036;
        &:after {
          content: '';
        }
      }
    }
  }
</style>
