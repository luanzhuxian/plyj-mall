<template>
    <div :class="$style.redPacketIntro">
        <div :class="[$style.module, $style.border]">
            <div :class="$style.title">使用说明</div>
        </div>

        <div :class="[$style.module, $style.content, $style.border]" v-if="$route.query.from && $route.query.from === 'RedPackageDetail'">
            <div :class="[$style.title, $style.left]">使用须知</div>
            <p :class="$style.tip">发券时间：2020.1.2.-2020.6.30</p>
            <p :class="$style.tip">使用时间：2020.1.2.-2020.6.30</p>
        </div>

        <div :class="[$style.module, $style.content, $style.border]">
            <div :class="$style.title">简单两步 方便快捷</div>
            <div :class="$style.useStep">
                <div>
                    <div :class="$style.title2">第一步</div>
                    <p :class="$style.tip">选择需要的福利红包领取</p>
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-packet-submit.jpg" alt="">
                </div>
                <div>
                    <div :class="$style.title2">第二步</div>
                    <p :class="$style.tip">在订单结算页面使用福利红包</p>
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/red-packet-home.jpg" alt="">
                </div>
            </div>
        </div>

        <div :class="[$style.module, $style.content, $style.border]">
            <div :class="$style.title">一. 购买与使用</div>
            <ol>
                <li>
                    <div :class="$style.title2">1. 不与全网优惠叠加使用</div>
                    <p :class="$style.tip">福利红包使用时不支持与满减券、品类券、奖学金等优惠叠加使用；且福利红包本身不可叠加使用，每次消费仅支持使用一张福利红包</p>
                </li>
                <li>
                    <div :class="$style.title2">2. 使用限制</div>
                    <p :class="$style.tip">不支持购买团购、预购、组合聚会学、秒杀等活动产品，不支持直播产品</p>
                </li>
                <li>
                    <div :class="$style.title2">3. 查看储备金</div>
                    <p :class="$style.tip">您可以在【我的】-【我的卡券】查看福利红包及使用记录</p>
                </li>
            </ol>
        </div>

        <div :class="[$style.module, $style.content]">
            <div :class="$style.title">二. 过期与退款</div>
            <ol>
                <li>
                    <div :class="$style.title2">1. 未消耗福利红包不支持退款</div>
                    <p :class="$style.tip">建议您尽快使用，不要浪费了福利红包哦！若未使用或福利红包过期，购买福利红包金额不会退回您的账户</p>
                </li>
                <li>
                    <div :class="$style.title2">2. 福利红包不支持开具发票</div>
                    <p :class="$style.tip">购买的福利红包不支持开具发票，使用福利红包支付的产品订单减免金额部分也不支持开具发票</p>
                </li>
                <li>
                    <div :class="$style.title2">3. 福利红包不支持提现</div>
                    <p :class="$style.tip">福利红包做为权益产品，红包金额仅可用于本平台消费，不可以提现</p>
                </li>
                <li>
                    <div :class="$style.title2">4. 订单退款</div>
                    <p :class="$style.tip">使用福利红包抵扣的订单在发生退款时，福利红包视为消耗不予退回</p>
                </li>
            </ol>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RedPacketIntro'
}
</script>

<style module lang="scss">
    .red-packet-intro {
        padding: 26px 44px;
        background-color: #fff;
        .module {
            padding-bottom: 26px;
            &.content {
                padding-top: 30px;
                padding-bottom: 56px;
            }
        }
        .title {
            font-size: 33px;
            text-align: center;
            font-weight: bold;
        }
        .title2 {
            margin-top: 38px;
            font-size: 26px;
            font-weight: bold;
            color: #3B3B3B;
        }
        .tip {
            margin-top: 16px;
            font-size: 26px;
            font-weight: normal;
            color: #3B3B3B;
        }
        .left {
            text-align: left;
        }
        .border {
            border-bottom: 2px solid #E5E4E4;
        }
    }
    .use-step {
        display: flex;
        justify-content: space-between;
        text-align: center;
        img {
            width: 172px;
            margin-top: 24px;
        }
    }
</style>
