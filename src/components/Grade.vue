<template>
  <div :class="$style.grade + ' ' + $style[size]">
    <div :class="$style.stars">
      <pl-svg
        v-for="i of 5"
        name="star"
        :class="{ [$style.selected]: grade >= i }"
        :key="i"
        @click="handleClick(i)"
      />
    </div>
    <span
      v-if="selectable"
      :class="$style.text+' fz-26 gray-3'"
      v-text="gradeText[grade]"
    />
  </div>
</template>

<script>
export default {
  name: 'Grade',
  props: {
    grade: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: 'small'
    },
    // 是否可以选择等级
    selectable: Boolean
  },
  data () {
    return {
      gradeText: ['', '非常差', '差', '一般', '好', '非常好']
    }
  },
  methods: {
    handleClick (grade) {
      if (this.selectable) {
        this.$emit('update:grade', grade)
      }
    }
  }
}
</script>

<style module lang="scss">
  .grade {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    &.middle > .stars > svg {
      width: 38px;
      height: 38px;
      margin-right: 20px;
      &:nth-last-of-type(1) {
        margin: 0;
      }
    }
    &.small > .stars > svg {
      width: 30px;
      height: 30px;
      margin-right: 14px;
      &:nth-last-of-type(1) {
        margin: 0;
      }
    }
    &.mini > .stars > svg {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      &:nth-last-of-type(1) {
        margin: 0;
      }
    }
  }
  .stars > svg {
    fill: #fcefd7;
    path {
      fill: #fcefd7;
    }
    &.selected {
      fill: #f2b036;
      path {
        fill: #f2b036;
      }
    }
  }
  .text {
  }
</style>
