<template>
  <div :class="$style.curriculum">
    <Banner :banners="banners" />
    <InfoBox>
      <div :class="$style.priceBox">
        <div v-if="detail.sellingPrice" :class="$style.price" v-text="detail.sellingPrice" />
        <div v-else :class="$style.free">免费</div>
        <div :class="$style.original">
          <div v-if="detail.priceType && detail.originalPrice && detail.originalPrice !== detail.sellingPrice" class="mr-30">原价：<del v-text="detail.originalPrice" /></div>
          <div>
            <span v-if="detail.sale === 0">正在热销中</span>
            <!--<template v-else-if="detail.sale > 0 && detail.sale < 10">
              <span v-text="detail.sale" />人关注
            </template>-->
            <template v-else>
              <span v-text="detail.sale" />人已学
            </template>
          </div>
        </div>
      </div>
      <!-- 课程名称 -->
      <DetailTitle :product-name="detail.courseName" />
      <!-- 课程描述 -->
      <DetailDesc v-text="detail.courseBrief" />
      <!-- 课程标签 -->
      <Tags :tags="detail.labelModels" />

      <div :class="$style.field">
        <div :class="$style.left">
          <pl-svg name="icon-teacher-d2398" width="30" />
          主讲人：
        </div>
        <div :class="$style.right" v-text="detail.lecturer" />
      </div>

      <div :class="$style.field">
        <div :class="$style.left">
          <pl-svg name="icon-date" width="30" />
          有效期：
        </div>
        <div :class="$style.right" v-text="detail.validityType ? `购买后${detail.validity}天内学完` : '购买后不限次观看'" />
      </div>
    </InfoBox>

    <div :class="$style.detailOrComment">
      <div :class="$style.tabs">
        <div :class="{ [$style.activeTab]: tab === 2 }" @click="tab = 2">
          商品详情
        </div>
      </div>

      <div>
        <DetailInfo
          v-show="tab === 2"
          :content="detail.details || '暂无详情'"
        />
      </div>
    </div>

    <div :class="$style.bottom">
      <div :class="$style.content">
        <router-link :class="$style.link" :to="{ name: 'Home' }">
          <pl-svg name="icon-home" width="38" height="70" />
        </router-link>
        <a :class="$style.link + ' ' + $style.callUs" @click="showContact = true">
          <pl-svg name="icon-call-us" width="80" height="72" />
        </a>
        <button v-if="!detail.isBuy" :class="$style.button + ' ' + $style.clickMeBecauseYouAreYoung" @click="goSubmit">
          立即学习
        </button>
        <button v-else :class="$style.button + ' ' + $style.hasStudied" @click="goStudy">
          观看学习
        </button>
      </div>
    </div>
    <Contact :show.sync="showContact" />
  </div>
</template>

<script>
import Banner from '../../components/detail/Banner.vue'
import InfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import Tags from '../../components/detail/Tags.vue'
import Contact from '../../components/common/Contact.vue'
import { getCourseDetail } from '../../apis/product'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters } from 'vuex'
export default {
  name: 'CurriculumDetail',
  components: {
    Banner,
    InfoBox,
    DetailTitle,
    DetailDesc,
    Tags,
    DetailInfo,
    Contact
  },
  data () {
    return {
      banners: [],
      detail: {},
      agentProduct: false,
      loading: false,
      tab: 2,
      studied: true,
      showContact: false
    }
  },
  props: {
    productId: {
      type: String,
      default: null
    },
    brokerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['appId']),
    // 0 全部，1 helper，2 会员，3 部分用户
    targetGroups () {
      return this.detail.targetGroups
    },
    tagIds () {
      return this.detail.tagIds
    }
  },
  async activated () {
    try {
      await this.refresh()
    } catch (e) {
      throw e
    }
  },
  async mounted () {
    sessionStorage.setItem('shareBrokerId', this.brokerId || '')
  },
  methods: {
    //  获取商品详情
    async getDetail () {
      try {
        this.loading = true
        this.resetState() // 重置一些状态
        // 此步是为了兼容处理，当当前产品的活动结束，重新刷新产品详情页面，当作普通商品
        let { result } = await getCourseDetail(this.productId)
        if (!result) {
          this.$error('该课程异常')
          this.$router.go(-1)
          return
        }
        const {
          courseImg
        } = result
        this.banners = [courseImg]
        this.detail = result

        // 生成分享
        let shareUrl = ''
        if (this.userId) {
          shareUrl = `${this.mallUrl}/detail/curriculum/${this.productId}/${this.userId}`
        } else {
          shareUrl = `${this.mallUrl}/detail/curriculum/${this.productId}`
        }
        this.shareUrl = shareUrl
        share({
          appId: this.appId,
          title: result.productName,
          desc: result.productDesc,
          link: shareUrl,
          imgUrl: result.productMainImage
        })
        return result
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    goStudy () {
      this.$router.push({ name: 'LivePlayBack', params: { id: this.detail.liveId } })
    },
    goSubmit () {
      this.$router.push({ name: 'SubmitCurriculum', params: { productId: this.productId, count: 1 } })
    },
    resetState () {
      this.banners.splice(0, 1000000)
    },
    async refresh () {
      try {
        await this.getDetail()
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .curriculum {
    padding-bottom: 190px;
  }
  .priceBox {
    > .price {
      font-size: 46px;
      color: #FE7700;
      &:before {
        content: '¥';
        font-size: 24px;
      }
    }
    .free {
      font-size: 46px;
      color: #FE7700;
    }
    > .original {
      display: flex;
      align-items: center;
      margin-top: 4px;
      color: #999;
      font-size: 26px;
      del {
        &:before {
          content: '¥';
        }
      }
    }
  }
  .field {
    display: flex;
    align-items: center;
    line-height: 78px;
    font-size: 24px;
    border-top: 1px solid #e7e7e7;
    > .left {
      color: #999;
      > svg {
        vertical-align: -6px;
      }
    }
    > .right {
      color: #000;
    }
  }
  .detailOrComment {
    margin-top: 20px;
    background-color: #fff;
  }
  .tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #e7e7e7;
    > div {
      width: max-content;
      font-size: 26px;
      color: #999;
      height: 90px;
      line-height: 90px;
      box-sizing: border-box;
      font-weight: bold;
      &.activeTab {
        color: #000;
        border-bottom: 2px solid #000;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-top: 60px;
    background-color: #fff;
    > .content {
      display: flex;
      align-items: center;
      height: 110px;
      border-top: 1px solid #e7e7e7;
    }
    .link {
      margin-left: 42px;
      &.callUs {
        margin-left: 36px;
      }
    }
    .button {
      width: 496px;
      margin-left: 40px;
      line-height: 80px;
      font-size: 26px;
      text-align: center;
      color: #fff;
      border-radius: 10px;
    }
    .click-me-because-you-are-young {
      background-color: #FE7700;
    }
    .has-studied {
      background-color: #F2B036;
    }
  }
</style>
