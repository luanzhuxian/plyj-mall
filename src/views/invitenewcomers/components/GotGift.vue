<template>
  <div class="got-gift">
    <overlay>
      <div class="center-box">
        <div class="got-success" v-if="success">
          <div class="title">恭喜您获得</div>
          <div class="gift-box">
            <div class="coupon" v-if="type === 'coupon'">
              <div class="coupon-inner">
                <div class="sub-ticket">
                  <span class="desc">满减券</span>
                  <!-- <pl-icon type="svg" name="icon-right" color="white" width="14" height="14" /> -->
                </div>
                <div class="content-box">
                  <div class="coupon-info">
                    <!-- <span class="ticket-label">满减券</span> -->
                    <span class="denomination">
                      {{ couponInfo.amount }}
                      <span class="yuan">元</span>
                    </span>
                    <span style="position:relative; left: -20px">
                      <span class="coupon-desc">满{{ couponInfo.activityLimit }}减{{ couponInfo.amount }}</span><br>
                      <span class="coupon-name">{{ couponInfo.couponName }}</span>
                    </span>
                  </div>
                  <div>
                    <span class="valid-date">有效期：{{ couponValidDate }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="gift" v-if="type === 'gift'">
              <div class="gift-img">
                <img :src="giftInfo.giftImage">
              </div>
              <div class="gift-info">
                <p class="gift-title">
                  {{ giftInfo.giftName }}
                </p>
                <p class="type">
                  砍价活动礼品兑换券
                </p>
                <p class="valid-date">
                  有效期：{{ giftValidDate }}
                </p>
              </div>
              <!-- <div class="btn-use-gift">
                立即兑换
              </div> -->
            </div>
          </div>
          <p class="description" v-if="type === 'coupon'">
            满减券已自动存入我的卡券中<br>
            您可在我的卡券中查看
          </p>
          <p class="description" v-if="type === 'gift'">
            奖品已自动存入我的礼品中<br>
            您可在我的礼品中查看
          </p>
          <div style="text-align: center">
            <div class="btn-do" @click="getMore()">
              继续开豪礼
            </div>
          </div>
        </div>
        <div class="got-success" v-else>
          <div class="title">很遗憾未中奖</div>
          <p class="description">
            奖品已派送完<br>
            感谢您参与活动
          </p>
          <div class="fail-btn-group">
            <div class="btn-backhome" @click="$router.push({ name: 'Activity' })">
              返回主会场
            </div>
            <div class="btn-iknown" @click="close">
              朕知道了
            </div>
          </div>
        </div>
        <div style="text-align: center;">
          <span class="btn-close" @click="close">
            <pl-icon type="icon" name="icon-close" color="white" />
          </span>
        </div>
      </div>
    </overlay>
  </div>
</template>

<script>
import moment from 'moment'
import Overlay from './Overlay'

const TIME_FMT = 'YYYY.MM.DD'

export default {
  name: 'GotGift',
  components: {
    Overlay
  },
  props: {
    type: {
      type: String,
      default: 'coupon'
    },
    success: {
      type: Boolean,
      default: false
    },
    couponInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    giftInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    validDate: {
      type: String,
      default: '2020.01.01-2021.01.01'
    }
  },

  computed: {
    couponValidDate () {
      return `${moment(this.couponInfo.useStartTime).format(TIME_FMT)}-${moment(this.couponInfo.useEndTime).format(TIME_FMT)}`
    },
    giftValidDate () {
      return `${moment(this.giftInfo.useStartTime).format(TIME_FMT)}-${moment(this.giftInfo.useEndTime).format(TIME_FMT)}`
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },

    getMore () {
      this.$emit('more')
    }
  }
}
</script>

<style lang="scss" scoped>
.got-gift {
  height: 644px;
  border-radius: 20px;

  .center-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .got-success {
      width: 506px;
      padding-top: 40px;
      margin-bottom: 64px;
      background-image: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/got-success@2x.png");
      background-color: rgba(250,77,47,1);
      background-repeat: no-repeat;
      background-size: 100%;
      border-radius: 20px;

      .title {
        color: white;
        margin-bottom: 20px;
        font-size: 60px;
        text-align: center;
        font-family: HYLingXinJ;
      }

      .description {
        margin-bottom: 40px;
        font-size: 20px;
        color: white;
        text-align: center;
      }

      .gift-box {
        margin-bottom: 20px;
        .coupon {
          width: 100%;
          height: 204px;
          margin: 0 auto;
          background-image: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/coupon-bg.png");
          background-size: 100% 100%;

          .coupon-inner {
            position: relative;
            width: 474px;
            height: 166px;
            margin: auto;
            padding-top: 10px;

            .sub-ticket {
              position: absolute;
              top: 0;
              right: 0;
              width:102px;
              height:166px;
              line-height: 166px;
              color: white;
              text-align: center;

              .desc {
                display: inline-block;
                width: 26px;
                height: 94px;
                font-size: 26px;
                font-weight: bold;
                line-height: 36px;
                color: white;
                text-shadow: 0px 1px 1px rgba(0,0,0,0.30);
                opacity: 0.9;
                vertical-align: middle;
              }
            }

            .content-box {
              position: relative;
              z-index: 1;
              height: 128px;
              padding-left: 16px;
              padding-top: 22px;

              .ticket-label {
                display: inline-block;
                margin-right: 4px;
                width: 26px;
                height: 68px;
                background:rgba(236,131,120,1);
                border-radius: 4px;
                color: white;
                font-size: 18px;
                text-align: center;
              }

              .denomination {
                display: inline-block;
                font-size: 72px;
                font-weight: bold;
                color: #d8574b;

                .yuan {
                  position: relative;
                  left: -40px;
                  display: inline-block;
                  width: 30px;
                  height: 30px;
                  line-height: 30px;
                  background-color: #d8574b;
                  border: 1px solid white;
                  color:white;
                  font-size: 18px;
                  font-weight: bold;
                  text-align: center;
                  border-radius: 50%;
                }
              }

              .coupon-info {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 6px;
              }

              .coupon-desc {
                font-size: 25px;
                font-weight: bold;
              }

              .coupon-name {
                font-size: 20px;
              }

              .valid-date {
                margin-right: 84px;
                font-size: 20px;
                color: white;
              }
            }
          }
        }

        .gift {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 474px;
          height: 96px;
          margin: 0 auto;
          background-image: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/gift-bg.png");
          background-size: 100%;

          .gift-img {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 160px;
            height: 96px;

            img {
              width: 126px;
              height: 84px;
            }
          }

          .gift-info {
            width: 218px;

            .gift-title {
              margin-left: 18px;
              margin-bottom: 2px;
              color: #333;
              font-size: 18px;
              font-weight: bold;
            }

            .type {
              margin-left: 18px;
              color: #e1622d;
              font-size: 16px;
              margin-bottom: 8px;
            }

            .valid-date {
              margin-left: 18px;
              color: #999;
              font-size: 14px;
            }
          }

          .btn-use-gift {
            width:92px;
            height:34px;
            line-height: 34px;
            background:rgba(235,92,32,1);
            border-radius:30px;
            font-size: 14px;
            font-weight: bold;
            color: #ffe7cc;
            text-align: center;
          }
        }
      }

      .btn-do {
        display: inline-block;
        width: 346px;
        height: 74px;
        line-height: 74px;
        margin-bottom: 48px;
        background: rgba(254,205,76,1);
        border: 2px solid rgba(255,224,157,1);
        border-radius: 276px;
        color: #a56113;
        font-size: 26px;
      }

      .fail-btn-group {
        text-align: center;
        padding-bottom: 40px;
      }
      .btn-backhome {
        width: 346px;
        height: 74px;
        line-height: 74px;
        margin: 16px auto;
        background: rgba(254,205,76,1);
        border: 1px solid rgba(255,224,157,1);
        border-radius: 276px;
        font-size: 26px;
        font-weight: bold;
        color: #a56113;
      }

      .btn-iknown {
        width: 346px;
        height: 74px;
        line-height: 74px;
        margin: 0 auto;
        background: rgba(253,123,99,1);
        border: 1px solid rgba(253,157,140,1);
        border-radius: 276px;
        font-size: 26px;
        font-weight: bold;
        color: white;
      }
    }
  }

  .btn-close {
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    border: 1px solid white;
    border-radius: 50%;
  }
}
</style>
