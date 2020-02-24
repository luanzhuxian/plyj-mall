<template>
  <div :class="$style.onlineClassroom">
    <div
      :class="{
        [$style.classifyMain]: true,
        [$style.showAll]: isShowAll
      }"
    >
      <ul :class="$style.classifyList">
        <li
          v-for="(item, index) in classifyList"
          :class="{
            [$style.active]: form.category1 === item.category1 && form.category2===item.category2
          }"
          :key="index"
          @click="classifyClick(item)"
        >
          {{ item.categoryName }}
        </li>
        <li :class="$style.close" v-if="isShowAll">
          <pl-svg
            name="icon-close"
            fill="#fff"
            width="36"
            @click="isShowAll = false"
          />
        </li>
      </ul>
      <transition name="fade">
        <div :class="$style.controlWrap" v-if="classifyList.length">
          <div :class="$style.control">
            <pl-svg
              v-show="!isShowAll"
              name="icon-group"
              width="24"
              fill="#484848"
              @click="isShowAll = true"
            />
          </div>
        </div>
      </transition>
    </div>
    <load-more
      ref="loadMore"
      :form="form"
      :request-methods="requestMethods"
      :loading.sync="loading"
      @refresh="refreshHandler"
      no-content-tip="此分类下还没有课程"
    >
      <template>
        <ul :class="$style.courseList">
          <li v-for="(item, index) of courseList" :key="index" :class="$style.courseItem">
            <img :src="item.courseImg + '?x-oss-process=style/thum-small'" alt="">
            <div :class="$style.desc">
              <div :class="$style.title" v-text="item.courseName" />
              <div :class="$style.text1">主讲讲师： {{ item.lecturer }}</div>
              <div :class="$style.bottom">
                <span v-if="item.priceType === 1">
                  <span :class="$style.price" v-text="item.sellingPrice" />
                  <del v-if="item.originalPrice" :class="$style.original" v-text="item.originalPrice" class="rmb" />
                </span>
                <span v-else :class="$style.free">免费</span>
                <pl-button type="primary" size="small" @click="$router.push({name: 'Curriculum', params:{ productId: item.id }})">立即学习</pl-button>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </load-more>
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
  deactivated () {
    this.isShowAll = false
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
<style lang="scss" module>
  .online-classroom {
    padding: 14vw 20px 20px;
    min-height: 50vh;
    background-color: #fff;
  }
  .classify-main {
    position: fixed;
    top: 91px;
    left: 0;
    min-height: 105px;
    width: 100vw;
    padding: 0 74px 0 28px;
    box-sizing: border-box;
    overflow-x: scroll;
    overflow-y: hidden;
    background-color: #fff;
    z-index: 10;
  }
  .control-wrap {
    position: fixed;
    top: 117px;
    right: 0;
    padding-left: 20px;
    overflow-y: hidden;
  }
  .control {
    width: 70px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    background-color: #FFF;
    box-shadow: -3px 0 6px rgba(0, 0, 0, .2);
    > svg {
      margin-left: 18px;
    }
  }
  .classify-list {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: max-content;
    padding-right: 90px;
    padding-top: 26px;
    background-color: #fff;
    box-sizing: border-box;
    > li {
      display: inline-block;
      padding: 0 15px;
      line-height: 42px;
      text-align: center;
      font-size: 22px;
      color: #666666;
      word-break: keep-all;
      white-space : nowrap;
      &.active {
        background: #FDF5E7;
        border: 1px solid #F3AD3C;
        border-radius: 22px;
        color: #F3AD3C;
      }
    }
    .close {
      position: absolute;
      bottom: -70px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .show-all {
    padding: 0;
    height: calc(100vh - 178px);
    box-shadow: 0 5px 5px rgba(0, 0, 0, .1);
    background-color: rgba(0, 0, 0, .3);
    .classify-list {
      width: 100%;
      flex-wrap: wrap;
      padding-right: 28px;
      padding-left: 28px;
    }
    .control {
      display: none;
    }
  }
  .course-list {
    display: flex;
  }
  .course-item {
    margin-right: 30px;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
    > img {
      width: 340px;
      height: 228px;
      margin-bottom: 16px;
      object-fit: cover;
      border-radius: 20px;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 18px;
    .price {
      font-size: 32px;
      color: #FE7700;
    }
    .original {
      font-size: 20px;
      color: #999;
    }
    .free {
      font-size: 28px;
      color: #FE7700;
    }
  }
  .title {
    margin-bottom: 4px;
    font-size: 24px;
    color: #000;
    font-weight: bold;
    @include elps-wrap(1);
  }
  .text1 {
    font-size: 22px;
    color: #666;
    @include elps-wrap(1);
  }
</style>
