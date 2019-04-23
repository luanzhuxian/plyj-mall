<template>
  <div
    v-if="loaded"
    :class="$style.mallHome + ' mall-home'"
  >
    <div :class="$style.top">
      <top-text
        :title="mallName + ' 欢迎您'"
        :tip="moment().format('MM月DD日 dddd')"
      />
    </div>
    <swiper
      :options="swiper"
      :class="$style.banner"
      v-if="banner.length > 0"
    >
      <swiper-slide
        v-for="(item, index) of banner"
        :key="index"
      >
        <!-- 商品 -->
        <img
          v-if="item.linkType === 'goods' && item.contentId"
          :class="$style.bannerImg"
          data-status="ON_SALE"
          @click="toProductDetail(item.contentId)"
          :src="item.fileId"
        >
        <!-- 分类 -->
        <router-link
          v-else-if="item.linkType === 'category' && item.link"
          :class="$style.bannerImg"
          tag="img"
          :src="item.fileId"
          alt=""
          :to="{ name: 'Classify', params: { optionId: item.link.split('/').splice(-1, 1)[0] } }"
        />
        <!-- 其它 -->
        <img
          v-else
          :src="item.fileId"
          :class="$style.bannerImg"
        >
      </swiper-slide>
      <div
        class="banner-pagination"
        slot="pagination"
      />
    </swiper>

    <div
      :class="$style.goodGift"
      v-if="modules.A.length"
    >
      <div :class="$style.moduleHead">
        <div :class="$style.moduleTitle">
          甄选好礼
        </div>
        <p>为了帮您甄选好礼，您知道我有多努力吗？</p>
      </div>
      <swiper
        :options="recommend"
        :class="$style.swiper"
      >
        <swiper-slide
          v-for="item of modules.A"
          :key="item.contentId"
        >
          <CategoryItem
            tag="div"
            :key="item.contentId"
            :img="item.productImage && item.productImage[0].mediaUrl"
            :product-name="item.productName"
            :product-id="item.sequenceNbr"
            :is-active="item.agentProduct"
            size="mini"
            :price="item.priceModels && item.priceModels[0].price"
          />
        </swiper-slide>
        <div
          v-if="modules.A.length > 3"
          class="good-gift-pagination"
          slot="pagination"
        />
      </swiper>
    </div>

    <div
      :class="$style.imgModule"
      v-if="modules.B.length"
    >
      <router-link
        v-if="modules.B[0].linkType === 'category' && modules.B[0].contentId"
        tag="img"
        :to="{ name: 'Classify', params: { optionId: modules.B[0].contentId } }"
        :src="modules.B[0].fileId"
        :class="$style.imgModuleImg"
      />
      <img
        v-else-if="modules.B[0].linkType === 'goods' && modules.B[0].contentId"
        :src="modules.B[0].fileId"
        :class="$style.imgModuleImg"
        @click="toProductDetail(modules.B[0].contentId)"
      >
      <img
        v-else
        :src="modules.B[0].fileId"
        :class="$style.imgModuleImg"
      >
    </div>

    <div
      :class="$style.goodsModule"
      v-if="modules.C.length"
    >
      <swiper
        :options="goods"
        style="overflow: visible"
      >
        <swiper-slide
          v-for="item of modules.C"
          :key="item.contentId"
        >
          <div :class="$style.slideWrap">
            <CategoryItem
              :img="item.productImage && item.productImage[0].mediaUrl"
              :product-name="item.productName"
              :product-id="item.sequenceNbr"
              :is-active="item.agentProduct"
              size="mini"
              :price="item.priceModels && item.priceModels[0].price"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div
      :class="$style.imgModule"
      v-if="modules.D.length"
    >
      <router-link
        v-if="modules.D[0].linkType === 'category' && modules.D[0].contentId"
        tag="img"
        :to="{ name: 'Classify', params: { optionId: modules.D[0].contentId } }"
        :src="modules.D[0].fileId"
        :class="$style.imgModuleImg"
      />
      <img
        v-else-if="modules.D[0].linkType === 'goods' && modules.D[0].contentId"
        :src="modules.D[0].fileId"
        :class="$style.imgModuleImg"
        @click="toProductDetail(modules.D[0].contentId)"
      >
      <img
        v-else
        :src="modules.D[0].fileId"
        :class="$style.imgModuleImg"
      >
    </div>

    <div
      :class="$style.goodsModule"
      v-if="modules.E.length"
    >
      <swiper
        :options="goods"
        style="overflow: visible"
      >
        <swiper-slide
          v-for="item of modules.E"
          :key="item.contentId"
        >
          <div :class="$style.slideWrap">
            <CategoryItem
              :img="item.productImage && item.productImage[0].mediaUrl"
              :product-name="item.productName"
              :product-id="item.sequenceNbr"
              :is-active="item.agentProduct"
              size="mini"
              :price="item.priceModels && item.priceModels[0].price"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <you-like v-if="showLike" />
  </div>

  <div
    v-else
    :class="$style.skeleton"
  >
    <div :class="$style.skeAnimation + ' ' + $style.skeWelcome" />
    <div :class="$style.skeAnimation + ' ' + $style.skeDate" />
    <div :class="$style.skeAnimation + ' ' + $style.skeA" />
    <div :class="$style.skeB">
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
    </div>
    <div :class="$style.skeAnimation + ' ' + $style.skeC" />
    <div :class="$style.skeD">
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
    </div>
    <div :class="$style.skeAnimation + ' ' + $style.skeE" />
    <div :class="$style.skeF">
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
      <div :class="$style.skeAnimation" />
    </div>
  </div>
</template>
<script>
import TopText from '../../components/Top-Text.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import YouLike from './YouLike.vue'
import CategoryItem from './CategoryItem.vue'
import { getHomeData, getHomeProduct } from '../../apis/home'
import { createBrokerShare } from '../../apis/product'
import { mapGetters } from 'vuex'
// import { mapGetters } from '../../apis/'
import 'swiper/dist/css/swiper.css'
import moment from 'moment'

export default {
  name: 'Home',
  components: {
    swiper,
    swiperSlide,
    YouLike,
    CategoryItem,
    TopText
  },
  data () {
    return {
      showLike: false,
      loaded: false,
      swiper: {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: true,
        loop: false,
        pagination: {
          el: '.banner-pagination',
          clickable: true
        }
      },
      recommend: {
        slidesPerView: 3,
        pagination: {
          el: '.good-gift-pagination'
        }
      },
      goods: {
        slidesPerView: 2.5,
        slidesPerGroup: 3
      },
      banner: [],
      modules: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: []
      },
      maybeLike: [],
      moment
    }
  },
  computed: {
    ...mapGetters(['agencyCode', 'agentUser', 'mallName'])
  },
  async created () {
    try {
      let { result } = await getHomeData(this.agencyCode)
      // 优先加载banner，其他请求必须在banner之后
      await this.getBanner(result)
      await this.getModule(result)
      this.showLike = true
      this.loaded = true
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getBanner (homeData) {
      let banner = homeData.filter(item => item.moduleType === 'BANNER')[0]
      if (banner && banner.values && banner.values.length) {
        let goodsIds = []
        let other = []
        let goods = []
        for (let val of banner.values) {
          if (val.linkType === 'goods') {
            goodsIds.push(val)
          } else {
            other.push(val)
          }
        }
        // 获取商品分享id
        for (let item of goodsIds) {
          let id = item.link ? item.link.split('/').splice(-1, 1)[0] : null
          item.contentId = id
          goods.push(item)
        }
        this.banner = [...goods, ...other]
      }
      return Promise.resolve()
    },
    async getModule (homeData) {
      let MODULE = homeData.filter(item => item.moduleType === 'MODULE')
      let module1 = MODULE.filter(item => /A|C|E/.test(item.moduleSuffix))
      let module2 = MODULE.filter(item => /B|D/.test(item.moduleSuffix))
      for (let m of module1) {
        let ids = []
        for (let val of m.values || []) {
          if (val.link) ids.push(val.link)
        }
        let { result } = await getHomeProduct(ids)
        for (let item of result) {
          this.modules[m.moduleSuffix].push(item)
        }
      }
      for (let m of module2) {
        for (let val of m.values || []) {
          val.contentId = val.link ? val.link.split('/').splice(-1, 1)[0] : null
          this.modules[m.moduleSuffix].push(val)
        }
      }
      return Promise.resolve()
    },
    /*
    * 跳转至商品详情
    * 跳转之前，如果当前用户是helper，尝试获取该商品的brokerId
    * */
    async toProductDetail (productSeq) {
      let route = {
        name: 'Lesson', params: { productSeq, brokerId: null }
      }
      if (this.agentUser) {
        try {
          let { result } = await createBrokerShare(productSeq)
          result = result || {}
          route.params.brokerId = result.sequenceNbr || null
        } catch (e) {
          throw e
        } finally {
          this.$router.push(route)
        }
      }
    }
  }
}
</script>
<style module lang="scss">
  @import "index.scss";
  .mall-home {
    overflow: hidden;
  }

  .skeleton {
    padding: 30px 40px;
    > div {
    }
  }
  .skeWelcome {
    width: 60%;
    height: 53px;
  }
  .skeDate {
    width: 40%;
    height: 37px;
    margin-top: 14px;
    background-color: #eee;
  }
  .skeA, .skeC, .skeE {
    height: 324px;
    margin-top: 60px;
    background-color: #eee;
  }
  .skeB, .skeD, .skeF {
    display: grid;
    width: 100%;
    height: 220px;
    margin-top: 60px;
    justify-content: space-between;
    grid-template-columns: repeat(3, 200px);
    > div {
      background-color: #eee;
    }
  }
  .skeAnimation {
    background: #eee linear-gradient(90deg, #eee 30%, rgba(255, 255, 255, .5) 48%, rgba(255, 255, 255, .5) 52%, #eee 70%) no-repeat 130% center;
    background-size: 200% 100%;
    animation: bgc .8s linear infinite;
  }
  @keyframes bgc {
    0% { background-position: 130% center; }
    100% { background-position: -130% center; }
  }
</style>
<style lang="scss">
  .mall-home {
    .swiper-slide {
      display: inline-flex;
      justify-content: center;
    }
  }
  .banner-pagination {
    position: absolute;
    bottom: 30px;
    right: 50%;
    transform: translateX(50%);
    z-index: 9;
    span {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-left: 7px;
      background-color: rgba(255, 255, 255, 1) !important;
    }
  }
  .good-gift-pagination {
    margin-top: 33px;
    text-align: center;
    span {
      display: inline-block;
      width: 10px;
      height: 17px;
      border-radius: 5px !important;
      transform: rotate(45deg);
      background-color: #d8d8d8;
      opacity: 1;
      margin: 0 16px 0 0 !important;
      &.swiper-pagination-bullet-active {
        background-color: #333;
      }
    }
  }
</style>
