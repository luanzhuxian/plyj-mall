<template>
    <!--我的视频列表-->
    <div :class="$style.liveLibrary">
        <!--视频列表-->
        <LoadMore
            ref="loadMore"
            :form="form"
            :class="$style.live"
            :request-methods="getLibraryList"
            @refresh="refreshList"
            @more="refreshList"
            no-content-tip="暂无视频可观看"
            :no-icon="true"
            icon="icon-course-7ffcc"
        >
            <liveItem v-for="(item,index) in list" :key="index" :item="item" />
        </LoadMore>
    </div>
</template>

<script>
import { getLibraryList } from '../../../apis/live-library'
import LoadMore from '../../../components/common/Load-More.vue'
import LiveItem from '../../live/live-library/components/Live-Item'
export default {
    name: 'CourseLibrary',
    components: {
        LoadMore,
        LiveItem
    },
    data () {
        return {
            form: {
                current: 1,
                size: 10
            },
            // 视频列表
            list: []
        }
    },
    async activated () {
        try {
            await this.$nextTick()
            await this.$refs.loadMore.refresh()
        } catch (e) { throw e }
    },
    methods: {
        getLibraryList,
        refreshList (list) {
            this.list = list
        }
    }
}
</script>

<style lang='scss' module >
  .live-library {
    > .live {
      padding-bottom: 20px;
    }
  }
</style>
