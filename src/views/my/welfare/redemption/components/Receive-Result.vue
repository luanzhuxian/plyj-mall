<template>
    <div :class="$style.receiveResult">
        <img :class="$style.icon" :src="statusImg[status] || statusImg[1]" alt="">
        <div :class="$style.result" v-text="statusDesc[status] || statusDesc[1]" />
        <div :class="$style.error" v-if="statusErrorDesc[status]" v-text="statusErrorDesc[status]" />
    </div>
</template>

<script>
export default {
    name: 'ReceiveResult',
    props: {
        // 0-核销成功 1，2，3，4-核销失败 -1核销出错
        status: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            statusImg: {
                0: 'https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/success.png',
                '-1': 'https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/error.png',
                1: 'https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/warning.png'
            },
            statusDesc: {
                0: '核销成功',
                '-1': '核销失败，请重试',
                1: '无效码'
            },
            statusErrorDesc: {
                1: '该激活码已过期!',
                2: '该激活码已使用，如有问题请联系商家',
                3: '您已激活兑换码，不可重复激活',
                4: '该兑换码未到使用时间，不可激活'
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
