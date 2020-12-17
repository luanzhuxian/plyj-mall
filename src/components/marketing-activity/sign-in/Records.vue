<template>
    <div :class="$style.signInRecords">
        <Tab activity-color="#FE461F" v-model="tab">
            <TabPane label="好礼晒单" value="1">
                <div>
                    <div :class="$style.statistics">
                        已有<strong>{{ sunPresentListTotal }}个</strong>获得{{ recordText }}
                    </div>
                    <div>
                        <SunPresentItem
                            v-for="item of 5"
                            :key="item"
                            user-img="item.userImg"
                            user-name="张三"
                            :award-type="1"
                            :signin-num="3"
                            :active-name="activeName"
                            :action-name="actionName"
                            award-name="item.awardName"
                            flaunt-award-name="FLAUNT_AWARD_NAME"
                        />
                    </div>
                </div>
            </TabPane>
            <TabPane label="我的奖品" value="2">
                <div>
                    <div :class="$style.statistics">
                        已有<strong>{{ myPresentList.length }}个</strong>获得{{ recordText }}
                    </div>
                    <div>
                        <MyPresentItem
                            v-for="(item, index) of myPresentList"
                            :key="index"
                            :award-type="2"
                            date="2020-20-02~2024-20-02"
                            :award-img="item.awardImg"
                            :award-name="item.awardName"
                            :flaunt-award-name="FLAUNT_AWARD_NAME"
                        />
                    </div>
                </div>
            </TabPane>
        </Tab>
    </div>
</template>

<script>
import Tab from '../tab/Lottery-Tabs.vue'
import TabPane from '../tab/Lottery-Tab-Pane.vue'
import SunPresentItem from './item/Sun-Present-Item.vue'
import MyPresentItem from './item/My-Present-Item.vue'
import { getObtainedSunPresentList } from '../../../apis/new-year'
export default {
    name: 'SignInRecords',
    components: {
        TabPane,
        Tab,
        SunPresentItem,
        MyPresentItem
    },
    props: {
        // 活动名称（名词，如：端午活动，智力题）
        activeName: {
            type: String,
            default: ''
        },
        // 动作名称（动词，如：打卡，签到）
        actionName: {
            type: String,
            default: ''
        },
        // 列表顶部的文字
        recordText: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tab: '1',
            sunPresentListTotal: 0,
            myPresentList: []
        }
    },
    created () {

    },
    methods: {
    // 获取好友晒单奖品列表
        async getObtainedSunPresentList () {
            try {
                const { result } = await getObtainedSunPresentList(this.id, 1, 50)
                this.sunPresentListTotal = result.receiveUserNumber
                this.myPresentList = result.flauntAwardsModels
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
    .signInRecords {
        width: 714px;
        margin: 0 auto;
        padding: 32px 38px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
        box-sizing: border-box;
    }
    .statistics {
        margin: 40px auto 26px;
        height: 54px;
        width: max-content;
        padding: 0 26px;
        line-height: 54px;
        background-color: #FFE3C8;
        border-radius: 34px;
        font-size: 26px;
        color: #620003;
        > strong {
            color: #FE461F;
        }
    }
</style>
