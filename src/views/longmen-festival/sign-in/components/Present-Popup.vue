<template>
    <div v-if="show">
        <div class="bg-gray">
            <transition name="fade">
                <div>
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
                                    <span>{{ currentPresentDetail.price }}</span>
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
                                                <p>{{ currentPresentDetail.couponName }}</p>
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
                                <p>{{ awardTypeDesc[currentPresentDetail.awardType] }}已经自动存入您的“{{ awardPackage[currentPresentDetail.awardType] }}”</p>
                                <p>您可在“{{ awardPackage[currentPresentDetail.awardType] }}”中查看</p>
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
                                    <button @click="backMainActivityCenter">返回首页</button>
                                </div>
                            </div>
                        </div>
                        <div class="close">
                            <pl-svg name="icon-close3" fill="#fff" width="40" @click="close" />
                        </div>
                    </template>
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
        // 是否为最终大奖
        isLastIcon: {
            type: Boolean,
            default: false
        },
        // 显示奖品弹框类型
        presentStage: {
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
        close (hasOtherOption) {
            this.$emit('update:show', false)
            if (hasOtherOption === true) this.$emit('close')
        },
        backMainActivityCenter () {
            this.$router.replace({ name: 'Home' })
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
    background-color: #fff;
    width: 540px;
    padding-bottom: 20px;
    border-radius: 10px;

    .top {
        padding-top: 60px;
        height: 170px;
        text-align: center;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/29b608e1-4954-4676-aa03-7f4c322d52c9.png') center top no-repeat;
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
            border: 1px solid #f01516;

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
                background-color: #ffe9e9;

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
                font-size: 24px;
                color: #ffdcb3;
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
            background: linear-gradient(180deg, #f5651a 0%, #f01b15 100%);
            box-shadow: 0 3px 6px #f01c15;
            border-radius: 50px;
            line-height: 52px;
            color: #ffdcb3;
        }

        .iKnow {
            color: #f01516;
        }

        .btns {
            font-size: 30px;
            color: #a8a8a8;
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
                width: 0;
                height: 57px;
                border: 1px solid #e7e7e7;
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
        color: #ffdcb3;
    }

    .detail {
        .gift {
            width: 400px;
            margin: 10px auto;
        }

        .light {
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            z-index: -1;
        }
    }

    .footer {
        padding-top: 60px;
        text-align: center;

        button {
            width: 326px;
            height: 52px;
            background: linear-gradient(180deg, #f5651a 0%, #f01b15 100%);
            box-shadow: 0 3px 6px #f01c15;
            border-radius: 50px;
            font-size: 30px;
            line-height: 52px;
            color: #ffdcb3;
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
        background-color: #fff;
        width: 400px;
        height: 70px;
        line-height: 70px;
        margin: 0 auto;
        border-radius: 20px 20px 0 0;
        text-align: center;
        font-size: 30px;
        color: #f01516;
    }

    .bottom {
        background: #fff;
        box-shadow: 0 3px 5px #f00;
        border-radius: 42px;
        padding: 10px 10px 20px 10px;
        width: 500px;
        .detail {
            text-align: center;
            border-radius: 30px;
            padding: 60px 0;
            background: #f01516 url('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/83e5925d-2d8a-4dd8-b009-755f3b2823d1.png') bottom no-repeat;
            background-size: contain;
            > img {
                width: 260px;
                height: 150px;
                object-fit: cover;
            }
            h3 {
                padding-top: 20px;
                margin: 0 auto;
                color: #fff;
                font-weight: 400;
                width: 400px;
                overflow: hidden;
                word-break: keep-all;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 30px;
                line-height: 40px;
            }
            h4 {
                padding: 10px 0;
                font-size: 20px;
                font-weight: 400;
                line-height: 26px;
                color: #ffdcb3;
            }
            p {
                font-size: 20px;
                color: #fff;
            }
        }

        .footer {
            padding-top: 30px;
            text-align: center;

            button {
                width: 326px;
                height: 52px;
                background: linear-gradient(180deg, #f5651a 0%, #f01b15 100%);
                box-shadow: 0 3px 6px #f01c15;
                border-radius: 50px;
                font-size: 30px;
                line-height: 52px;
                color: #ffdcb3;
            }
        }
    }
}

</style>
