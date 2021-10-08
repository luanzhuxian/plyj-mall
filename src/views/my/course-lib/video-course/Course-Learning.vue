<template>
    <div :class="$style.courseLearning">
        <PlLoadMore
            ref="loadMore"
            :form="form"
            :request-methods="getCourseList"
            @refresh="refreshList"
            @more="refreshList"
            :no-content-tip="learnTxt"
            :no-icon="false"
            icon="icon-course-7ffcc"
        >
            <study-item
                v-for="(item,index) in list"
                :key="index"
                :item="item"
            />
        </PlLoadMore>
        <!--无数据情况-->
        <div v-if="loading" :class="$style.none">
            <div @click="goLearning" :class="$style.goLearning">去学习课程</div>
        </div>
    </div>
</template>

<script>
import StudyItem from '../../../../components/my/course-lib/video-course/Study-Item'
import { getCourseList } from '../../../../apis/live-library'
export default {
    name: 'CourseLearning',
    components: {
        StudyItem
    },
    data () {
        return {
            list: [],
            loading: false,
            learnStatus: ['未学习', '学习中', '已过期'],
            form: {
                // 1：未学习  2：学习中  3：已过期
                learnStatus: 1,
                // 1单课 2系列课
                courseType: 1,
                current: 1,
                size: 10
            }
        }
    },
    async activated () {
        try {
            const { learnStatus, courseType } = this.$route.params
            if (learnStatus) {
                this.list = []
                this.loading = false
                this.form.current = 1
                this.form.learnStatus = Number(learnStatus)
                this.form.courseType = Number(courseType)
                await this.$nextTick()
                await this.$refs.loadMore.refresh()
            }
        } catch (e) { throw e }
    },
    methods: {
        getCourseList,
        refreshList (list) {
            this.list = list
            this.loading = list.length === 0
        },
        goLearning () {
            const name = this.$route.params.courseType === '1' ? 'OnlineClassroom' : 'seriesOfCourses'
            this.$router.push({ name })
        }
    },
    computed: {
        learnTxt () {
            return `暂无${ this.learnStatus[(this.$route.params.learnStatus || 1) - 1] }的课程`
        }
    }
}
</script>

<style module lang='scss'>
.course-learning {
    padding: 6px 28px 20px 28px;
    box-sizing: border-box;
    background-color: #fff;
}
.none {
    margin-top: 20px;
    text-align: center;
    > .go-learning {
        display: inline-block;
        width: 280px;
        border: 2px solid #fe7700;
        border-radius: 8px;
        font-size: 28px;
        font-weight: 400;
        line-height: 60px;
        color: #fe7700;
        background: rgba(255,244,235,1);
    }
}

</style>
