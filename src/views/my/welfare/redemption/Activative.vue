<template>
    <div :class="$style.activative">
        <div :class="$style.mainImg">
            <pl-svg name="icon-coupon" fill="#FFF" width="120" height="120" />
        </div>
        <div :class="$style.content">
            <div :class="$style.code">
                <template v-if="info.exchangeCode">
                    {{ info.exchangeCode | separator(' ', 4) }}
                </template>
            </div>
            <div :class="$style.timeDesc">
                <template v-if="info.startTime && info.endTime">
                    {{ info.startTime | dateFormat('YYYY.MM.DD') }}-{{ info.endTime | dateFormat('YYYY.MM.DD') }}
                </template>
            </div>
        </div>
        <div :class="$style.bottom">
            <button
                @click="receiveRedemption"
                :class="{
                    [$style.primary]: true,
                    [$style.disabled]: !info.exchangeCode
                }"
            >激活并使用</button>
            <button :class="$style.plain" @click="$router.push({ name: 'Home' })">去商城看看</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    getRedemptiontInfo,
    receiveRedemption
} from '../../../../apis/my-redemption'
import ReceiveResult from './components/Receive-Result'
export default {
    name: 'RedemptionActivative',
    props: {
        code: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            info: {}
        }
    },
    computed: {
        ...mapGetters(['userId'])
    },
    async activated () {
        try {
            this.getInfo()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getInfo () {
            try {
                const { result } = await getRedemptiontInfo(this.code)
                if (!result) {
                    this.$warning('当前兑换码不存在，请确认后重试')
                    this.backMyRedemptionPage()
                    return
                }
                this.info = result
            } catch (e) {
                throw e
            }
        },
        async backMyRedemptionPage () {
            await setTimeout(() => {
                // 当前兑换码不可用，去 我的兑换码 列表查看其它，或者用code激活
                this.$router.replace({ name: 'MyRedemption', params: { status: 'ALL' } })
            }, 3000)
        },
        async makeSureRole () {
            if (this.userId) return true
            await this.$alert({
                message: '为了您的账号安全，请绑定手机号',
                confirmText: '去绑定手机号码'
            })
            sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                name: this.$route.name,
                params: { codeId: this.codeId }
            }))
            this.$router.push({ name: 'BindMobile' })
        },
        async receiveRedemption () {
            if (!this.info.exchangeCode) return
            const isVisiter = await this.makeSureRole()
            if (!isVisiter) return
            const h = this.$createElement
            try {
                const { result: { code, id } } = await receiveRedemption(this.code)
                await this.$alert({
                    slot: h(ReceiveResult, { props: { code } }),
                    confirmText: '朕知道了'
                })
                if (code === 200) {
                    // 核销成功去查看当前兑换码中心
                    this.$router.replace({ name: 'RedemptionCenter', params: { codeId: id } })
                } else {
                    this.backMyRedemptionPage()
                }
            } catch (e) {
                this.$alert({
                    slot: h(ReceiveResult, { props: { code: 500 } }),
                    confirmText: '朕知道了'
                })
            }
        }
    }
}
</script>

<style  module lang="scss">
  .activative{}
  .mainImg{
    width: 180px;
    height: 180px;
    margin: 100px auto 46px;
    border-radius: 50%;
    text-align: center;
    background-color: #1890FF;
    > svg {
      padding-top: 25px;
    }
  }
  .content{
    text-align: center;
    > div {
      position: relative;
      width: 510px;
      min-height: 90px;
      margin: 0 auto;
      border:2px solid #CCC;
      line-height: 90px;
      font-size:32px;
      font-weight:bold;
      color:#666;
      &:before {
        position: absolute;
        top: -18px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 20px;
        line-height:36px;
        font-size:28px;
        background-color: #f4f5f9;
        color:#C4C4C4;
      }
      &.code:before {
        content: '兑换码';
      }
      &.timeDesc {
        margin-top: 48px;
        &:before{
          content: '使用时间';
        }
      }
    }
  }
  .bottom{
    margin-top: 140px;
    text-align: center;
    > button{
      padding: 0 240px;
      line-height:100px;
      font-size:36px;
      font-weight:bold;
      color:#FFF;
      &.primary {
        height:100px;
        border-radius:20px;
        background-color:#1890FF;
        &.disabled {
          opacity: 0.6;
        }
      }
      &.plain{
        color:#43A0F5;
      }
    }
  }
</style>
