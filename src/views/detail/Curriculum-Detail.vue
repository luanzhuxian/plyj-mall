<template>
  <div :class="$style.curriculum">
    <!-- 海报按钮 -->
    <div :class="$style.haibao">
      <pl-svg :key="1" v-if="creating" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
      <pl-svg :key="2" v-else name="icon-haibao" width="35" @click="createHaibao" />
      <p>分享海报</p>
    </div>
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
        <button
          v-else
          :class="$style.button + ' ' + $style.hasStudied"
          @click="$router.push({ name: 'CourseWatch', params: { id: productId }, query: { liveId: detail.liveId, orderId: detail.orderId, progress: detail.learnProgress } })"
        >
          观看学习
          <!--<i v-if="detail.vodNumber">
            ({{ detail.vodNumber }}次)
          </i>-->
        </button>
      </div>
    </div>
    <Contact :show.sync="showContact" />

    <!-- 海报弹框 -->
    <transition name="fade">
      <div :class="$style.saveHaibao" v-if="showHaibao">
        <div :class="$style.saveHaibaoContent">
          <img :src="haibao" alt="">
          <div :class="$style.saveButton">
            长按识别或保存二维码，分享给朋友吧！
          </div>
          <pl-svg name="icon-close3" fill="#fff" width="30" @click="showHaibao = false" />
        </div>
      </div>
    </transition>
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
import { generateQrcode, cutImageCenter, cutArcImage, loadImage, createText } from '../../assets/js/util'
import { mapGetters } from 'vuex'
const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
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
      showContact: false,
      creating: false,
      showHaibao: false,
      haibao: ''
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
    ...mapGetters(['appId', 'userName', 'avatar']),
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
  deactivated () {
    this.showHaibao = false
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
        this.haibaoImg = await loadImage(courseImg)
        return result
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
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
    },
    async createHaibao (type) {
      if (this.loading) {
        return
      }
      let img = this.haibaoImg
      if (!img) {
        this.$error('图片加载错误')
        return
      }
      if (this.haibao) {
        this.showHaibao = true
        return
      }
      this.creating = true
      // 截取头像
      let lodedAvatar
      try {
        lodedAvatar = await loadImage(this.avatar)
      } catch (e) {
        lodedAvatar = await loadImage(avatar)
      }
      const arcAvatar = cutArcImage(lodedAvatar)
      // 截取中间部分
      img = cutImageCenter(img, 750 / 500)
      let canvas = document.createElement('canvas')
      canvas.width = 1120
      canvas.height = 1346
      let ctx = canvas.getContext('2d')
      // 绘制头部
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 1120, 192)
      ctx.drawImage(arcAvatar, 32, 32, 128, 128)
      ctx.font = 'bold 48px Microsoft YaHei UI'
      ctx.fillStyle = '#000'
      createText(ctx, 192, 120, this.userName, 68, 800, 1)
      try {
        // 二维码
        let qrcode = await generateQrcode(300, this.shareUrl, 15, img, 10, 'canvas')
        // 商品图片
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 192, 1120, 746)
        if (type !== 1 && this.preActivity === 2) {
          ctx.fillStyle = '#FA4D2F'
        } else {
          ctx.fillStyle = '#fff'
        }
        ctx.fillRect(0, 938, 1120, 408)
        ctx.drawImage(qrcode, 750, 978, 320, 320)
        // 填充商品名称
        // let str = this.detail.courseName
        let line = (type !== 1 && this.preActivity === 2) ? 1 : 2
        let price = this.detail.sellingPrice
        let originalPrice = this.detail.originalPrice
        ctx.textBaseline = 'top'
        ctx.font = '56px Microsoft YaHei UI'
        ctx.fillStyle = '#000'
        // 填充价钱
        createText(ctx, 48, 978, this.detail.courseName, 80, 620, line)
        ctx.fillStyle = '#FE7700'
        ctx.fillText('¥', 48, 1190 + (76 - 56) / 2)
        ctx.font = 'bold 88px Microsoft YaHei UI'
        createText(ctx, 96, 1170 + (104 - 88) / 2, String(price), 104)
        // 绘制原价
        if (originalPrice && originalPrice !== price) {
          let priceWidth = ctx.measureText(price).width
          ctx.fillStyle = '#999'
          ctx.font = '56px Microsoft YaHei UI'
          ctx.fillText(`¥${originalPrice}`, 96 + priceWidth + 44, 1190 + (80 - 56) / 2)
          let originalPriceWidth = ctx.measureText(`¥${originalPrice}`).width
          ctx.save()
          // 设置删除线
          ctx.strokeStyle = '#999'
          ctx.beginPath()
          ctx.lineWidth = '4'
          ctx.moveTo(96 + priceWidth + 44, 1190 + (80 - 56) / 2 + 80 / 3)
          ctx.lineTo(96 + priceWidth + 44 + originalPriceWidth, 1190 + (80 - 56) / 2 + 80 / 3)
          ctx.stroke()
        }
        this.haibao = canvas.toDataURL('image/jpeg', 0.7)
        this.showHaibao = true
      } catch (e) {
        throw e
      } finally {
        this.creating = false
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

  .haibao {
    position: fixed;
    right: 0;
    top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 84px;
    font-size: 16px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    z-index: 20;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    > svg {
      width: 33px;
    }
    > p {
      margin-top: 4px;
    }
  }
  .saveHaibao {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 10000;
    .saveHaibaoContent {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: max-content;
      height: max-content;
      > .saveButton {
        width: 560px;
        margin-top: -4px;
        text-align: center;
        line-height: 66px;
        font-size: 28px;
        color: #666;
        background-color: #FBFBFB;
      }
      > img {
        width: 560px;
        object-fit: cover;
      }
      > svg {
        position: absolute;
        top: -64px;
        right: 0;
        width: 48px;
        height: 48px;
        color: #fff;
      }
    }
  }
</style>
