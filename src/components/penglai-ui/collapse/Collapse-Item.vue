<template>
  <div
    class="pl-collapse-item"
    :class="{ 'hairline--top': index }"
  >
    <div
      :aria-expanded="expanded"
      class="pl-collapse-item__title"
      :class="{ 'pl-collapse-item__title--expanded': expanded, 'pl-collapse-item__title--disabled': disabled }"
      @click="onClick"
    >
      <div
        v-if="title"
        class="pl-collapse-item__title-text"
      >
        <span
          :class="titleClass"
          :style="titleStyle"
        >
          {{ title }}
        </span>
        <span
          v-if="value"
          :class="valueClass"
        >
          {{ value }}
        </span>
      </div>
      <slot
        v-else
        name="title"
      />

      <pl-svg
        v-if="!useRightIcon"
        class="pl-collapse-item__right-icon"
        :name="rightIcon.name"
        color="#CCC"
      />
      <slot
        v-else
        name="right-icon"
      />
    </div>
    <div
      v-show="show"
      ref="wrapper"
      class="pl-collapse-item__wrapper"
      @transitionend="onTransitionEnd"
    >
      <div
        ref="content"
        class="pl-collapse-item__content"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { ChildrenMixin } from './relation'
import { isDef } from '../../../assets/js/util'

function raf (fn) {
  return window.requestAnimationFrame(fn)
}

export default {
  name: 'CollapseItem',
  mixins: [ChildrenMixin('Collapse')],
  props: {
    rightIcon: {
      type: Object,
      default () {
        return {
          name: 'right',
          color: '#CCC'
        }
      }
    },
    useRightIcon: Boolean,
    center: Boolean,
    disabled: Boolean,
    titleStyle: {
      type: Object,
      default: null
    },
    titleClass: {
      type: Object,
      default: null
    },
    valueClass: {
      type: Object,
      default: null
    },
    title: {
      type: [String, Number],
      default: null
    },
    value: {
      type: [String, Number],
      default: null
    },
    name: {
      type: [String, Number],
      default: null
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: null,
      inited: null
    }
  },
  computed: {
    currentName () {
      return isDef(this.name) ? this.name : this.index
    },

    expanded () {
      if (!this.parent) {
        return null
      }

      const { value } = this.parent
      return this.parent.accordion
        ? value === this.currentName
        : value.some(name => name === this.currentName)
    }
  },
  watch: {
    expanded (expanded, prev) {
      if (prev === null) {
        return
      }

      if (expanded) {
        this.show = true
        this.inited = true
      }

      raf(() => {
        const { content, wrapper } = this.$refs
        if (!content || !wrapper) {
          return
        }

        const { clientHeight } = content
        if (clientHeight) {
          const contentHeight = `${clientHeight}px`
          wrapper.style.height = expanded ? 0 : contentHeight
          raf(() => {
            wrapper.style.height = expanded ? contentHeight : 0
          })
        } else {
          this.onTransitionEnd()
        }
      })
    }
  },
  created () {
    this.show = this.expanded
    this.inited = this.expanded
  },
  methods: {
    onClick () {
      if (this.disabled) {
        return
      }

      const { parent } = this
      const name = parent.accordion && this.currentName === parent.value ? '' : this.currentName
      this.parent.switch(name, !this.expanded)
    },

    onTransitionEnd () {
      if (!this.expanded) {
        this.show = false
      } else {
        this.$refs.wrapper.style.height = null
      }
    }
  }

}
</script>

<style lang="scss">
.pl-collapse-item {
  position: relative;

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    color: #333;
    font-size: 24px;
    line-height: 34px;
    background-color: #FFF;

    &--expanded {
      .pl-collapse-item__right-icon {
        transform: rotate(-90deg);
      }
    }

    &-text {
      flex: 1
    }
  }

  &__right-icon {
    width: 22px;
    transform: rotate(90deg);
    transition: .3s;
  }

  &__wrapper {
    overflow: hidden;
    transition: height .3s ease-in-out;
    will-change: height;
  }

  &__content {
    padding: 16px 0 0;
    color: #333333;
    font-size: 24px;
    line-height: 28px;
    background-color: #FFF;
  }
}
</style>
