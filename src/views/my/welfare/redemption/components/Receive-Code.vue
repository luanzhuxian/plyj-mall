<template>
    <div :class="$style.receiveCode">
        <div :class="$style.title">添加兑换码</div>
        <div :class="$style.searchBox">
            <input
                ref="input"
                v-model.trim="code"
                type="Number"
                :placeholder="`请输入${codeMaxLength}位兑换码`"
                @input="input"
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
/* eslint-disable func-style */
function getMaxLengthStr (str, length) {
    if (str >= length) {
        return str.substring(0, length)
    }
    return str
}
export default {
    name: 'ReceiveCode',
    data () {
        return {
            codeMaxLength: 14,
            code: '',
            isLoading: false
        }
    },
    created () {
        this.$parent.$on('confirm', this.receiveRedemption)
    },
    methods: {
        input () {
            this.code = getMaxLengthStr(this.code, this.codeMaxLength)
        },
        scan () {
            if (window.wx) {
                window.wx.scanQRCode({
                    needResult: 1,
                    scanType: ['qrCode', 'barCode'],
                    success: res => {
                        // 当needResult 为 1 时，扫码返回的结果
                        const result = res.resultStr
                        this.code = this.getCode(result)
                    }
                })
            } else {
                console.error('微信配置错误')
            }
        },
        getCode (result) {
            const arr = result.split('?')[0].split('/')
            const code = arr[arr.length - 1] || ''
            return getMaxLengthStr(code, this.codeMaxLength)
        },
        async receiveRedemption () {
            // 校验兑换码code
            if (!this.code) {
                await this.$warning('未输入兑换码')
                return
            }
            // 是否加载中
            if (this.isLoading) return
            this.isLoading = true
            try {
                const { result: { code } } = await receiveRedemption(this.code)
                if (code === 200) {
                    await this.$success('激活成功')
                    this.$emit('refresh')
                } else {
                    await this.$warning(codeDesc[code])
                }
            } catch (e) {
                await this.$warning(codeDesc[500])
            } finally {
                this.code = ''
                this.isLoading = false
            }
        }
    },
    destroyed () {
        this.$parent.$off('confirm', this.receiveRedemption)
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
