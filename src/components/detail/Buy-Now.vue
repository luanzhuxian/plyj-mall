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
    <button
      :class="$style.addToCart"
      @click="clickHandler(1)"
      :disabled="loading"
    >
      加入购物车
    </button>
    <button
      :class="$style.buyNowBtn"
      @click="clickHandler(2)"
      :disabled="loading"
    >
      立即购买
    </button>
    <specification-pop
      :data="priceModels"
      :default-code="defaultCode"
      :product-image="image"
      :visible.sync="showSpecifica"
    >
      <template v-slot:footer="{ selected }">
        <pl-button
          type="warning"
          size="large"
          :loading="loading"
          @click="confirm(selected)"
        >
          确定
        </pl-button>
      </template>
    </specification-pop>
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
    // 是否在外部选择了规格
    hasSelectedFromOut: {
      type: Boolean
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
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['supportPhone', 'mallDomain', 'mobile', 'agentUser', 'userId']),
    defaultCode () {
      return this.currentModel.optionCode || ''
    }
  },
  watch: {
    currentModel: {
      handler () {
      },
      deep: true
    }
  },
  deactivated () {
    this.reset()
  },
  methods: {
    handleClick () {
      this.$emit('click', this)
    },
    // 选中规格
    async confirm (model) {
      this.$emit('update:currentModel', model)
      // this.$emit('update:hasSelectedFromOut', false)
      try {
        await this.$nextTick()
        if (this.clickAddToCart) {
          await this.addToCart()
        }
        if (this.clickBuyNow) {
          this.submit()
        }
      } catch (e) {
        throw e
      }
    },
    // 跳转至提交订单页面
    async submit () {
      const currentModel = this.currentModel
      const { productSeq, count, optionCode } = currentModel
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId') || ''
      localStorage.setItem('CONFIRM_LIST', JSON.stringify([{
        productId: productSeq,
        optionCode: optionCode,
        count: count,
        agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
      }]))
      this.showSpecifica = false
      this.$router.push({
        name: 'SubmitOrder',
        query: {
          isCart: false
        }
      })
    },
    async clickHandler (type) {
      if (!this.hasBind()) return
      // 加入购物车按钮
      if (type === 1) {
        this.clickAddToCart = true
        this.clickBuyNow = false
      }
      // 立即购买按钮
      if (type === 2) {
        this.clickBuyNow = true
        this.clickAddToCart = false
      }
      this.showSpecifica = true
    },
    addToCart () {
      this.loading = true
      const { productSeq, count, optionCode } = this.currentModel
      // helper分享时携带的id
      const shareBrokerId = sessionStorage.getItem('shareBrokerId') || ''
      return new Promise(async (resolve, reject) => {
        try {
          await addToCart({
            productId: productSeq,
            productCount: count,
            skuCode: optionCode,
            agentUser: this.agentUser ? this.userId : shareBrokerId // 如果当前用户是经纪人，则覆盖其他经纪人的id
          })
          this.$success('加入成功')
          this.showSpecifica = false
        } catch (e) {
          reject(e)
        } finally {
          this.loading = false
        }
      })
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
