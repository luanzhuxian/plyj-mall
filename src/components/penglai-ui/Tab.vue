<template>
  <div :class="'pl-tab' + ` pl-tab__${size}`">
    <div
      v-for="(item, i) of tabs"
      :key="i"
      class="pl-tab__pane"
      :class="{ active: item[options.id] === currentId }"
      @click="handleClick(item)"
    >
      {{ item[options.name] }}
      <span
        class="pl-tab__count"
        v-if="count[item.id]"
        v-text="count[item.id]"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlTab',
  props: {
    tabs: {
      type: Array,
      default: function () {
        return []
      }
    },
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
    activeId: {
      type: [String, Number],
      default: ''
    },
    count: {
      type: Object,
      default: null
    }
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
    &__pane {
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
    &__count {
      display: inline-flex;
      justify-content: center;
      position: absolute;
      top: 5px;
      right: -45px;
      width: 56px;
      height: 56px;
      line-height: 54px;
      font-size: 28px;
      transform: scale(.5);
      transform-origin: 0 0;
      color: #fff;
      background: url("../../assets/images/my/circle.png") no-repeat center center;
      background-size: 100%;
    }
  }
</style>
