<template>
<div :class="$style.mallHome + ' mall-home'">
  <div :class="$style.top">
    <top-text :title="mallName + ' 欢迎您'" :tip="moment().format('MM月DD日 dddd')"></top-text>
  </div>
  <swiper :options="swiper" :class="$style.banner">
    <swiper-slide
      v-for="(item, index) of banner"
      :key="index">
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
      <img v-else :src="item.fileId" :class="$style.bannerImg" >
    </swiper-slide>
    <div class="banner-pagination" slot="pagination" />
  </swiper>

  <div :class="$style.goodGift" v-if="modules.A.length">
    <div :class="$style.moduleHead">
      <div :class="$style.moduleTitle">甄选好礼</div>
      <p>为了帮您甄选好礼，您知道我有多努力吗？</p>
    </div>
    <swiper :options="recommend" :class="$style.swiper">
      <swiper-slide v-for="item of modules.A" :key="item.contentId">
        <CategoryItem
          tag="div"
          :key="item.contentId"
          :img="item.productImage && item.productImage[0].mediaUrl"
          :productName="item.productName"
          :productId="item.sequenceNbr"
          :isActive="item.agentProduct"
          size="mini"
          :price="item.priceModels && item.priceModels[0].price"
        />
      </swiper-slide>
      <div v-if="modules.A.length > 3" class="good-gift-pagination" slot="pagination" />
    </swiper>
  </div>

  <div :class="$style.imgModule"  v-if="modules.B.length">
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
    />
    <img v-else :src="modules.B[0].fileId" :class="$style.imgModuleImg" />
  </div>

  <div :class="$style.goodsModule"  v-if="modules.C.length">
    <swiper :options="goods" style="overflow: visible">
      <swiper-slide v-for="item of modules.C" :key="item.contentId">
        <div :class="$style.slideWrap">
          <CategoryItem
            :img="item.productImage && item.productImage[0].mediaUrl"
            :productName="item.productName"
            :productId="item.sequenceNbr"
            :isActive="item.agentProduct"
            size="mini"
            :price="item.priceModels && item.priceModels[0].price"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>

  <div  :class="$style.imgModule" v-if="modules.D.length">
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
    <img v-else :src="modules.D[0].fileId" :class="$style.imgModuleImg" />
  </div>

  <div :class="$style.goodsModule" v-if="modules.E.length">
    <swiper :options="goods" style="overflow: visible">
      <swiper-slide v-for="item of modules.E" :key="item.contentId">
        <div :class="$style.slideWrap">
          <CategoryItem
            :img="item.productImage && item.productImage[0].mediaUrl"
            :productName="item.productName"
            :productId="item.sequenceNbr"
            :isActive="item.agentProduct"
            size="mini"
            :price="item.priceModels && item.priceModels[0].price"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>

  <you-like v-if="showLike"></you-like>
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
