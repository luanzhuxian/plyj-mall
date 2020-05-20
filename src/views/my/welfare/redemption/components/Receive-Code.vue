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
// import { receiveRedemption } from '../../../../apis/my-redemption'
const statusDesc = {
    1: '该兑换码未到使用时间，不可激活哦~',
    2: '该激活码已过期！',
    3: '该激活码已使用，如有问题请联系商家',
    4: '您已激活该兑换码，不可重复激活哦~'
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
            console.log(1)
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
        async receiveRedemption () {
            try {
                if (!this.codeId) {
                    await this.$warning('未输入核销码')
                    return
                }
                // const { result: { status } } = await receiveRedemption(this.codeId)
                const status = 0
                const errorText = statusDesc[status]
                await this.$warning(errorText)
            } catch (e) {
                throw e
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
