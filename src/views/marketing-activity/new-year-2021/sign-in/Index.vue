<template>
    <div class="sign-in">
        <!-- 礼品展示开始 -->
        <div class="present" v-if="presentList.length === 1">
            <img v-if="presentList[0].show" src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift.png" alt="">
        </div>
        <swiper :options="swiperOption" v-if="presentList.length > 1" class="swiper">
            <swiper-slide v-for="(item,index) in presentList" :key="index">
                <div class="swiper-box">
                    <div class="img">
                        <!--礼品图片-->
                        <img v-if="item.show" :src="item.awardImg" class="gift">
                        <span>{{ item.awardName }}</span>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
        <!-- 礼品展示结束 -->
        <!-- 倒计时 -->
        <div class="count-down">
            <CountDown
                active-name="答题打卡"
                :status="activeDetail.activityStatus"
                :duration="activityDuration"
                tip-colour="#620003"
                :count="activeDetail.signinNumber"
                count-colour="#FE461F"
                time-bottom-colour="#FE461F"
                time-colour="#FFE3C8" />
        </div>
        <!-- 打卡答题 -->
        <div class="box-wrap">
            <div class="box-inner">
                <div class="head">
                    <button class="btn disabled" v-if="activeDetail.activityStatus === 0">活动未开始</button>
                    <div class="info" v-if="activeDetail.activityStatus === 1">
                        <div>
                            <div class="text">今日可签到打卡{{ activeDetail.currentSignin ? 0 : 1 }}次</div>
                            <div class="tips">还差{{ differenceNumber }}次打卡答题可参与智慧礼抽奖</div>
                        </div>
                        <button v-if="false" class="btn" :class="{'disabled': false}" :disabled="false" @click="receive">领取奖品</button>
                        <button v-else class="btn" :class="{'disabled': activeDetail.currentSignin}" :disabled="activeDetail.currentSignin" @click="signIn">打卡答题</button>
                    </div>
                    <div class="info" v-if="activeDetail.activityStatus === 1 && activeDetail.isLottery">
                        <div>
                            <div class="text">{{ activeDetail.completeNumber }}人已完成打卡答题</div>
                            <div class="tips">可参与抽奖获得智慧礼</div>
                        </div>
                        <button class="btn" :class="{'disabled': false}" :disabled="false" @click="lottery">立即抽奖</button>
                    </div>
                </div>
                <div class="sign-in-list">
                    <div class="sign-in-item" v-for="(item, index) in signInIconList" :key="index">
                        <SigninIcon
                            v-if="!item.isPresent"
                            :has-signin="item.hasSignin"
                            :material-desc="item.materialDesc"
                            :icon-name="item.name"
                            :detail="item"
                        />
                        <PresentIcon
                            v-else
                            :has-signin="item.hasSignin"
                            :is-grand-prsent="item.isGrandPrsent"
                            :award-type="item.awardType"
                            :award-img="item.awardImg"
                            :detail="item"
                        />
                    </div>
                </div>
            </div>
        </div>
        <Records
            action-name="打卡"
            active-name="智力题"
            record-text="小聪明的奖励"
        />
        <!-- 活动规则 -->
        <ActivityRule :active-detail="activeDetail" />
        <!-- 分享海报 -->
        <SharePoster bgi="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/poster-bg.jpg" />
        <!-- 提示弹框 -->
        <InfoModal
            :show.sync="isShowInfoModal"
            title="恭喜您打卡6个智力题"
            sub-title="获得礼品"
        />
        <SigninPoster :show.sync="signPosterShow" :bgi="signPosterBgi" />
    </div>
</template>

<script>
import ActivityRule from '../../../../components/marketing-activity/sign-in/Activity-Rule'
import SharePoster from '../../../../components/marketing-activity/sign-in/Poster'
import CountDown from '../../../../components/marketing-activity/sign-in/Count-Down'
import SigninIcon from '../../../../components/marketing-activity/sign-in/Signin-Icon'
import PresentIcon from '../../../../components/marketing-activity/sign-in/Present-Icon'
import Records from '../../../../components/marketing-activity/sign-in/Records'
import InfoModal from '../../../../components/marketing-activity/sign-in/Info-Modal'
import SigninPoster from '../../../../components/marketing-activity/sign-in/Signin-Poster'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { getSignInIconList, getPresentList, checkInCurrentNewYearIcon } from '../../../../apis/new-year'
import moment from 'moment'
export default {
    components: {
        swiper,
        swiperSlide,
        ActivityRule,
        SharePoster,
        CountDown,
        SigninIcon,
        PresentIcon,
        Records,
        InfoModal,
        SigninPoster
    },
    data () {
        return {
            id: '',
            isShowRule: false,
            isShowSharePoster: false,
            activeDetail: {},
            swiperOption: {
                direction: 'horizontal',
                effect: 'coverflow',
                speed: 1000,
                loop: true,
                slidesPerView: 3,
                spaceBetween: 24,
                autoplay: {
                    // 1秒切换一次
                    delay: 1000,
                    disableOnInteraction: false,
                    stopOnLast: false
                },
                observer: true,
                observeParents: true
            },
            presentList: [],
            signInIconList: [],
            isShowInfoModal: false,
            signPosterShow: false,
            activityDuration: 0,
            totalSignIn: 0,
            differenceNumber: 0,
            signPosterBgi: ''
        }
    },
    created () {
        this.id = this.$route.params.id
        this.getPresentList()
        this.getSignInIconList()
    },
    methods: {
        // 获取大奖列表
        async getPresentList () {
            try {
                const { result } = await getPresentList(this.id)
                this.presentList = result
                if (result.length === 2) {
                    this.presentList.push(this.presentList[0])
                    this.presentList.push(this.presentList[1])
                }
            } catch (e) {
                throw e
            }
        },
        // 获取签到列表
        async getSignInIconList () {
            try {
                const { result } = await getSignInIconList(this.id)
                // 活动状态 0 未开始 1 进行中  2 结束  3 已删除
                const { activityStartLongTime, activityEndLongTime, activityStatus, notes, nextSigninNote } = result
                this.activeDetail = result
                this.totalSignIn = notes.length
                this.differenceNumber = this.totalSignIn - nextSigninNote + 1
                this.activityDuration = Number(activityStatus) === 0 ? (activityStartLongTime - moment().valueOf()) : (activityEndLongTime - moment().valueOf())
                const presentList = []
                for (const i in notes) {
                    const item = notes[i]
                    if (item.hasAward) {
                        presentList.push({
                            index: item.index,
                            isPresent: true,
                            hasSignin: item.awardType !== '',
                            hasAward: item.hasAward,
                            awardImg: item.awardImg,
                            awardType: item.awardType,
                            isGrandPrsent: item.index === notes.length
                        })
                    }
                }
                this.signInIconList = notes
                for (const i in presentList) {
                    const item = presentList[i]
                    this.signInIconList.splice(item.index, 0, item)
                }
            } catch (e) {
                throw e
            }
        },
        async signIn () {
            await checkInCurrentNewYearIcon(this.id, this.activeDetail.nextSigninNote)
            const currentIndex = this.activeDetail.nextSigninNote - 1
            this.signPosterBgi = this.signInIconList[currentIndex].posterUrl
            this.signPosterShow = true
            this.signInIconList[currentIndex].hasSignin = true
            this.activeDetail.currentSignin = true
            this.differenceNumber--
        },
        receive () {
            console.log('领取奖品')
        },
        lottery () {
            console.log('抽奖')
        }
    }
}
</script>

<style scoped lang="scss">
.sign-in{
  background: #C40E1A url("https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/sign_in_bg.png") no-repeat;
  background-size: 100% 553px;
  padding: 175px 0 30px;
  .present{
    height: 197px;
    text-align: center;
    img{
      height: 197px;
    }
  }
  .swiper {
    width: 80vw;
    .swiper-box {
      width: 201px;
      height: 253px;
      overflow: hidden;
    }
  }
  .count-down{
    margin-top: 17px;
    background: url("https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/count_down_bg.png") no-repeat;
    background-size: 100% 100%;
    height: 159px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-wrap{
    background: #FE461F;
    border-radius: 20px;
    margin: -20px 18px 56px;
    padding: 22px 28px 58px;
    .box-inner{
      background: #fff;
      border-radius: 20px;
      .head{
        background: #FFFAF5;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 20px 20px 0px 0px;
        height: 123px;
        display: flex;
        justify-content: center;
        align-items: center;
        .info{
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 25px;
          font-family: MicrosoftYaHei;
          .text{
            font-size: 26px;
            color: #0D0D0D;
          }
          .tips{
            margin-top: 11px;
            font-size: 22px;
            color: #313131;
          }
        }
        .btn{
          padding: 14px 40px;
          background: #FE461F;
          border-radius: 10px;
          font-size: 26px;
          color: #FFE3C8;
          &.disabled{
            background: rgba(252, 69, 33, .5);
          }
        }
      }
      .sign-in-list{
        padding: 34px 45px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
