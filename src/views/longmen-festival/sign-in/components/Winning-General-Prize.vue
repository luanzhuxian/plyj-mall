<template>
    <div v-if="show">
        <div class="bg-gray">
            <transition name="fade">
                <div class="present-box">
                    <div class="top">
                        恭喜您签到参与{{ signedInNumber }}个端午活动
                        <p class="has-underline">获得{{ awardTypeDesc[awardType] }}</p>
                    </div>
                    <div class="detail">
                        <div class="product" v-if="awardType === 1">
                            <img :src="awardImg">
                            <div class="product-detail">
                                <h3>{{ awardName }}</h3>
                                <h4>
                                    有效期：{{ startTime | dateFormat('YYYY.MM.DD') }}-{{ endTime | dateFormat('YYYY.MM.DD') }}
                                </h4>
                            </div>
                        </div>
                        <div class="scholarship" v-if="awardType === 2">
                            <img
                                src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f3f449e6-43f1-4ddc-a68b-9a0a536a88e5.png">
                            <span>{{ scholarshipAmount }}</span>
                        </div>
                        <div class="coupon" v-if="awardType === 3 || awardType === 4">
                            <img :src="awardType === 4? 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/category-coupon.png' : 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/full-coupon.png'">
                            <div class="wrap">
                                <div class="left">
                                    <div class="coupon-price">
                                        {{ amount }}
                                    </div>
                                    <div class="desc">
                                        <p>{{ couponName }}</p>
                                        <p>{{ awardTypeDesc[awardType] }}</p>
                                    </div>
                                    <p class="expiration">
                                        有效期 {{ startTime | dateFormat('YYYY.MM.DD') }}-{{ endTime | dateFormat('YYYY.MM.DD') }}
                                    </p>
                                </div>
                                <div class="right">
                                    立即<br>领取
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="info">
                        <p>
                            {{ awardTypeDesc[awardType] }}
                            已经自动存入您的
                            “{{ awardPackage[awardType] }}”
                        </p>
                        <p>您可在“{{ awardPackage[awardType] }}”中查看</p>
                    </div>
                    <div class="footer">
                        <button class="accept" @click="close">开心收下</button>
                    </div>
                </div>
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
        // 签到个数
        signedInNumber: {
            type: [Number, String],
            default: 0
        },
        // 奖品类型 1-奖品 2-奖学金 3-全场满减券 4-品类券
        awardType: {
            type: Number,
            default: 1
        },
        // 若为奖品 图片
        awardImg: {
            type: String,
            default: ''
        },
        // 若为奖品 名称
        awardName: {
            type: String,
            default: ''
        },
        // 若为奖品/优惠券 有效期开始时间
        startTime: {
            type: String,
            default: ''
        },
        // 若为奖品/优惠券 有效期结束时间
        endTime: {
            type: String,
            default: ''
        },
        // 若为奖学金，奖学金金额
        scholarshipAmount: {
            type: [Number, String],
            default: 0
        },
        // 若为优惠券，优惠券金额
        amount: {
            type: [Number, String],
            default: 0
        },
        // 若为优惠券，优惠券名称
        couponName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            awardTypeDesc: {
                1: '礼品',
                2: '奖学金',
                3: '全场满减券',
                4: '品类券'
            },
            awardPackage: {
                1: '我的礼品',
                2: '我的奖学金',
                3: '我的卡券',
                4: '我的卡券'
            }
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

  .present-box {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    width: 540px;
    padding-bottom: 20px;
    border-radius: 10px;
  }

  .top {
    padding-top: 60px;
    height: 170px;
    text-align: center;
    background: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/gift-head.png') center top no-repeat;
    background-size: cover;
    font-size: 40px;
    color: #ffdcb3;

    p {
      position: relative;
      padding-top: 10px;
      font-size: 30px;
      line-height: 40px;

      &.has-underline {
        &:after,
        &:before {
          position: absolute;
          top: 50%;
          transform: translateY(-30%);
          content: '';
          width: 74px;
          height: 0;
          border: 1px solid #ffdcb3;
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
      overflow: hidden;

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
            color: #ed2e50;

            &:before {
              content: '￥';
              font-size: 17px;
              transform: translateX(-10px);
            }
          }

          .desc {
            display: inline-block;
            margin-left: 10px;
            font-size: 20px;
          }

          .expiration {
            margin-top: 10px;
          }
        }

        .right {
          font-size: 24px;
          line-height: 28px;
          color: #fff;
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
      border: 1px solid #FCE6D3;

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
        background-color: #FCE6D3;

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
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        margin-left: -4px;
        font-size: 24px;
        color: #ffdcb3;
      }
    }
  }

  .info {
    text-align: center;
    font-size: 20px;
    line-height: 26px;
    color: #a8a8a8;
    padding-bottom: 20px;
  }

  .footer {
    border-top: 1px solid #e7e7e7;
    padding-top: 20px;
    text-align: center;
    font-size: 30px;
    text-align: center;

    .accept {
      width: 326px;
      height: 52px;
      background: #FF9F4B;
      border-radius: 50px;
      line-height: 52px;
      color: #FFF;
    }
  }

</style>
