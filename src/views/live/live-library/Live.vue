<template>
  <!--我的视频列表-->
  <div :class="$style.liveLibrary">
    <!--视频列表-->
    <LoadMore
      ref="loadMore"
      :form="form"
      :class="$style.courseLearning"
      :request-methods="getLibraryList"
      @refresh="refreshList"
      @more="refreshList"
      no-content-tip="learnTxt"
      :no-icon="false"
      icon="icon-course-7ffcc"
    >
      <liveItem v-for="(item,index) in list" :key="index" :item="item" />
    </LoadMore>
  </div>
</template>
视频库
<script>
import { getLibraryList } from '../../../apis/live-library'
import LoadMore from './../../../components/common/Load-More.vue'
import LiveItem from './components/Live-Item'
export default {
  name: 'LiveLibrary',
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
      list: [] // 视频列表
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

<style lang='scss' module scoped>
  .live-library {

  }
</style>
