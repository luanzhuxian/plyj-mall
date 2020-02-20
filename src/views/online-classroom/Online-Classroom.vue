<template>
  <div class="online-classroom">
    <div :class="['classify-main', isShowAll ? 'show-all' : '']">
      <ul class="classify-list">
        <li
          v-for="(item, index) in classifyList"
          :class="form.category1 ===item.category1 && form.category2===item.category2 ? 'active' : ''"
          :key="index"
          @click="classifyClick(item)"
        >
          {{ item.categoryName }}
        </li>
        <li style="width: 60px" v-if="!isShowAll" />
      </ul>
      <transition name="fade">
        <div class="control" v-if="classifyList.length">
          <pl-svg
            v-show="!isShowAll"
            name="icon-group"
            width="24"
            @click="isShowAll = true"
          />
          <pl-svg
            v-show="isShowAll"
            name="icon-close"
            fill="#ccc"
            width="20"
            @click="isShowAll = false"
          />
        </div>
      </transition>
    </div>
    <div class="course-list">
      <load-more
        ref="loadMore"
        :form="form"
        :request-methods="requestMethods"
        :loading.sync="loading"
        @refresh="refreshHandler"
        no-content-tip="此分类下还没有课程"
      >
        <template>
          <div v-for="(item, index) of courseList" :key="index" class="course-item">
            <img :src="item.courseImg" alt="">
            <div class="desc">
              <h5>{{ item.courseName }}</h5>
              <span>主讲讲师： {{ item.lecturer }}</span>
              <div class="price">
                <template v-if="item.priceType === 1">
                  <span>￥</span>{{ item.sellingPrice }}
                  <span v-if="item.originalPrice" class="original-price">￥{{ item.originalPrice }}</span>
                </template>
                <template v-else>免费</template>
              </div>
              <button @click="$router.push({name: 'Curriculum', params:{ productId: item.id }})">立即学习</button>
            </div>
          </div>
        </template>
      </load-more>
    </div>
  </div>
</template>
<script>
import { getCourse } from '../../apis/online-classroom.js'
import { getCategoryTree } from '../../apis/classify'
import LoadMore from '../../components/common/Load-More.vue'
export default {
  name: 'OnlineClassroom',
  components: {
    LoadMore
  },
  data () {
    return {
      form: {
        category1: '',
        category2: '',
        current: 1,
        size: 10
      },
      isShowAll: false,
      classifyList: [],
      requestMethods: getCourse,
      loading: false,
      $refresh: null,
      courseList: []
    }
  },
  async activated () {
    try {
      if (!this.classifyList.length) { // 有分类且有默认值才设置默认分类
        await this.getCategoryTree()
      }
      this.$refresh = this.$refs.loadMore.refresh
    } catch (e) {
      throw e
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'Curriculum') {
        vm.$refs.loadMore.refresh()
      }
    })
  },
  methods: {
    async getCategoryTree () {
      try {
        const { result } = await getCategoryTree()
        let classifyList = [{
          category1: '',
          category2: '',
          categoryName: '全部'
        }]
        if (result.length) {
          for (let i in result) {
            let item = result[i]

            if (item.childs) {
              for (let j in item.childs) {
                let classifyItem = {}
                classifyItem.category1 = item.id
                let subItem = item.childs[j]
                classifyItem.category2 = subItem.id
                classifyItem.categoryName = subItem.categoryName
                classifyList.push(classifyItem)
              }
            } else {
              let classifyItem = {}
              classifyItem.category1 = item.id
              classifyItem.category2 = ''
              classifyItem.categoryName = item.categoryName
              classifyList.push(classifyItem)
            }
          }
        }
        this.classifyList = classifyList
      } catch (e) {
        throw e
      }
    },
    async classifyClick (item) {
      try {
        this.form.current = 1
        this.form.category1 = item.category1
        this.form.category2 = item.category2
        this.isShowAll = false
        this.$refresh()
      } catch (e) {
        throw e
      }
    },
    refreshHandler (list) {
      this.courseList = list
    }
  }
}
</script>
<style lang="scss" scoped>
  .classify-main {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 32px;
    background-color: #FFF;
  }
  .control {
    position: absolute;
    width: 50px;
    height: 36px;
    background-color: #FFF;
    z-index: 3;
    top: 28px;
    right: 0;
  }
  .classify-list {
    padding-right: 100px;
    background-color: #FFF;
    overflow: auto;
    width: calc(100vw - 20px);
    word-break: keep-all;
    white-space: nowrap;
    li {
      height: 30px;
      line-height: 30px;
      text-align: center;
      display: inline-block;
      margin: 7px 0;
      padding: 3px 10px;
      font-size:22px;
      color:#666666;
      &.active {
        background:#FDF5E7;
        border:1px solid #F3AD3C;
        border-radius:64px;
        color:#F3AD3C;
      }
    }
  }
  .show-all {
    position: relative;
    width: calc(100vw - 20px);
    padding: 10px 0;
    .classify-list {
      word-break: unset;
      white-space: unset;
    }
    .control{
      right: -20px;
    }
  }
  .course-list {
    padding-top: 40px;
    height: calc(100vh - 36px);
  }
  .course-item {
    margin: 1%;
    display: inline-block;
    width: 48%;
    img {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }
    .desc {
      position: relative;
      padding: 10px 12px 16px;
      background:#F8F8F8;
      border-radius:0px 0px 10px 10px;
      >h5{
        width:160px;
        font-size:24px;
        color:#222;
        @include elps-wrap(1);
      }
      >span {
        font-size:22px;
        color:#828282;
      }
      .price {
        font-weight:bold;
        margin-top: 10px;
        font-size:32px;
        color:#FE7700;
        span {
          font-weight:400;
          font-size:20px;
        }
        .original-price {
          font-size:20px;
          color:#999999;
          text-decoration: line-through;
        }
      }
      > button {
        position: absolute;
        bottom: 16px;
        right: 12px;
        width:120px;
        height:48px;
        background:#FE7700;
        border-radius:4px;
        font-size:26px;
        line-height:48px;
        color:#FFF;
      }
    }
  }
</style>
