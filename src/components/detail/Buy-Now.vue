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
    <pl-button
      :type="type"
      size="large"
      @click="handleClick"
    >
      {{ text }}
    </pl-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPenglaiAppid } from '../../apis/base-api'

export default {
  name: 'BuyNow',
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    detail: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['supportPhone', 'mallDomain'])
  },
  methods: {
    handleClick () {
      this.$emit('click', this)
    },
    // 跳转至提交订单页面
    async jumpSubmit (option, isSupplierProduct, brokerId) {
      let { productSeq, count, optionCode } = option
      if (isSupplierProduct) {
        // 如果是供应商商品，这样跳转至提交订单页面
        let { result } = await getPenglaiAppid()
        let { protocol, host } = location
        let href = `${protocol}//${host}/${this.mallDomain}/my/order/submit/${productSeq}/${optionCode}/${count}${brokerId ? ('/' + brokerId) : ''}`
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${result}&redirect_uri=${href}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        return location.replace(url)
      }
      if (brokerId) {
        this.$router.push({ name: 'Cart', params: { productSeq, count, optionCode, brokerId } })
      } else {
        this.$router.push({ name: 'Cart', params: { productSeq, count, optionCode } })
      }
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
    button {
      flex: 1;
      margin-right: 40px;
    }
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
        color: #666;
        fill: #666 !important;
      }
    }
  }
</style>
