<template lang="html">
  <div
    class="pl-picker-column"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <ul
      ref="wrapper"
      class="pl-picker-column__wrapper"
      :style="wrapperStyle"
      @transitionend="onTransitionEnd"
    >
      <li
        v-for="(option, index) of options"
        :key="index"
        class="ellipsis pl-picker-column__item"
        :class="{ 'pl-picker-column__item--disabled': isOptionDisabled(option) }"
        @click="() => onClickItem(index)"
      >
        {{ getOptionText(option) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { isObj } from '../../../assets/js/util.js'
import { deepClone } from '../../../assets/js/deep-clone.js'
import { preventDefault } from '../../../assets/js/event.js'
import { TouchMixin } from './touch'

const DEFAULT_DURATION = 200
const MOMENTUM_DURATION = 1000
const MOMENTUM_LIMIT_TIME = 300
const MOMENTUM_LIMIT_DISTANCE = 15

function getElementTranslateY (element) {
  const { transform } = window.getComputedStyle(element)
  const translateY = transform.slice(7, transform.length - 1).split(', ')[5]
  return Number(translateY)
}

function isOptionDisabled (option) {
  return isObj(option) && option.disabled
}

function range (num, min, max) {
  return Math.min(Math.max(num, min), max)
}

export default {
  name: 'PickerColumn',
  mixins: [TouchMixin],
  props: {
    valueKey: {
      type: String,
      default: ''
    },
    itemHeight: {
      type: Number,
      default: null
    },
    defaultIndex: {
      type: Number,
      default: null
    },
    visibleItemCount: {
      type: Number,
      default: null
    },
    initialOptions: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      offset: 0,
      duration: 0,
      options: deepClone(this.initialOptions),
      currentIndex: this.defaultIndex,
      isOptionDisabled
    }
  },
  computed: {
    count () {
      return this.options.length
    },
    baseOffset () {
      return (this.itemHeight * (this.visibleItemCount - 1)) / 2
    },
    wrapperStyle () {
      return {
        transform: `translate3d(0, ${(this.offset + this.baseOffset) / 7.5}vh, 0)`,
        // transform: `translate3d(0, ${this.itemHeight}px, 0)`,
        transitionDuration: `${this.duration}ms`,
        lineHeight: `${this.itemHeight / 7.5}vh`
      }
    }
  },
  watch: {
    defaultIndex (value) {
      this.setIndex(this.defaultIndex)
    },
    currentIndex (value) {
      this.calFontSize(value)
    }
  },
  created () {
    if (this.$parent.children) {
      this.$parent.children.push(this)
    }
    this.setIndex(this.currentIndex)
    this.calFontSize(this.currentIndex)
  },
  destroyed () {
    const { children } = this.$parent
    if (children) {
      children.splice(children.indexOf(this), 1)
    }
  },
  methods: {
    calFontSize (current) {
      const { options } = this
      const fontSize = 21
      this.fontSizeList = options.map((option, index) => fontSize - (Math.abs(current - index) * 8))
      this.$forceUpdate()
    },
    onTouchStart (event) {
      this.touchStart(event)

      if (this.moving) {
        const translateY = getElementTranslateY(this.$refs.wrapper)
        this.startOffset = Math.min(0, translateY)
      } else {
        this.startOffset = this.offset
      }

      this.duration = 0
      this.moving = false
      this.transitionEndTrigger = null
      this.touchStartTime = Date.now()
      this.momentumOffset = this.startOffset
    },
    onTouchMove (event) {
      preventDefault(event)
      this.moving = true
      this.touchMove(event)
      this.offset = range(
        this.startOffset + this.deltaY,
        -(this.count * this.itemHeight),
        this.itemHeight
      )

      const now = Date.now()
      if (now - this.touchStartTime > MOMENTUM_LIMIT_TIME) {
        this.touchStartTime = now
        this.momentumOffset = this.offset
      }
    },
    onTouchEnd () {
      const distance = this.offset - this.momentumOffset
      const duration = Date.now() - this.touchStartTime
      const allowMomentum =
       duration < MOMENTUM_LIMIT_TIME &&
       Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE

      if (allowMomentum) {
        this.momentum(distance, duration)
        return
      }

      if (this.offset !== this.startOffset) {
        this.duration = DEFAULT_DURATION
        const index = this.getIndexByOffset(this.offset)
        this.setIndex(index, true)
      }
    },
    onTransitionEnd () {
      this.moving = false

      if (this.transitionEndTrigger) {
        this.duration = DEFAULT_DURATION
        this.transitionEndTrigger()
        this.transitionEndTrigger = null
      }
    },
    onClickItem (index) {
      this.duration = DEFAULT_DURATION
      this.setIndex(index, true)
    },
    adjustIndex (index) {
      index = range(index, 0, this.count)

      for (let i = index; i < this.count; i++) {
        if (!isOptionDisabled(this.options[i])) return i
      }

      for (let i = index - 1; i >= 0; i--) {
        if (!isOptionDisabled(this.options[i])) return i
      }
    },
    getOptionText (option) {
      return isObj(option) && this.valueKey in option ? option[this.valueKey] : option
    },
    setIndex (index, userAction) {
      index = this.adjustIndex(index) || 0
      this.offset = -index * this.itemHeight

      const trigger = () => {
        if (index !== this.currentIndex) {
          this.currentIndex = index

          if (userAction) {
            this.$emit('change', index)
          }
        }
      }

      if (this.moving) {
        this.transitionEndTrigger = trigger
      } else {
        trigger()
      }
    },
    setValue (value) {
      const { options } = this
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i)
        }
      }
    },
    getValue () {
      return this.options[this.currentIndex]
    },
    getIndexByOffset (offset) {
      return range(
        Math.round(-offset / this.itemHeight),
        0,
        this.count - 1
      )
    },
    momentum (distance, duration) {
      const speed = Math.abs(distance / duration)

      distance = this.offset + speed / 0.0015 * (distance < 0 ? -1 : 1)

      const index = this.getIndexByOffset(distance)

      this.duration = MOMENTUM_DURATION
      this.setIndex(index, true)
    }
  }
}
</script>

<style lang="scss">
</style>
