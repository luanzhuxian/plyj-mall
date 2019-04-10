<template>
  <div :class="$style.featureLesson">
    <DetailBanner :banners="banners" />
    <DetailInfoBox>
      <DetailTitle>
        标题标题标题标题标题标题标题标题标题标题标题标题
      </DetailTitle>
      <DetailDesc>
        简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介
      </DetailDesc>
      <DetailTags :tags="tags" />
      <div :class="$style.price">
        <Price
          price="29.9"
          size="huge"
          original-price="499"
        />
        <div :class="$style.service">
          <pl-svg name="time" />
          <span>随时退</span>
        </div>
      </div>
      <DetailOtherInfo type="feature" />
    </DetailInfoBox>

    <DetailInfo
      :content="content"
      title="体验详情"
    />

    <div class="slide-padding mt-80">
      <ModuleTitle title="授课老师" />
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
    <!-- 适用时间 -->
    <div class="slide-padding mt-40">
      <ApplicableTime time="周五至周日 09:00-12:00" />
    </div>
    <div class="slide-padding mt-80">
      <ModuleTitle title="商家推荐" />
      <FeatureLessonItem
        img="//img.alicdn.com/imgextra/i4/1652742042/TB2k5g2IbGYBuNjy0FoXXciBFXa_!!1652742042.jpg_2200x2200Q90s50.jpg_.webp"
        title="标题标题标题标题标题标题标题"
        time="2"
        count="23"
        price="99"
        original-price="199"
      />
      <FeatureLessonItem
        img="//img.alicdn.com/imgextra/i4/1652742042/TB2k5g2IbGYBuNjy0FoXXciBFXa_!!1652742042.jpg_2200x2200Q90s50.jpg_.webp"
        title="标题标题标题标题标题标题标题"
        time="2"
        count="23"
        price="99"
        original-price="199"
      />
    </div>

    <buy-now
      type="warning"
      text="立即购买"
    />
  </div>
</template>
<script>
import Price from '../../components/Price.vue'
import ModuleTitle from '../../components/Module-Title.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailInfoBox from '../../components/detail/Info-Box.vue'
import DetailTags from '../../components/detail/Tags.vue'
import DetailBanner from '../../components/detail/Banner.vue'
import DetailOtherInfo from '../../components/detail/Other-Info.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import Teaching from '../../components/detail/Teaching.vue'
import Comment from '../../components/detail/Comment.vue'
import BrandIntro from '../../components/detail/Brand-Intro.vue'
import FeatureLessonItem from '../../components/item/Feature-Lesson-Item.vue'
import ApplicableTime from '../../components/detail/Applicable-Time.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'

export default {
  name: 'FeatureLesson',
  components: {
    Price,
    ModuleTitle,
    DetailTitle,
    DetailDesc,
    DetailInfoBox,
    DetailTags,
    DetailBanner,
    DetailOtherInfo,
    DetailInfo,
    Teaching,
    Comment,
    BrandIntro,
    FeatureLessonItem,
    ApplicableTime,
    BuyNow
  },
  data () {
    return {
      tags: ['标签', '标签', '标签', '标签', '标签', '标签', '标签'],
      banners: [
        '//img.alicdn.com/imgextra/i4/1652742042/TB2f8YmygKTBuNkSne1XXaJoXXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp',
        '//img.alicdn.com/imgextra/i2/1652742042/TB2sV2wGv9TBuNjy0FcXXbeiFXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp',
        '//img.alicdn.com/imgextra/i4/1652742042/TB2TMrYGx1YBuNjy1zcXXbNcXXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp'
      ],
      content:
      `简单舒适的卫衣，连帽抽绳设计，时尚六色随心选，个性的主题slogan穿出自己的风格，时而俏皮，时而霸气，时而淑女，总有一款是你想要的风格。美美的灯笼袖设计，简单中透着时尚，宽松版型，随便一搭就可以美美哒出门啦，再也不用担心蓝朋友手机里的自己啦~
      <img src="//img.alicdn.com/imgextra/i4/1652742042/TB2f8YmygKTBuNkSne1XXaJoXXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp" >
      <img src="//img.alicdn.com/imgextra/i4/1652742042/O1CN011QxHDpFE5mnOkqB_!!1652742042.jpg_2200x2200Q90s50.jpg_.webp" alt="">`
    }
  }
}
</script>
<style module lang="scss">
  .feature-lesson {
    margin-bottom: 120px;
  }
  .price {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 30px;
  }
  .service {
    font-size: 24px;
    color: #a8a8a8;
    svg {
      width: 32px;
      margin-right: 10px;
      vertical-align: -8px;
    }
  }
</style>
