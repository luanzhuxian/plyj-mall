<template>
  <transition name="fade">
    <div
      :class="$style.specificationsPop"
      v-show="showSpec"
      @click.self.stop="close"
      @transitionend="closed"
    >
      <transition name="slide">
        <div :class="$style.specBox" v-show="showBox">
          <div>
            <div :class="$style.baseInfo">
              <img
                v-if="localCurrentSku.skuImage"
                v-img-error
                :src="localCurrentSku.skuImage[0] || productImage + '?x-oss-process=style/thum'"
                alt=""
              >
              <div :class="$style.baseInfoRight">
                <p :class="$style.price" v-text="localCurrentSku.price" />
                <p :class="$style.original" v-if="localCurrentSku.originalPrice">
                  原价：<del class="rmb" v-text="localCurrentSku.originalPrice" />
                </p>
                <p :class="$style.repertory">
                  库存<i v-text="localCurrentSku.stock || 0" />件
                </p>
              </div>
            </div>

            <template v-if="skuAttrList && skuAttrList.length">
              <div :class="$style.color" v-for="(item, i) of skuAttrList" :key="i">
                <div v-text="item.productAttributeName" />
                <div :class="$style.colorList">
                  <template v-if="item.productAttributeValues && item.productAttributeValues.length">
                    <template v-for="(s, j) of item.productAttributeValues">
                      <button
                        v-if="!s.isDisabled && !s.isNoStock"
                        :key="j"
                        @click.stop="change(i, s.id)"
                        :disabled="s.disabled"
                        :class="{ [$style.active]: selected.indexOf(s.id) > -1 }"
                        v-text="s.productAttributeValueName"
                      />
                    </template>
                  </template>
                </div>
              </div>
            </template>

            <div :class="$style.count">
              <div>购买数量</div>
              <div :class="$style.countCtr">
                <button :disabled="count <= min || currentDisabled" @click.stop="minus">
                  -
                </button>
                <input
                  v-model.number="count"
                  type="number"
                  @input="countChange"
                  :disabled="currentDisabled"
                >
                <button :disabled="count >= localCurrentSku.stock || currentDisabled" @click.stop="add">
                  +
                </button>
              </div>
            </div>
          </div>
          <div :class="$style.footer" v-if="localCurrentSku.id">
            <slot
              name="footer"
              :currentSku="localCurrentSku"
              :revert="revert"
            />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
/* eslint-disabled */
export default {
  name: 'SpecificationPop',
  props: {
    visible: Boolean,
    skuList: {
      type: Array,
      default: function () {
        return []
      }
    },
    skuAttrList: {
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
      default: 1
    },
    // 初始的规格，它可以作为一个默认值，用以回滚
    sku: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      showBox: false,
      showSpec: false,
      count: 1,
      min: 1,
      inited: false,
      localData: [],
      selected: [],
      localCurrentSku: {}
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
    skuAttrList: {
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
    },
    sku: {
      handler (val) {
        this.localCurrentSku = val
      },
      deep: true
    },
    localCurrentSku: {
      handler (val) {
        if (val.id) {
          this.selected.splice(0, 1, val.skuCode1)
          this.selected.splice(1, 1, val.skuCode2 || '')
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    currentDisabled () {
      return false
    }
  },
  methods: {
    close () {
      this.revert()
      this.$emit('update:visible', false)
    },
    closed () {
      if (!this.visible) {
        this.$emit('closed')
      }
    },
    // 初始化，会选中一个默认规格，如果没有默认规格，选中第一个(禁用的不能选中)，并触发一次change事件
    init () {
      this.selected = []
      this.inited = true
      if (this.sku.id) {
        this.selected.push(this.sku.skuCode1)
        this.selected.push(this.sku.skuCode2 || '')
      } else {
        for (let [i, attr] of this.skuAttrList.entries()) {
          for (let val of attr.productAttributeValues) {
            let skus = this.skuList.filter(item => item[`skuCode${i + 1}`] === val.id)
            // 判断此类规格是否全部售罄
            this.$set(val, 'isNoStock', skus.every(item => item.stock === 0))
            // 判断此类规格是否全部禁用
            this.$set(val, 'isDisabled', skus.every(item => item.status === 0))
          }
          // 找出没有完全经用的规格
          let noDisabledOrNoStock = attr.productAttributeValues.filter(item => !item.isNoStock && !item.isDisabled)
          if (noDisabledOrNoStock.length) {
            this.selected.push(noDisabledOrNoStock[0].id)
          }
        }
      }
      this.localCurrentSku = this.setSku(this.selected)
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
    setSku (ids) {
      let iterator = ids[Symbol.iterator]()
      let skuAttr = iterator.next()
      let skuList = this.skuList
      let skuNo = 1
      while (!skuAttr.done) {
        skuList = skuList.filter(item => item['skuCode' + skuNo] === skuAttr.value)
        skuAttr = iterator.next()
        skuNo++
      }
      skuList[0].count = skuList[0].minBuyNum
      this.min = skuList[0].minBuyNum
      this.count = this.min
      this.localCurrentSku = skuList[0]
      this.$emit('change', this.localCurrentSku)
      return skuList[0]
    },
    change (index, id) {
      this.selected.splice(index, 1, id)
      this.setSku(this.selected)
    },
    countChange () {
      if (this.count === '') return
      if (this.count < this.min) {
        this.count = this.min
        this.$warning(`此规格最小购买量为${this.min}`)
      }
      if (this.count > this.localCurrentSku.stock) {
        this.count = this.localCurrentSku.stock
        this.$warning(`购买的宝贝数超过剩余库存`)
      }
      this.localCurrentSku.count = this.count
      this.$emit('change', this.localCurrentSku)
    },
    minus () {
      this.count--
      this.$set(this.localCurrentSku, 'count', this.count)
      this.$emit('change', this.localCurrentSku)
    },
    add () {
      this.count++
      this.$set(this.localCurrentSku, 'count', this.count)
      this.$emit('change', this.localCurrentSku)
    },
    // 回滚（如果规格选择失败，或者没选，回滚到最初规格）
    revert () {
      this.$emit('change', this.sku)
      this.localCurrentSku = this.sku
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
      border-bottom: 1px solid #e7e7e7;
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
