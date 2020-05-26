<template>
    <div
        :class="{
            [$style.onlineClassroom]: true,
            [$style.unaccalimedSendCount]: unaccalimedSendCount,
        }"
    >
        <div :class="$style.tabBox">
            <pl-tab
                size="middle"
                :tabs="tabs"
                :active-id.sync="activeTabId"
                @change="tabChange"
            >
                <div
                    :class="$style.tabPane"
                    v-for="(item, i) of tabs"
                    :key="i"
                    :slot="'tab-pane-' + i"
                />
            </pl-tab>
        </div>
        <div
            :class="$style.sendLive"
            v-if="unaccalimedSendCount"
            @click="isShowSendLiveDialog = true"
        >
            <span>赠送了您{{ unaccalimedSendCount }}节课程哦，快来学习吧~</span>
            <span>查看></span>
        </div>
        <keep-alive>
            <router-view />
        </keep-alive>
        <!--赠课弹框-->
        <send-live
            v-if="isShowSendLiveDialog"
            :show.sync="isShowSendLiveDialog"
            is-notice="1"
        />
    </div>
</template>
<script>
import { getSendLiveList } from '../../apis/online-classroom.js'
import { getCourseCategoryTree } from '../../apis/classify'
import SendLive from '../../components/common/Send-Live.vue'

export default {
    name: 'OnlineClassroomIndex',
    components: {
        SendLive
    },
    provide () {
        return {
            onlineClassCoursesCatrgory: this.onlineClassCoursesCatrgory
        }
    },
    data () {
        return {
            activeTabId: 0,
            tabs: [
                { name: '互动直播', routerName: 'InteractiveLive', id: 0 },
                { name: '精选单课', routerName: 'OnlineClassroom', id: 1 },
                { name: '系列精品课', routerName: 'seriesOfCourses', id: 2 }
            ],
            unaccalimedSendCount: 0,
            isShowSendLiveDialog: false,
            onlineClassCoursesCatrgory: {
                seriesCoursesCatrgory: [],
                coursesCatrgory: []
            }
        }
    },
    async created () {
        try {
            this.activeTabId = this.tabs.find(item => item.routerName === this.$route.name).id
            await this.getSendLiveCount()
            await this.getCourseCategoryTree()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getCourseCategoryTree () {
            try {
                const { result } = await getCourseCategoryTree()
                if (result.length) {
                    this.onlineClassCoursesCatrgory.seriesCoursesCatrgory = result.find(item => Number(item.type) === 2) || { childs: [] }
                    this.onlineClassCoursesCatrgory.coursesCatrgory = result.find(item => Number(item.type) === 1) || { childs: [] }
                }
            } catch (e) {
                throw e
            }
        },
        async tabChange (item) {
            await this.$nextTick()
            await this.$router.replace({ name: item.routerName })
        },
        async getSendLiveCount () {
            try {
                const { result } = await getSendLiveList('1')
                const liveList = (result.liveList && result.liveList) || []
                const courseList = (result.courseList && result.courseList) || []
                this.unaccalimedSendCount = liveList.length + courseList.length
            } catch (e) {
                throw e
            }
        }
    }
}
</script>
<style lang="scss" module>
    .online-classroom {
        min-height: calc(100vh - 92px - 120px);
        padding-top: 92px;
        padding-bottom: 120px;
        background-color: #FFF;
        &.unaccalimedSendCount {
            padding-top: 172px;
        }
    }

    .tab-box {
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        border-bottom: 1px solid #e7e7e7;
        z-index: 10;

        :global {
            .pl-tab {
                justify-content: center;
            }

            .pl-tab__pane.active:after {
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 8px;
                border-radius: 4px;
                background-image: linear-gradient(90deg, #F3AD3C, #F7CF54);
            }
        }
    }

    .send-live {
        position: fixed;
        left: 0;
        top: 92px;
        width: 100%;
        display: flex;
        padding: 0 32px 0 24px;
        box-sizing: border-box;
        justify-content: space-between;
        line-height: 80px;
        font-size: 28px;
        background-color: #448AE1;
        color: #FFF;
        z-index: 10;
    }
</style>
