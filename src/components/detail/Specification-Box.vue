<template>
  <div :class="$style.specificationBox" @click="handleClick">
    <!-- 事件不能绑定在父元素上，因为与弹出框的关闭会相互干扰 -->
    <div>
      <pl-svg name="specification" :class="$style.specIcon" />
      <span class="fz-28">规格</span>
    </div>
    <div :class="$style.specification">
      <span class="fz-22 gray-4" v-if="!current.optionName">请选择规格</span>
      <span class="fz-22 gray-4" v-else v-text="current.optionName"></span>
      <pl-svg name="right"></pl-svg>
    </div>

    <!--<specification-pop :img="img" :data="detail.priceModels" :visible="showSpecifica" @close="popClose" @confirm="selectSpec" />-->
  </div>
</template>

<script>
export default {
  name: 'Specification-Box',
  data () {
    return {
    }
  },
  props: {
    current: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style module lang="scss">
  .specification-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 0;
    background-color: #fff;
    overflow: hidden;
    &:before {
      @include border-half-top(#e7e7e7)
    }
    .specification {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      flex: 1;
      span {
        display: inline-block;
        width: 400px;
        text-align: right;
        @include elps-wrap(1);
      }
      svg {
        width: 16px;
        height: 16px;
        margin-left: 10px;
        fill: $--font-color_gray4;
      }
    }
  }
  .specIcon {
    width: 30px;
    height: 30px;
    margin-right: 20px;
    vertical-align: -5px;
  }
</style>
