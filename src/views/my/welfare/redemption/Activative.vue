<template>
    <div :class="$style.activative">
        <div :class="$style.mainImg">
            <pl-svg name="icon-coupon" fill="#FFF" width="120" height="120" />
        </div>
        <div :class="$style.content">
            <div :class="$style.code">
                {{ codeId | separator(' ', 4) }}
            </div>
            <div :class="$style.timeDesc">
                {{ info.startTime | dateFormat('YYYY.MM.DD') }}-{{ info.endTime | dateFormat('YYYY.MM.DD') }}
            </div>
        </div>
        <div :class="$style.bottom">
            <button @click="receiveRedemption" :class="$style.primary">激活并使用</button>
            <button :class="$style.plain">去商城看看</button>
        </div>
    </div>
</template>

<script>
import {
    getRedemptiontInfo
    // receiveRedemption
} from '../../../../apis/my-redemption'
import ReceiveResult from './components/Receive-Result'
export default {
    name: 'RedemptionActivative',
    props: {
        codeId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            info: {
                startTime: '2020.12.18 12:30:00',
                endTime: '2020.12.20 12:30:00'
            }
        }
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
                const { result } = await getRedemptiontInfo()
                console.log(result)
                console.log(this.info)
            } catch (e) {
                throw e
            }
        },
        async receiveRedemption () {
            const h = this.$createElement
            try {
                const { codeId } = this
                // const { result: { status } } = await receiveRedemption(codeId)
                const status = -1
                await this.$alert({
                    slot: h(ReceiveResult, { props: { status } }),
                    confirmText: '朕知道了'
                })
                // 核销成功去查看当前核销码页面
                if (status === 0) {
                    this.$router.replace({ name: 'RedemptionCenter', params: { codeId } })
                } else {
                    // 当前兑换码不可用，去 我的兑换码 列表
                    this.$router.replace({ name: 'MyRedemption', params: { status: 'ALL' } })
                }
            } catch (e) {
                this.$alert({
                    slot: h(ReceiveResult, { props: { status: -1 } }),
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
      }
      &.plain{
        color:#43A0F5;
      }
    }
  }
</style>
