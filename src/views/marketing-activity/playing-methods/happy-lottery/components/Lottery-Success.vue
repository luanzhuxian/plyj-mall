<template>
    <pl-mask
        :show="show"
        :show-close="false"
        @close="closeHandler"
    >
        <div :class="$style.lotterySuccess">
            <div :class="$style.wrap">
                <div :class="$style.content">
                    <div :class="$style.grade" v-text="grade" />
                    <div style="text-align: center;">
                        <img :class="$style.giftImage" v-if="awardType !== 1" src="https://mallcdn.youpenglai.com/static/mall/lottery/third-prize.png" alt="奖品图片">
                        <img :class="$style.giftImage" v-else :src="giftImage" alt="奖品图片">
                    </div>
                    <div class="mt-16" :class="$style.giftName">
                        <span>{{ giftName }}</span>
                        <span v-if="price">{{ price }}元</span>
                    </div>
                    <div v-if="awardType === 2" class="text-center mt-16 fz-28" :class="$style.date">有效期：领取当日起{{ days }}天以内</div>
                    <div v-else class="text-center mt-16 fz-28" :class="$style.date">有效期 {{ date }}</div>
                    <div class="text-center mt-16 fz-20 gray-3" :class="$style.tip">奖品已自动存入您的我的优惠券/礼品/奖学金中</div>
                </div>
                <div :class="$style.got">
                    <button :class="$style.ohYeah" @click="closeHandler">开心收下</button>
                </div>
            </div>
        </div>
    </pl-mask>
</template>

<script>
export default {
    name: 'LotterySuccess',
    props: {
        show: Boolean,
        grade: {
            type: String,
            default: ''
        },
        awardType: {
            type: Number,
            default: 3
        },
        giftImage: {
            type: String,
            default: ''
        },
        giftName: {
            type: String,
            default: '撒大噶阿斯顿飞过'
        },
        activityName: {
            type: String,
            default: '阿斯顿噶'
        },
        date: {
            type: String,
            default: ''
        },
        // 奖学金金额
        price: {
            type: Number,
            default: 0
        },
        // 奖学金的使用期限
        days: {
            type: Number,
            default: 0
        }
    },
    methods: {
        closeHandler () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module lang="scss">
    .lotterySuccess {
        position: relative;
        width: 702px;
        padding-top: 76px;
        background-size: 100%;
        &:before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 133px;
            content: '';
            background: url("https://mallcdn.youpenglai.com/static/mall/lottery/success-head.png?t=2") no-repeat center top;
            background-size: auto 100%;
        }
        .wrap {
            padding: 15px;
            background: linear-gradient(180deg, #FB8C1E, #FFB700);
            border: 10px solid #ffc881;
            border-radius: 40px;
        }
        .content {
            padding-bottom: 45px;
            background-color: #fff;
            border-radius: 30px;
            box-shadow: 10px 22px 0 #FD9E11;
        }
    }
    .grade {
        padding-top: 42px;
        font-size: 48px;
        color: #ED4001;
        text-align: center;
        font-weight: bold;
    }
    .giftImage {
        margin-top: 32px;
        height: 284px;
    }
    .giftName {
        font-size: 36px;
        color: #F79F1A;
        text-align: center;
    }
    .got {
        margin: 52px auto 58px;
        text-align: center;
    }
    .oh-yeah {
        width: 280px;
        height: 110px;
        border-radius: 55px;
        font-size: 36px;
        color: #fff;
        background: linear-gradient(180deg, #FE6200, #E22A03);
        box-shadow: 0 15px 0 #d42d02;
        &:active {
            transform: translateY(10px);
            box-shadow: 0 5px 0 #d42d02;
        }
    }
</style>
