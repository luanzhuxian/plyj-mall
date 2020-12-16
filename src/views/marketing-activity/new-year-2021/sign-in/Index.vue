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
                :status="activeDetail.status"
                :duration="9000000"
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
                    <button class="btn disabled" v-if="activeDetail.status === 0">活动未开始</button>
                    <div class="info" v-if="activeDetail.status === 1">
                        <div>
                            <div class="text">今日可签到打卡1次</div>
                            <div class="tips">还差6次打卡答题可参与智慧礼抽奖</div>
                        </div>
                        <button class="btn" :class="{'disabled': false}" :disabled="false" @click="signIn">打卡答题</button>
                        <button v-if="false" class="btn" :class="{'disabled': false}" :disabled="false" @click="receive">领取奖品</button>
                    </div>
                    <div class="info" v-if="activeDetail.status === 1 && activeDetail.isLottery">
                        <div>
                            <div class="text">12人已完成打卡答题</div>
                            <div class="tips">可参与抽奖获得智慧礼</div>
                        </div>
                        <button class="btn" :class="{'disabled': false}" :disabled="false" @click="lottery">立即抽奖</button>
                    </div>
                </div>
                <div class="sign-in-list">
                    <div class="sign-in-item" v-for="(item, index) in signInIconList" :key="index">
                        <SigninIcon
                            v-if="!item.isPresent"
                            :detail="item"
                            :has-signin="item.hasSignin"
                            :material-desc="item.materialDesc"
                            :icon-name="item.name"
                            :bgi="item.poster"
                        />
                        <PresentIcon
                            v-else
                            :detail="item"
                            :has-signin="item.hasSignin"
                            :is-grand-prsent="item.isGrandPrsent"
                            :award-type="item.awardType"
                            :award-img="item.awardImg"
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
import { swiper, swiperSlide } from 'vue-awesome-swiper'
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
        InfoModal
    },
    data () {
        return {
            id: '',
            isShowRule: false,
            isShowSharePoster: false,
            activeDetail: {
                signinNumber: 122,
                status: 1
            },
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
            presentList: [{
                show: true,
                awardImg: 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift.png',
                awardName: ''
            }, {
                show: true,
                awardImg: 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift.png',
                awardName: ''
            }, {
                show: true,
                awardImg: 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift.png',
                awardName: ''
            }],
            signInIconList: [],
            isShowInfoModal: false
        }
    },
    created () {
        this.id = this.$route.params.id
        this.getSignInIconList()
    },
    methods: {
        getSignInIconList () {
            this.signInIconList = [{ isPresent: false, hasSignin: true, materialDesc: '买', name: '买食材', poster: 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/%E6%B5%B7%E6%8A%A51.jpg' }, {}, {}, {}, {}, {}]
        },
        signIn () {
            this.isShowInfoModal = true
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
            opacity: .5;
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
