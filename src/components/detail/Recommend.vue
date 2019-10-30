<template>
  <div :class="$style.recommend + ' slide-padding mt-80'">
    <ModuleTitle :title="title" />
    <LessonItem
      img="//img.alicdn.com/imgextra/i4/1652742042/O1CN014XCR681QxHGRfRMVe_!!0-item_pic.jpg_2200x2200Q50s50.jpg_.webp"
      title="标题标题标题标题标题标题标题标题标题"
      :tags="['名师', '正式课', '15人以下']"
      count="10"
      price="5999.99"
      original-price="8999.99"
    />
  </div>
</template>

<script>
import ModuleTitle from '../common/Module-Title.vue'
import LessonItem from '../item/Lesson-Item.vue'
export default {
  name: 'Recommend',
  components: {
    ModuleTitle,
    LessonItem
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .recommend {}
</style>
