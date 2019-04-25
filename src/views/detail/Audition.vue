<template>
  <div :class="$style.audition">
    <DetailBanner :banners="banners" />
    <DetailInfoBox>
      <DetailTitle>88元包邮 2.27号10点开抢 MG小象休闲衬衣复古港味长袖格子衬衫</DetailTitle>
      <DetailDesc>102人买过</DetailDesc>
      <DetailOtherInfo type="audition" />
    </DetailInfoBox>
    <!-- 课程介绍 -->
    <DetailInfo
      title="课程介绍"
      :content="content"
    />

    <!-- 授课老师 -->
    <div class="slide-padding mt-80">
      <ModuleTitle title="授课老师" />
      <Teaching />
      <Teaching />
    </div>

    <!-- 雅客评论 -->
    <div class="slide-padding mt-80">
      <ModuleTitle title="雅客评论" />
      <Comment />
    </div>

    <!-- 品牌介绍 -->
    <div class="slide-padding mt-80">
      <ModuleTitle title="品牌介绍" />
      <BrandIntro />
    </div>

    <!-- 适用时间 -->
    <div class="slide-padding mt-40">
      <ApplicableTime time="周五至周日 09:00-12:00" />
    </div>

    <!-- 相关课程 -->
    <div class="slide-padding mt-80">
      <ModuleTitle title="相关课程" />
      <AuditionItem
        img="//gw.alicdn.com/bao/uploaded/i3/479184430/O1CN01ayHuQ81iaz4T6HTdm_!!0-item_pic.jpg_300x300q85s150_.webp"
        count="123"
        title="标题标题标题标题标题标题标题标题标题"
        :tags="['新手', '成人', '零基础']"
      />
    </div>

    <buy-now
      type="primary"
      text="免费领取"
    />
  </div>
</template>

<script>
import DetailBanner from '../../components/detail/Banner.vue'
import DetailInfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailOtherInfo from '../../components/detail/Other-Info.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import Teaching from '../../components/detail/Teaching.vue'
import Comment from '../../components/detail/Comment.vue'
import BrandIntro from '../../components/detail/Brand-Intro.vue'
import ApplicableTime from '../../components/detail/Applicable-Time.vue'
import ModuleTitle from '../../components/Module-Title.vue'
import AuditionItem from '../../components/item/Audition-Item.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'

export default {
  name: 'AuditionVue',
  components: {
    DetailBanner,
    DetailInfoBox,
    DetailTitle,
    DetailDesc,
    DetailOtherInfo,
    DetailInfo,
    Teaching,
    Comment,
    BrandIntro,
    ApplicableTime,
    ModuleTitle,
    AuditionItem,
    BuyNow
  },
  data () {
    return {
      content: `
      酷家乐是以分布式并行计算和多媒体数据挖掘为技术核心 ，推出的VR室内设计平台。通过ExaCloud云渲染技术，云设计、BIM、VR、AR、AI等技术，10秒生成效果图，5分钟生成装修方案。通过酷家乐用户可以通过电脑在线完成户型搜索、绘制、改造，拖拽模型进行室内设计，快速渲染预见装修效果。 目前，平台拥有覆盖全国90%的户型库，吸引了超过300万室内设计师（覆盖全国40%的室内设计师）和超1000万业主用户。酷家乐已服务于小米、美克美家、林氏木业、顾家家居、博洛尼等12000家品牌企业，市场覆盖率超过70%。 根据市场需求以及针对人群特点，括里思维设计工作室现推出“酷家乐”软件培训2天课程。每期均设在周末白天，系统讲解酷家乐这款软件从入门到进阶，轻松掌握这款软件使用方法，从而达到轻松出图纸设计不求人的目的。 小班授课，由资深设计师亲自面授课程，并有练习和辅导时间，不用担心学不会的问题。
      `,
      banners: [
        '//img.alicdn.com/imgextra/i1/479184430/O1CN01sFcmvL1iaz4W2wbxh_!!0-item_pic.jpg_640x640q85s150_.webp',
        '//img.alicdn.com/imgextra/i4/479184430/O1CN01EtiSmK1iaz4PmBqlX_!!479184430.jpg_640x640q85s150_.webp',
        '//img.alicdn.com/imgextra/i3/479184430/O1CN01aqngl11iaz4T8wnX3_!!479184430.jpg_640x640q85s150_.webp'
      ]
    }
  }
}
</script>

<style module lang="scss">
  .audition {
    margin-bottom: 120px;
  }
</style>
