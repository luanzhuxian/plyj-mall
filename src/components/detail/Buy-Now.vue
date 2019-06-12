<template>
  <div :class="$style.buyNow">
    <div :class="$style.phone">
      <a
        :class="$style.link"
        :href="'tel:' + supportPhone"
      ><pl-svg name="phone" /></a>
      <router-link
        :class="$style.link"
        :to="{ name: 'Home' }"
      >
        <pl-svg name="home" />
      </router-link>
    </div>
    <!--<pl-button-->
    <!--:type="type"-->
    <!--size="large"-->
    <!--@click="handleClick"-->
    <!--&gt;-->
    <!--{{ text }}-->
    <!--</pl-button>-->
    <!--<div-->
    <!--:class="$style.buttons"-->
    <!--&gt;-->
    <button
      :class="$style.addToCart"
      @click="addToCart"
      :disabled="loading"
    >
      加入购物车
    </button>
    <button
      :class="$style.buyNowBtn"
      @click="submit"
      :disabled="loading"
    >
      立即购买
    </button>
    <!--</div>-->

    <specification-pop
      :data="priceModels"
      :product-image="image"
      :visible.sync="showSpecifica"
      @confirm="specChanged"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addToCart } from '../../apis/shopping-cart'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'

export default {
  name: 'BuyNow',
  components: {
    SpecificationPop
  },
  data () {
    return {
      showSpecifica: false, // 显示规格弹框
      clickAddToCart: false,
      clickBuyNow: false,
      loading: false
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    // 规格列表
    priceModels: {
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
    // 购买的规格
    currentModel: {
      type: Object,
      default: function () {
        return null
      }
    },
    // 是否为供应商商品
    isSupplierProduct: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['supportPhone', 'mallDomain', 'mobile', 'agentUser', 'userId'])
  },
  activated () {
    this.reset()
  },
  methods: {
    handleClick () {
      this.$emit('click', this)
    },
    // 选中规格
    specChanged (model) {
      this.$emit('update:currentModel', model)
      this.$nextTick(() => {
        if (this.clickAddToCart) {
          this.addToCart()
        }
        if (this.clickBuyNow) {
          this.submit()
        }
      })
    },
    // 跳转至提交订单页面
    async submit () {
      if (!this.hasBind()) return
      this.clickBuyNow = true
      this.clickAddToCart = false
      const {
        /* isSupplierProduct, */
        currentModel
      } = this
      if (!currentModel || !currentModel.count) {
        this.showSpecifica = true
        return
      }
      const { productSeq, count, optionCode } = currentModel
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId') || ''
      localStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: productSeq,
        optionCode: optionCode,
        count: count,
        agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
      }]))
      this.$router.push({ name: 'SubmitOrder' })
    },
    // 加入购物车
    async addToCart () {
      if (!this.hasBind()) return
      this.clickAddToCart = true
      this.clickBuyNow = false
      const { currentModel } = this
      if (!currentModel || !currentModel.count) {
        this.showSpecifica = true
        return
      }
      this.loading = true
      const { productSeq, count, optionCode } = currentModel
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId') || ''
      try {
        await addToCart({
          productId: productSeq,
          productCount: count,
          skuCode: optionCode,
          agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
        })
        this.$success('加入成功')
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
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
            localStorage.setItem('BIND_MOBILE_FROM', JSON.stringify(this.$route))
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
    width: 100%;
    height: 110px;
    background-color: #fff;
    z-index: 11;
    .phone {
      display: flex;
      justify-content: space-around;
      width: 258px;
      text-align: center;
      > .link {
        position: relative;
        flex: 1;
        &:nth-of-type(1):after {
          position: absolute;
          content: '';
          top: 50%;
          right: 0;
          width: 1px;
          height: 50%;
          transform: translateY(-50%);
          background-color: #e7e7e7;
        }
      }
      svg {
        width: 40px;
        color: $--font-color_gray2;
        fill: $--font-color_gray2 !important;
      }
    }
  }
  .buttons {
    display: inline-flex;
    justify-content: flex-start;
    width: 468px;
    height: 80px;
    font-size: 30px;
    color: #fff;
    border-radius: $--radius2;
    overflow: hidden;
  }
  .addToCart, .buyNowBtn {
    width: 234px;
    height: 80px;
    color: #fff;
    font-size: 30px;
  }
  .addToCart {
    border-radius: 10px 0 0 10px;
    background-color: $--warning-color;
  }
  .buyNowBtn {
    border-radius: 0 10px 10px 0;
    background-color: $--primary-color;
  }
</style>
