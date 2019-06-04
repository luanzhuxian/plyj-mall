<template>
  <transition name="fade">
    <div
      :class="$style.specificationsPop"
      v-show="showSpec"
      @click.self.stop="close"
    >
      <transition name="slide">
        <div
          :class="$style.specBox"
          v-show="showBox"
        >
          <div>
            <div :class="$style.baseInfo">
              <img
                v-img-error
                :src="productImage"
                alt=""
              >
              <div :class="$style.baseInfoRight">
                <p
                  :class="$style.price"
                  v-text="selected.price"
                />
                <p
                  :class="$style.original"
                  v-if="selected.originPrice"
                >
                  原价：<del
                    class="rmb"
                    v-text="selected.originPrice"
                  />
                </p>
                <p :class="$style.repertory">
                  库存<i v-text="selected.stock" />件
                </p>
              </div>
            </div>

            <div :class="$style.color">
              <!--<div>颜色</div>-->
              <div>规格</div>
              <ul :class="$style.colorList">
                <li
                  v-for="(item, i) of data"
                  :key="i"
                  :class="{ [$style.active]: item.optionCode === selected.optionCode }"
                  @click.stop="change(item)"
                  v-text="item.optionName"
                />
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
              <div :class="$style.countCtr">
                <button
                  :disabled="count <= min"
                  @click.stop="minus"
                >
                  -
                </button>
                <input
                  v-model.number="count"
                  type="number"
                  @change="countChange"
                >
                <button
                  :disabled="count >= stock"
                  @click.stop="add"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <pl-button
            :class="$style.confirm"
            size="large"
            type="warning"
            @click.stop="confirm"
          >
            确定
          </pl-button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SpecificationPop',
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
      type: String,
      default: ''
    },
    // 默认数量
    defaultCount: {
      type: Number,
      default: 0
    },
    // 默认选中的规格
    defaultCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showBox: false,
      showSpec: false,
      selected: {},
      oldSelect: {},
      count: 1,
      min: 1,
      stock: 1
    }
  },
  watch: {
    data: {
      handler (val) {
        if (val && val.length > 0) {
          this.init()
          // this.selected = val[0]
          // this.min = this.count = val[0].minBuyNum || 1
          // this.stock = val[0].stock
        }
      },
      deep: true,
      immediate: true
    },
    visible (val) {
      this.setShow(val)
    },
    defaultCount () {
      this.init()
    },
    defaultCode () {
      this.init()
    }
  },
  created () {
    this.setShow(this.visible)
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    init () {
      this.count = this.defaultCount
      const currentSku = this.data.find(item => item.optionCode === this.defaultCode)
      if (currentSku) {
        this.selected = currentSku || {}
      } else {
        this.selected = this.data[0] || {}
      }
      this.min = this.selected.minBuyNum || 1
      if (!this.count) {
        this.count = this.min
      }
      this.stock = this.selected.stock
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
      this.oldSelect = this.selected
      this.selected = option
      this.min = this.count = option.minBuyNum || 1
      this.stock = option.stock
    },
    countChange () {
      if (this.count <= this.min) {
        this.count = this.min
        this.$warning(`此规格最小购买量为${this.min}`)
      }
      if (this.count >= this.stock) {
        this.count = this.stock
        this.$warning(`购买数量不能大于库存`)
      }
    },
    minus () {
      this.count--
    },
    add () {
      this.count++
    },
    checkCount (count) {
      if (count < this.min) {
        this.$warning(`此规格最小购买量为${this.min}`)
        return false
      }
      if (count > this.stock) {
        this.$warning(`购买数量不能大于库存`)
        return false
      }
      return true
    },
    confirm () {
      if (this.checkCount(this.count)) {
        this.count = Number.parseInt(this.count)
        this.close()
        this.$emit('confirm', Object.assign({ count: this.count }, this.selected), this.oldSelect, this.revert)
      }
    },
    // 回滚（如果规格选择失败，回滚到上一个选择的规格），取决于是否决定这样做
    revert () {
      this.selected = this.oldSelect
      this.min = this.count = this.oldSelect.minBuyNum || 1
      this.stock = this.oldSelect.stock
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
    flex-wrap: wrap;
    align-items: center;
    max-height: 300px;
    padding: 5px;
    overflow: auto;
    box-sizing: border-box;
    li {
      position: relative;
      line-height: 54px;
      margin: 0 13px 13px 0;
      padding: 0 20px;
      color: #666;
      font-size: 24px;
      background-color: #f3f3f3;
      border-radius: $--radius2;
      &.active {
        background: none;
        color: $--primary-color;
        &:after {
          @include border-half($--primary-color, 18px)
        }
      }
    }
  }
  .count {
    > .countCtr {
      display: flex;
      height: 60px;
      button {
        height: 60px;
        width: 60px;
        font-size: 26px;
        font-weight: bold;
        color: #999;
        background-color: #f3f3f3;
      }
      input {
        width: 80px;
        height: 60px;
        margin: 0 2px;
        padding: 0 10px;
        text-align: center;
        font-size: 20px;
        background-color: #f3f3f3;
        border-radius: 0 !important;
      }
    }
  }
  .confirm {
    position: relative;
  }
</style>
