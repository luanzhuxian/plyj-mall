<template>
  <div :class="$style.container">
    <div :class="$style.head">
      <div>
        <p @click="showPoster = true">分享海报</p>
        <p @click="showDetail = true">活动细则</p>
      </div>
    </div>
    <div :class="$style.content">
      <!--签到-->
      <div :class="$style.signIn">

        <div><span>{{ activityInfo.joinPeopleNumber }} </span><span> 人与我共同抗击疫情</span></div>
        <!--签到天数-->
        <div :class="$style.con">

          <div>
            <div>
              <h1>我与疫情抗战了</h1>
              <div><span>{{ signInInfo.totalHealthDay || 0 }}</span></div>
            </div>
            <div
              :class="{
                [$style.signNot]:!signInInfo.currentSign && typeof signInInfo.currentSign === 'boolean' ,
                [$style.signYes]:signInInfo.currentSign,
              }"
              @click="isSignIn"
            />
          </div>

          <div>
            <!--签到打卡-->
            <div>
              <div>
                <img src="https://mallcdn.youpenglai.com/static/beat-plague/03c085e7-ab35-4c75-b01d-b454d4e8b778.png" alt="">
                <span>可用健康值：{{ signInInfo.usableHealthValue || 0 }}</span>
              </div>
              <div>累计获得健康值：{{ signInInfo.totalHealthValue || 0 }}</div>
            </div>
            <!--签到进度条-->
            <div>
              <div>
                <p>已连续</p>
                <p>抗击疫情</p>
                <p>{{ signInInfo.currentContinuitySignDay || 0 }}天</p>
              </div>
              <div>
                <Step v-if="signInInfo.everyDayInfos.length" :list="signInInfo.everyDayInfos" :current-sign="signInInfo.currentSign" />
              </div>
            </div>
          </div>

        </div>

      </div>

      <!--弹幕-->
      <Barrage v-if="barrageFlag" :list="barrageInfo" />

      <!--健康值兑换-->
      <div :class="$style.award">
        <Award @success="refreshMessage" :award-list="giftInfo" />
      </div>
    </div>
    <div :class="$style.footer" />
    <!--海报-->
    <Poster
      :show.sync="showPoster"
      :poster-info="{
        'startTime':activityInfo.startTime,
        'endTime':activityInfo.endTime,
        'hasLogo':activityInfo.isShow || 0,
        'logoUrl':activityInfo.logoUrl
      }"
    />
    <!--活动细则-->
    <Popup :show.sync="showDetail" :hide-close-icon="false">
      <div :class="$style.detail">
        <div :class="$style.title">
          <img src="https://mallcdn.youpenglai.com/static/beat-plague/2ed59881-e182-408e-afff-4e9ee89575fa.png" alt="">
          <ul>
            <li>活动时间：{{ activityInfo.startTime }} ~ {{ activityInfo.endTime }}</li>
            <li>活动对象：全部会员</li>
            <!-- <li>活动机构：某机构</li> -->
            <li>活动奖励：获得健康值，可兑换相应礼品</li>
          </ul>
        </div>
        <div :class="$style.content">
          <p>活动说明</p>
          <div>在活动有效期内，您可每天进行平安签到1次</div>
          <ul>
            <li>如果连续签到1天，即可获得1个健康值</li>
            <li>如果连续签到2天，即可获得2个健康值</li>
            <li>如果连续签到3天，即可获得3个健康值</li>
            <li>如果连续签到4天，即可获得4个健康值</li>
            <li>如果连续签到5天，即可获得5个健康值</li>
            <li>如果连续签到6天，即可获得6个健康值</li>
            <li>如果连续签到7天，每天即可获得7个健康值</li>
          </ul>
          <div>
            <!-- <p>如果未连续签到，则要重新开始连续签到的计算健康值仅支持本活动种的奖励兑换，活动结束后，未进行兑换的用户，视为防窃兑换奖励，健康值将清零，请大家在活动有效期内及时进行奖励兑换。</p> -->
            <p v-html="activityInfo.detailedRule" />
            <div>
              <img src="https://mallcdn.youpenglai.com/static/beat-plague/d3e0c8bb-08d4-4438-9712-b20b34f3307f.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </Popup>
    <!--签到弹窗-->
    <Popup :show.sync="shwoSignIn" :hide-close-icon="true">
      <div :class="$style.signInWish">
        <div :class="$style.day">{{ signInInfo.totalHealthDay || 0 }}</div>
        <div :class="$style.description">
          <div>情系疫情 武汉加油</div>
          <div>
            <span>连续签到{{ signInInfo.currentContinuitySignDay + 1 }}天</span>
            <span>可获得{{ signInInfo.currentSignHealthValue || 0 }}个健康值</span>
          </div>
        </div>
        <ul>
          <li>请选择您想说的话，进行健康打卡，声援武汉</li>
          <li @click="signIn(item)" v-for="(item,index) in wishList" :key="index">
            <img src="https://mallcdn.youpenglai.com/static/beat-plague/b843e0f1-166c-42ce-b13a-02a26339dbba.png">
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div :class="$style.wishBottom" />
    </Popup>

  </div>
</template>

<script>
import Popup from './../../components/penglai-ui/Popup'
import Award from './components/Award'
import Barrage from './components/Barrage'
import Poster from './components/Poster.vue'
import Step from './components/Step'
import { getSignInInfo, getactivityInfo, getGiftInfo, signIn, getBarrage } from './../../apis/fight-epidemic'
export default {
  name: 'SignIn',
  components: {
    Popup,
    Award,
    Barrage,
    Step,
    Poster
  },
  data () {
    return {
      showPoster: false,
      showDetail: false,
      shwoSignIn: false,
      barrageFlag: false,
      activityId: this.$route.params.id,
      signInInfo: {
        everyDayInfos: [],
        currentSign: false
      }, // 我的签到信息
      activityInfo: {
        isShow: 0
      }, // 签到活动信息
      giftInfo: [], // 礼品信息
      barrageInfo: [], // 弹幕
      wishList: ['身体健康平安，我为中国加油!', '我在家中为武汉加油，向一线战士致敬!', '不给祖国添乱，宅在家中为祖国做贡献!', '家中一切平安，我与大家共同抗击疫情!']
    }
  },
  async activated () {
    try {
      let flag = await this.getSignInInfo()
      if (flag) {
        this.getactivityInfo()
        this.getGiftInfo()
        this.getBarrage()
      }
      // 加载签到的背景图
      let img = new Image()
      img.src = 'https://mallcdn.youpenglai.com/static/beat-plague/201584d4-4031-4262-ab58-5b9026311be5.png'
    } catch (e) { throw e }
  },
  methods: {
    refreshMessage () {
      try {
        this.getSignInInfo()
        this.getactivityInfo()
        this.getGiftInfo()
      } catch (e) { throw e }
    },
    // 获取我的签到信息
    async getSignInInfo () {
      try {
        let { result } = await getSignInInfo(this.activityId)
        // 是否已经报名
        if (!result.isRegister) {
          this.$router.replace({ name: 'EpidemicSignUp', params: { id: this.activityId } })
          return false
        }
        this.signInInfo = result
        return true
      } catch (e) { throw e }
    },
    // 获取签到活动信息
    async getactivityInfo () {
      try {
        let { result } = await getactivityInfo(this.activityId)
        result.startTime = result.startTime.split(' ')[0]
        result.endTime = result.endTime.split(' ')[0]
        this.activityInfo = result
      } catch (e) { throw e }
    },
    // 获取兑换礼品信息
    async getGiftInfo () {
      try {
        let { result } = await getGiftInfo(this.activityId, this.$store.getters.userId)
        this.giftInfo = result
      } catch (e) { throw e }
    },
    // 获取弹幕信息
    async getBarrage () {
      try {
        let { result: { records } } = await getBarrage(this.activityId)
        this.barrageInfo = records
        this.barrageFlag = true
      } catch (e) { throw e }
    },
    // 签到
    async signIn (content) {
      try {
        let { status } = await signIn({
          activityId: this.activityId,
          content
        })
        if (status === 200) {
          this.$success('健康打卡成功')
          this.shwoSignIn = false
          this.getSignInInfo()
          this.getactivityInfo()
          this.getBarrage()
        }
      } catch (e) { throw e }
    },
    // 是否签到
    isSignIn () {
      try {
        // 已经签到
        if (this.signInInfo.currentSign) {
          this.$success('今日已打卡，明日再来报平安~')
          return
        }
        // 活动 1 未开始 2 正在进行 3 结束
        if (this.signInInfo.statue === 1) {
          this.$warning('活动还未开始')
          return
        } else if (this.signInInfo.statue === 1) {
          this.$warning('活动还已结束')
          return
        }
        this.shwoSignIn = true
      } catch (e) { throw e }
    }
  }
}
</script>

<style module lang='scss'>

    .container {
        > .head {
            position: relative;
            height: 245px;
            background: url(https://mallcdn.youpenglai.com/static/beat-plague/341c23c9-c269-47eb-bc4d-7e1943f28306.png) no-repeat -1px center;
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
            min-height: calc(100vh - 285px);
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
                            background-size: 100%;
                        }
                        > .sign-not {
                            background: url(https://mallcdn.youpenglai.com/static/beat-plague/fc1f8d6f-afcf-437f-b57c-c1191a1786a6.png) no-repeat center center;
                        }
                        > .sign-yes {
                            background: url(https://mallcdn.youpenglai.com/static/beat-plague/5560ba97-0f3c-4450-97c0-85c260644dc8.png) no-repeat center center;
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
                padding: 0 24px 24px 24px;
            }
        }
        .footer {
            height: 120px;
            background: url(https://mallcdn.youpenglai.com/static/beat-plague/52d1f091-f6a7-4f42-a1a0-4f0171efaf4f.png) no-repeat -2px -1px;
            background-size: 101%;
        }
    }

    .detail {
        box-sizing: border-box;
        padding: 23px 36px 46px 36px;
        font-size: 32px;
        color: #FFFFFF;
        background: #406BFF;
        li {
            list-style: disc;
        }
        > .title {
            > img {
                width: 400px;
                height: 120px;
            }
            > ul {
                box-sizing: border-box;
                padding: 0 36px 52px 36px;
                border-bottom: 1px solid #FFFFFF;
                > li {
                    margin-top: 32px;
                    font-size: 32px;
                }
            }
        }
        > .content {
            font-size: 28px;
            > p {
                margin: 40px 0;
            }
            > ul {
                box-sizing: border-box;
                padding: 0 36px;
                margin: 31px 0 36px 0;
                > li {
                    margin-top: 10px;
                }
            }
            > div:nth-of-type(2) {
                > p:nth-last-of-type(1) {
                    margin-top: 48px;
                }
                > div {
                    display: flex;
                    justify-content: flex-end;
                    > img {
                        width: 194px;
                        height: 72px;
                    }
                }
            }
        }
    }

    .wish-bottom {
        padding: 40px 0;
        background-color: #4560ff;
    }
    .sign-in-wish {
        position: relative;
        height: 1028px;
        color: #FFFFFF;
        background: url(https://mallcdn.youpenglai.com/static/beat-plague/201584d4-4031-4262-ab58-5b9026311be5.png) no-repeat -1px -1px;
        background-size: 100% 111%;
        > .day {
            position: absolute;
            right: 174px;
            top: 85px;
            font-size: 72px;
        }
        > .description {
            position: absolute;
            top: 330px;
            left: 92px;
            box-sizing: border-box;
            width: 570px;
            padding: 0px 70px;
            font-size: 28px;
            text-align: center;
            > div:nth-last-of-type(1) {
                display: flex;
                justify-content: space-between;
                margin-top: 14px;
            }
        }
        > ul {
            position: absolute;
            top: 494px;
            left: 92px;
            font-size: 28px;
            > li:nth-of-type(n + 2) {
                display: flex;
                align-items: center;
                margin-top: 24px;
                padding: 22px;
                border-radius: 40px;
                font-weight: 500;
                color: #3381F0;
                background-color: #FFFFFF;
                > img {
                    width: 52px;
                    height: 52px;
                }
            }
        }
    }

</style>

<style lang="scss">

    .pl-popup__content {
        max-height: 85vh;
    }

</style>
