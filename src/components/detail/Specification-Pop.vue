<template>
  <transition name="fade">
    <div :class="$style.specificationsPop" v-show="showSpec" @click.self.stop="close">
      <transition name="slide">
        <div :class="$style.specBox" v-show="showBox">
          <div>
            <div :class="$style.baseInfo">
              <img v-img-error :src="img" alt="">
              <div :class="$style.baseInfoRight">
                <p :class="$style.price" v-text="selected.price" />
                <p :class="$style.original">原价：<del class="rmb" v-text="selected.originPrice" /></p>
                <p :class="$style.repertory">库存<i v-text="selected.stock" />件</p>
              </div>
            </div>

            <div :class="$style.color">
              <!--<div>颜色</div>-->
              <div>规格</div>
              <ul :class="$style.colorList">
                <li v-for="(item, i) of data"
                    :key="i"
                    :class="{ [$style.active]: item.optionCode === selected.optionCode }"
                    @click="change(item)"
                    v-text="item.optionName" />
              </ul>
            </div>
            <!--<div :class="$style.size">-->
            <!--<div>尺寸</div>-->
            <!--<ul :class="$style.sizeList">-->
            <!--<li>L</li>-->
            <!--</ul>-->
            <!--</div>-->
            <div :class="$style.count">
              <div>购买数量</div>
              <div>
                <button @click="minus">-</button>
                <input v-model="count" type="number">
                <button @click="add">+</button>
              </div>
            </div>
          </div>
          <pl-button :class="$style.confirm" size="large" type="warning" @click="confirm">确定</pl-button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Specification-Pop',
  props: {
    visible: Boolean,
    // 所有规格
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    productImage: {
      type: Array,
      default: function () {
        return [{}]
      }
    }
  },
  data () {
    return {
      showBox: false,
      showSpec: false,
      selected: {},
      count: 1,
      min: 1,
      stock: 1
    }
  },
  computed: {
    img: function () {
      return this.productImage[0].mediaUrl || ''
    }
  },
  watch: {
    data (val) {
      this.selected = val[0]
      this.min = this.count = val[0].minBuyNum || 1
      this.stock = val[0].stock
    },
    visible (val) {
      this.setShow(val)
    }
  },
  created () {
    this.setShow(this.visible)
  },
  methods: {
    close () {
      console.log(123)
      this.$emit('update:visible', false)
    },
    setShow (show) {
      if (show) {
        this.showSpec = true
        setTimeout(() => {
          this.showBox = true
        }, 300)
      } else {
        this.showBox = false
        setTimeout(() => {
          this.showSpec = false
        }, 300)
      }
    },
    change (option) {
      this.selected = option
      this.min = this.count = option.minBuyNum || 1
      this.stock = option.stock
    },
    minus () {
      this.count--
    },
    add () {
      this.count++
    },
    checkCount (count) {
      if (count < this.min) {
        this.$toast(`此规格最小购买量为${this.min}`)
        return false
      }
      if (count > this.stock) {
        this.$toast(`购买数量不能大于库存`)
        return false
      }
      return true
    },
    confirm () {
      if (this.checkCount(this.count)) {
        this.close()
        this.$emit('confirm', Object.assign({ count: this.count }, this.selected))
      }
    }
  }
}
</script>

<style module lang="scss">
  .specifications-pop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
    z-index: 12;
  }
  .spec-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 875px;
    padding: 36px 30px 20px 30px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    bottom: 0;
    background-color: #fff;
    box-sizing: border-box;
    img {
      width: 108px;
      height: 108px;
      margin-right: 22px;
      object-fit: cover;
    }
    .base-info {
      display: flex;
      align-items: flex-end;
      padding-bottom: 24px;
    }
  }
  .base-info-right {
    font-size: 24px;
    .price {
      color: $--primary-color;
      font-weight: bold;
      &:before {
        content: '￥';
        font-size: 20px;
      }
    }
    .original {
      color: #adadad;
    }
    .repertory {
      color: #666;
    }
  }
  .color, .size, .count {
    position: relative;
    padding: 20px 0;
    > div:nth-of-type(1) {
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
  .color {
    &:before {
      @include border-half-top(#e7e7e7);
    }
    &:after {
      @include border-half-bottom(#e7e7e7)
    }
  }
  .size {
    &:after {
      @include border-half-bottom(#e7e7e7)
    }
  }
  .color-list, .size-list {
    display: flex;
    li {
      position: relative;
      margin-right: 26px;
      margin-bottom: 13px;
      padding: 10px 20px;
      color: #666;
      background-color: #f3f3f3;
      border-radius: 10px;
      &.active {
        background: none;
        color: $--primary-color;
        &:after {
          @include border-half($--primary-color, 20px)
        }
      }
    }
  }
  .count {
    > div {
      display: flex;
      button {
        width: 60px;
        height: 60px;
        font-size: 26px;
        font-weight: bold;
        color: #999;
        background-color: #f3f3f3;
        margin-right: 3px;
      }
      input {
        width: 80px;
        height: 60px;
        padding: 0 10px;
        margin-right: 3px;
        text-align: center;
        background-color: #f3f3f3;
      }
    }
  }
  .confirm {
    position: relative;
  }
</style>
