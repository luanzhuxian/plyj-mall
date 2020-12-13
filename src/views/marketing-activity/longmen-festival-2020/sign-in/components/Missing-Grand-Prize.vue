<template>
    <div v-if="show">
        <div class="bg-gray">
            <transition name="fade">
                <div class="present-box">
                    <div class="top">
                        很遗憾 您与奖品擦肩而过
                        <p>新年喜临门 感谢您的参与</p>
                    </div>
                    <div class="detail">
                        <div class="no-present">
                            <img src="https://mallcdn.youpenglai.com/static/admall/2.9.0/sad-zongzi.png">
                        </div>
                    </div>
                    <div class="footer">
                        <div class="btns">
                            <button class="iKnow" @click="close">朕知道了</button>
                            <button @click="backMainActivityCenter">返回首页</button>
                        </div>
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
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },
        backMainActivityCenter () {
            this.$router.replace({ name: 'Home' })
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
    margin: 30px;
    .no-present {
      text-align: center;
      img {
        width: 170px;
      }
    }
  }

  .footer {
    border-top: 1px solid #e7e7e7;
    padding-top: 20px;
    text-align: center;
    font-size: 30px;
    text-align: center;

    .btns {
      font-size: 30px;
      display: flex;

      button {
        flex: 1;
        position: relative;
        color: #A8A8A8;
      }

      .iKnow{
        color: #FF9F4B;
        ::after {
          position: absolute;
          right: 0;
          top: -7px;
          content: '';
          width: 0;
          height: 57px;
          border: 1px solid #e7e7e7;
        }
      }
    }
  }
</style>
