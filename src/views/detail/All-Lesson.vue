<template>
  <div :class="$style.allLesson">
    <TopText title="全部课程" tip="这里什么都有，随便挑吧！" />
    <ul :class="$style.classifyList">
      <li
        v-for="(item, i) of classifyList"
        :class="{ [$style.active]: currentClassify === item.name }"
        @click="changeClassify(item)"
        :key="i">
        {{item.name}}({{item.count}})
      </li>
    </ul>

    <LessonItem
      img="//img.alicdn.com/imgextra/i3/1652742042/TB2mEgbcAfb_uJkHFCcXXXagFXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp"
      title="标题"
      :tags="['正式课', '名师', '15人以下']"
      count="123"
      price="199.90"
      original-price="299"
    />
    <LessonItem
      img="//img.alicdn.com/imgextra/i3/1652742042/TB2mEgbcAfb_uJkHFCcXXXagFXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp"
      title="标题"
      :tags="['正式课', '名师', '15人以下']"
      count="123"
      price="199.90"
      original-price="299"
    />
  </div>
</template>

<script>
import LessonItem from '../../components/item/Lesson-Item.vue'
import TopText from '../../components/Top-Text.vue'
export default {
  name: 'All-Lesson',
  components: {
    LessonItem,
    TopText
  },
  data () {
    return {
      currentClassify: '全部',
      classifyList: [
        {
          name: '全部',
          count: 2
        },
        {
          name: '训练营',
          count: 4
        },
        {
          name: '新生班',
          count: 3
        },
        {
          name: '语文',
          count: 4
        },
        {
          name: '数学',
          count: 3
        },
        {
          name: '英语abcABCXgG',
          count: 4
        },
        {
          name: '物理',
          count: 3
        },
        {
          name: '化学',
          count: 3
        }
      ]
    }
  },
  methods: {
    changeClassify (item) {
      this.currentClassify = item.name
    }
  }
}
</script>

<style module lang="scss">
  .all-lesson {
    padding: 28px 40px;
  }
  .classify-list {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    li {
      position: relative;
      padding: 0 26px;
      line-height: 60px;
      margin: 0 16px 16px 0;
      color: #999;
      font-size: 24px;
      border-radius: 30px;
      background-color: #ffffff;
      vertical-align: baseline;
      &.active {
        color: $--warning-color;
        &:after {
          @include border-half($--warning-color, 60px)
        }
      }
    }
  }
</style>
