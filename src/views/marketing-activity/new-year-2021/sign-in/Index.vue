<template>
    <div class="sign-in">
        <!-- 礼品展示开始 -->
        <div class="present" v-if="presentList.length === 1">
            <img v-if="presentList[0].show" src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift.png" alt="">
        </div>
        <swiper :options="swiperOption" v-if="presentList.length > 1" class="swiper">
            <swiper-slide v-for="(item,index) in presentList" :key="index" class="swiper-no-swiping">
                <div class="swiper-box">
                    <div class="img">
                        <!--有礼品图片时的背景-->
                        <img v-if="item.show" class="gift-bg" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-gift.png" alt="">
                        <!--无礼品图片时的背景-->
                        <img v-else class="gift-bg" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/small-gift-style.png" alt="">
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
                :status="1"
                :duration="9000000"
                tip-colour="#620003"
                :count="122"
                count-colour="#FE461F"
                time-bottom-colour="#FE461F"
                time-colour="#FFE3C8" />
        </div>
        <!--  -->
        <div class="box-wrap">
            <div class="box-inner">
                <div class="head">
                    <button>活动未开始</button>
                </div>
                <div class="list" />
            </div>
        </div>
        <Records
            action-name="打卡"
            active-name="智力题"
        >
            <template v-slot:shaidan="{total}">
                已有<strong>{{ total }}人</strong>获得小聪明的奖励
            </template>
            <template v-slot:my-gift="{total}">
                已有<strong>{{ total }}人</strong>获得小聪明的奖励
            </template>
        </Records>
        <!-- 活动规则 -->
        <ActivityRule :active-detail="activeDetail" />
        <!-- 分享海报 -->
        <SharePoster bgi="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/poster-bg.jpg" />
    </div>
</template>

<script>
import ActivityRule from '../../../../components/marketing-activity/sign-in/Activity-Rule.vue'
import SharePoster from '../../../../components/marketing-activity/sign-in/Poster.vue'
import CountDown from '../../../../components/marketing-activity/sign-in/Count-Down.vue'
import Records from '../../../../components/marketing-activity/sign-in/Records.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    components: {
        swiper,
        swiperSlide,
        ActivityRule,
        SharePoster,
        CountDown,
        Records
    },
    data () {
        return {
            isShowRule: false,
            isShowSharePoster: false,
            activeDetail: {},
            presentList: [{
                show: true
            }]
        }
    },
    methods: {
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
    height: 197px;
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
    margin: -20px 18px 0;
    padding: 22px 28px 58px;
    .box-inner{
      background: #fff;
      border-radius: 20px;
      .head{
        background: #FFFAF5;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 20px 20px 0px 0px;
        height: 123px;
      }
      .list{
        padding: 30px 45px;
      }
    }
  }
}
</style>
