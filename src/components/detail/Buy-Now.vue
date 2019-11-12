<template>
  <div :class="$style.buyNow">
    <div :class="$style.phone">
      <router-link :class="$style.link" :to="{ name: 'Home' }">
        <pl-svg name="home" />
      </router-link>
      <a v-if="servicePhoneModels.length === 1" :class="$style.link + ' ' + $style.callUs" :href="'tel:' + servicePhoneModels[0].contactWay">
        <pl-svg name="call-us" />
      </a>
      <a v-else :class="$style.link + ' ' + $style.callUs" @click="showContact = true">
        <pl-svg name="call-us" />
      </a>
      <router-link :class="$style.link + ' ' + $style.toCart" :to="{ name: 'ShoppingCart' }">
        <i v-if="cartCount > 99" :class="$style.cartCount">99+</i>
        <i v-else-if="cartCount > 0" :class="$style.cartCount" v-text="cartCount" />
        <pl-svg name="cart2" />
      </router-link>
    </div>
    <!-- 团购商品下单 -->
    <div :class="$style.buttons" v-if="activeProduct === 2 && preActivity === 2">
      <button
        :class="$style.addToCart"
        @click="clickHandler(2)"
        :disabled="loading || allDisabled || disableConfrim"
      >
        <span>单独购买</span>
        <div :class="$style.btnText">¥ {{ currentSku.price }}</div>
      </button>
      <button
        :class="$style.buyNowBtn"
        @click="clickHandler(3)"
        :disabled="loading"
      >
        <span>我要参团</span>
        <div :class="$style.text">¥ {{ activityProductModel.price }}</div>
      </button>
    </div>
    <!-- 秒杀商品下单 -->
    <div :class="$style.buttons" v-else-if="activeProduct === 3 && preActivity === 2">
      <button
        :class="$style.addToCart"
        @click="clickHandler(2)"
        :disabled="loading || allDisabled || disableConfrim"
      >
        <span>原价购买</span>
        <span :class="$style.btnText">¥ {{ currentSku.price }}</span>
      </button>
      <button
        :class="$style.buyNowBtn"
        @click="clickHandler(3)"
        :disabled="loading"
      >
        <span>立即秒杀</span>
        <span :class="$style.text">¥ {{ activityProductModel.price }}</span>
      </button>
    </div>
    <!-- 预购商品下单 -->
    <div :class="$style.button" v-else-if="activeProduct === 4 && preActivity === 2">
      <button
        :class="$style.preBtn"
        @click="clickHandler(3)"
        :disabled="loading"
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
        :disabled="loading || allDisabled || disableConfrim"
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
      :active-type="activeType"
    >
      <template v-slot:footer="{ currentSku }">
        <pl-button
          type="warning"
          size="large"
          :loading="loading"
          @click="confirm(currentSku)"
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
      showSpecifica: false, // 显示规格弹框
      clickAddToCart: false,
      clickBuyNow: false,
      loading: false,
      showContact: false,
      activeType: 1
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
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
      default: function () {
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
    disableConfrim: Boolean,
    disableAddCart: Boolean,
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
  computed: {
    ...mapGetters(['servicePhoneModels', 'mallDomain', 'mobile', 'agentUser', 'userId', 'cartCount']),
    // 所有规格禁用状态
    allDisabled () {
      return this.skuList.every(item => item.stock < item.minBuyNum) || this.productStatus !== 2
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
    // 选中规格
    async confirm (options) {
      try {
        await this.$nextTick()
        if (this.clickAddToCart) {
          await this.addToCart(options)
        }
        if (this.clickBuyNow) {
          this.submit(options)
        }
      } catch (e) {
        throw e
      }
    },
    // 跳转至提交订单页面
    async submit (options) {
      const { count, skuCode1, skuCode2 = '', price } = options
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId') || ''
      sessionStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: this.productId,
        count: count,
        skuCode1: skuCode1,
        skuCode2,
        price,
        agentUser: shareBrokerId || this.userId || null // 如果当前用户是经纪人，则覆盖其他经纪人的id
      }]))
      this.showSpecifica = false
      // 判断是否跳转过去显示活动总库存，为 1 显示
      let activeAllResidue = (this.preActivity === 2 && this.activeProduct !== 1 && this.activeType !== 1) ? 1 : 0
      this.$router.push({
        name: 'SubmitOrder',
        query: {
          isCart: 'NO',
          activeProduct: this.activeType,
          activityId: this.activeType === 1 ? '' : this.activityProductModel.activityId,
          activeAllResidue
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
      // 立即购买按钮
      if (type === 2) {
        this.clickBuyNow = true
        this.clickAddToCart = false
        this.activeType = 1
      }
      // 立即购买按钮
      if (type === 3) {
        this.clickBuyNow = true
        this.clickAddToCart = false
        this.activeType = this.activeProduct
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
            agentUser: shareBrokerId || this.userId || null // 如果当前用户是经纪人，则覆盖其他经纪人的id
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
        &.callUs > svg {
          width: 77px !important;
        }
        /*&:nth-of-type(1):after {
          position: absolute;
          content: '';
          top: 50%;
          right: 0;
          width: 1px;
          height: 50%;
          transform: translateY(-50%);
          background-color: #e7e7e7;
        }*/
        &.toCart {
          position: relative;
          svg {
            width: 78px;
          }
        }
        svg {
          width: 40px;
          color: $--font-color_gray2;
          fill: $--font-color_gray2 !important;
        }
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
    display: inline-flex;
    padding-right: 16px;
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
    }
    > span {
      display: inline-block;
    }
  }
  .preBtn{
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
  }
  .addToCart {
    border-radius: 10px 0 0 10px;
    background-color: $--warning-color;
  }
  .buyNowBtn {
    border-radius: 0 10px 10px 0;
    background-color: $--primary-color;
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
