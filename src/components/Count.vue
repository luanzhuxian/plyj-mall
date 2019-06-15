<template>
  <div :class="$style.count">
    <button
      :class="$style.subtract"
      @click.stop="subtract"
      :disabled="localCount <= min || loading"
    >
      <pl-svg
        name="jian"
        :color="localCount <= min ? '#ccc' : '#666'"
      />
    </button>
    <input
      :class="$style.input"
      type="number"
      :value="localCount"
      @change="valueChange"
    >
    <button
      :class="$style.add"
      @click.stop="add"
      :disabled="localCount >= max || loading"
    >
      <pl-svg
        name="add2"
        :color="localCount >= max ? '#ccc' : '#666'"
      />
    </button>
  </div>
</template>

<script>
export default {
  name: 'Count',
  data () {
    return {
      localCount: 1,
      loading: false
    }
  },
  props: {
    max: {
      type: Number,
      default: Number.MAX_VALUE
    },
    min: {
      type: Number,
      default: 1
    },
    count: {
      type: Number,
      default: 1
    }
  },
  watch: {
    count: {
      handler (val) {
        this.localCount = val
      },
      immediate: true
    }
  },
  methods: {
    add () {
      let temp = this.localCount
      temp++
      this.emitChange(temp)
    },
    subtract () {
      let temp = this.localCount
      temp--
      this.emitChange(temp)
    },
    valueChange (e) {
      let val = Number(e.target.value)
      if (val && (val <= this.max && val >= this.min)) {
        this.emitChange(val)
      } else {
        e.target.value = this.localCount
      }
    },
    emitChange (count) {
      this.loading = true
      /*
      * 触发change事件，在外部调用回调函数后，再改变localCount，并且可以指定localCount
      * */
      this.$emit('change', count, (err, number) => {
        if (!err) {
          this.localCount = number || count
        }
        this.loading = false
      })
    }
  }
}
</script>

<style module lang="scss">
  .count {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 146px;
    line-height: 66px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: transparent;
    &:after {
      @include border-half(#e7e7e7, 16px);
      z-index: 1;
    }
    .input {
      flex: 1;
      width: 100%;
      height: 90%;
      font-size: 20px;
      text-align: center;
      z-index: 2;
    }
    .subtract, .add {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 36px;
      font-size: 25px;
      color: #666;
      box-sizing: border-box;
      font-weight: lighter;
      z-index: 2;
       svg {
         width: 14px;
       }
    }
    .subtract {
      &:after {
        @include border-half-right(#e7e7e7)
      }
    }
    .add {
      &:after {
        @include border-half-left(#e7e7e7)
      }
    }
  }
</style>
