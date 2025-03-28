<template>
    <div
        :class="[$style.couponItem, status ? $style.unavailable : '']"
        :style="{ '--backgroundImage': `url(${ bg[couponType] })` }"
    >
        <!-- 根据优惠券类型显示图片，2-品类券 1-满减券 -->
        <div :class="$style.main">
            <div :class="$style.couponItemLeft">
                <div :class="$style.leftTop">
                    <div :class="[$style.couponPrice, String(amount).length > 3 ? $style.middle: '', String(amount).length > 3 > 4 ? $style.large: '']">
                        <span :class="$style.prefix">{{ couponType === 3 ? '抵' : '￥' }}</span>
                        <span v-text="amount" />
                    </div>
                    <div :class="[$style.couponDesc, amount > 999 ? $style.middle: '']">
                        <div v-if="couponType === 3">满{{ full }}可用</div>
                        <div v-else>满{{ full }}减 {{ amount }}</div>
                        <div v-text="name" />
                    </div>
                </div>
                <div :class="$style.lifeTime">
                    <div>有效期：<i>{{ useStartTime | dateFormat('YYYY-MM-DD') }}~{{ useEndTime | dateFormat('YYYY-MM-DD') }}</i></div>
                    <!-- 使用说明 -->
                    <div
                        v-show="instruction"
                        @click="showInstruction = !showInstruction"
                        :style="{ '--bgc': couponType === 1 ? '#e7294b' : couponType === 2 ? '#fab10d' : '#ef3d04' }"
                        :class="[$style.instructionBtn]"
                    >
                        <span>使用说明</span>
                        <pl-svg
                            :class="{ [$style.showInstruction]: showInstruction }"
                            name="icon-arrow-down"
                            fill="#FFF"
                            width="16"
                        />
                    </div>
                </div>
            </div>
            <div :class="$style.couponItemRight"
                 v-if="isShowReceive"
                 @click.stop="couponClick"
            >
                <div :class="$style.price" v-if="isPriceShow"> ￥{{ price / 100 }}</div>
                <div :class="$style.ctrl">
                    <!-- 根据是否可以去使用，目前只有我的卡券+提交订单显示'去使用'， 其他显示'立即领取' -->
                    <!-- 应当是能够显示立即领取的地方，都可能达到领取上限 -->
                    <div v-if="canReceive && !isAvailableStatus" :class="$style.rightText">
                        <span>立即</span>
                        <span>领取</span>
                    </div>
                    <div :class="[$style.overMax, $style.rightText]" v-if="!canReceive && !isAvailableStatus">
                        <span>已达到</span>
                        <span>领用上限</span>
                    </div>
                    <div v-if="isAvailableStatus" :class="$style.rightText">
                        <span>去</span>
                        <span>使</span>
                        <span>用</span>
                    </div>
                    <pl-svg v-if="!isPriceShow && (isAvailableStatus || (!isAvailableStatus && canReceive))" name="icon-right" fill="#fff" width="22" />
                </div>
            </div>
        </div>
        <!-- 使用说明 -->
        <transition name="fade">
            <div v-if="instruction && showInstruction" :class="$style.instruction" v-text="instruction" />
        </transition>
        <!-- 不可使用的状态，文字描述 -->
        <div :class="$style.unavailableDesc" v-if="status" v-text="status" />
        <div v-if="isClaimed" :class="$style.claimed">
            <img src="https://mallcdn.youpenglai.com/static/mall/icons/olds/claimed.png" :style="{ width: 200 / 7.5 + 'vw' }" alt="">
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { requestPayData, pay, submitOrder, cancleOrderListByBatchNumber } from '../../../assets/js/wechat/submit-order'
import { receiveCoupon, receiveCouponForLive } from '../../../apis/my-coupon'
export default {
    name: 'CouponItem',
    props: {
        status: {
            type: String,
            default: ''
        },
        // 优惠券本身的Id
        couponId: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },

        // 优惠总金额
        amount: {
            type: Number,
            default: 1
        },

        // 满多少
        full: {
            type: Number,
            default: 1
        },

        // 说明
        instruction: {
            type: String,
            default: ''
        },
        useStartTime: {
            type: String,
            default: ''
        },
        useEndTime: {
            type: String,
            default: ''
        },

        // 是否使用
        isAvailableStatus: Boolean,

        // 领取次数
        receiveCount: {
            type: Number,
            default: 0
        },

        // 优惠券类型 1：满减券 2：品类券 3: 福利红包
        couponType: {
            type: Number,
            default: 1
        },
        // 是否可领取
        canReceive: {
            type: Boolean,
            default: true
        },
        // 是否显示立即领取
        isShowReceive: {
            type: Boolean,
            default: true
        },

        // 福利红包价格
        price: {
            type: Number,
            default: 0
        },
        // 其它活动id
        activityId: {
            type: String,
            default: ''
        },
        // 福利红包活动id
        redPacketActivityId: {
            type: String,
            default: ''
        },
        // 福利红包是否在当前页面直接购买，不用跳转到活动详情页面
        directPay: Boolean,
        // 领取环境: live 直播间
        source: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            bg: [
                null,
                'https://mallcdn.youpenglai.com/static/mall/2.0.0/full-coupon.png',
                'https://mallcdn.youpenglai.com/static/mall/2.0.0/category-coupon.png',
                'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-package-bg.png'
            ],
            showInstruction: false,
            // 是否已领取
            isClaimed: false,
            loading: false
        }
    },
    computed: {
        ...mapGetters(['userId', 'userName', 'mobile']),
        // 福利红包价格展示
        isPriceShow () {
            return this.couponType === 3 && this.price
        }
    },
    deactivated () {
        this.showInstruction = false
    },
    methods: {
        async couponClick (e) {
            if (!this.userId) {
                this.$confirm('请先绑定手机')
                    .then(() => {
                        const {
                            name,
                            params,
                            query
                        } = this.$route
                        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                            name,
                            params,
                            query
                        }))
                        this.$router.push({
                            name: 'BindMobile'
                        })
                    })
                return
            }
            if (this.loading) return
            try {
                this.loading = true
                // 福利红包
                if (this.couponType === 3) {
                    await this.redpacket()
                } else {
                    await this.coupon()
                }
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },
        // 优惠券处理逻辑
        async coupon () {
            if (this.status) return
            if (this.isAvailableStatus) {
                // 去使用
                await this.$router.push({
                    name: 'CouponActivity',
                    params: { couponId: this.couponId }
                })
            } else if (this.canReceive) {
                // 去领取
                if (this.source === 'live') {
                    await receiveCouponForLive({
                        couponId: this.couponId,
                        activityId: this.activityId,
                        entityClassName: 'MallLiveActivityEntity'
                    })
                } else {
                    await receiveCoupon({ couponId: this.couponId })
                }
                this.$emit('received')
                this.$success('领取成功，请在我的卡券中查看')
                this.isClaimed = true
            }
            this.$emit('couponClick', this.$props)
        },
        // 福利红包处理逻辑
        async redpacket () {
            if (this.status) return
            // 0元优惠券，或者标记了可直接下单的，可以直接下单领取，其它情况跳转至活动详情页面领取
            if ((!this.price || this.directPay) && this.canReceive && !this.isAvailableStatus) {
                let orderBatchNumber = ''
                try {
                    const { result } = await submitOrder({
                        source: 9,
                        activityId: this.redPacketActivityId,
                        helper: this.userId,
                        userAddress: {
                            mobile: this.mobile,
                            name: this.userName
                        },
                        skus: [
                            {
                                goodsId: this.redPacketActivityId,
                                goodsType: 'RED_ENVELOPE',
                                sku1: this.redPacketActivityId,
                                count: 1
                            }
                        ]
                    })
                    orderBatchNumber = result
                    const payData = await requestPayData(orderBatchNumber)
                    // const { payData, orderBatchNumber } = await submitRedPackageOrder(this.redPacketActivityId, 1)
                    if (payData.appId) {
                        await pay(payData)
                    } else if (!this.price) {
                        this.$emit('received')
                        this.$success('领取成功，请在我的卡券中查看')
                        this.isClaimed = true
                    } else {
                        throw new Error('支付失败')
                    }
                } catch (e) {
                    if (orderBatchNumber) cancleOrderListByBatchNumber(orderBatchNumber)
                    throw e
                }
                return
            }
            this.$router.push({
                name: 'RedPackageDetail',
                params: { activityId: this.redPacketActivityId }
            })
        }
    }
}
</script>

<style module lang="scss">
  /* 将整个优惠券灰化，暂时不这样做了 */
  .unavailable {
    filter: grayscale(100%);
  }
  .coupon-item {
      position: relative;
      width: 100%;
      margin-bottom: 32px;
      overflow: hidden;
      > .main {
          width: 100%;
          display: flex;
          box-sizing: border-box;
          overflow: hidden;
          height: 222px;
          background: var(--backgroundImage) no-repeat center center;
          background-size: 100% 222px;
      }
  }
  .coupon-item-left {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 48px 0 24px 32px;
  }
  .left-top {
    display: flex;
    align-items: center;
  }
  .coupon-price {
    margin-left: 80px;
    line-height: 50px;
    font-size: 70px;
    color: #ED2E50;

    &.middle {
      font-size: 50px;
      line-height: 50px;
    }

    &.large {
      font-size: 40px;
      line-height: 40px;
    }

    > .prefix {
      display: inline-block;
      box-sizing: border-box;
      color: #ED2E50;
      line-height: 32px;
      text-align: center;
      font-size: 26px;
      transform: translate(-10px, -5px);
    }
  }
  .coupon-desc {
    margin-left: 20px;
    > div {
      &:nth-of-type(1) {
        font-size: 28px;
        font-weight: bold;
        line-height: 38px;
      }
      &:nth-of-type(2) {
        font-size: 22px;
        line-height: 30px;
      }
    }
    &.middle {
      > div {
        &:nth-of-type(1) {
          font-size: 24px;
          line-height: 32px;
        }
        &:nth-of-type(2) {
          font-size: 20px;
          line-height: 22px;
        }
      }
    }
  }
  .life-time {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-left: 50px;
    padding-right: 22px;
    color: #414141;
    font-size: 16px;
    line-height: 20px;
      .instruction-btn {
          width: 118px;
          font-size: 16px;
          text-align: center;
          color: #FFF;
          border-radius: 14px;
          padding: 3px 2px;
          background-color: var(--bgc);
          > svg {
              margin-left: 4px;
              vertical-align: -3px;
              transform: rotate(0);
              transition: transform .2s linear;
              &.showInstruction {
                  transform: rotate(-180deg);
              }
          }
      }
  }
  .coupon-item-right {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 154px;
    .right-text {
        display: flex;
        flex-direction: column;
        font-size: 34px;
        color: #fff;
        font-weight: bold;
        &.over-max {
            text-align: center;
        }
    }
    .receive-count {
        position: absolute;
        font-weight: normal;
        width: 150px;
    }
    .ctrl {
        display: flex;
        align-items: center;
        > svg {
            margin-left: 10px;
        }
    }
    .price {
        color: #fff;
        font-size: 32px;
        font-weight: bold;
    }

    /*.over-max {
        display: inline-block;
        position: relative;
        width: 110px;
        height: 110px;
        text-align: center;
        background: rgba(139, 139, 139, 1);
        border: 6px solid rgba(255, 255, 255, 1);
        border-radius: 50%;
        font-size: 20px;
        color: rgba(255, 255, 255, 1);

        > span {
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            word-break: keep-all;
        }
    }*/
  }

  /* 不可使用的状态，文字描述 */
  .unavailable-desc {
    width: 240px;
    height: 80px;
    color: #FFF;
    background-color: #5B5B5B;
    border: 6px solid #fff;
    border-radius: 12px;
    transform: rotate(-10deg);
    font-size: 44px;
    font-weight: 800;
    text-align: center;
    line-height: 80px;
    position: absolute;
    top: 54px;
    right: 52px;
  }

  /* 使用说明 */
  .instruction {
    padding: 20px 24px;
    word-break: break-all;
    white-space: pre-line;
    font-size: 24px;
    color: #666;
  }

  /*已领取*/
  .claimed {
    position: absolute;
    left: 350px;
    top: -50px;
  }
</style>
