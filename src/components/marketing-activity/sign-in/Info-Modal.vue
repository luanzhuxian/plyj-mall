<template>
    <pl-mask :show="show" @close="close">
        <div :class="$style.modal">
            <div :class="$style.head">
                <div :class="$style.title">{{ title }}</div>
                <div :class="$style.subTitle">{{ subTitle }}</div>
            </div>
            <div :class="$style.gift" />
            <div :class="$style.text">奖品已经自动存入您的我的礼品中</div>
            <div :class="$style.text">您可在我的卡包中查看</div>
            <div :class="$style.btn">
                <button :class="$style.btn" @click="close">开心收下</button>
            </div>
        </div>
    </pl-mask>
</template>
<script>
export default {
    name: 'InfoModel',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module scoped lang="scss">
  .modal{
    width: 533px;
    background: #fff;
    border-radius: 10px;
    padding: 0 0 35px;
    .head{
      background: url("https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/popup_top.png") no-repeat;
      background-size: 100% 175px;
      padding-top: 40px;
      height: 135px;
      .title{
        text-align: center;
        font-size: 40px;
        color: #FFDCB3;
      }
      .sub-title{
        margin-top: 8px;
        text-align: center;
        font-size: 30px;
        color: #FFDCB3;
      }
    }
    .gift{
      margin: 30px auto;
    }
    .text{
      text-align: center;
      font-size: 20px;
      line-height: 1.5;
      color: #A8A8A8;
    }
    .btn{
      text-align: center;
      margin-top: 30px;
      button{
        width: 326px;
        height: 52px;
        background: linear-gradient(180deg, #F5651A 0%, #F01B15 100%);
        box-shadow: 0px 3px 6px rgba(240, 28, 21, 0.6);
        border-radius: 50px;
        font-size: 30px;
        color: #FFDCB3;
      }
    }
    .loading {
      &:global {
        animation: rotate 2s linear infinite;
      }
    }
  }
</style>
