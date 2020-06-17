<template>
    <div :class="$style.rules">
        <div :class="$style.entry" @click="show = true">活动规则</div>
        <pl-popup
            :show.sync="show"
            title="活动细则"
            append-body
        >
            <ol :class="$style.content">
                <li>
                    <span>活动时间：2019.05.20 至 2019.06.20</span>
                </li>
                <li>
                    <span>活动对象：新注册会员</span>
                </li>
                <li>
                    <span>活动说明：</span>
                    <ol :class="$style.content">
                        <li>在活动有效期内，新用户注册成为店铺的会员，且成功绑定手机号，即可领取优惠大礼包1份；</li>
                        <li>每个账号限领一次。</li>
                        <li>用户领取成功后，优惠券将自动存入“我的卡包”中，使用有效期内用户可随时查看使用；奖学金将自动存入“我的奖学金”中，使用有效期内用户可随时查看使用；礼品可自动存入“我的礼品”中，兑换有效期内用户可随时进行礼品兑换</li>
                    </ol>
                </li>
            </ol>
        </pl-popup>
    </div>
</template>

<script>
export default {
    name: 'Poster',
    data () {
        return {
            show: false
        }
    }
}
</script>

<style module lang="scss">
    .rules {
        position: absolute;
        > .entry {
            position: fixed;
            right: 0;
            top: 210px;
            width: 128px;
            line-height: 50px;
            color: #fff;
            font-size: 24px;
            text-align: center;
            border-radius: 25px 0 0 25px;
            background-color: #FA8E59;
        }
    }
    .content {
        padding: 24px 24px 60px;
        font-size: 26px;
        line-height: 56px;
        counter-reset: on 0;
        > li {
            counter-increment: on;
            &:before {
                content: counters(on, '-') '. '; /* 形如：3-1.  */
            }
        }
    }
</style>
