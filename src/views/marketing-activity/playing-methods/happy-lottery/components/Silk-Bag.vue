<template>
    <div>
        <div :class="$style.activityIntro" @click="showRule = true">活动锦囊</div>
        <pl-popup
            :show.sync="showRule"
            title="活动说明"
        >
            <dl :class="$style.ruleContent">
                <dt class="fz-28">1. 活动时间</dt>
                <dd class="fz-24 gray-2 mb-48">{{ detail.startTime }} 至 {{ detail.endTime }}</dd>
                <dt class="fz-28">2. 活动对象</dt>
                <dd class="fz-24 gray-2" :class="Number(detail.userRange) !== 3 && 'mb-48'" v-text="userGroupMap[detail.userRange]" />
                <dd class="fz-24 gray-2 mb-48" v-if="Number(detail.userRange) === 3">
                    <span :class="$style.tag" v-for="item of detail.userGroups" :key="item.groupName" v-text="item.groupName" />
                </dd>
                <dt class="fz-28">3. 抽奖条件</dt>
                <dd
                    class="fz-24 gray-2"
                    v-for="(item, i) of detail.terms"
                    :key="i"
                >
                    <span>用户 {{ ['', '首次注册', '每天进入商城', '单笔订单实际支付满'][item.luckDrawType] }}</span>
                    <template v-if="item.luckDrawType === 3">
                        <span v-text="Number(item.money / 100).toFixed(2)" />
                        <span> 元，</span>
                    </template>
                    <span> 即可获得 </span>
                    <span v-text="item.availableLuckDrawNumber" />
                    <span> 次抽奖机会</span>
                </dd>
                <dt class="fz-28 mt-40">4. 活动说明</dt>
                <dd class="fz-24 gray-2" style="word-break: break-all; white-space: pre-line;" v-text="detail.activityRule" />
            </dl>
        </pl-popup>
    </div>
</template>

<script>
export default {
    name: 'HappyLotterySilkBag',
    data () {
        return {
            showRule: false,
            userGroupMap: [
                '所有用户',
                'Helper',
                '普通会员',
                '部分用户分组可用'
            ]
        }
    },
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
        }
    }
}
</script>

<style module lang="scss">
    @import "top-button";
    .ruleContent {
        padding: 40px;
        color: #000;
        > dt {
            margin-bottom: 8px;
        }
    }
    .activityIntro {
        @include fixedTop();
        top: 228px;
        background: linear-gradient(180deg, #FCD612, #FFB700) no-repeat;
        color: #fff;
    }
</style>
