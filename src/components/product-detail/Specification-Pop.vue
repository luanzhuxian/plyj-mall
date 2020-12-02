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
                    <pl-svg :class="$style.close" name="icon-close2" width="30" fill="#ccc" @click.stop="close" />
                    <div>
                        <div :class="$style.baseInfo" v-if="currentSku">
                            <img v-imgError
                                 v-if="currentSku.skuImage"
                                 v-img-error
                                 :src="skuImage + '?x-oss-process=style/thum'"
                                 alt=""
                            >
                            <div :class="$style.baseInfoRight">
                                <!-- 公益活动 -->
                                <p
                                    v-if="activeProduct === 7"
                                    :class="$style.price"
                                    v-text="publicBenefitActivePrice"
                                />
                                <p
                                    v-else-if="activeType === 1 || (activeProduct === 4 && !currentSku.activityProduct)"
                                    :class="$style.price"
                                    v-text="currentSku.price"
                                />
                                <!-- 如果是预购的话，取当前选中规格的价格 -->
                                <p
                                    v-else-if="activeProduct === 4 && currentSku.activityProduct"
                                    :class="$style.price"
                                    v-text="currentSku.activityPrice"
                                />
                                <p :class="$style.original"
                                   v-if="currentSku.price !== currentSku.originalPrice && currentSku.originalPrice">
                                    原价：
                                    <del class="rmb" v-text="currentSku.originalPrice" v-if="activeType !== 1" />
                                    <del class="rmb" v-else v-text="currentSku.originalPrice" />
                                </p>
                                <p :class="$style.repertory" v-if="currentSku.skuCode1Name">
                                    已选：
                                    “<i v-text="currentSku.skuCode1Name" />
                                    <template v-if="currentSku.skuCode2Name">，<i v-text="currentSku.skuCode2Name" /></template>
                                    ”
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
                                <!-- 只有 进行中 + 秒杀活动 + 活动购买/从规格页面 按照活动限购显示，其他都按照普通商品的限购显示 -->
                                <span
                                    v-if="activeType === 3 && activityProductModel && activityProductModel.activityLimit === 1"
                                    class="fz-20 ml-10"
                                    style="color: #B8B8B8; font-weight: normal;"
                                >
                                    (每账号限购{{ activityProductModel.activityLimitNumber }}件)
                                </span>
                                <span
                                    v-else-if="limiting"
                                    class="fz-20 ml-10"
                                    style="color: #B8B8B8; font-weight: normal;"
                                >
                                    (每账号限购{{ limiting }}件)
                                </span>
                            </div>
                            <div :class="$style.countCtr">
                                <button
                                    :disabled="(activeType === 1 && count <= min) || (activeType !== 1 && count <= 1)"
                                    @click.stop="minus"
                                >
                                    -
                                </button>
                                <input
                                    v-model.number="count"
                                    type="number"
                                    @blur="countChange"
                                >
                                <!-- 公益活动 -->
                                <button
                                    v-if="activeProduct === 7"
                                    :disabled="count >= publicBenefitActiveStock"
                                    @click.stop="add"
                                >
                                    +
                                </button>
                                <!-- 其他 -->
                                <button
                                    v-else
                                    :disabled="(activeType === 1 && count >= localCurrentSku.stock) || (activeType !== 1 && activityProductModel && count >= activityProductModel.buyCount)"
                                    @click.stop="add"
                                >
                                    +
                                </button>
                                <p :class="$style.residue">
                                    <!-- 活动商品库存展示，如果商品不是预购且活动库存不足，则显示正常库存 -->
                                    <!-- 注意：公益活动例外 -->
                                    <template v-if="activeProduct === 7">
                                        库存<i v-text="publicBenefitActiveStock" />件
                                    </template>
                                    <template v-else-if="activeType !== 1 && activeType !== 4">
                                        总库存<i v-text="activeAllResidue" />件
                                    </template>
                                    <template v-else>
                                        库存<i v-text="residue" />件
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- 预购提醒 -->
                    <div :class="$style.bookPrice" v-if="activeProduct === 4 && preActivity === 2 && currentSku.activityProduct">
                        定金<span>{{ currentSku.activityPrice }}</span>
                        <div class="deposit">
                            抵<span>{{ currentSku.depositTotal }}</span>
                        </div>
                    </div>

                    <!-- 红包抵用提醒 -->
                    <div class="fz-24" v-if="getRedPacket">
                        当前商品可使用满 <i class=" primary-color">{{ getRedPacket.useLimitAmount }}减{{ getRedPacket.amount }}</i> 商品福利红包
                    </div>

                    <div :class="$style.footer" v-if="localCurrentSku.id" @click.capture="slotClickHandler">
                        <slot
                            name="footer"
                            :publicBenefitActiveStock="publicBenefitActiveStock"
                            :publicBenefitActivePrice="publicBenefitActivePrice"
                            :currentSku="localCurrentSku"
                            :revert="revert"
                            :limit="limit"
                            :limiting="(activeType === 3 && activityProductModel && activityProductModel.activityLimit === 1) ? activityProductModel.activityLimitNumber : limiting"
                        />
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import { getCurrentLimit } from '../../apis/product'

export default {
    name: 'SpecificationPop',
    props: {
        visible: Boolean,
        skuList: {
            type: Array,
            default () {
                return []
            }
        },
        // 优惠券列表
        couponList: {
            type: Array,
            default () {
                return []
            }
        },
        skuAttrList: {
            type: Array,
            default () {
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
            default () {
                return {}
            }
        },
        // 商品本身限购数量
        limiting: {
            type: Number,
            default: 0
        },
        // 1普通 2团购 3秒杀 4预购  在选择规格处，只显示作为商品本身的限购数
        activeProduct: {
            type: [Number, String],
            default: 1
        },
        // 0预热未开始 1预热中 2进行中
        preActivity: {
            type: [Number, String],
            default: 0
        },
        // 活动商品数据
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
            // 可买数量
            limit: 0,
            // 当前规格，和计算属性 currentSku 基本一致，不同的是，这个的值可以被修改
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
        async visible (val) {
            this.setShow(val)
            if (val) {
                this.init()
            }
        }
    },
    created () {
    },
    computed: {
        publicBenefitActive () {
            const list = (this.activityProductModel && this.activityProductModel.productModels) || []
            return list.find(({ sku1, sku2 }) => sku1 === this.currentSku1 && sku2 === this.currentSku2) || {}
        },
        // 公益活动所选规格的库存
        publicBenefitActiveStock () {
            return this.publicBenefitActive.activityStock
        },
        publicBenefitActivePrice () {
            return this.publicBenefitActive.activityPrice
        },
        // 当前选中的规格的原始值
        currentSku () {
            const current = this.skuList.find(item => item.skuCode1 === this.currentSku1 && item.skuCode2 === this.currentSku2) || {}
            if (this.sku.skuCode1 === current.skuCode1 && this.sku.skuCode2 === current.skuCode2) {
                current.count = this.defaultCount || current.minBuyNum
            } else {
                current.count = current.minBuyNum
            }
            return { ...current }
        },
        skuImage () {
            const currentSku1 = this.skuAttrList[0].productAttributeValues.find(item => item.id === this.currentSku1)
            return currentSku1.productAttributeImage ? currentSku1.productAttributeImage[0] || this.productImage : this.productImage
        },
        residue () {
            if (this.activeType === 4 && this.localCurrentSku.activityProduct) {
                return this.localCurrentSku.stock
            }
            return this.localCurrentSku.stock
        },

        // 活动期间总余
        activeAllResidue () {
            return this.activityProductModel ? this.activityProductModel.buyCount : 0
        },

        /**
         * 如果不是活动商品 或者活动未开始，返回1（按正常商品处理）
         * 如果是活动商品，且不是预购活动，当活动库存不足时返回 1
         */
        activeType () {
            if (this.activeProduct !== 1 && this.preActivity === 2) {
                if (this.activeAllResidue <= 0 && this.activeProduct !== 4) {
                    return 1
                }
                return this.activeProduct
            }
            return 1
        },

        /**
         * 找出合适的福利红包，如果没有返回null
         * 更加规格和规格价格，找出减免力度最大的红包展示出来
         */
        getRedPacket () {
            const RED_PACKET = this.couponList.filter(item => item.couponType === 3).sort((a, b) => a.amount - b.amount)
            if (!RED_PACKET.length) {
                return null
            }
            // 找出匹配当前规格的红包
            const filterRedPacket = []
            const { skuCode1: CUR_SKUCODE1, skuCode2: CUR_SKUCODE2 } = this.currentSku
            for (const redPacket of RED_PACKET) {
                const { couponGoodsSkuDTOS } = redPacket
                if (couponGoodsSkuDTOS.some(item => item.skuCode === CUR_SKUCODE1 && item.subSkuCode === CUR_SKUCODE2)) {
                    filterRedPacket.push(redPacket)
                }
            }
            return filterRedPacket.slice(-1)[0] || null
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
            this.localCurrentSku.count = this.sku.count
            this.count = this.sku.count
            if (this.sku.id && this.sku.stock >= this.sku.minBuyNum && this.sku.count <= this.sku.stock) {
                this.skuChange(this.sku.skuCode1, this.sku.skuCode2)
            } else {
                // 没有默认规格，并且默认规格失效，找出规格列表中，第一给没有禁用的规格
                const noDisable = this.skuList.find(item => {
                    /**
                     * 规格按钮的禁用规则：
                     * 非活动商品或者活动商品但是活动未开始时，当库存大于最小购买量，按钮就不可选择
                     * 活动商品且活动已开始，当购买数量大于0 的情况下
                     */
                    if (this.activeType === 1 || this.preActivity !== 2) {
                        return item.stock >= item.minBuyNum
                    }
                    return this.activityProductModel && this.activityProductModel.buyCount
                })
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
            const sku1list = this.skuList.filter(item => item.skuCode1 === skuCode1)
            return sku1list.every(item => {
                if (this.activeType === 1 || this.preActivity !== 2) {
                    return item.stock < item.minBuyNum
                }
                return this.activityProductModel && this.activityProductModel.buyCount < 1
            })
        },
        async skuChange (skuCode1, skuCode2) {
            // 该行是有用的，目的是触发多次 watcher 更新，解决选择数量问题
            this.currentSku1 = ''

            this.currentSku1 = skuCode1
            skuCode2 = skuCode2 || this.currentSku2 || ''
            const skuCode2List = this.skuList.filter(item => item.skuCode1 === skuCode1)
            for (const item of skuCode2List) {
                // 普通商品才开启禁用
                if (item.stock < item.minBuyNum && this.activeType === 1) {
                    this.$set(item, 'disabled', true)
                } else {
                    this.$set(item, 'disabled', false)
                }
            }
            const noDisabled = skuCode2List.filter(item => !item.disabled)
            if (skuCode2) {
                const currentSku2 = skuCode2List.find(item => item.skuCode2 === skuCode2)
                if (currentSku2 && !currentSku2.disabled) {
                    this.currentSku2 = skuCode2
                } else {
                    this.currentSku2 = noDisabled.length ? noDisabled[0].skuCode2 || '' : ''
                }
            } else {
                this.currentSku2 = noDisabled.length ? noDisabled[0].skuCode2 || '' : ''
            }
            const sku2AttrList = []
            for (const item of skuCode2List) {
                if (item.skuCode2) {
                    sku2AttrList.push(item.skuCode2)
                }
            }
            this.skuCode2List = skuCode2List
            this.setCount()
            await this.onSkuChange()
        },
        async subSkuChange (sku2) {
            this.currentSku2 = sku2
            this.setCount()
            await this.onSkuChange()
        },
        // 初始化显示的数量
        setCount () {
            this.min = this.currentSku.minBuyNum || 1
            const max = Math.max(this.currentSku.count, this.min)
            this.localCurrentSku.count = max
            this.count = max
        },
        async onSkuChange () {
            await this.$nextTick()
            this.localCurrentSku = this.currentSku
            this.$emit('change', this.currentSku)
            this.$emit('update:sku', this.currentSku)

            // 当前商品限购的时候，检查可买数量
            if (this.limiting) {
                try {
                    const { result: limit } = await getCurrentLimit(this.currentSku.productId, this.activeType)
                    this.limit = limit
                } catch (e) {
                    this.limit = this.limiting
                    this.$error('商品限购检查错误')
                }
            }
        },
        attrIsHear (attrId) {
            return this.skuList.some(item => item.skuCode1 === attrId || item.skuCode2 === attrId)
        },
        countChange () {
            if (this.count === '') return
            if (this.count > this.localCurrentSku.stock) {
                this.count = this.localCurrentSku.stock
                this.$warning(`购买的宝贝数超过剩余库存`)
                return
            }
            if (this.activeType === 1) {
                if (this.count < this.min) {
                    this.count = this.min
                    this.$warning(`此规格最小购买量为${ this.min }`)
                }
                if (this.limiting && this.count > this.limiting) {
                    this.count = this.limiting
                    this.$warning(`每账号限购${ this.limiting }件`)
                }
            } else {
                if (this.count < 1) {
                    this.count = 1
                    this.$warning(`此规格最小购买量为1`)
                }
                if (this.activityProductModel) {
                    if (this.count > this.activityProductModel.buyCount) {
                        this.count = this.activityProductModel.buyCount
                        this.$warning(`购买的宝贝数超过剩余库存`)
                    } else if (this.activityProductModel.activityLimit === 1 && this.count > this.activityProductModel.activityLimitNumber) {
                        this.count = this.activityProductModel.activityLimitNumber
                        this.$warning(`每账号限购${ this.activityProductModel.activityLimitNumber }件`)
                    }
                }
            }
            this.count = Number.parseInt(this.count)
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
            if (this.sku.id) {
                this.$emit('change', this.sku)
                this.localCurrentSku = this.sku
                this.count = this.sku.count
                this.currentSku1 = this.sku.skuCode1
                this.currentSku2 = this.sku.skuCode2
            }
        },

        // 点击购买或者加入购物车时，更新当前可买数量
        async slotClickHandler () {
            setTimeout(async () => {
                // 当前商品限购的时候，检查可买数量
                if (this.limiting) {
                    const { result: limit } = await getCurrentLimit(this.currentSku.productId, this.activeType)
                    this.limit = limit
                }
            }, 1500)
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

    .base-info {
      display: flex;
      align-items: flex-end;
      padding-bottom: 24px;
      border-bottom: 1px solid #e7e7e7;

      > img {
        width: 162px;
        height: 108px;
        margin-right: 22px;
        object-fit: cover;
      }
    }
  }

  .book-price {
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;

    .deposit {
      margin-left: 10px;
    }

    span {
      color: #FE7700;

      &:before {
        content: '¥';
        font-size: 24px;
      }
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
        color: #666;
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
