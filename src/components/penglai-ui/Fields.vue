<template>
  <div class="pl-fields">
    <div
      :class="'pl-fields_box ' + size"
      @click="handleClick"
    >
      <div class="pl-fields_text">
        <pl-svg
          :color="iconColor"
          v-if="icon && iconPosition === 'left'"
          class="pl-fields_icon"
          :name="icon"
          :style="{ paddingRight: iconGap / 7.5 + 'vw'}"
        />
        <span
          v-text="text"
          :style="{ fontWeight: rightTextWeight }"
        />
        <pl-svg
          :color="iconColor"
          v-if="icon && iconPosition === 'right'"
          class="pl-fields_icon"
          :name="icon"
          :style="{ paddingLeft: iconGap / 7.5 + 'vw'}"
        />
      </div>
      <div class="pl-fields_right">
        <span
          v-if="rightText"
          class="pl-fields_right_text"
          v-text="rightText"
        />
        <pl-svg
          v-if="route || showRightIcon"
          class="pl-fields_right_icon"
          :name="rightIcon"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlFields',
  props: {
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    },
    iconGap: {
      type: Number,
      default: 0
    }, // 图片和文字直接的间隙
    iconPosition: {
      type: String,
      default: 'left'
    },
    text: {
      type: String,
      default: ''
    },
    rightTextWeight: {
      type: String,
      default: 'normal'
    },
    rightText: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: 'right'
    },
    showRightIcon: Boolean,
    route: {
      type: Object,
      default: function () {
        return null
      }
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
      if (this.route) {
        this.$router.push(this.route)
      }
    }
  }
}
</script>

<style lang="scss">
.pl-fields {
  position: relative;
  background-color: #fff;
  border-bottom: 1px solid #e7e7e7;
  &:nth-last-of-type(1):after {
    display: none;
  }
}
  .pl-fields_box {
    position: relative;
    display: flex;
    align-items: center;
    &.large {
      height: 100px;
    }
    &.small {
      height: 70px;
    }
  }
  .pl-fields_text {
    font-size: 28px;
    flex: 1;
  }
  .pl-fields_icon {
    width: 34px;
    height: 34px;
    vertical-align: -7px;
  }
  .pl-fields_right {
    margin-right: 30px;
    display: flex;
    align-items: center;
    .pl-fields_right_text {
      font-size: 28px;
      color: #999;
    }
    .pl-fields_right_icon {
      width: 22px;
      margin-left: 10px;
      fill: #ccc;
      vertical-align: -3px;
    }
  }
</style>
