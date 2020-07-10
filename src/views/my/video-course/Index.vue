<template>
    <div :class="{ [$style.liveLibrary]: true, [$style.myLive]: isLiveCourse }">
        <div :class="$style.nav">
            <div :class="$style.head">
                <div :class="$style.tabs" @click="$router.push({ name: 'MyLive' })">
                    <div :class="{ [$style.tabFocus]: isLiveCourse }">直播课</div>
                    <div :class="{ [$style.line]: true, [$style.lineFocus]: isLiveCourse }" />
                </div>
                <div :class="$style.tabs" @click="$router.push({ name: 'VideoCourses', params: { courseType: '1' } })">
                    <div :class="{ [$style.tabFocus]: isSingleCourse }">单课</div>
                    <div :class="{ [$style.line]: true, [$style.lineFocus]: isSingleCourse }" />
                </div>
                <div :class="$style.tabs" @click="$router.push({ name: 'VideoCourses', params: { courseType: '2' } })">
                    <div :class="{ [$style.tabFocus]: isSeriesCourse }">系列课</div>
                    <div :class="{ [$style.line]: true, [$style.lineFocus]: isSeriesCourse }" />
                </div>
                <div :class="$style.tabs" @click="$router.push({ name: 'MyImageText', params: { courseType: '2' } })">
                    <div :class="{ [$style.tabFocus]: isSeriesCourse }">我的资料</div>
                    <div :class="{ [$style.line]: true, [$style.lineFocus]: isSeriesCourse }" />
                </div>
            </div>
            <div v-if="!isLiveCourse" :class="$style.studyTabs">
                <div :class="{ [$style.focus]: item.learnStatus === learnStatus }" v-for="(item,index) in tabs" :key="index" @click="target(item.learnStatus)">{{ item.name }}({{ item.num }})</div>
            </div>
            <div v-if="learnStatus === '3'" :class="$style.description">
                已过期课程不支持观看
            </div>
            <div v-else-if="!isLiveCourse && learnStatus !== '3'" :class="$style.description">
                仅支持观看已成功购买的线上视频课程
            </div>
        </div>
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
import { getCourseStudyNum } from '../../../apis/live-library'
export default {
    name: 'CourseLibrary',
    data () {
        return {
            tabs: [
                {
                    learnStatus: '1',
                    name: '未学习',
                    num: 0
                },
                {
                    learnStatus: '2',
                    name: '学习中',
                    num: 0
                },
                {
                    learnStatus: '3',
                    name: '已过期',
                    num: 0
                }
            ]
        }
    },
    methods: {
        target (learnStatus) {
            this.$router.push({ name: this.$route.name, params: { learnStatus } })
        },
        async getStudyNum (courseType) {
            try {
                const { result } = await getCourseStudyNum(courseType)
                this.tabs[0].num = result.noStartLearnCount || 0
                this.tabs[1].num = result.startLearningCount || 0
                this.tabs[2].num = result.startEndCount || 0
            } catch (e) { throw e }
        }
    },
    watch: {
        '$route.params': {
            async handler ({ courseType }) {
                try {
                    if (courseType) await this.getStudyNum(courseType)
                } catch (e) {
                    if (e.name === 'ResponseError') {
                        this.$error(JSON.parse(e.message).message)
                    } else {
                        this.$error(e.message)
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        learnStatus () {
            return this.$route.params.learnStatus
        },
        isLiveCourse () {
            return this.$route.name === 'MyLive'
        },
        isSingleCourse () {
            return this.$route.name === 'CourseLearning' && this.$route.params.courseType === '1'
        },
        isSeriesCourse () {
            return this.$route.name === 'CourseLearning' && this.$route.params.courseType === '2'
        }
    }
}
</script>

<style module lang='scss'>

.live-library {
    box-sizing: border-box;
    padding-top: 225px;
    min-height: 100vh;
    background-color: #fff;
    &.my-live {
        padding-top: 115px;
    }
    > .nav {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        background-color: #fff;
        > .head {
            display: flex;
            justify-content: center;
            width: 100%;
            border-bottom: 2px solid #e6e6e6;
            font-size: 30px;
            color: #222;
            background-color: #fff;
            > .tabs {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                padding: 24px 15px 0 15px;
                > div:nth-of-type(1) {
                    width: 100%;
                    text-align: center;
                }
                > .tab-focus {
                    color: #f2b036;
                }
                > .line {
                    width: 40px;
                    height: 8px;
                    margin-top: 16px;
                    border-radius: 222px;
                }
                > .line-focus {
                    background: linear-gradient(90deg,rgba(243,173,60,1) 0%,rgba(247,207,84,1) 100%);
                }
            }
        }
        > .study-tabs {
            display: flex;
            width: 100%;
            padding: 18px 28px;
            box-sizing: border-box;
            background-color: #fff;
            > div {
                margin-right: 30px;
                padding: 6px 32px;
                border: 1px solid #fff;
                border-radius: 128px;
                font-size: 22px;
                text-align: center;
                color: #666;
            }
            > .focus {
                border-color: #f3ad3c;
                color: #f3ad3c;
                background-color: #fcf5ea;
            }
        }
        > .description {
            padding: 14px 28px;
            box-sizing: border-box;
            font-size: 24px;
            color: #666;
            background-color: #fff;
        }
    }
}

</style>
