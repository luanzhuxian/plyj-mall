<template>
  <div :class="$style.container">
    <div :class="$style.head">
      <div>
        <p @click="showPoster = true">分享海报</p>
        <p>活动细则</p>
      </div>
    </div>
    <div :class="$style.content">
      <!--签到-->
      <div :class="$style.signIn">

        <div><span>12,200 </span><span> 人与我共同抗击疫情</span></div>
        <!--签到天数-->
        <div :class="$style.con">

          <div>
            <div>
              <h1>我与疫情抗战了</h1>
              <div><span>1</span></div>
            </div>
            <div />
          </div>

          <div>
            <!--签到打卡-->
            <div>
              <div>
                <img src="https://mallcdn.youpenglai.com/static/beat-plague/03c085e7-ab35-4c75-b01d-b454d4e8b778.png" alt="">
                <span>可用健康值：1</span>
              </div>
              <div>累计获得健康值：1</div>
            </div>
            <!--签到进度条-->
            <div>
              <div>
                <p>已连续</p>
                <p>抗击疫情</p>
                <p>1天</p>
              </div>
              <div>
                <Step />
              </div>
            </div>
          </div>

        </div>

      </div>

      <!--弹幕-->
      <Barrage />

      <!--健康值兑换-->
      <div :class="$style.award">
        <Award />
      </div>
    </div>
    <div :class="$style.footer" />
    <Poster :show.sync="showPoster" />
  </div>
</template>

<script>
import Award from './components/Award'
import Barrage from './components/Barrage'
import Poster from './components/Poster.vue'
import Step from './components/Step'
export default {
  name: 'SignIn',
  components: {
    Award,
    Barrage,
    Step,
    Poster
  },
  data () {
    return {
      showPoster: false
    }
  }
}
</script>

<style module lang='scss'>

    .container {
        > .head {
            position: relative;
            height: 245px;
            background: url(https://mallcdn.youpenglai.com/static/beat-plague/7fc4ca52-a4f7-4a5d-a7ab-b8ed3c383aac.png) no-repeat -1px center;
            background-size: 101%;
            > div {
                position: absolute;
                top: 40px;
                right: 0;
                width: 104px;
                > p {
                    padding: 8px 8px 8px 16px;
                    border-radius: 40px 0 0 40px;
                    box-sizing: border-box;
                    font-size: 20px;
                    color: #3771FC;
                    background: #FFFFFF;
                    &:nth-of-type(1) {
                        margin-bottom: 20px;
                    }
                }
            }
        }
        > .content {
            min-height: calc(100vh - 245px);
            box-sizing: border-box;
            background: #495BFF;
            > .sign-in {
                margin: 0 auto;
                width: calc(100vw - 48px);
                overflow: hidden;
                border-radius: 20px;
                > div:nth-of-type(1) {
                    padding: 28px 0;
                    font-size: 30px;
                    text-align: center;
                    background: #CEE2FF;
                    > span:nth-of-type(1) {
                        font-weight: 600;
                    }
                }
                > .con {
                    box-sizing: border-box;
                    padding: 30px 20px;
                    background: #FFFFFF;
                    > div:nth-of-type(1) {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        box-sizing: border-box;
                        padding: 0 48px;
                        text-align: center;
                        > div:nth-of-type(1) {
                            color: #0E6CE5;
                            > h1 {
                                font-size: 28px;
                                font-weight: 400;
                                margin-bottom: 20px;
                            }
                            > div {
                                box-sizing: border-box;
                                width: 250px;
                                height: 148px;
                                padding-top: 26px;
                                font-size: 52px;
                                color: #6AE1FC;
                                background: url(https://mallcdn.youpenglai.com/static/beat-plague/7591527a-df0d-40a5-adea-eee9bb595891.png) no-repeat center center;
                                background-size: 100%;
                            }
                        }
                        > div:nth-of-type(2) {
                            width: 240px;
                            height: 126px;
                            background: url(https://mallcdn.youpenglai.com/static/beat-plague/fc1f8d6f-afcf-437f-b57c-c1191a1786a6.png) no-repeat center center;
                            background-size: 100%;
                        }
                    }
                    > div:nth-of-type(2) {
                        border-radius: 12px;
                        margin-top: 20px;
                        overflow: hidden;
                        > div:nth-of-type(1) {
                            display: flex;
                            justify-content: space-between;
                            padding: 20px;
                            font-size: 28px;
                            color: #999999;
                            background: #F7F7F7;
                            > div:nth-of-type(1) {
                                color: #333333;
                                > img {
                                    width: 25px;
                                    margin-right: 8px;
                                }
                            }
                        }
                        > div:nth-of-type(2) {
                            display: flex;
                            justify-content: space-between;
                            padding: 30px 10px 30px 20px;
                            background:linear-gradient(180deg,rgba(37,155,255,1) 0%,rgba(73,91,255,1) 100%);
                            font-size: 24px;
                            color: #FFFFFF;
                            > div:nth-of-type(1) {
                                padding-right: 10px;
                                border-right: 1px solid #6AE1FC;
                                > p:nth-of-type(2) {
                                    margin: 10px 0;
                                    white-space: nowrap;
                                }
                            }
                            > div:nth-of-type(2) {
                                width: 514px;
                                padding-left: 8px;
                                box-sizing: border-box;
                            }
                        }
                    }
                }
            }
            > .award {
                padding: 24px;
            }
        }
        .footer {
            height: 120px;
            background: url(https://mallcdn.youpenglai.com/static/beat-plague/52d1f091-f6a7-4f42-a1a0-4f0171efaf4f.png) no-repeat -2px -1px;
            background-size: 101%;
        }
    }

</style>
