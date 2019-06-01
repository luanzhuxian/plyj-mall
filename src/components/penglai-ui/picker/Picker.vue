<template lang="html">
  <div class="pl-picker">
    <div
      v-if="showToolbar"
      class="pl-picker__toolbar"
    >
      <div
        role="button"
        class="pl-picker__cancel"
        @click="onCancel"
      >
        {{ cancelButtonText }}
      </div>
      <div
        v-if="title"
        class="pl-picker__title ellipsis"
      >
        {{ title }}
      </div>
      <div
        role="button"
        class="pl-picker__confirm"
        @click="onConfirm"
      >
        {{ confirmButtonText }}
      </div>
    </div>
    <div
      class="pl-picker__columns"
      :style="columnsStyle"
      @touchmove="onTouchMove"
    >
      <PickerColumn
        v-for="(item, index) of columnsList"
        :key="index"
        :value-key="valueKey"
        :item-height="itemHeight"
        :visible-item-count="visibleItemCount"
        :initial-options="simple ? item : item.values"
        :default-index="defaultIndex"
        @change="() => onChange(index)"
      />
      <div
        class="pl-picker__mask"
        :style="maskStyle"
      />
      <div
        class="pl-picker__frame hairline--top-bottom"
        :style="frameStyle"
      />
    </div>
  </div>
</template>

<script>
import PickerColumn from './Picker-Column.vue'
import { deepClone } from '../../../assets/js/deep-clone.js'
import { preventDefault } from '../../../assets/js/event.js'

export default {
  name: 'Picker',
  components: {
    PickerColumn
  },
  props: {
    loading: Boolean,
    showToolbar: Boolean,
    title: {
      type: String,
      default: ''
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    visibleItemCount: {
      type: Number,
      default: 5
    },
    itemHeight: {
      type: Number,
      default: 72
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    valueKey: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      children: []
    }
  },
  computed: {
    simple () {
      return this.columns.length && !this.columns[0].values
    },
    wrapHeight () {
      return this.itemHeight * this.visibleItemCount
    },
    columnsList () {
      return this.simple ? [this.columns] : this.columns
    },
    frameStyle () {
      return {
        height: `${this.itemHeight}px`
      }
    },
    columnsStyle () {
      return {
        height: `${this.wrapHeight}px`
      }
    },
    maskStyle () {
      return {
        backgroundSize: `100% ${(this.wrapHeight - this.itemHeight) / 2}px`
      }
    }
  },
  watch: {
    columns () {
      this.setColumns()
    }
  },
  methods: {
    setColumns () {
      const columns = this.simple ? [{ values: this.columns }] : this.columns
      columns.forEach((column, index) => {
        this.setColumnValues(index, deepClone(column.values))
      })
    },
    emit (event) {
      if (this.simple) {
        this.$emit(event, this, this.getColumnValue(0), this.getColumnIndex(0))
      } else {
        this.$emit(event, this, this.getValues(), this.getIndexes())
      }
    },
    onChange (columnIndex) {
      if (this.simple) {
        this.$emit('change', this, this.getColumnValue(0), this.getColumnIndex(0))
      } else {
        this.$emit('change', this, this.getValues(), columnIndex)
      }
    },
    // get column instance by index
    getColumn (index) {
      return this.children[index]
    },
    // get column value by index
    getColumnValue (index) {
      const column = this.getColumn(index)
      return column && column.getValue()
    },
    // set column value by index
    setColumnValue (index, value) {
      const column = this.getColumn(index)
      column && column.setValue(value)
    },
    // get column option index by column index
    getColumnIndex (columnIndex) {
      return (this.getColumn(columnIndex) || {}).currentIndex
    },
    // set column option index by column index
    setColumnIndex (columnIndex, optionIndex) {
      const column = this.getColumn(columnIndex)
      column && column.setIndex(optionIndex)
    },
    // get options of column by index
    getColumnValues (index) {
      return (this.children[index] || {}).options
    },
    // set options of column by index
    setColumnValues (index, options) {
      const column = this.children[index]
      if (column && JSON.stringify(column.options) !== JSON.stringify(options)) {
        column.options = options
        column.setIndex(0)
      }
    },
    // get values of all columns
    getValues () {
      return this.children.map(child => child.getValue())
    },

    // set values of all columns
    setValues (values) {
      values.forEach((value, index) => {
        this.setColumnValue(index, value)
      })
    },
    // get indexes of all columns
    getIndexes () {
      return this.children.map(child => child.currentIndex)
    },
    // set indexes of all columns
    setIndexes (indexes) {
      indexes.forEach((optionIndex, columnIndex) => {
        this.setColumnIndex(columnIndex, optionIndex)
      })
    },
    onConfirm () {
      this.emit('confirm')
    },
    onCancel () {
      this.emit('cancel')
    },
    onTouchMove (event) {
      preventDefault(event)
    }
  }
}
</script>

<style lang="scss">
.pl-picker {
  position: relative;
  background-color: #FFF;
  user-select: none;
  -webkit-text-size-adjust: 100%; /* avoid iOS text size adjust */

  &__toolbar {
    display: flex;
    justify-content: space-between;
    height: 90px;
    line-height: 90px;
    border-bottom: 1px solid #F0F0F0;
  }

  &__cancel,
  &__confirm {
    padding: 0 15px;
    color: #FE7700;
    font-size: 30px;

    &:active {
      // background-color: #333333;
    }
  }

  &__cancel {
    color: #999999;
  }

  &__title {
    max-width: 50%;
    font-weight: 500;
    font-size: 30px;
    text-align: center;
  }

  &__columns {
    position: relative;
    display: flex;
  }

  &__frame {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 3;
    width: 100%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, hsla(0, 0%, 100%, .9), hsla(0, 0%, 100%, .4)), linear-gradient(0deg, hsla(0, 0%, 100%, .9), hsla(0, 0%, 100%, .4));
    background-repeat: no-repeat;
    background-position: top, bottom;
    pointer-events: none;
  }

  &-column {
    flex: 1;
    overflow: hidden;
    font-size: 42px;
    text-align: center;
    // padding: 6px 0;

    &__wrapper {
      transition-timing-function: cubic-bezier(0.23, 1, 0.68, 1);
    }

    &__item {
      padding: 0 5px;
      color: #333333;
      transition: all .2s ease-in;

      &--disabled {
        opacity: .4;
      }
    }
  }

  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .hairline--top-bottom {
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      top: -50%;
      right: -50%;
      bottom: -50%;
      left: -50%;
      border: 0 solid #F0F0F0;
      transform: scale(0.5);
      border-width: 2px 0;
    }
  }
}
</style>
