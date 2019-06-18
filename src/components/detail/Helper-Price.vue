<template>
  <div
    :class="$style.helperPrice"
    v-if="agentUser"
  >
    <pl-svg name="money" />
    <div :class="$style.right">
      <p :class="$style.price + ' fz-28'">
        <span class="bold">润笔</span> <i
          class="rmb"
          v-text="current.agentEndPrice || 0"
        />
      </p>
      <p class="fz-22 gray-3">
        努力分享，可以获得更多的润笔哦~
      </p>
      <p class="fz-22 gray-3">
        点击右上角进行分享哦!
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HelperPrice',
  props: {
    // 当前规格
    current: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['agentUser'])
  }
}
</script>

<style module lang="scss">
  .helper-price {
    position: relative;
    display: flex;
    align-items: start;
    padding: 20px 0;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
    svg {
      width: 30px;
      height: 30px;
      margin-top: 6px;
    }
  }
  .price {
    margin-bottom: 4px;
    line-height: 40px;
    i {
      color: $--primary-color;
      margin-left: 8px;
    }
  }
  .right {
    margin-left: 15px;
    line-height: 32px;
  }
</style>
