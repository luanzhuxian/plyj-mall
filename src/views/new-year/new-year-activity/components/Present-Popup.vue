<template>
  <div v-if="show">
    <div class="bg-gray">
      <transition name="fade">
        <!-- 中阶梯奖品弹框 -->
        <template class="bg-gray" v-if="!isLastIcon && presentStage === 1">
          <div class="present-box">
            <div class="top">
              恭喜您积攒{{ activeDetail.signedInNumber }}个年味
              <p class="has-underline">获得{{ awardTypeDesc[currentPresentDetail.awardType] }}</p>
            </div>
            <div class="detail">
              <div class="product" v-if="currentPresentDetail.awardType === 1">
                <img :src="currentPresentDetail.awardImg">
                <div class="product-detail">
                  <h3>{{ currentPresentDetail.awardName }}</h3>
                  <h4>有效期：{{ currentPresentDetail.formatStartTime }}-{{ currentPresentDetail.formatEndTime }}</h4>
                </div>
              </div>
              <div class="scholarship" v-if="currentPresentDetail.awardType === 2">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f3f449e6-43f1-4ddc-a68b-9a0a536a88e5.png">
                <span>{{ currentPresentDetail.awardName }}</span>
              </div>
              <div class="coupon" v-if="currentPresentDetail.awardType === 3 || currentPresentDetail.awardType === 4">
                <img v-if="currentPresentDetail.awardType === 4" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/category-coupon.png">
                <img v-else src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/full-coupon.png">
                <div class="wrap">
                  <div class="left">
                    <div class="coupon-price">
                      {{ currentPresentDetail.price }}
                    </div>
                    <div class="desc">
                      <p>{{ currentPresentDetail.awardName }}</p>
                      <p>{{ awardTypeDesc[currentPresentDetail.awardType] }}</p>
                    </div>
                    <p class="expiration">有效期 {{ currentPresentDetail.formatStartTime }}-{{ currentPresentDetail.formatEndTime }}</p>
                  </div>
                  <div class="right">
                    立即<br>领取
                  </div>
                </div>
              </div>
            </div>
            <div class="info">
              <p>{{ awardTypeDesc[currentPresentDetail.awardType] }}已经自动存入您的{{ awardPackage[currentPresentDetail.awardType] }}</p>
              <p>您可在{{ awardPackage[currentPresentDetail.awardType] }}中查看</p>
            </div>
            <div class="footer">
              <button class="accept" @click="close">开心收下</button>
            </div>
          </div>
          <div class="close">
            <pl-svg name="icon-close3" fill="#fff" width="40" @click="close" />
          </div>
        </template>
        <!-- 错过阶梯奖品弹框 -->
        <template class="bg-gray" v-if="!isLastIcon && presentStage === 2">
          <div class="present-box">
            <div class="top">
              很遗憾 您与奖品擦肩而过
              <p>新年喜临门 感谢您的参与</p>
            </div>
            <div class="detail">
              <div class="no-present">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/974d057c-214a-4e44-90b6-26ed88e28fac.png">
              </div>
            </div>
            <div class="info">
              <p>您再获得{{ activeDetail.nextPresentIndex - activeDetail.signedInNumber }}个年味即可参与抽奖</p>
            </div>
            <div class="footer">
              <button class="iKnow" @click="close">朕知道了</button>
            </div>
          </div>
          <div class="close">
            <pl-svg name="icon-close3" fill="#fff" width="40" @click="close" />
          </div>
        </template>
        <!-- 中年味大奖前提示 -->
        <template class="bg-gray" v-if="isLastIcon && presentStage === 0">
          <div class="grand-present-tip-box">
            <div class="top">
              <p>恭喜你已集齐我心中的年味</p>
              <p>请抽出我心中的年味大礼</p>
            </div>
            <div class="detail">
              <img class="gift" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/ac9e7b86-69d4-4356-9ba7-c233e711056d.png">
              <img class="light" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/1565326e-6f2a-42f7-9303-c8ad3221f92b.png">
            </div>
            <div class="footer">
              <button @click="close(true)">立即抽奖</button>
            </div>
          </div>
          <div class="close small">
            <pl-svg name="icon-close3" fill="#fff" width="40" @click="close" />
          </div>
        </template>
        <!-- 中年味大奖弹框 -->
        <template class="bg-gray" v-if="isLastIcon && presentStage === 1">
          <div class="grand-present-box">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/6d5c54f0-e972-4fd2-b28b-021a12c78e39.png">
            <div class="top">恭喜你获得年味大礼</div>
            <div class="bottom">
              <div class="detail">
                <img :src="currentPresentDetail.awardImg">
                <h3>{{ currentPresentDetail.awardName }}</h3>
                <p>有效期：{{ currentPresentDetail.formatStartTime }}-{{ currentPresentDetail.formatEndTime }}</p>
              </div>
              <div class="footer">
                <button @click="close">开心收下</button>
              </div>
            </div>
          </div>
          <div class="close">
            <pl-svg name="icon-close3" fill="#fff" width="40" @click="close" />
          </div>
        </template>
        <!-- 错过年味大奖弹框 -->
        <template class="bg-gray" v-if="isLastIcon && presentStage === 2">
          <div class="present-box">
            <div class="top">
              很遗憾 您与奖品擦肩而过
              <p>新年喜临门 感谢您的参与</p>
            </div>
            <div class="detail">
              <div class="no-present">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/974d057c-214a-4e44-90b6-26ed88e28fac.png">
              </div>
            </div>
            <div class="footer">
              <div class="btns">
                <button class="iKnow" @click="close">朕知道了</button>
                <button @click="backMainActivityCenter">返回主会场</button>
              </div>
            </div>
          </div>
          <div class="close">
            <pl-svg name="icon-close3" fill="#fff" width="40" @click="close" />
          </div>
        </template>
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
    },
    isLastIcon: { // 是否为最终大奖
      type: Boolean,
      default: false
    },
    presentStage: { // 显示奖品弹框类型
      type: Number,
      default: 1
    },
    activeDetail: {
      type: Object,
      default () {
        return {}
      }
    },
    currentPresentDetail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      awardTypeDesc: {
        '1': '礼品',
        '2': '奖学金',
        '3': '全场满减券',
        '4': '品类券'
      },
      awardPackage: {
        '1': '我的礼品',
        '2': '我的奖学金',
        '3': '我的卡券',
        '4': '我的卡券'
      }
    }
  },
  methods: {
    close (hasOtherOption) {
      this.$emit('update:show', false)
      if (hasOtherOption === true) this.$emit('close')
    },
    backMainActivityCenter () {
      this.$router.replace({ name: 'Activity' })
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
    background: rgba(0, 0, 0, 0.65);

   /* 关闭按钮 */
    .close {
      margin-top: 920px;
      text-align: center;
      &.small {
        margin-top: 250px;
      }
    }
  }

  /* 中奖弹框样式 */
  .present-box {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #FFF;
    width: 540px;
    padding-bottom: 20px;
    border-radius: 10px;

    .top {
      padding-top: 60px;
      height: 170px;
      text-align: center;
      background: url("https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/29b608e1-4954-4676-aa03-7f4c322d52c9.png") center top no-repeat;
      background-size: cover;
      font-size: 40px;
      color: #FFDCB3;

      p {
        position: relative;
        padding-top: 10px;
        font-size: 30px;
        line-height: 40px;

        &.has-underline {
          &:after, &:before {
            position: absolute;
            top: 50%;
            transform: translateY(-30%);
            content: '';
            width: 74px;
            height: 0px;
            border: 1px solid #FFDCB3;
          }

          &:before {
            left: 100px;
          }

          &:after {
            right: 100px;
          }
        }
      }
    }

    .detail {
      margin: 20px 0;

      /* 优惠券样式 */
      .coupon {
        padding: 0 20px;
        position: relative;

        img {
          width: 500px;
        }

        .wrap {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;

          .left {
            padding: 34px 0 0 50px;

            .coupon-price {
              display: inline-block;
              font-size: 55px;
              color: #ED2E50;

              &:before {
                content: '￥';
                font-size: 17px;
                transform: translateX(-10px);
              }
            }

            .desc {
              display: inline-block;
              margin-left: 30px;
            }

            .expiration {
              margin-top: 10px;
            }
          }

          .right {
            font-size: 24px;
            line-height: 28px;
            color: #FFF;
            position: absolute;
            right: 70px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      /* 礼品样式 */
      .product {
        margin: 0 15px;
        display: flex;
        box-sizing: border-box;
        border: 1px solid #F01516;

        img {
          width: 180px;
          height: 120px;
          object-fit: cover;
          vertical-align: middle;
        }

        .product-detail {
          padding: 12px 0 0 10px;
          height: 120px;
          box-sizing: border-box;
          flex: 1;
          background-color: #FFE9E9;

          h3 {
            font-size: 32px;
            color: #373737;
            font-weight: 400;
            width: 240px;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 20px;
          }

          h4 {
            font-size: 20px;
            font-weight: 400;
            color: #373737;
            margin: 10px 0;
          }
        }
      }

      /* 奖学金样式 */
      .scholarship {
        text-align: center;
        position: relative;

        span {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          color: #FFDCB3;
        }
      }

      /* 错过奖品 */
      .no-present {
        text-align: center;

        img {
          width: 170px;
        }
      }
    }

    .info {
      text-align: center;
      font-size: 20px;
      line-height: 26px;
      color: #A8A8A8;
      padding-bottom: 20px;
    }

    .footer {
      border-top: 1px solid #E7E7E7;
      padding-top: 20px;
      text-align: center;
      font-size: 30px;
      text-align: center;

      .accept {
        width: 326px;
        height: 52px;
        background: linear-gradient(180deg, #F5651A 0%, #F01B15 100%);
        box-shadow: 0px 3px 6px #F01C15;
        border-radius: 50px;
        line-height: 52px;
        color: #FFDCB3;
      }

      .iKnow {
        color: #F01516;
      }

      .btns {
        font-size: 30px;
        color: #A8A8A8;
        display: flex;

        button {
          flex: 1;
          position: relative;
        }

        .iKnow:after {
          position: absolute;
          right: 0;
          top: -7px;
          content: '';
          width: 0px;
          height: 57px;
          border: 1px solid #E7E7E7;
        }
      }
    }
  }

  /* 中年味大奖开奖前 */
  .grand-present-tip-box {
    position: fixed;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    background-color: transparent;
    position: relative;
    text-align: center;

    .top {
      font-size: 40px;
      line-height: 56px;
      color: #FFDCB3;
    }

    .detail {
      .gift {
        margin-left: 30px;
      }

      .light {
        position: absolute;
        left: 50%;
        margin-left: -35%;
        top: 20px;
        z-index: -1;
        animation: rotateAndScale 3s linear infinite;
      }
    }

    .footer {
      padding-top: 60px;
      text-align: center;

      button {
        width: 326px;
        height: 52px;
        background: linear-gradient(180deg, #F5651A 0%, #F01B15 100%);
        box-shadow: 0px 3px 6px #F01C15;
        border-radius: 50px;
        font-size: 30px;
        line-height: 52px;
        color: #FFDCB3;
      }
    }
  }

  /* 中年味大奖 */
  .grand-present-box {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);

    > img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -120px;
      z-index: -1;
    }

    .top {
      background-color: #FFF;
      width: 400px;
      height: 70px;
      line-height: 70px;
      margin: 0 auto;
      border-radius:20px 20px 0 0;
      text-align: center;
      font-size:30px;
      color:#F01516;
    }

    .bottom {
      background:#FFF;
      box-shadow:0px 3px 5px #FF0000;
      border-radius:42px;
      padding: 10px 10px 20px 10px;
      width: 500px;
      .detail {
        text-align: center;
        border-radius:30px;
        padding: 60px 0;
        background: #F01516 url("https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/83e5925d-2d8a-4dd8-b009-755f3b2823d1.png") bottom no-repeat;
        background-size: contain;
        > img{
          width: 260px;
          height: 150px;
          object-fit: cover;
        }
        h3 {
          padding-top: 20px;
          margin: 0 auto;
          color: #FFF;
          font-weight: 400;
          width: 400px;
          overflow: hidden;
          word-break: keep-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size:30px;
          line-height:40px;
        }
        h4 {
          padding: 10px 0;
          font-size:20px;
          font-weight:400;
          line-height:26px;
          color:#FFDCB3;
        }
        p {
          font-size:20px;
          color:#FFF;
        }
      }

      .footer {
        padding-top: 30px;
        text-align: center;

        button {
          width: 326px;
          height: 52px;
          background: linear-gradient(180deg, #F5651A 0%, #F01B15 100%);
          box-shadow: 0px 3px 6px #F01C15;
          border-radius: 50px;
          font-size: 30px;
          line-height: 52px;
          color: #FFDCB3;
        }
      }
    }
  }

</style>
