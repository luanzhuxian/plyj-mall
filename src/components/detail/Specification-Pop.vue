<template>
  <transition name="fade">
    <div
      :class="$style.specificationsPop"
      v-show="showSpec"
      @click.self.stop="close"
      @transitionend="closed"
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
                  v-text="selected.price || (data[0] && data[0].price)"
                />
                <p
                  :class="$style.original"
                  v-if="selected.originPrice"
                >
                  原价：<del
                    class="rmb"
                    v-text="selected.originPrice || (data[0] && data[0].originPrice)"
                  />
                </p>
                <p :class="$style.repertory">
                  库存<i v-text="selected.stock || 0" />件
                </p>
              </div>
            </div>

            <div :class="$style.color">
              <!--<div>颜色</div>-->
              <div>规格</div>
              <div :class="$style.colorList">
                <button
                  v-for="(item, i) of localData"
                  :key="i"
                  :class="{ [$style.active]: item.optionCode === selected.optionCode }"
                  @click.stop="change(item)"
                  :disabled="item.disabled"
                  v-text="item.optionName"
                />
              </div>
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
                  :disabled="count <= min || currentDisabled"
                  @click.stop="minus"
                >
                  -
                </button>
                <input
                  v-model.number="count"
                  type="number"
                  @input="countChange"
                  :disabled="currentDisabled"
                >
                <button
                  :disabled="count >= stock || currentDisabled"
                  @click.stop="add"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div
            :class="$style.footer"
            v-if="selected.optionCode"
          >
            <slot
              name="footer"
              :selected="selected"
              :revert="revert"
            />
          </div>
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
      count: 1,
      min: 1,
      stock: 1,
      inited: false,
      localData: []
    }
  },
  created () {
    this.setShow(this.visible)
  },
  deactivated () {
    this.inited = false
  },
  watch: {
    // 规格列表加载完成时，初始化一下
    data: {
      handler (val) {
        if (!this.inited && val && val.length > 0) {
          this.init()
        }
      },
      deep: false,
      immediate: true
    },
    visible (val) {
      this.setShow(val)
    },
    // 默认数量变化时，实时更新当前数量
    defaultCount: {
      handler (val) {
        this.count = val
      },
      immediate: true
    }
  },
  computed: {
    currentDisabled () {
      return this.isDisabled(this.selected)
    }
  },
  methods: {
    close () {
      // this.revert()
      this.$emit('update:visible', false)
    },
    closed () {
      if (!this.visible) {
        this.$emit('closed')
      }
    },
    isDisabled (option) {
      return !option.optionCode || (option.stock === 0 || option.stock < option.minBuyNum)
    },
    // 初始化，会选中一个默认规格，如果没有默认规格，选中第一个(禁用的不能选中)，并触发一次change事件
    init () {
      let selected = null
      this.inited = true
      this.count = this.defaultCount
      let currentSku = this.data.find(item => {
        item.disabled = this.isDisabled(item)
        return item.optionCode === this.defaultCode
      })
      if (!currentSku) {
        selected = this.data.filter(item => !item.disabled)[0] || {}
      } else {
        selected = currentSku
      }
      this.min = selected.minBuyNum || 1
      if (!this.count) {
        this.count = this.min
      }
      this.localData = this.data
      this.stock = selected.stock
      this.change(selected)
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
      this.selected.count = this.min = this.count = option.minBuyNum || 1
      this.stock = option.stock
      this.$emit('change', option)
    },
    countChange () {
      if (this.count === '') return
      if (this.count < this.min) {
        this.count = this.min
        this.$warning(`此规格最小购买量为${this.min}`)
      }
      if (this.count > this.stock) {
        this.count = this.stock
        this.$warning(`购买的宝贝数超过剩余库存`)
      }
      this.selected.count = this.count
    },
    minus () {
      this.count--
      this.$set(this.selected, 'count', this.count)
      this.$emit('change', this.selected)
    },
    add () {
      this.count++
      this.$set(this.selected, 'count', this.count)
      this.$emit('change', this.selected)
    },
    // 回滚（如果规格选择失败，或者没选，回滚到最初规格）
    revert () {
      if (this.defaultCode) {
        this.selected = this.data.find(item => item.optionCode === this.defaultCode)
      } else {
        this.selected = this.data[0]
      }
      this.count = this.defaultCount || this.selected.minBuyNum
      this.stock = this.selected.stock
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
    border-bottom: 1px solid #e7e7e7;
    border-top: 1px solid #e7e7e7;
  }
  .size {
    border-bottom: 1px solid #e7e7e7;
  }
  .color-list, .size-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    max-height: 300px;
    padding: 5px;
    overflow: auto;
    box-sizing: border-box;
    > button {
      position: relative;
      margin: 0 13px 13px 0;
      padding: 0 20px;
      width: max-content;
      line-height: 60px;
      color: #666;
      font-size: 24px;
      background-color: #f3f3f3;
      border: 1px solid #f3f3f3;
      border-radius: $--radius2;
      overflow: visible;
      box-sizing: border-box;
      &:disabled {
        color: #ccc !important;
      }
      &.active {
        color: $--primary-color;
        border: 1px solid currentColor;
        border-radius: 9px;
        background: none;
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
        &:disabled {
          color: #ccc !important;
        }
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
        &:disabled {
          color: #ccc !important;
        }
      }
    }
  }
  .footer {
    position: relative;
  }
</style>
