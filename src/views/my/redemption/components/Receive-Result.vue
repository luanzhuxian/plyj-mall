<template>
    <div :class="$style.receiveResult">
        <img :class="$style.icon" :src="codeImg[code] || codeImg['default']" alt="">
        <div :class="$style.result" v-text="codeDesc[code] || codeDesc['default']" />
        <div :class="$style.error" v-if="codeErrorDesc[code]" v-text="codeErrorDesc[code]" />
    </div>
</template>

<script>
export default {
    name: 'ReceiveResult',
    props: {
        // 200激活成功 500激活失败 201无效码 202失效码 203未开始 204已过期 205自己激活 206别人激活
        code: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            codeImg: {
                200: 'https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/success.png',
                500: 'https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/error.png',
                default: 'https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/warning.png'
            },
            codeDesc: {
                200: '激活成功',
                500: '激活失败，请重试',
                default: '无效码'
            },
            codeErrorDesc: {
                201: '该兑换码为无效码',
                202: '该兑换码为失效码',
                203: '该兑换码未到使用时间，不可激活',
                204: '该兑换码已过期!',
                205: '您已激活兑换码，不可重复激活',
                206: '该兑换码已使用，如有问题请联系商家'
            }
        }
    }
}
</script>

<style module lang="scss">
  .icon {
    width: 180px;
    height: 180px;
  }

  .result {
    margin: 20px 0 22px;
    font-size: 32px;
    font-weight: 600;
    color: #333333;
  }
  .error {
    line-height:40px;
    font-size:28px;
    color:#999;
  }
</style>
<style>
  .message-box-content .message {
    min-height: auto!important;
  }
</style>
