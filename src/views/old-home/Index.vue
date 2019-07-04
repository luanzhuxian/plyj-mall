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
        <router-link
          :class="$style.bannerImg"
          v-if="item.linkType && item.link"
          tag="img"
          :src="item.image"
          :to="getRouteLink(item)"
        />
        <img
          :class="$style.bannerImg"
          v-else
          :src="item.image"
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
        :class="$style.imgModuleImg"
        v-if="modules.B[0].linkType && modules.B[0].link"
        tag="img"
        :src="modules.B[0].image"
        :to="getRouteLink(modules.B[0])"
      />
      <img
        :class="$style.imgModuleImg"
        v-else
        :src="modules.B[0].image"
      >
    </div>

    <div :class="$style.goodsModule" v-if="modules.C.length">
      <swiper :options="goods" style="overflow: visible">
        <swiper-slide v-for="(item, i) of modules.C" :key="i">
          <div :class="$style.slideWrap">
            <!-- <category-item
              tag="div"
              size="mini"
              :img="item.productMainImage + '?x-oss-process=style/thum-small'"
              :is-active="item.agentProduct"
              :product-id="item.id"
              :product-name="item.productName"
              :price="item.productSkuModels.length && item.productSkuModels[0].price"
              :sale="item.salesVolume"
              :labels="item.labelModels"
            /> -->
            <category-item
              tag="div"
              size="mini"
              :img="item.productMainImage + '?x-oss-process=style/thum-small'"
              :is-active="item.agentProduct"
              :product-id="item.id"
              :product-name="item.productName"
              :price="item.productSkuModels.length && item.productSkuModels[0].price"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div :class="$style.imgModule" v-if="modules.D.length">
      <router-link
        :class="$style.imgModuleImg"
        v-if="modules.D[0].linkType && modules.D[0].link"
        tag="img"
        :src="modules.D[0].image"
        :to="getRouteLink(modules.D[0])"
      />
      <img
        :class="$style.imgModuleImg"
        v-else
        :src="modules.D[0].image"
      >
    </div>

    <div :class="$style.goodsModule" v-if="modules.E.length">
      <swiper :options="goods" style="overflow: visible">
        <swiper-slide v-for="(item, i) of modules.E" :key="i">
          <div :class="$style.slideWrap">
            <category-item
              tag="div"
              size="mini"
              :img="item.productMainImage + '?x-oss-process=style/thum-small'"
              :is-active="item.agentProduct"
              :product-id="item.id"
              :product-name="item.productName"
              :price="item.productSkuModels.length && item.productSkuModels[0].price"
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
        this.banner = banner.values
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
        this.modules[m.moduleSuffix] = m.values
      }
      return Promise.resolve()
    },
    getRouteLink ({ linkType, link }) {
      const name = linkType === 'goods'
        ? 'Lesson'
        : linkType === 'category'
          ? 'Classify'
          : null
      const index = link.lastIndexOf('/')
      const id = index ? link.substring(index + 1) : null
      return {
        name,
        params: {
          ...(linkType === 'category' ? { optionId: id } : null),
          ...(linkType === 'goods' ? { productId: id } : null),
          ...(linkType === 'goods' && this.agentUser ? { brokerId: this.userId } : null) // 如果当前用户是helper，尝试获取该商品的brokerId
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
