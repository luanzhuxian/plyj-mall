<template>
    <div :class="$style.signInRecords">
        <Tab activity-color="#FE461F" v-model="tab">
            <TabPane label="好礼晒单" value="1">
                <div>
                    <div :class="$style.statistics">
                        已有<strong>{{ sunPresentListTotal }}人</strong>获得{{ recordText }}
                    </div>
                    <div class="no-sun-present" v-if="sunPresentList.length === 0">
                        <img
                            src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png">
                    </div>
                    <template v-else>
                        <template v-for="(item, index) in sunPresentList">
                            <SunPresentItem
                                v-if="index < 3 || showSunPresentListMore" :key="index"
                                :user-img="item.userImg"
                                :user-name="item.userName"
                                :award-type="item.awardType"
                                :flaunt-award="item.flauntAward"
                                :signin-num="item.signinNum"
                                :award-name="item.awardName"
                                :active-name="activeName"
                                :action-name="actionName"
                                flaunt-award-name="FLAUNT_AWARD_NAME"
                            />
                        </template>
                        <div
                            v-if="sunPresentList.length > 3 && !showSunPresentListMore"
                            :class="$style.more"
                            @click="showSunPresentListMore = true"
                        >
                            查看更多
                        </div>
                    </template></div>
            </TabPane>
            <TabPane label="我的奖品" value="2">
                <div>
                    <div :class="$style.statistics">
                        我获得了<strong>{{ myPresentList.length }}个</strong>{{ recordText }}
                    </div>
                    <div class="no-sun-present" v-if="myPresentList.length === 0">
                        <img
                            src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png">
                    </div>
                    <template v-else>
                        <template v-for="(item, index) in myPresentList">
                            <MyPresentItem
                                v-if="index < 3 || showMyPresentListMore"
                                :key="index"
                                :award-type="item.awardType"
                                :award-img="item.awardImg"
                                :award-name="item.awardName"
                                date="2020-20-02~2024-20-02"
                                :is-grand-prsent="item.isGrandPrsent"
                                :flaunt-award-name="FLAUNT_AWARD_NAME"
                            />
                        </template>
                        <div
                            v-if="myPresentList.length > 3 && !showMyPresentListMore"
                            :class="$style.more"
                            @click="showMyPresentListMore = true"
                        >
                            查看更多
                        </div>
                    </template></div>
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
        id: {
            type: String,
            default: ''
        },
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
        },
        myPresentList: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            tab: '1',
            sunPresentListTotal: 0,
            sunPresentList: [],
            // 是否显示所有好友晒单列表
            showSunPresentListMore: false,
            // 是否显示所有我的奖品
            showMyPresentListMore: false,
            FLAUNT_AWARD_NAME: '打卡聪明年'
        }
    },
    created () {
        this.getObtainedSunPresentList(this.id)
    },
    methods: {
    // 获取好友晒单奖品列表
        async getObtainedSunPresentList () {
            try {
                const { result } = await getObtainedSunPresentList(this.id, 1, 50)
                this.sunPresentListTotal = result.receiveUserNumber
                this.sunPresentList = result.flauntAwardsModels
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
        text-align: center;
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
    .no-sun-present {
      margin-top: 40px;
      text-align: center;

      > img {
        width: 200px;
      }
    }

    .more {
      font-size: 26px;
      line-height: 35px;
      color: #333;
      margin-top: 30px;
    }
</style>
