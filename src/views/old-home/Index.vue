<template>
  <div v-if="loaded" :class="$style.mallHome + ' mall-home'">
    <div :class="$style.top">
      <top-text :title="mallName + ' 欢迎您'" :tip="date" />
    </div>
    <swiper
      :options="swiper"
      :class="$style.banner"
      v-if="banner.length > 0"
    >
      <swiper-slide v-for="(item, index) of banner" :key="index">
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
      <div class="banner-pagination" slot="pagination" />
    </swiper>

    <div :class="$style.goodGift" v-if="modules.A.length">
      <div :class="$style.moduleHead">
        <div :class="$style.moduleTitle">
          甄选好礼
        </div>
        <p>为了帮您甄选好礼，您知道我有多努力吗？</p>
      </div>
      <swiper :class="$style.swiper" :options="recommend">
        <swiper-slide v-for="(item, i) of modules.A" :key="i">
          <category-item
            tag="div"
            size="mini"
            :img="item.productMainImage + '?x-oss-process=style/thum-small'"
            :is-active="item.agentProduct"
            :product-id="item.id"
            :product-name="item.productName"
            :price="item.productSkuModels.length && item.productSkuModels[0].price"
            :sale="item.salesVolume"
            :labels="item.labelModels"
          />
        </swiper-slide>
        <div
          v-if="modules.A.length > 3"
          class="good-gift-pagination"
          slot="pagination"
        />
      </swiper>
    </div>

    <div :class="$style.imgModule" v-if="modules.B.length">
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

    <div :class="$style.goodsModule" v-if="modules.C.length">
      <swiper :options="goods" style="overflow: visible">
        <swiper-slide v-for="(item, i) of modules.C" :key="i">
          <div :class="$style.slideWrap">
            <CategoryItem
              :img="item.productImage && item.productImage[0].mediaUrl+ '?x-oss-process=style/thum-small'"
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

    <div :class="$style.imgModule" v-if="modules.D.length">
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

    <div :class="$style.goodsModule" v-if="modules.E.length">
      <swiper :options="goods" style="overflow: visible">
        <swiper-slide v-for="(item, i) of modules.E" :key="i">
          <div :class="$style.slideWrap">
            <CategoryItem
              :img="item.productImage && item.productImage[0].mediaUrl+ '?x-oss-process=style/thum-small'"
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

    <you-like />
  </div>

  <div v-else :class="$style.skeleton">
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
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import TopText from '../../components/Top-Text.vue'
import CategoryItem from './CategoryItem.vue'
import YouLike from './YouLike.vue'
import { getHomeData, getProduct } from '../../apis/home'
import { mapGetters } from 'vuex'
import 'swiper/dist/css/swiper.css'

export default {
  name: 'Home',
  components: {
    swiper,
    swiperSlide,
    TopText,
    CategoryItem,
    YouLike
  },
  data () {
    return {
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
      date: moment().format('MM月DD日 dddd')
    }
  },
  computed: {
    ...mapGetters(['agencyCode', 'agentUser', 'mallName', 'userId'])
  },
  async created () {
    try {
      let { result } = await getHomeData()
      // 优先加载banner，其他请求必须在banner之后
      await this.getBanner(result)
      await this.getModule(result)
      this.loaded = true
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getBanner (homeData) {
      let banner = homeData.find(item => item.moduleType === 'BANNER') || {}
      if (banner && banner.values && banner.values.length) {
        let goods = []
        let other = []
        for (let val of banner.values) {
          if (val.linkType === 'goods') {
            // 获取商品分享id
            val.contentId = val.link ? val.link.split('/').splice(-1, 1)[0] : null
            goods.push(val)
          } else {
            other.push(val)
          }
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
        if (!m.values || !m.values.length) continue
        const ids = m.values
          .filter(val => !!val.link)
          .map(val => val.link)

        if (ids.length) {
          try {
            let { result } = await getProduct(ids)
            for (let item of result) {
              item.productSkuModels.sort((a, b) => a.price - b.price)
            }
            Array.prototype.push.apply(this.modules[m.moduleSuffix], result)
          } catch (e) {
            throw e
          }
        }
      }

      for (let m of module2) {
        if (!m.values || !m.values.length) continue
        for (let val of m.values) {
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
        name: 'Lesson', params: { productSeq, brokerId: this.agentUser ? this.userId : null }
      }
      this.$router.push(route)
    }
  }
}
</script>
<style module lang="scss">
  @import "index.scss";
  .mall-home {
    overflow: hidden;
  }
  /* skeleton starts */
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
    @include skeAnimation(#eee)
  }
  /* skeleton ends */
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
