<template>
  <div :class="$style.count">
    <button
      :class="$style.subtract"
      @click.stop="subtract"
      :disabled="localCount <= min || loading"
    >
      －
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
      ＋
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
    count (val) {
      this.localCount = val
    }
  },
  mounted () {
    this.localCount = this.count
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
    width: 146px;
    line-height: 66px;
    border: 1px solid #e7e7e7;
    box-sizing: border-box;
    border-radius: 8px;
    .input {
      flex: 1;
      width: 100%;
      text-align: center;
    }
    .subtract, .add {
      width: 40px;
      height: 36px;
      font-size: 25px;
      color: #666;
      box-sizing: border-box;
      font-weight: lighter;
      &:disabled {
        color: #e7e7e7;

      }
    }
    .subtract {
      border-right: 1px solid #e7e7e7;
    }
    .add {
      border-left: 1px solid #e7e7e7;
    }
  }
</style>
