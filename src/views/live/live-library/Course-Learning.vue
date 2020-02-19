<template>
  <div>
    <load-more
      ref="loadMore"
      :form="form"
      :class="$style.notLearn"
      :request-methods="getCourseList"
      @refresh="refreshList"
      @more="refreshList"
      :no-content-tip="learnTxt"
      :no-icon="false"
      icon="icon-course-7ffcc"
    >
      <study-item v-for="(item,index) in list" :key="index" :item="item" />
    </load-more>
    <!--无数据情况-->
    <div v-if="loading" :class="$style.none">
      <div @click="$router.push({name:'Home'})" :class="$style.goLearning">去学习课程</div>
    </div>
  </div>
</template>

<script>
import StudyItem from './components/Study-Item'
import LoadMore from './../../../components/common/Load-More.vue'
import { getCourseList } from './../../../apis/live-library'
export default {
  name: 'NotLearn',
  components: {
    StudyItem,
    LoadMore
  },
  data () {
    return {
      list: [],
      loading: false,
      learnStatus: ['未学习', '学习中', '已学完'],
      form: {
        learnStatus: 1, // 1：未学习  2：学习中  3：已学完
        current: 1,
        size: 10
      }
    }
  },
  methods: {
    refreshList (list) {
      this.list = list
      this.loading = list.length === 0
    },
    getCourseList
  },
  computed: {
    learnTxt () {
      return `暂无${this.learnStatus[this.$route.params.learnStatus - 1]}的课程`
    }
  },
  watch: {
    '$route.params.learnStatus': {
      async handler (newVal, oldVal) {
        try {
          this.list = []
          this.loading = false
          this.form.current = 1
          this.form.learnStatus = Number(newVal)
          await this.$nextTick()
          this.$refs.loadMore.refresh()
        } catch (e) { throw e }
      },
      immediate: true
    }
  }
}
</script>

<style module lang='scss'>
  .not-learn {
    padding: 28px;
    box-sizing: border-box;
    background-color: #FFFFFF;
  }
  .none {
    text-align: center;
    > .go-learning {
      display: inline-block;
      width: 280px;
      border:2px solid #FE7700;
      border-radius:8px;
      font-size:28px;
      font-weight:400;
      line-height: 60px;
      color: #FE7700;
      background:rgba(255,244,235,1);
    }
  }
</style>
