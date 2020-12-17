<template>
    <div v-if="show">
        <div class="bg-gray">
            <transition name="fade">
                <!-- 错过阶梯奖品弹框 -->
                <div class="present-box">
                    <div class="top" :style="{backgroundImage: 'url('+ topBg +')', color: textColor}">
                        很遗憾 您与奖品擦肩而过
                        <p>感谢您的参与</p>
                    </div>
                    <div class="detail">
                        <div class="no-present">
                            <img :src="sadImg">
                        </div>
                    </div>
                    <div class="info">
                        <p>您再参与{{ needSignInCount }}次打卡活动即可参与抽奖</p>
                    </div>
                    <div class="footer">
                        <button @click="close" :style="{ color: btnTextColor}">朕知道了</button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MissingGeneralPrize',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        // 还需要多签到多少次可以获得奖品
        needSignInCount: {
            type: [Number, String],
            default: 0
        },
        // 头部背景图
        topBg: {
            type: String,
            default: ''
        },
        textColor: {
            type: String,
            default: ''
        },
        btnTextColor: {
            type: String,
            default: ''
        },
        sadImg: {
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

<style scoped lang="scss">

  .bg-gray {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, .65);
  }

  .present-box {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    width: 540px;
    padding-bottom: 20px;
    border-radius: 10px;
  }

  .top {
    padding-top: 60px;
    height: 170px;
    text-align: center;
    background: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/gift-head.png') center top no-repeat;
    background-size: cover;
    font-size: 40px;
    color: #ffdcb3;

    p {
      position: relative;
      padding-top: 10px;
      font-size: 30px;
      line-height: 40px;
    }
  }

  .detail {
    margin: 20px 0;
    .no-present {
      text-align: center;

      img {
        width: 170px;
      }
    }
  }

  .info {
    text-align: center;
    font-size: 20px;
    line-height: 26px;
    color: #a8a8a8;
    padding-bottom: 20px;
  }

  .footer {
    border-top: 1px solid #e7e7e7;
    padding-top: 20px;
    text-align: center;
    font-size: 30px;

    button {
      color: #FF9F4B;
    }
  }

</style>
