<template>
  <div :class="$style.grade + ' ' + $style[size]">
    <div :class="$style.stars">
      <pl-icon
        v-for="i of 5"
        :key="i"
        name="icon-star"
        :class="{ [$style.selected]: grade >= i, [$style.star]: true }"
        :color="grade >= i ? '#f2b036' : '#fcefd7'"
        :size="iconSize"
        @click="handleClick(i)"
      />
    </div>
    <span
      v-if="selectable"
      :class="$style.text + ' fz-26 gray-3'"
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
      default: 0
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
  computed: {
    iconSize () {
      if (this.size === 'mini') {
        return 20
      }
      if (this.size === 'small') {
        return 30
      }
      if (this.size === 'middle') {
        return 38
      }
      return 16
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
    .stars {
      height: max-content;
    }
    &.middle > .stars {
      line-height: 30px;
      > .star {
        margin-right: 20px;
        &:nth-last-of-type(1) {
          margin: 0;
        }
      }
    }
    &.small > .stars {
      transform: translateY(-5px);
      .star {
        margin-right: 14px;
        &:nth-last-of-type(1) {
          margin: 0;
        }
      }
    }
    &.mini > .stars {
      line-height: 20px;
      transform: translateY(-5px);
      > .star {
        margin-right: 8px;
        &:nth-last-of-type(1) {
          margin: 0;
        }
      }
    }
  }
  .stars {
    > .star {
      display: inline-block;
    }
  }
  .text {
  }
</style>
