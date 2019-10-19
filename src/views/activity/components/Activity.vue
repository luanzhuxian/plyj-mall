<template>
  <div :class="$style.activity">
    <div :class="$style.wrapper">
      <router-link :class="$style.item" tag="div" :to="{ name: '' }">
        <div :class="$style.itemLeft">
          <div :class="$style.main">
            学霸之路
          </div>
          <div :class="$style.sub">
            惊喜大奖等你来拿
          </div>
        </div>
        <pl-icon name="icon-calendar" type="svg" width="72" height="72" />
        <!-- <svg :class="$style.icon" aria-hidden="true">
          <use xlink:href="#icon-calendar" />
        </svg> -->
      </router-link>
      <router-link :class="$style.item" tag="div" :to="{ name: '' }">
        <div :class="$style.itemLeft">
          <div :class="$style.main">
            邀新有礼
          </div>
          <div :class="$style.sub">
            多种优惠不打烊
          </div>
        </div>
        <pl-icon name="icon-present" type="svg" width="72" height="72" />
        <!-- <svg :class="$style.icon" aria-hidden="true">
          <use xlink:href="#icon-present" />
        </svg> -->
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Activity',
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style module lang="scss">
  .activity {
    .wrapper {
      display: flex;
      padding: 28px 0;
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
    }
    .item {
      flex: 1;
      width: 0;
      display: flex;
      align-items: center;
      padding: 0 24px;
      &:nth-of-type(1) {
        border-right: 2px solid #EEEEEE;
      }
    }
    .item-left {
      flex: 1;
      width: 0;
      .main {
        font-size: 32px;
        font-weight: bold;
        line-height: 44px;
        color: #333333;
        margin-bottom: 4px;
      }
      .sub {
        font-size: 24px;
        line-height: 34px;
        color: #999999;
      }
    }
  }
</style>
