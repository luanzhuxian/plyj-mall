<template>
    <div
        :class="[$style.couponItem, status ? $style.unavailable : '']"
        :style="{ '--backgroundImage': `url(${ bg[couponType] })` }"
    >
        <!-- 根据优惠券类型显示图片，2-品类券 1-满减券 -->
        <div :class="$style.main">
            <div :class="$style.couponItemLeft">
                <div :class="$style.leftTop">
                    <div :class="[$style.couponPrice, amount > 999 ? $style.middle: '', amount > 9999 ? $style.large: '']" v-text="amount" />
                    <div :class="[$style.couponDesc, amount > 999 ? $style.middle: '']">
                        <div>满{{ full }}减 {{ subtract }}</div>
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
                <div :class="$style.price" v-if="isPriceShow"> ￥{{ price }}</div>
                <div :class="$style.ctrl">
                    <!-- 根据是否可以去使用，目前只有我的卡券+提交订单显示'去使用'， 其他显示'立即领取' -->
                    <!-- 应当是能够显示立即领取的地方，都可能达到领取上限 -->
                    <div v-if="!isOverMax && !isAvailableStatus" :class="$style.rightText">
                        <span>立即</span>
                        <span>领取</span>
                    </div>
                    <div :class="$style.overMax" v-if="isOverMax && !isAvailableStatus">
                        <span>已达到</span>
                        <span>领用上限</span>
                    </div>
                    <div v-if="isAvailableStatus" :class="$style.rightText">
                        <span>去</span>
                        <span>使</span>
                        <span>用</span>
                    </div>
                    <pl-svg v-if="!isPriceShow && (isAvailableStatus || (!isAvailableStatus && !isOverMax))" name="icon-right" fill="#fff" width="22" />
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
export default {
    name: 'CouponItem',
    data () {
        return {
            showInstruction: false,
            bg: [
                null,
                'https://mallcdn.youpenglai.com/static/mall/2.0.0/full-coupon.png',
                'https://mallcdn.youpenglai.com/static/mall/2.0.0/category-coupon.png',
                'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-package-bg.png'
            ]
        }
    },
    deactivated () {
        this.showInstruction = false
    },
    props: {
        status: {
            type: String,
            default: ''
        },
        // 活动id
        id: {
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

        // 减多少
        subtract: {
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

        // 是否点击去分类
        canGoClassify: {
            type: Boolean,
            default: true
        },

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

        // 是否已经到达领用上线,只有领用处才有这个字段
        isOverMax: {

            /* activityLimit 0 不限制 1-限制; quantityLimit 可以领取的张数; count 已经领取的次数 */
            type: Boolean,
            default: false
        },

        // 是否在当前页面可领取，只支持前端页面的显示
        isClaimed: {
            type: Boolean,
            default: false
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
        }
    },
    computed: {
        ...mapGetters(['userId']),
        isPriceShow () {
            return this.couponType === 3 && !this.isAvailableStatus && !this.isOverMax && this.price
            // return this.couponType === 3 && !this.isAvailableStatus && !this.isOverMax
        }
    },
    methods: {
        async couponClick (e) {
            if (this.isPriceShow && this.id) {
                return this.$router.push({
                    name: 'RedPackageDetail',
                    params: { activityId: this.id }
                })
            }
            if (this.isAvailableStatus && this.canGoClassify) {
                // 去使用，进入可使用此优惠券的商品列表中
                this.$router.push({
                    name: 'CouponActivity',
                    params: { couponId: this.couponId }
                })
            } else {
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
                if (!this.status) {
                    await this.$emit('couponClick', e)
                }
            }
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
      width: 100%;
      margin-bottom: 32px;
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

    &:before {
      display: inline-block;
      content: '￥';
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
  .unavailableDesc {
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
