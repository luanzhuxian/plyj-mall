<template>
  <div :class="$style.groupBuying">
    <DetailBanner :banners="banners" />
    <DetailInfoBox>
      <DetailTitle>标题标题标题标题标题标题标题标题标题</DetailTitle>
      <DetailDesc>简介简洁</DetailDesc>
      <DetailService />
      <pl-svg :class="$style.groupPrice" name="group-price" />
      <Price price="9.9" size="huger" original-price="599"></Price>
    </DetailInfoBox>

    <DetailInfo title="课程详情" :content="content" />

    <div class="slide-padding mt-80">
      <ModuleTitle title="团购详情" />
      <Specific total-price="666" group-price="233" />
    </div>

    <div class="slide-padding mt-80">
      <ModuleTitle title="购买须知" />
      <MustKnow />
    </div>

    <div class="slide-padding mt-80">
      <ModuleTitle title="授课老师" />
      <Teaching />
      <Teaching />
    </div>

    <div class="slide-padding mt-80">
      <ModuleTitle title="雅客评论" />
      <Comment />
    </div>

    <div class="slide-padding mt-80">
      <ModuleTitle title="品牌介绍" />
      <BrandIntro />
    </div>
    <div class="slide-padding mt-40">
      <ApplicableTime time="请购买后向商家咨询！" />
    </div>

    <div class="slide-padding mt-80">
      <ModuleTitle title="商家推荐" />
      <GroupBuyingItem
        img="//img.alicdn.com/imgextra/i4/1652742042/TB2paCOgWmWBuNjy1XaXXXCbXXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp"
        title="标题标题标题标题"
        price="999.99"
        original-price="9999.99"
      />
    </div>
    <buy-now type="warning" text="9.9元 立即抢购" />
  </div>
</template>

<script>
import DetailBanner from '../../components/detail/Banner.vue'
import DetailInfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailService from '../../components/detail/Service.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import Teaching from '../../components/detail/Teaching.vue'
import Comment from '../../components/detail/Comment.vue'
import BrandIntro from '../../components/detail/Brand-Intro.vue'
import MustKnow from '../../components/detail/Must-Know.vue'
import Specific from '../../components/detail/Specific.vue'
import ApplicableTime from '../../components/detail/Applicable-Time.vue'
import ModuleTitle from '../../components/Module-Title.vue'
import GroupBuyingItem from '../../components/Group-Buying-Item.vue'
import Price from '../../components/Price.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'
export default {
  name: 'Group-Buying',
  components: {
    DetailBanner,
    DetailInfoBox,
    DetailTitle,
    DetailDesc,
    DetailService,
    DetailInfo,
    Teaching,
    MustKnow,
    Comment,
    Specific,
    BrandIntro,
    ApplicableTime,
    ModuleTitle,
    GroupBuyingItem,
    Price,
    BuyNow
  },
  data () {
    return {
      content: '酷家乐是以分布式并行计算和多媒体数据挖掘为技术核心 ，推出的VR室内设计平台。通过ExaCloud云渲染技术，云设计、BIM、VR、AR、AI等技术，10秒生成效果图，5分钟生成装修方案。通过酷家乐用户可以通过电脑在线完成户型搜索、绘制、改造，拖拽模型进行室内设计，快速渲染预见装修效果。 目前，平台拥有覆盖全国90%的户型库，吸引了超过300万室内设计师（覆盖全国40%的室内设计师）和超1000万业主用户。酷家乐已服务于小米、美克美家、林氏木业、顾家家居、博洛尼等12000家品牌企业，市场覆盖率超过70%。 根据市场需求以及针对人群特点，括里思维设计工作室现推出“酷家乐”软件培训2天课程。每期均设在周末白天，系统讲解酷家乐这款软件从入门到进阶，轻松掌握这款软件使用方法，从而达到轻松出图纸设计不求人的目的。 小班授课，由资深设计师亲自面授课程，并有练习和辅导时间，不用担心学不会的问题。',
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
  .group-buying {
    margin-bottom: 120px;
  }
  .group-price {
    display: block;
    width: 88px;
    margin-top: 40px;
    margin-bottom: 12px;
  }
</style>
