<template>
  <transition name="fade">
    <div
      :class="$style.specificationsPop"
      v-show="showSpec"
      @click.self.stop="close"
      @touchmove.stop.prevent="() => {}"
    >
      <transition name="slide">
        <div :class="$style.specBox" v-show="showBox">
          <pl-svg :class="$style.close" name="close2" color="#ccc" @click.stop="close" />
          <div>
            <div :class="$style.baseInfo" v-if="currentSku">
              <img
                v-if="currentSku.skuImage"
                v-img-error
                :src="skuImage + '?x-oss-process=style/thum'"
                alt=""
              >
              <div :class="$style.baseInfoRight">
                <p :class="$style.price" v-text="activityProductModel.price" v-if="activeProduct !== 1 && preActivity === 2" />
                <p :class="$style.price" v-text="currentSku.price" v-else />
                <p :class="$style.original" v-if="currentSku.price !== currentSku.originalPrice && currentSku.originalPrice">
                  原价：<del class="rmb" v-text="currentSku.originalPrice" />
                </p>
                <p :class="$style.repertory" v-if="currentSku.skuCode1Name">
                  已选：
                  “<i v-text="currentSku.skuCode1Name" />
                  <template v-if="currentSku.skuCode2Name">，<i v-text="currentSku.skuCode2Name" /></template>”
                </p>
              </div>
            </div>
            <div :class="$style.skuBox" @touchmove.stop="() => {}">
              <!-- 规格1 -->
              <div :class="$style.color" v-if="skuAttrList && skuAttrList.length">
                <div v-text="skuAttrList[0].productAttributeName" />
                <div :class="$style.colorList">
                  <template v-for="(item, i) of skuAttrList[0].productAttributeValues">
                    <button
                      v-if="attrIsHear(item.id)"
                      :key="i"
                      @click.stop="skuChange(item.id)"
                      :disabled="sku1IsAllDisabled(item.id)"
                      :class="{ [$style.active]: currentSku1 === item.id }"
                      v-text="item.productAttributeValueName"
                    />
                  </template>
                </div>
              </div>
              <!-- 规格2 -->
              <div :class="$style.color" v-if="skuCode2List.length && skuAttrList.length > 1">
                <div v-text="skuAttrList[1].productAttributeName" />
                <div :class="$style.colorList">
                  <button
                    v-for="(item, i) of skuCode2List"
                    :key="i"
                    @click.stop="subSkuChange(item.skuCode2)"
                    :disabled="item.disabled"
                    :class="{ [$style.active]: currentSku2 === item.skuCode2 }"
                    v-text="item.skuCode2Name"
                  />
                </div>
              </div>
            </div>
            <div :class="$style.count">
              <div>
                <span>购买数量</span>
                <span v-if="activeProduct === 3 && preActivity === 2 && activityProductModel.activityLimit === 1" class="fz-20 ml-10" style="color: #B8B8B8; font-weight: normal;">(每账号限购{{ activityProductModel.activityLimitNumber }}件)</span>
                <span v-if="limiting" class="fz-20 ml-10" style="color: #B8B8B8; font-weight: normal;">(每账号限购{{ limiting }}件)</span>
              </div>
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
                <p :class="$style.residue">
                  库存<i v-text="(activeProduct !== 1 && preActivity === 2) ? activityProductModel.stock : residue" />件
                </p>
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
      default: 0
    },
    // 初始的规格，它可以作为一个默认值，用以回滚
    // 必须包含属性：count[number] skuCode1[string] skuCode2[string]
    sku: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 限购数量
    limiting: {
      type: Number,
      default: 0
    },
    activeProduct: {
      type: [Number, String],
      default: ''
    },
    preActivity: {
      type: [Number, String],
      default: ''
    },
    activityProductModel: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showBox: false,
      showSpec: false,
      count: 1,
      min: 1,
      localCurrentSku: {},
      skuCode2List: [],
      currentSku1: '',
      currentSku2: ''
    }
  },
  deactivated () {
    this.close()
  },
  beforeDestroy () {
    this.close()
  },
  watch: {
    visible (val) {
      this.setShow(val)
      if (val) {
        this.init()
      }
    },
    currentSku: {
      handler (val) {
        if (!val.id) return
        this.localCurrentSku = val
        this.$emit('change', val)
        this.$emit('update:sku', val)
      },
      deep: true
    }
  },
  created () {
    console.log('====' + this.activeProduct)
  },
  computed: {
    currentDisabled () {
      return false
    },
    currentSku () {
      let current = this.skuList.find(item => {
        return item.skuCode1 === this.currentSku1 && item.skuCode2 === this.currentSku2
      }) || {}
      if (this.sku.skuCode1 === current.skuCode1 && this.sku.skuCode2 === current.skuCode2) {
        current.count = this.defaultCount || current.minBuyNum
      } else {
        current.count = current.minBuyNum
      }
      return current
    },
    skuImage () {
      let currentSku1 = this.skuAttrList[0].productAttributeValues.find(item => item.id === this.currentSku1)
      return currentSku1.productAttributeImage ? currentSku1.productAttributeImage[0] || this.productImage : this.productImage
    },
    residue () {
      return this.localCurrentSku.stock
    }
  },
  methods: {
    close () {
      this.revert()
      this.$emit('update:visible', false)
    },
    // 初始化，会选中一个默认规格，如果没有默认规格，选中第一个(禁用的不能选中)，并触发一次change事件
    init () {
      // 有默认规格，并且默认规格有效
      this.localCurrentSku.count = this.count = this.sku.count
      if (this.sku.id && this.sku.stock >= this.sku.minBuyNum && this.sku.count <= this.sku.stock) {
        this.skuChange(this.sku.skuCode1, this.sku.skuCode2)
      } else {
        // 没有默认规格，并且默认规格失效
        let noDisable = this.skuList.find(item => item.stock >= item.minBuyNum)
        if (!noDisable) {
          this.$emit('change', {})
          this.$emit('update:sku', {})
          return
        }
        this.skuChange(noDisable.skuCode1, noDisable.skuCode2 || '')
      }
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
    sku1IsAllDisabled (skuCode1) {
      let sku1list = this.skuList.filter(item => item.skuCode1 === skuCode1)
      return sku1list.every(item => item.stock < item.minBuyNum)
    },
    skuChange (skuCode1, skuCode2) {
      this.currentSku1 = skuCode1
      skuCode2 = skuCode2 || this.currentSku2 || ''
      let skuCode2List = this.skuList.filter(item => item.skuCode1 === skuCode1)
      for (let item of skuCode2List) {
        if (item.stock < item.minBuyNum) {
          this.$set(item, 'disabled', true)
        } else {
          this.$set(item, 'disabled', false)
        }
      }
      let noDisabled = skuCode2List.filter(item => !item.disabled)
      if (skuCode2) {
        let currentSku2 = skuCode2List.find(item => item.skuCode2 === skuCode2)
        if (currentSku2 && !currentSku2.disabled) {
          this.currentSku2 = skuCode2
        } else {
          this.currentSku2 = noDisabled.length ? noDisabled[0].skuCode2 || '' : ''
        }
      } else {
        this.currentSku2 = noDisabled.length ? noDisabled[0].skuCode2 || '' : ''
      }
      let sku2AttrList = []
      for (let item of skuCode2List) {
        if (item.skuCode2) {
          sku2AttrList.push(item.skuCode2)
        }
      }
      this.skuCode2List = skuCode2List
      this.setCount()
    },
    subSkuChange (sku2) {
      this.currentSku2 = sku2
      this.setCount()
    },
    setCount () {
      this.min = this.currentSku.minBuyNum || 1
      let max = Math.max(this.currentSku.count, this.min)
      this.localCurrentSku.count = max
      this.count = max
    },
    attrIsHear (attrId) {
      return this.skuList.some(item => item.skuCode1 === attrId || item.skuCode2 === attrId)
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
      this.count = this.localCurrentSku.count = Number.parseInt(this.count)
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
      if (this.sku.id) {
        this.$emit('change', this.sku)
        this.localCurrentSku = this.sku
        this.count = this.sku.count
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
  .close {
    position: absolute;
    top: 24px;
    right: 26px;
    width: 46px;
    height: 46px;
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
  .skuBox {
    max-height: 420px;
    overflow: scroll;
  }
  .color-list, .size-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 5px;
    overflow: auto;
    box-sizing: border-box;
    > button {
      position: relative;
      margin: 0 13px 13px 0;
      padding: 10px 20px;
      width: max-content;
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
      align-items: center;
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
  .residue {
    margin-left: 20px;
    font-size: 24px;
    color: #999;
  }
  .footer {
    position: relative;
  }
</style>
