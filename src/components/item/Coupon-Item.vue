<template>
    <div :class="[$style.couponItem, status ? $style.unavailable : '']">
        <!-- 根据优惠券类型显示图片，1-满减券 2-品类券 3-福利红包 -->
        <img v-if="couponType === 1" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/full-coupon.png">
        <img v-if="couponType === 2" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/category-coupon.png">
        <img v-if="couponType === 3" src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-package-bg.png">
        <div :class="$style.wrap">
            <div :class="$style.main">
                <div :class="$style.couponItemLeft">
                    <div :class="$style.leftTop">
                        <div :class="[$style.couponPrice, amount > 999 ? $style.middle: '', amount > 9999 ? $style.large: '']" v-text="amount" />
                        <div :class="[$style.couponDesc, amount > 999 ? $style.middle: '']">
                            <div v-if="couponType === 3">满{{ full }}抵 {{ subtract }}</div>
                            <div v-else>满{{ full }}减 {{ subtract }}</div>
                            <div v-text="name" />
                        </div>
                    </div>
                    <div :class="$style.lifeTime">
                        <div>有效期：<i>{{ useStartTime | dateFormat('YYYY.MM.DD') }}~{{ useEndTime | dateFormat('YYYY.MM.DD') }}</i></div>
                        <!-- 使用说明 -->
                        <div
                            v-show="instruction"
                            :class="{
                                [$style.instructionBtn]: true,
                                [$style.red]: couponType === 1,
                                [$style.yellow]: couponType === 2,
                                [$style.orange]: couponType === 3
                            }"
                            @click="showInstruction = !showInstruction"
                        >
                            使用说明
                            <pl-svg
                                :class="{ [$style.showInstruction]: showInstruction }"
                                name="icon-arrow-down"
                                fill="#FFF"
                                width="10"
                            />
                        </div>
                    </div>
                </div>
                <div
                    v-if="isShowReceive"
                    :class="$style.couponItemRight"
                    @click.stop="couponClick"
                >
                    <div :class="$style.price" v-if="couponType === 3 && price">{{ `￥${price}` }}</div>
                    <div :class="$style.getNowWrapper">
                        <div :class="$style.getNow">
                            <!-- 根据是否可以去使用，目前只有我的卡券+提交订单显示'去使用'， 其他显示'立即领取' -->
                            <span v-if="isAvailableStatus">
                                去
                                <br>
                                使
                                <br>
                                用
                            </span>
                            <span v-else>
                                <span :class="$style.overMax" v-if="isOverMax">
                                    <span>
                                        已达到
                                        <br>
                                        领用上限
                                    </span>
                                </span>
                                <!-- 应当是能够显示立即领取的地方，都可能达到领取上限 -->
                                <template v-else>
                                    <span>
                                        立即
                                        <br>
                                        领取
                                    </span>
                                </template>
                            </span>
                            <br>
                        <!--TODO.当前不显用次数 <span v-if="!isAvailableStatus" :class="$style.receiveCount">{{ receiveCount ? `(${receiveCount}次)` : '' }}</span>-->
                        </div>
                        <pl-svg v-if="isAvailableStatus || (!isAvailableStatus && !isOverMax)" name="icon-right" fill="#fff" width="16" />
                    </div>
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
            showInstruction: false
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

        // 优惠券类型 1：满减券 2：品类券 3：福利红包
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

        price: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters(['userId'])
    },
    methods: {
        async couponClick (e) {
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
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    width: 100%;
    /*overflow: hidden;*/

    > img {
      width: 100%;
      min-height: 250px;
    }
    > .wrap {
      position: absolute;
      top: 20px;
      width: 100%;
      overflow: hidden;
      > .main {
        width: 100%;
        min-height: 240px;
        height: max-content;
        display: flex;
        box-sizing: border-box;
      }
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
    align-items: center;
    margin-top: 15px;
    margin-left: 50px;
    padding-right: 22px;
    color: #414141;
    font-size: 20px;
    line-height: 20px;
  }
.instruction-btn {
    width: 118px;
    font-size: 20px;
    text-align: center;
    color: #FFF;
    border-radius: 14px;
    padding: 3px 2px;
    &.red {
        background-color: #E82A4A;
    }
    &.yellow {
        background-color: #F9B20F;
    }
    &.orange {
        background-color: #EF3D03;
    }
    > svg {
        width: 18px;
        line-height: 18px;
        vertical-align: middle;
        transform: rotate(0);
        transition: transform .2s linear;
        &.showInstruction {
            transform: rotate(-180deg);
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
    margin-top: -48px;
    font-size: 32px;
    color: #fff;
    font-weight: bold;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.30);
    .price {
        position: relative;
        left: -8px;
    }
    .get-now-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 4px;
    }
    .get-now {
      position: relative;
      .receive-count {
        position: absolute;
        font-weight: normal;
        width: 150px;
      }

      .over-max {
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
      }
    }
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
  .claimed{
    position: absolute;
    left: 350px;
    top: -50px;
  }
</style>
