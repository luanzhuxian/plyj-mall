<template>
  <div :class="$style.code">
    <p :class="$style.title">兑换码</p>
    <p :class="$style.codeValue" v-text="data.exchangeCode" />
    <p :class="$style.gift">恭喜您,获得精美礼品一份.请您前往指定朋来站点凭兑换码领取小礼品哦~</p>
    <p :class="$style.address">领取地址：{{ data.addressValue }}</p>
    <p :class="$style.tip">礼品数量有限，先到先得哦~</p>
    <router-link
      tag="div"
      :class="$style.goBuy"
      :to="{ name: 'Home' }"
    >
      去逛雅集
    </router-link>
    <div
      :class="$style.confirm"
      @click="confirm"
    >
      确认领取礼品
    </div>
  </div>
</template>

<script>
import { getConfirmInfo, confirmGet } from '../../apis/wwec'
export default {
  name: 'Code',
  data () {
    return {
      data: {}
    }
  },
  async activated () {
    try {
      let { result } = await getConfirmInfo()
      this.data = result
    } catch (e) {
      throw e
    }
  },
  methods: {
    async confirm () {
      try {
        await this.$confirm('您是否确认 已领取精美礼品?')
        await confirmGet({
          id: this.data.id,
          status: 2
        })
        this.$router.replace({ name: 'GetSuccess' })
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .code {
    position: relative;
    width: 100vw;
    height: 100vh;
    padding: 78px 72px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .title {
    font-size: 48px;
    line-height: 66px;
    color: #000;
    margin-bottom: 30px;
    font-weight: bold;
  }
  .code-value {
    margin-bottom: 20px;
    font-size: 40px;
    line-height: 56px;
    color: #598bf8;
    &:before {
      display: inline-block;
      content: '';
      width: 16px;
      height: 16px;
      margin-right: 8px;
      border-radius: 8px;
      background-color: #598bf8;
      vertical-align: 5px;
    }
  }
  .gift {
    margin-bottom: 32px;
    color: #666;
    font-size: 24px;
    line-height: 35px;
  }
  .address {
    margin-bottom: 2px;
    color: #598bf8;
    font-size: 28px;
    line-height: 40px;
  }
  .tip {
    font-size: 24px;
    color: #999;
  }
  .goBuy {
    width: 180px;
    margin: 82px auto 0;
    padding: 18px 0;
    font-size: 28px;
    text-align: center;
    border: 1px solid #707070;
    border-radius: 20px;
  }
  .confirm {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: 116px;
    color: #fff;
    text-align: center;
    font-size: 32px;
    background-color: #598bf8;
  }

</style>
