<template>
    <div :class="$style.myImageText">
        <load-more
            ref="loadMore"
            :form="form"
            :class="$style.courseLearning"
            :request-methods="getMyImageText"
            @refresh="refreshList"
            @more="refreshList"
            :no-icon="false"
            icon="icon-course-7ffcc"
        >
            <study-item
                v-for="(item,index) in list"
                :key="index"
                :item="item"
            />
        </load-more>
        <!--无数据情况-->
        <div v-if="loading" :class="$style.none">
            <div @click="goLearning" :class="$style.goLearning">去学习课程</div>
        </div>
    </div>
</template>

<script>
import StudyItem from '../../../live/live-library/components/Study-Item'
import LoadMore from '../../../../components/common/Load-More.vue'
import { getMyImageText } from '../../../../apis/live-library'

export default {
    name: 'ImageText',
    components: {
        StudyItem,
        LoadMore
    },
    data () {
        return {
            getMyImageText,
            list: [],
            loading: false,
            form: {
                current: 1,
                size: 10
            }
        }
    },
    async mounted () {
        console.log(123123)
        try {
            await this.$refs.loadMore.refresh()
        } catch (e) {
            throw e
        }
    },
    methods: {
        refreshList (list) {
            this.list = list
            this.loading = list.length === 0
        }
    }
}
</script>

<style module lang="scss">
    .my-image-text {
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
