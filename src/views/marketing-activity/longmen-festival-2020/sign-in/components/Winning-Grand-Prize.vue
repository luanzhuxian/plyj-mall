<template>
    <div v-if="show">
        <div class="bg-gray">
            <transition name="fade">
                <div class="grand-present-box">
                    <img src="https://mallcdn.youpenglai.com/static/admall/2.9.0/obtain-gift-head.png">
                    <div class="top">恭喜你获得{{ flauntAwardName }}</div>
                    <div class="bottom">
                        <div class="detail">
                            <img :src="awardImg">
                            <h3>{{ awardName }}</h3>
                            <p>有效期：{{ startTime | dateFormat('YYYY.MM.DD') }}-{{ endTime | dateFormat('YYYY.MM.DD') }}</p>
                        </div>
                        <div class="footer">
                            <button @click="close">开心收下</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WinningGrandPrize',
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
        // 奖品图片
        awardImg: {
            type: String,
            default: ''
        },
        // 奖品名称
        awardName: {
            type: String,
            default: ''
        },
        // 奖品有效期开始时间
        startTime: {
            type: String,
            default: ''
        },
        // 奖品有效期结束时间
        endTime: {
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

  /* 中年味大奖 */
  .grand-present-box {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);

    > img {
      width: 96vw;
      height: 28vw;
      object-fit: cover;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -13vw;
      margin-left: -10px;
    }
  }

  .top {
    position: relative;
    margin: 0 auto;
    padding-top: 10px;
    padding-left: 10px;
    line-height: 70px;
    text-align: center;
    font-size: 45px;
    color: #FFDCB3;
  }

  .bottom {
    border-radius: 42px;
    padding: 10px 10px 20px 10px;
    width: 460px;
    .detail {
      text-align: center;
      border-radius: 30px;
      padding: 60px 0;
      background: #3E9F7F url('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/83e5925d-2d8a-4dd8-b009-755f3b2823d1.png') bottom no-repeat;
      background-size: contain;
      color: #fff;
      > img {
        width: 300px;
        height: 300px;
        object-fit: cover;
      }
      h3 {
        padding-top: 20px;
        margin: 0 auto;
        font-weight: 400;
        width: 400px;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 30px;
        line-height: 40px;
      }
      p {
        font-size: 20px;
      }
    }

    .footer {
      padding-top: 30px;
      text-align: center;

      button {
        width: 326px;
        height: 52px;
        background: #FF9F4B;
        border-radius: 50px;
        font-size: 30px;
        line-height: 52px;
        color: #FFF;
      }
    }
  }

</style>
