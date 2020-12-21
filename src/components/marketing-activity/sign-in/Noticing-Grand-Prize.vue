<template>
    <div v-if="show">
        <div class="bg-gray">
            <transition name="fade">
                <!-- 中年味大奖前提示 -->
                <div class="grand-present-tip-box">
                    <div class="top">
                        <p>恭喜你已完成打卡智力题</p>
                        <p>请抽取出您的智慧礼</p>
                    </div>
                    <div class="detail" :style="{backgroundImage: 'url('+ bgImg +')'}">
                        <img :src="awardImg">
                    </div>
                    <div class="footer">
                        <button @click="close" :style="{background: bgColor, color: textColor}">立即抽奖</button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PresentPopup',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        // 大奖名称
        flauntAwardName: {
            type: String,
            default: '大奖'
        },
        bgImg: {
            type: String,
            default: ''
        },
        awardImg: {
            type: String,
            default: ''
        },
        bgColor: {
            type: String,
            default: '#FF9F4B'
        },
        textColor: {
            type: String,
            default: '#ffdcb3'
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$emit('close')
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

  .grand-present-tip-box {
    position: fixed;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    background-color: transparent;
    position: relative;
    text-align: center;
  }

  .top {
    font-size: 40px;
    line-height: 56px;
    color: #ffdcb3;
  }

  .detail {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 496px;
    height: 496px;
    margin: 0 auto;
    text-align: center;
    img {
      width: 462px;
      height: 354px;
      margin-left: 52px;
    }
  }

  .footer {
    padding-top: 20px;
    text-align: center;

    button {
      width: 326px;
      height: 52px;
      background-color: #FF9F4B;
      border-radius: 50px;
      font-size: 30px;
      line-height: 52px;
      color: #fff;
    }
  }

</style>
