<template>
    <div :class="$style.receiveCode">
        <div :class="$style.title">添加激活码</div>
        <div :class="$style.searchBox">
            <input
                ref="input"
                v-model.trim="codeId"
                type="Number"
                placeholder="请输入11位激活码"
            >
            <img
                src="https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/scan.png"
                alt=""
                @click="scan"
            >
        </div>
    </div>
</template>

<script>
import { receiveRedemption } from '../../../../../apis/my-redemption'
const codeDesc = {
    201: '该兑换码为无效码',
    202: '该兑换码为失效码',
    203: '该兑换码未到使用时间，不可激活',
    204: '该兑换码已过期!',
    205: '您已激活兑换码，不可重复激活',
    206: '该兑换码已使用，如有问题请联系商家',
    500: '激活失败'
}
export default {
    name: 'ReceiveCode',
    data () {
        return {
            codeId: ''
        }
    },
    created () {
        this.$parent.$on('confirm', this.receiveRedemption)
    },
    methods: {
        scan () {
            if (window.wx) {
                window.wx.scanQRCode({
                    needResult: 1,
                    scanType: ['qrCode', 'barCode'],
                    success: res => {
                        // 当needResult 为 1 时，扫码返回的结果
                        const result = res.resultStr
                        this.codeId = this.getCodeId(result)
                    }
                })
            } else {
                console.error('微信配置错误')
            }
        },
        getCodeId (result) {
            const arr = result.split('?')[0].split('/')
            const code = arr[arr.length - 1] || ''
            return code
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
            if (!this.makeSureRole) return
            try {
                if (!this.codeId) {
                    await this.$warning('未输入核销码')
                    return
                }
                const { result: { code } } = await receiveRedemption(this.codeId)
                if (code === 200) {
                    this.$success('兑换成功')
                } else {
                    const errorText = codeDesc[code]
                    await this.$warning(errorText)
                }
            } catch (e) {
                await this.$warning(codeDesc[500])
            }
        }
    }
}
</script>

<style module lang="scss">
  .receiveCode {
    text-align: left;
    margin-left: 56px;
  }

  .title {
    font-size: 34px;
    font-weight: bold;
    line-height: 56px;
    color: #000;
  }

  .searchBox {
    margin: 34px 0 24px;
    > input {
      width:320px;
      padding-left: 22px;
      border:2px solid #999;
      line-height:56px;
      font-size:26px;
      color:#999;
    }
    > img {
      width: 44px;
      height: 44px;
      margin-left: 28px;
      vertical-align: -10px;
      object-fit: cover;
    }
  }
</style>

<style>
  .message-box-content .message {
    min-height: auto !important;
  }
</style>
