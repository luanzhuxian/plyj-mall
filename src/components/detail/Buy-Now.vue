<template>
    <div :class="$style.buyNow">
        <div :class="$style.phone">
            <router-link :class="$style.link" :to="{ name: 'Home' }">
                <pl-svg name="icon-home" width="38" height="70" />
            </router-link>
            <a v-if="servicePhoneModels.length === 1" :class="$style.link" :href="'tel:' + servicePhoneModels[0].contactWay">
                <pl-svg name="icon-call-us" width="80" height="72" />
            </a>
            <a v-else :class="$style.link + ' ' + $style.callUs" @click="showContact = true">
                <pl-svg name="icon-call-us" width="80" height="72" />
            </a>
            <router-link :class="$style.link + ' ' + $style.toCart" :to="{ name: 'ShoppingCart' }">
                <i v-if="cartCount > 99" :class="$style.cartCount">99+</i>
                <i v-else-if="cartCount > 0" :class="$style.cartCount" v-text="cartCount" />
                <pl-svg name="icon-cart2" width="80" height="72" />
            </router-link>
        </div>
        <!-- 团购商品下单 -->
        <div :class="$style.buttons" v-if="activeProduct === 2 && preActivity === 2">
            <!-- 活动商品库存不足时，显示该按钮 -->
            <button
                v-if="activeStock <= 0"
                :class="$style.addToCart"
                :disabled="loading || allDisabled || disableConfirm"
                @click="clickHandler(2)"
            >
                单独购买
                <div :class="$style.btnText">¥ {{ currentSku.price }}</div>
            </button>
            <button
                :class="$style.buyNowBtn"
                @click="clickHandler(3)"
                :disabled="loading || disableConfirm || activeStock <= 0"
            >
                <span>{{ activeStock > 0 ? '我要参团' : '已售罄' }}</span>
                <div v-if="activeStock > 0" :class="$style.text">¥ {{ activityProductModel.price }}</div>
            </button>
        </div>
        <!-- 秒杀商品下单 -->
        <div :class="$style.buttons" v-else-if="activeProduct === 3 && preActivity === 2">
            <!-- 活动商品库存不足时，显示该按钮 -->
            <button
                v-if="activeStock <= 0"
                :class="$style.addToCart"
                :disabled="loading || allDisabled || disableConfirm"
                @click="clickHandler(2)"
            >
                原价购买
                <div :class="$style.btnText">¥ {{ currentSku.price }}</div>
            </button>
            <button
                :class="$style.buyNowBtn"
                @click="clickHandler(3)"
                :disabled="loading || disableConfirm || activeStock <= 0"
            >
                <span>{{ activeStock > 0 ? '立即秒杀' : '已售罄' }}</span>
                <span v-if="activeStock > 0" :class="$style.text">¥ {{ activityProductModel.price }}</span>
            </button>
        </div>
        <!-- 预购商品下单 -->
        <div :class="$style.buttons" v-else-if="activeProduct === 4 && preActivity === 2">
            <button
                :class="$style.buyNowBtn"
                @click="clickHandler(3)"
                :disabled="loading || disableConfirm"
            >
                定金购买
                <div :class="$style.btnText">¥ {{ activityProductModel.price }}</div>
            </button>
        </div>
        <!-- 正常商品下单 -->
        <div :class="$style.buttons" v-else>
            <button
                :class="$style.addToCart"
                @click="clickHandler(1)"
                :disabled="loading || allDisabled"
                :style="{'line-height': 80 / 7.5 + 'vw'}"
            >
                <span>加入购物车</span>
            </button>
            <button
                :class="$style.buyNowBtn"
                @click="clickHandler(2)"
                :disabled="loading || allDisabled || disableConfirm"
                :style="{'line-height': 80 / 7.5 + 'vw'}"
            >
                <span>{{ confirmText }}</span>
            </button>
        </div>
        <specification-pop
            :product-image="image"
            :visible.sync="showSpecifica"
            :sku-list="skuList"
            :sku-attr-list="skuAttrList"
            :sku="currentSku"
            :limiting="limiting"
            :active-product="activeProduct"
            :pre-activity="preActivity"
            :activity-product-model="activityProductModel"
        >
            <template v-slot:footer="{ currentSku, limiting, limit }">
                <pl-button
                    type="warning"
                    size="large"
                    :loading="loading"
                    @click="confirm(currentSku, limiting, limit)"
                >
                    确定
                </pl-button>
            </template>
        </specification-pop>

        <Contact :show.sync="showContact" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_CART_COUNT } from '../../store/mutation-type'
import { addToCart } from '../../apis/shopping-cart'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import Contact from '../common/Contact.vue'
export default {
    name: 'BuyNow',
    components: {
        SpecificationPop,
        Contact
    },
    data () {
        return {
            // 显示规格弹框
            showSpecifica: false,
            clickAddToCart: false,
            clickBuyNow: false,
            loading: false,
            showContact: false,

            /**
       * 购买方式
       * 2 按正常商品购买
       * 3 按活动商品购买
       */
            buyWay: 2
        }
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        skuList: {
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

        // 商品图片
        image: {
            type: String,
            default: ''
        },
        confirmText: {
            type: String,
            default: '立即购买'
        },

        // 购买的规格
        currentSku: {
            type: Object,
            default () {
                return {}
            }
        },
        productId: {
            type: String,
            default: ''
        },
        productStatus: {
            type: Number,
            default: 2
        },

        // 限购数量
        limiting: {
            type: Number,
            default: 0
        },
        disableConfirm: Boolean,
        x: Boolean,
        activeProduct: {
            type: [Number, String],
            default: 1
        },
        preActivity: {
            type: [Number, String],
            default: 0
        },
        activityProductModel: {
            type: Object,
            default: null
        }
    },
    computed: {
        ...mapGetters(['servicePhoneModels', 'mallDomain', 'mobile', 'agentUser', 'userId', 'cartCount']),

        // 所有规格禁用状态
        allDisabled () {
            return this.skuList.every(item => item.stock < item.minBuyNum) || this.productStatus !== 2
        },
        activeStock () {
            return this.activityProductModel ? this.activityProductModel.buyCount : 0
        }
    },
    async activated () {
        try {
            await this.getCartCount()
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        this.reset()
    },
    mounted () {
        this.getCartCount()
    },
    methods: {
        ...mapActions({
            getCartCount: GET_CART_COUNT
        }),
        handleClick () {
            this.$emit('click', this)
        },

        /**
     * 购买
     * @param options {object} 选择的规格
     * @param limiting {number} 总限购数量
     * @param limit {number} 可买数量
     */
        async confirm (options, limiting, limit) {
            try {
                await this.$nextTick()
                if (this.clickAddToCart) {
                    await this.addToCart(options)
                }
                if (this.clickBuyNow) {
                    if (!this.checkLimit(options, limiting, limit)) {
                        return
                    }
                    this.submit(options)
                }
            } catch (e) {
                throw e
            }
        },

        // 检查限购
        checkLimit (sku, limiting, limit) {
            if (limiting && sku.count > limit) {
                if (limiting === limit) {
                    this.$warning(`您至多购买${ limit }件`)
                    return false
                }
                if (limiting - limit === limiting) {
                    this.$warning(`您已购买${ limiting }件，已达购买上限`)
                    return false
                }
                this.$warning(`您已购买${ limiting - limit }件，您还可以购买${ limit }件`)
                return false
            }
            return true
        },

        // 跳转至提交订单页面
        async submit (options) {
            const { count, skuCode1, skuCode2 = '', price } = options

            // helper分享时携带的id
            const shareBrokerId = sessionStorage.getItem('shareBrokerId') || ''
            sessionStorage.setItem('CONFIRM_LIST', JSON.stringify([{
                productId: this.productId,
                count,
                skuCode1,
                skuCode2,
                price,
                // 如果当前用户是经纪人，则覆盖其他经纪人的id
                agentUser: shareBrokerId || this.userId || null
            }]))
            this.showSpecifica = false
            this.$router.push({
                name: 'SubmitOrder',
                query: {
                    isCart: 'NO',
                    activeProduct: this.buyWay === 2 ? 1 : this.activeProduct,
                    preActivity: this.buyWay === 3 ? this.preActivity : '',
                    activityId: this.buyWay === 3 ? this.activityProductModel.activityId : ''
                }
            })
        },
        async clickHandler (type) {
            if (!this.hasBind()) return

            // type 等于1、2 时表示正常购买
            // 加入购物车按钮
            if (type === 1) {
                this.clickAddToCart = true
                this.clickBuyNow = false
            }

            // 正常购买
            if (type === 2) {
                this.clickBuyNow = true
                this.clickAddToCart = false
                this.buyWay = 2
            }

            // 立即购买按钮or定金购买
            if (type === 3) {
                this.clickBuyNow = true
                this.clickAddToCart = false
                this.buyWay = 3
            }
            this.showSpecifica = true
        },
        addToCart (options) {
            this.loading = true
            const { count, skuCode1, skuCode2 = '' } = options

            // helper分享时携带的id
            const shareBrokerId = sessionStorage.getItem('shareBrokerId') || ''
            return new Promise(async (resolve, reject) => {
                try {
                    await addToCart({
                        productId: this.productId,
                        productCount: count,
                        skuCode: skuCode1,
                        skuCode2,
                        // 如果当前用户是经纪人，则覆盖其他经纪人的id
                        agentUser: shareBrokerId || this.userId || null
                    })
                    this.$success('已添加到购物车')
                    this.$emit('update:currentSku', options)
                    this.getCartCount()
                    this.showSpecifica = false
                } catch (e) {
                    reject(e)
                } finally {
                    this.loading = false
                }
            })
        },
        specChanged (sku) {
            this.$emit('change', sku)
            this.$emit('update:currentSku', sku)
        },
        reset () {
            this.showSpecifica = false
            this.clickAddToCart = false
            this.clickBuyNow = false
        },
        hasBind () {
            if (!this.mobile) {
                this.$confirm('您还没有绑定手机，请先绑定手机')
                    .then(() => {
                        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                            name: this.$route.name,
                            params: this.$route.params,
                            query: this.$route.query
                        }))
                        this.$router.push({ name: 'BindMobile' })
                    })
                    .catch(() => {})
                return false
            }
            return true
        }
    }
}
</script>

<style module lang="scss">
  .buy-now {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 110px;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
    z-index: 11;
    .phone {
      display: flex;
      justify-content: space-around;
      width: 258px;
      text-align: center;
      > .link {
        position: relative;
        flex: 1;
        .cartCount {
          position: absolute;
          right: -6px;
          top: -8px;
          height: 36px;
          min-width: 36px;
          padding: 0 5px;
          line-height: 32px;
          color: #fff;
          background-color: #FE7700;
          border-radius: 18px;
          font-size: 24px;
          border: 2px solid #fff;
          box-sizing: border-box;
        }
      }
    }
  }
  .buttons {
    flex: 1;
    display: flex;
    margin: 0 16px;
    border-radius: 10px;
    overflow: hidden;
    > button {
      flex: 1;
    }
  }
  .addToCart, .buyNowBtn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 220px;
    height: 80px;
    color: #fff;
    font-size: 30px;
    &:disabled {
      color: rgba(255, 255, 255, .4);
      .btn-text {
        background-color: #e7e7e7;
        color: #ccc;
      }
    }
    > span {
      display: inline-block;
    }
  }
  /*.preBtn{
    width: 440px;
    height: 80px;
    margin-right: 16px;
    color: #fff;
    font-size: 30px;
    background: #FE7700;
    border-radius: 10px;
    &:disabled {
      color: rgba(255, 255, 255, .4);
    }
  }*/
  .addToCart {
    background-color: $--warning-color;
  }
  .buyNowBtn {
    background-color: $--primary-color;
    &:disabled {
      color: rgba(255, 255, 255, .4);
      .btn-text {
        background-color: #e7e7e7;
        color: #ccc;
      }
    }
  }
  .btn-text{
    margin: 4px auto 0;
    width: 100px;
    text-align: center;
    line-height: 28px;
    background: #ffffff;
    border-radius: 304px;
    font-size: 20px;
    color: #FE7700;
  }
</style>
