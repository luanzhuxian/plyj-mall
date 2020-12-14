<template>
    <div class="sign-in">
        <!-- 活动规则 -->
        <ActivityRule
            :show.sync="isShowRule"
            flaunt-award-name="打卡聪明年"
            :active-detail="activeDetail"
        />

        <!-- 分享海报 -->
        <SharePoster
            :show.sync="isShowSharePoster"
            :poster="sharePoster"
        />
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
        <div class="count-down" />
        <!--  -->
        <div class="box-wrap">
            <div class="box-inner">
                <div class="head">
                    <button>活动未开始</button>
                </div>
                <div class="list" />
            </div>
        </div>
    </div>
</template>

<script>
import ActivityRule from './components/Activity-Rule'
import SharePoster from '../../../../components/common/Share-Poster'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    components: {
        swiper,
        swiperSlide,
        ActivityRule,
        SharePoster
    },
    data () {
        return {
            isShowRule: false,
            isShowSharePoster: false,
            activeDetail: {},
            sharePoster: '',
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
  height: 100vh;
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
