<template>
  <div class="new-year-activity">
    <!-- 活动详情展示 -->
    <div class="activity-detail">
      <div class="top">
        <!-- 礼品展示 -->
        <div v-if="presentList.length === 1" class="one-swiper">
          <img
            src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/bd63ba94-e164-411a-b62d-a5d7e803a59d.png"
          >
        </div>
        <swiper :options="swiperOption" v-if="presentList.length > 1" class="swiper">
          <swiper-slide v-for="(item,index) in presentList" :key="index" class="swiper-no-swiping">
            <div class="swiper-box">
              <img :src="item.headImgUrl">
              <p>
                <span>平衡车</span>
                <br>
                <span>价值1000元</span>
              </p>
            </div>
          </swiper-slide>
        </swiper>
        <!-- 展示海报按钮 -->
        <button class="show-poster" @click="showPoster">
          <pl-svg name="icon-haibao" height="25" />
          <span>海报</span>
        </button>
        <!-- 展示活动规则按钮 -->
        <button class="show-rule" @click="isShowRule = true">
          活动规则
        </button>
      </div>
      <div class="bottom">
        <!-- 活动倒计时 -->
        <div class="count-down">
          <div class="desc">
            <h3>
              已有<span>122</span>人积攒我心中的年味
            </h3>
            <div>
              距活动结束仅剩<span>122</span>天<span>24</span>：<span>59</span>：<span>59</span>
            </div>
          </div>
        </div>
        <!-- 参与活动 -->
        <div class="join-activity">
          <div class="control-top">
            <button v-if="false">活动未开始</button>
            <button v-if="false">立即参加活动</button>
            <div class="desc-control">
              <p>
                <span>12人已集齐年味</span>
                <span>可参与抽奖获得年味大奖</span>
              </p>
              <button>获得我的年味</button>
              <button v-if="false">立即抽奖</button>
            </div>
          </div>
          <div class="sign-in-icon-bottom">
            <div class="sign-in-icon-item" v-for="(item, index) in signInIconList" :key="index">
              <div v-if="!item.isPresent" class="icon-item">
                <div class="icon">
                  <img v-if="item.isSignIn"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/46322250-3be6-4c39-99fd-2b07fbde4915.png"
                       alt=""
                  >
                  <img v-else class="not-sign"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/30a904a8-a0ae-4154-895e-1f9aefd9a6bf.png"
                       alt=""
                  >
                  <span class="not-sign">{{ item.name }}</span>
                </div>
                <p>{{ item.desc }}</p>
              </div>
              <div v-else class="prensent-icon-item">
                <!-- 奖品为奖学金-->
                <div v-if="false">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png"
                    alt=""
                  >
                  <p>已获得</p>
                </div>
                <!-- 奖品为优惠券-->
                <div v-if="false">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                    alt=""
                  >
                  <p>已获得</p>
                </div>
                <!-- 奖品为礼品-->
                <div v-if="false">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                    alt=""
                  >
                  <p>已获得</p>
                </div>
                <!-- 未获得礼品-->
                <div v-if="false">
                  <span>
                    <pl-svg name="icon-welfare" width="70" fill="#ffe3c8" />
                  </span>
                  <p class="not-sign">礼品</p>
                </div>
                <!-- 最后年味大奖-->
                <div v-if="true">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/65044768-ee0c-4987-907b-b69e71cb067c.png"
                    alt=""
                  >
                  <p :class="{'not-sign': !item.isSignIn}">年味大奖</p>
                </div>
              </div>
              <div v-if="(index !== signInIconList.length -1) && ((index + 1) % 5 !== 0)" class="underline" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已获得奖品展示区 -->
    <div class="present-list">
      <div class="top">
        <button @click="clickPrensentType(1)" :class="{'is-selected': presentListType === 1}">
          <span>好礼晒单</span>
          <span class="underline" />
        </button>
        <div class="divider-line" />
        <button @click="clickPrensentType(2)" :class="{'is-selected': presentListType === 2}">
          <span>我的奖品</span>
          <span class="underline" />
        </button>
      </div>
      <div class="bottom">
        <div class="sun-present" v-if="presentListType === 1">
          <div class="statistics">
            已有<span>102人</span>获得年味奖品
          </div>
          <div class="no-sun-present" v-if="sunPresentList.length === 0">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png"
              alt=""
            >
          </div>
          <template v-else>
            <template v-for="(item, index) in sunPresentList">
              <div class="sun-present-item" v-if="index < 3 || showSunPresentListMore" :key="index">
                <!-- 礼品展示 -->
                <img v-if="item.giftType === 1"
                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png"
                     alt=""
                >
                <img v-else-if="item.giftType === 2"
                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                     alt=""
                >
                <img v-else
                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f53995cc-7c11-40ca-902c-4f34cda1d075.png"
                     alt=""
                >
                <!-- 头像-->
                <img class="avatar" :src="item.avatar" alt="">
                <!-- 礼品描述 -->
                <h3>
                  <p>{{ item.userName }}积攒了<span class="orange">3</span>个年味</p>
                  <p>
                    开启礼品 获得
                    <span v-if="item.giftType === 1">
                      <span class="orange">{{ item.price }}</span> 元{{ item.name }}
                    </span>
                    <span v-else-if="item.giftType === 2">
                      <span class="orange">{{ item.price }}</span> 元{{ item.name }}
                    </span>
                    <span v-else>
                      价值<span class="orange">{{ item.price }}</span> 元{{ item.name }}
                    </span>
                  </p>
                </h3>
              </div>
            </template>
            <div
              v-if="sunPresentList.length > 3 && !showSunPresentListMore"
              class="more"
              @click="showSunPresentListMore = true"
            >
              查看更多
            </div>
          </template>
        </div>
        <div class="my-present" v-if="presentListType === 2">
          <div class="statistics">
            我获得<span>2个</span>年味奖品
          </div>
          <div class="no-sun-present" v-if="myPresentList.length === 0">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png"
              alt=""
            >
          </div>
          <template v-else>
            <template v-for="(item, index) in myPresentList">
              <div class="my-present-item" v-if="index < 3 || showMyPresentListMore" :key="index">
                <!-- 礼品展示 -->
                <span>
                  <img v-if="item.giftType === 1"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png"
                       alt=""
                  >
                  <img v-else-if="item.giftType === 2"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                       alt=""
                  >
                  <img v-else :src="item.giftImg" alt="">
                  <i :class="{'grand-prize': item.isGrandPrize}">
                    年味大奖
                  </i>
                </span>
                <!-- 礼品描述 -->
                <h3>
                  <p>奖品 【{{ item.presentName }}】</p>
                  <p class="orange">
                    <span v-if="item.giftType === 1">满{{ 1000 }}减{{ 23213 }}</span>
                    <span v-else-if="item.giftType === 2">￥{{ 23 }}元</span>
                    <span v-else>产品介绍</span>
                  </p>
                  <p>有效期2020.3.19~2020.3.19</p>
                </h3>
              </div>
            </template>
            <div
              v-if="myPresentList.length > 3 && !showMyPresentListMore"
              class="more"
              @click="showMyPresentListMore = true"
            >
              查看更多
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 活动规则 -->
    <pl-popup
      title="活动细则"
      :show="isShowRule"
      @close="isShowRule = false"
    >
      <div class="rule-content">
        <h3>1.活动时间</h3>
        <p>2019.05.20 10:20:20至2018.06.20 10:20:20</p>
        <h3>2.抽奖时间</h3>
        <p>2019.12.12 10:20:20至2018.06.20 10:20:20</p>
        <h3>3.活动对象</h3>
        <p>所有会员</p>
        <h3>4.活动奖品</h3>
        <p>年味大礼</p>
        <h3>5.活动说明</h3>
        <span>
          在活动有效期内，集齐我心中的10个年味，即可参与抽奖，抽出年味大奖。用户积攒了一定数量的年味，即可获得相应的奖品
        </span>
        <span>获得的礼品将自动存入我的礼品中;</span>
        <span>获得的优惠券将自动存入我的卡包中</span>
        <span>获得的压岁钱将自动存入我的奖学金中 。</span>
      </div>
    </pl-popup>
  </div>
</template>

<script>
import { getNewYearActivityDetail } from '../../../apis/new-year-activity'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'NewYearActivity',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      presentList: [
        {
          headImgUrl: 'https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/bd63ba94-e164-411a-b62d-a5d7e803a59d.png'
        },
        {
          headImgUrl: 'https://mallcdn.youpenglai.com/static/mall/2.0.0/activity/invitation-large.png'
        }
      ],
      swiperOption: {
        direction: 'horizontal',
        effect: 'coverflow',
        speed: 1000,
        loop: true,
        slidesPerView: 3,
        spaceBetween: 24,
        autoplay: {
          delay: 1000, // 1秒切换一次
          disableOnInteraction: false,
          stopOnLast: false
        },
        observer: true,
        observeParents: true
      },
      isShowPoster: false, // 是否显示分享海报
      isShowRule: false, // 是否显示活动规则
      signInIconList: [
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false }
      ], // 签到图标表
      presentListType: 1, //  1- 好礼晒单 2-我的奖品
      sunPresentList: [
        {
          giftType: 1,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '满减券'
        },
        {
          giftType: 2,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '奖学金'
        },
        {
          giftType: 3,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '平衡车'
        },
        {
          giftType: 3,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '平衡车'
        },
        {
          giftType: 3,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '平衡车'
        }
      ], // 好礼晒单列表
      showSunPresentListMore: false,
      myPresentList: [
        {
          giftType: 1,
          presentName: '满减券',
          isGrandPrize: true
        },
        {
          giftType: 2,
          presentName: '奖学金'
        },
        {
          giftType: 2,
          presentName: '奖学金'
        },
        {
          giftType: 3,
          presentName: '平衡车',
          giftImg: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
        }
      ], // 好礼晒单列表
      showMyPresentListMore: false
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  async activated () {
  },
  async created () {
  },
  methods: {
    async init () {
      await getNewYearActivityDetail()
    },
    showPoster () {
      try {
        this.isShowPoster = true
      } catch (e) {
        throw e
      }
    },
    clickPrensentType (type) {
      this.presentListType = type
      this.showMyPresentListMore = false
      this.showSunPresentListMore = false
    }
  }
}
</script>

<style scoped lang="scss">
  .new-year-activity {
    width: 100vw;
    background-color: #c40e1a;
    padding-bottom: 60px;

    .activity-detail {
      min-height: 580px;
      background: url('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/575c43ec-15c3-47fe-be5f-948fc9d55d8c.png') top no-repeat;
      background-size: contain;

      .top {
        position: relative;
        padding-top: 160px;

        .one-swiper {
          position: absolute;
          top: 200px;
          left: 50%;
          transform: translateX(-50%);

          > img {
            width: 244px;
            object-fit: cover;
            cursor: pointer;
          }
        }

        .swiper {
          width: 80vw;
          position: absolute;
          top: 200px;
          left: 50%;
          transform: translateX(-50%);

          .swiper-no-swiping {
            .swiper-box {
              background-color: #EE4620;
              height: 250px;
              overflow: hidden;
              border-radius: 20px;

              > img {
                width: 240px;
                height: 170px;
                object-fit: cover;
              }

              > p {
                margin-top: 10px;
                text-align: center;

                span {
                  color: #FFF;
                  font-size: 24px;

                  &:last-child {
                    font-size: 20px;
                    color: #FFDCB3;
                  }
                }
              }
            }
          }
        }

        .show-poster {
          position: absolute;
          right: 0;
          top: 350px;
          width: 100px;
          height: 48px;
          line-height: 48px;
          border: 1px solid rgba(255, 227, 200, 1);
          background: linear-gradient(90deg, rgba(255, 152, 26, 1) 0%, rgba(238, 70, 32, 1) 100%);
          border-radius: 24px 0px 0px 24px;
          z-index: 1;
          letter-spacing: 2px;

          > svg {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            vertical-align: middle;
          }

          > span {
            display: inline-block;
            margin-left: 32px;
            font-size: 20px;
            color: #FFF;
          }
        }

        .show-rule {
          position: absolute;
          right: 0;
          top: 410px;
          width: 120px;
          height: 48px;
          line-height: 48px;
          border: 1px solid rgba(255, 227, 200, 1);
          background: linear-gradient(90deg, rgba(255, 152, 26, 1) 0%, rgba(238, 70, 32, 1) 100%);
          border-radius: 24px 0px 0px 24px;
          z-index: 1;
          font-size: 20px;
          color: #FFF;
          text-align: right;
          padding-right: 8px;
          letter-spacing: 2px;
        }
      }

      .bottom {
        position: relative;

        .count-down {
          margin-top: 320px;
          height: 140px;
          background: url('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8ea9af77-c778-4909-82ad-7424312dd48a.png') top no-repeat;
          background-size: cover;

          .desc {
            padding-top: 40px;
            text-align: center;
            line-height: 40px;

            > h3 {
              font-size: 28px;
              color: #620003;

              span {
                color: #FE461F;
              }
            }

            > div {
              font-size: 26px;
              color: #FE461F;

              span {
                text-align: center;
                display: inline-block;
                background-color: #FE461F;
                color: #FFF;
                margin: 0 2px;
                padding: 0 3px;
                min-width: 32px;
                height: 36px;
              }
            }
          }
        }

        .join-activity {
          margin: -2px 13px 0;
          min-height: 500px;
          background: #FFF;
          border-radius: 20px;
          border: rgba(254, 70, 31, 1) 28px solid;

          .control-top {
            padding: 30px 0;
            display: flex;
            justify-content: center;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

            button {
              height: 64px;
              width: 220px;
              line-height: 64px;
              font-size: 26px;
              color: rgba(255, 227, 200, 1);
              background: rgba(254, 70, 31, 1);
              border-radius: 10px;
              text-align: center;
            }

            > .desc-control {
              display: flex;
              flex-direction: row;
              justify-content: space-around;

              p {
                display: inline-block;
                padding-right: 150px;

                span {
                  display: block;
                  font-size: 26px;

                  &:last-child {
                    font-size: 22px;
                    color: #313131;
                    padding-top: 10px;
                  }
                }
              }
            }
          }

          .sign-in-icon-bottom {
            padding: 0 20px;

            .sign-in-icon-item {
              padding: 10px 0;
              display: inline-block;

              .icon-item {
                display: inline-block;

                .icon {
                  position: relative;
                  text-align: center;

                  img {
                    width: 80px;
                    object-fit: cover;

                    &.not-sign {
                      width: 70px;
                    }
                  }

                  span {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    color: #FFE3C8;
                    font-size: 28px;

                    &.not-sign {
                      color: #FFFFFF;
                    }
                  }
                }

                > p {
                  color: #F60000;
                  font-size: 24px;
                  line-height: 40px;
                }
              }

              .prensent-icon-item {
                display: inline-block;

                > div {
                  position: relative;
                  text-align: center;

                  > img {
                    width: 100px;
                    object-fit: cover;
                  }

                  > p {
                    color: #F60000;
                    font-size: 24px;
                    line-height: 40px;

                    &.not-sign {
                      color: #000;
                    }
                  }

                  > span {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background-color: #FD461F;
                    position: relative;
                    display: inline-block;

                    > svg {
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translateX(-50%) translateY(-50%);
                    }
                  }
                }
              }

              .underline {
                display: inline-block;
                width: 18px;
                border: 1px solid #FF8A8A;
                margin: 60px 6px;
              }
            }
          }
        }
      }
    }

    .present-list {
      min-height: 500px;
      padding-bottom: 20px;
      margin: 18px 13px 0;
      background-color: #FFFFFF;
      border-radius: 20px;

      .top {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;

        button {
          color: #787878;
          font-size: 32px;
          position: relative;

          .underline {
            display: none;
          }

          &.is-selected {
            color: #FE461F;

            span {
              position: relative;
              z-index: 1;
            }

            .underline {
              width: 100%;
              position: absolute;
              bottom: 4px;
              z-index: 0;
              display: block;
              border-bottom: #FFDC34 solid 10px;
            }
          }
        }

        .divider-line {
          margin: 0 100px;
          display: inline-block;
          width: 0px;
          height: 34px;
          border: 2px solid rgba(201, 201, 201, 1);
        }
      }

      .bottom {
        text-align: center;

        .statistics {
          margin: 0 150px;
          height: 54px;
          line-height: 54px;
          background: rgba(255, 227, 200, 1);
          border-radius: 34px;
          font-size: 26px;
          color: rgba(98, 0, 3, 1);

          span {
            color: #FA4D2F;
          }
        }

        .no-sun-present {
          margin-top: 40px;
          text-align: center;

          > img {
            width: 200px;
          }
        }

        .sun-present-item {
          display: flex;
          align-items: center;
          margin: 15px 30px;
          border-bottom:1px solid #C9C9C9;
          padding-bottom: 15px;

          > img {
            width: 80px;
            object-fit: contain;

            &.avatar {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              margin-left: 30px;
              object-fit: cover;
            }
          }

          h3 {
            text-align: left;
            margin-left: 25px;
            font-size: 26px;
            line-height: 40px;
            color: #333;
            font-weight: 400;

            p:last-child {
              font-size:24px;
              color:#999;
            }

            .orange {
              color: #FA4D2F;
            }
          }
        }

        .my-present-item {
          display: flex;
          align-items: center;
          margin: 15px 30px;
          border-bottom:1px solid #C9C9C9;
          padding-left: 20px;
          padding-bottom: 15px;
          > span {
            position: relative;
            img {
              width: 80px;
              object-fit: cover;
            }
            i {
              display: none;
            }
            .grand-prize {
              padding: 0 8px;
              display: block;
              position: absolute;
              top: 0;
              left: 50%;
              background:#FEC252;
              border-radius:20px;
              height:30px;
              line-height: 30px;
              width:80px;
              font-size:20px;
              color:#FE4923;
            }
          }
          h3 {
            text-align: left;
            font-size:26px;
            font-weight:400;
            line-height:40px;
            color:#333;
            margin-left: 70px;

            p:last-child {
              font-size:24px;
              color:#999;
            }

            .orange {
              color: #FA4D2F;
            }
          }
        }
        .more {
          font-size:26px;
          line-height:35px;
          color:#333;
        }
      }
    }

    .rule-content {
      padding: 0 40px 20px;

      h3 {
        font-size: 32px;
      }

      p {
        margin-bottom: 40px;
        font-size: 28px;
      }

      span {
        display: block;
        font-size: 28px;
      }
    }
  }
</style>
