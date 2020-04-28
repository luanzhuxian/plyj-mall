<template>
    <div class="bg tuan-bg">
        <!-- <div class="rule" @click="showRule = true">活动规则</div> -->
        <div class="main">
            <div class="list tuan-ing" v-if="ingList.length > 0">
                <div class="head">
                    <pl-svg name="icon-ing_icon" width="52" />
                    <pl-svg name="icon-ing_text" width="180" height="52" />
                </div>
                <div class="item" v-for="(item, k) in ingList" :key="k" @click="jumpToDetail(item.productId)">
                    <div class="img">
                        <img v-imgError :src="item.productMainImage">
                        <div class="count-down">
                            <count-down
                                activity-text="距结束"
                                :endtime="item.activityEndTime"
                                @done="getList"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="title">{{ item.productName }}</div>
                        <template>
                            <div v-if="item.prizePool != 0" class="tuan-tips">成团瓜分<span>{{ item.prizePool }}元</span></div>
                            <div v-else class="tuan-tips" style="width:17.466667vw">双十二有礼</div>
                        </template>
                        <div class="tuan-join">已有{{ item.number }}人参团</div>
                        <div class="bottom">
                            <div class="price-bar">
                                <pl-svg name="icon-tuangoujia" width="100" height="50" />
                                <div class="price">{{ item.price }}</div>
                            </div>
                            <div class="miao-btn">
                                <pl-svg name="icon-vie-for" fill="#fff" width="37" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list tuan-coming" v-if="comingList.length > 0">
                <div class="head">
                    <pl-svg name="icon-coming_icon" width="52" />
                    <pl-svg name="icon-coming_text" fill="#fff" width="180" height="52" />
                </div>
                <div class="item" v-for="(item, k) in comingList" :key="k" @click="jumpToDetail(item.productId)">
                    <div class="img">
                        <img v-imgError :src="item.productMainImage">
                        <div class="count-down">
                            <count-down
                                activity-text="距开始"
                                :endtime="item.activityStartTime"
                                @done="getList"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="title">{{ item.productName }}</div>
                        <template>
                            <div v-if="item.prizePool != 0" class="tuan-tips">成团瓜分<span>{{ item.prizePool }}元</span></div>
                            <div v-else class="tuan-tips" style="width:17.466667vw">双十二有礼</div>
                        </template>
                        <div class="tuan-join"><!-- 已有{{ item.number }}人参团 --></div>
                        <div class="bottom">
                            <div class="price-bar">
                                <pl-svg name="icon-tuangoujia" width="100" height="50" />
                                <div class="price">{{ item.price }}</div>
                            </div>
                            <div class="view-btn">查看</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <pl-popup
            :show.sync="showRule"
            title="活动细则"
            @close="showRule = false"
        >
            <div>sfsf</div>
        </pl-popup>
    </div>
</template>

<script>
import { tuanActivityPage } from '../../apis/product'
import CountDown from './Count-Down'
export default {
    name: 'List',
    components: {
        CountDown
    },
    data () {
        return {
            ingList: [],
            comingList: [],
            showRule: false
        }
    },
    async activated () {
        try {
            await this.getList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getList () {
            try {
                const { result } = await tuanActivityPage({ type: '2019_01' })
                if (!result[0].length && !result[1].length) {
                    this.$alert({
                        message: '暂无数据',
                        viceMessage: '逛逛主会场吧~',
                        confirmText: '再逛逛'
                    })
                        .finally(() => {
                            this.$router.go(-1)
                        })
                    return
                }
                this.ingList = result[1]
                this.comingList = result[0]
                return result
            } catch (e) {
                throw e
            }
        },
        jumpToDetail (id) {
            this.$router.push({ name: 'Product', params: { productId: id }, query: { currentProductStatus: 2 } })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./List";
</style>
