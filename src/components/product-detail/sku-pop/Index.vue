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
                                 v-img-error
                                 :src="skuImage + '?x-oss-process=style/thum'"
                                 alt=""
                            >
                            <div :class="$style.baseInfoRight">
                                <!-- 公益活动 -->
                                <p
                                    v-if="activeType === 7"
                                    :class="$style.price"
                                    v-text="publicBenefitActivePrice"
                                />
                                <p
                                    v-else-if="activeType === 1 || (activeType === 4 && !currentSku.activityProduct)"
                                    :class="$style.price"
                                    v-text="currentSku.price"
                                />
                                <!-- 如果是预购的话，取当前选中规格的价格 -->
                                <p
                                    v-else-if="activeType === 4 && currentSku.activityProduct"
                                    :class="$style.price"
                                    v-text="currentSku.activityPrice"
                                />
                                <p
                                    v-else-if="activeType !== 1 && activeType !== 4"
                                    :class="$style.price"
                                    v-text="activityProductModel.price"
                                />
                                <p :class="$style.original"
                                   v-if="currentSku.price !== currentSku.originalPrice && currentSku.originalPrice"
                                >
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
                                <p :class="$style.repertory" v-text="currentSku.noSku" />
                            </div>
                        </div>
                        <div :class="$style.skuBox" @touchmove.stop="() => {}">
                            <LabelSku
                                :sku-attr="formatedSkuAttrList"
                                :sku-list="skuList"
                                :default-sku-attrs="currentSkuAttrs"
                                @change="skuChange"
                            />
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
                                    :disabled="(activeType === 1 && count >= currentSku.stock) || (activeType !== 1 && activityProductModel && count >= activityProductModel.buyCount)"
                                    @click.stop="add"
                                >
                                    +
                                </button>
                                <p :class="$style.residue" v-if="skuHasChecked">
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

                        <!-- 预购提醒 -->
                        <div :class="$style.bookPrice" v-if="activeProduct === 4 && preActivity === 2 && currentSku.activityProduct">
                            定金<span>{{ currentSku.activityPrice }}</span>
                            <div class="deposit">
                                抵<span>{{ currentSku.depositTotal }}</span>
                            </div>
                        </div>

                        <!-- 红包抵用提醒 -->
                        <div class="fz-24" v-if="getRedPacket && getRedPacket.count >= 1 && activeType === 1 && !currentSku.activityProduct">
                            可使用 <i class=" primary-color">满{{ getRedPacket.useLimitAmount }}减{{ getRedPacket.amount }}</i> 商品福利红包
                        </div>
                    </div>

                    <div :class="$style.footer" @click.capture="slotClickHandler">
                        <slot
                            name="footer"
                            :publicBenefitActiveStock="publicBenefitActiveStock"
                            :publicBenefitActivePrice="publicBenefitActivePrice"
                            :currentSku="currentSku"
                            :count="count"
                            :skuHasChecked="skuHasChecked"
                            :limiting="(activeType === 3 && activityProductModel && activityProductModel.activityLimit === 1) ? activityProductModel.activityLimitNumber : limiting"
                        />
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
/* eslint-disable */
// import { getCurrentLimit } from '../../../apis/product'
import LabelSku from './Label-Sku.vue'
import { setTimeoutSync } from '../../../assets/js/util'

export default {
    name: 'SpecificationPop',
    components: {
        LabelSku
    },
    props: {
        visible: Boolean,
        // 所有可用的sku
        skuList: {
            type: Array,
            default () {
                return []
            }
        },
        // 所有sku属性
        skuAttrList: {
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
        productImage: {
            type: String,
            default: '',
            required: true
        },

        // 默认数量
        defaultCount: {
            type: Number,
            default: 1
        },

        // 初始的规格，它可以作为一个默认值，用以回滚
        // 必须包含属性：count[number] skuCode1[string] skuCode2[string]
        sku: {
            type: Object,
            default () {
                return null
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
            // 格式化后的sku属性数据，继承自skuAttrList
            formatedSkuAttrList: null,
            // 当前选中的sku属性
            currentSkuAttrs: [],
            showBox: false,
            showSpec: false,
            // 选择的规格数量
            count: 1
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
        }
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
        /**
         * 是否完全选中了规格
         * 比如有A\B两种规格，但是只选中了A或者B，就返回false
         * @return Boolean
         */
        skuHasChecked () {
            return this.currentSkuAttrs.every(item => Boolean(item)) && Boolean(this.currentSkuAttrs.length)
        },
        // 当前选中的规格
        currentSku: {
            get () {
                if (!this.skuHasChecked) {
                    const priceList = this.skuList.map(item => item.price)
                    const originalPriceList = this.skuList.map(item => item.originalPrice)
                    const minPrice = Math.min(...priceList)
                    const maxPrice = Math.max(...priceList)
                    const minOriginalPrice = Math.min(...originalPriceList) || ''
                    const maxOriginalPrice = Math.max(...originalPriceList) || ''
                    return {
                        price: [...new Set([minPrice, maxPrice])].join('~'),
                        originalPrice: [...new Set([minOriginalPrice, maxOriginalPrice])].join('~'),
                        noSku: `请选择 ${ this.skuAttrList.map(item => item.productAttributeName).join(' ') }`,
                        stock: -1
                    }
                }
                const skuCode1 = this.currentSkuAttrs[0].id
                const skuCode2 = this.currentSkuAttrs[1] ? this.currentSkuAttrs[1].id : ''
                const sku = this.skuList.find(item => item.skuCode1 === skuCode1 && item.skuCode2 === skuCode2)
                return {
                    ...sku,
                    count: sku.minBuyNum,
                }
            }
        },
        skuImage () {
            if (!this.skuHasChecked) {
                return this.skuHasChecked ? '' : this.productImage
            }
            return this.currentSkuAttrs[0].productAttributeImage[0] || this.productImage
        },
        // 最小购买量
        min () {
            return this.currentSku.minBuyNum
        },
        // 剩余库存
        residue () {
            // 此商品是预购（this.activeType === 4）并且当前规格也是预购（this.localCurrentSku.activityProduc === true）
            // if (this.activeType === 4 && this.localCurrentSku.activityProduct) {
            //     return this.localCurrentSku.stock
            // }
            return this.currentSku.stock || 0
        },

        // 活动剩余库存
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
    mounted () {
        this.init()
    },
    methods: {
        init () {
            // 格式化sku属性
            for (const skuAttr of this.skuAttrList) {
                for (const skuAttr of skuAttr.productAttributeValues) {
                    // 设置默认选中
                    this.$set(skuAttr, 'checked', false)
                    this.$set(skuAttr, 'disabled', false)
                    this.$set(skuAttr, 'hidden', false)
                }
            }
            const attrs = [...this.skuAttrList]
            let lastAttr = attrs.splice(attrs.length - 1)[0]
            while (attrs.length > 0) {
                const preLastAttr = attrs.splice(attrs.length - 1)[0]
                preLastAttr.children = lastAttr
                lastAttr = preLastAttr
            }
            this.formatedSkuAttrList = lastAttr

            // 设置默认的sku
            if (this.sku) {
                const skuCode1 = this.sku.skuCode1
                const skuCode2 = this.sku.skuCode2
                const skuAttrs = [...this.skuAttrList.map(item => item.productAttributeValues)].flat()
                const skuAttr1 = skuAttrs.filter(item => item.id === skuCode1)[0]
                const skuAttr2 = skuAttrs.filter(item => item.id === skuCode2)[0] || null
                this.currentSkuAttrs = skuAttr2 ? [skuAttr1, skuAttr2] : [skuAttr1]
            }

            // 设置数量
            this.count = this.defaultCount

        },
        close () {
            this.$emit('update:visible', false)
        },
        async skuChange (sku) {
            this.currentSkuAttrs = sku
            await this.$nextTick()
            if (this.skuHasChecked) {
                this.$emit('change', this.currentSku)
                this.$emit('update:sku', this.currentSku)
            }
        },
        setShow (show) {
            if (show) {
                this.showSpec = true
                setTimeout(() => {
                    this.showBox = true
                }, 300)
                this.init()
            } else {
                this.showBox = false
                setTimeout(() => {
                    this.showSpec = false
                }, 300)
            }
        },
        countChange () {
            if (!this.skuHasChecked) {
                if (this.count > 1) {
                    this.$warning('请选择商品规格')
                }
                this.count = 1
                return
            }
            if (this.count > this.currentSku.stock) {
                this.count = this.currentSku.stock
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
        },
        minus () {
            if (!this.skuHasChecked) {
                this.count = 1
                this.$warning('请选择商品规格')
                return
            }
            this.count--
        },
        add () {
            if (!this.skuHasChecked) {
                this.count = 1
                this.$warning('请选择商品规格')
                return
            }
            this.count++
        },
        /**
         * 拦截购买，加入购物车等按钮
         * 如果没有选择规格，则阻止事件的传递
         * @param e {Event}
         * @return {Promise<void>}
         */
        async slotClickHandler (e) {
            if (!this.skuHasChecked) {
                e.stopPropagation()
                this.$warning('请选择商品规格')
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

  .color-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 5px;
    overflow: auto;
    box-sizing: border-box;

    > label {
        > input {
            display: none;
            &:checked + span {
                color: $--primary-color;
                border: 1px solid currentColor;
                border-radius: 9px;
                background: none;
            }
            &:disabled + span {
                color: #ccc !important;
            }
        }
        > span {
            display: inline-block;
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
