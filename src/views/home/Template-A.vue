<template>
  <div :class="$style.homeTemplateA">
    <div :class="$style.top">
      <top-text :title="mallName + ' 欢迎您'" :tip="date" />
    </div>
    <swiper
      v-if="data['BANNER'].values.length"
      :class="$style.banner"
      :options="swiperOptionBanner"
    >
      <swiper-slide v-for="(item, index) of data['BANNER'].values" :key="index">
        <router-link
          :class="$style.img"
          v-if="item.type && item.value"
          tag="img"
          :src="item.image"
          :to="getRouteLink(item)"
        />
        <img
          :class="$style.img"
          v-else
          :src="item.image"
        >
      </swiper-slide>
      <div class="home-banner-pagination" slot="pagination" />
    </swiper>

    <img
      v-if="data88[mallId]"
      :class="$style.img88"
      :src="data88[mallId].gif" alt=""
      @click="showHaibao"
    >

    <div :class="$style.gift" v-if="data['MODULE_A'].values.length">
      <div :class="$style.head">
        <div :class="$style.title">
          甄选好礼
        </div>
        <p>为了帮您甄选好礼，您知道我有多努力吗？</p>
      </div>
      <swiper :class="$style.swiper" :options="swiperOptionGift">
        <swiper-slide v-for="(item, i) of data['MODULE_A'].values" :key="i">
          <category-item
            tag="div"
            size="mini"
            :img="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-small'"
            :product-id="item.goodsInfo.id"
            :product-name="item.goodsInfo.productName"
            :price="item.goodsInfo.productSkuModels.length && item.goodsInfo.productSkuModels[0].price"
          />
        </swiper-slide>
        <div
          v-if="data['MODULE_A'].values.length > 3"
          class="good-gift-pagination"
          slot="pagination"
        />
      </swiper>
    </div>

    <div :class="$style.activity" v-if="data['MODULE_B'].values.length">
      <router-link
        :class="$style.img"
        v-if="data['MODULE_B'].values[0].type && data['MODULE_B'].values[0].value"
        tag="img"
        :src="data['MODULE_B'].values[0].image"
        :to="getRouteLink(data['MODULE_B'].values[0])"
      />
      <img
        :class="$style.img"
        v-else
        :src="data['MODULE_B'].values[0].image"
      >
    </div>

    <div :class="$style.products" v-if="data['MODULE_C'].values.length">
      <swiper :options="swiperOptionProd">
        <swiper-slide v-for="(item, i) of data['MODULE_C'].values" :key="i">
          <div :class="$style.wrapper">
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
              :img="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-small'"
              :product-id="item.goodsInfo.id"
              :product-name="item.goodsInfo.productName"
              :price="item.goodsInfo.productSkuModels.length && item.goodsInfo.productSkuModels[0].price"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div :class="$style.activity" v-if="data['MODULE_D'].values.length">
      <router-link
        :class="$style.image"
        v-if="data['MODULE_D'].values[0].type && data['MODULE_D'].values[0].value"
        tag="img"
        :src="data['MODULE_D'].values[0].image"
        :to="getRouteLink(data['MODULE_D'].values[0])"
      />
      <img
        :class="$style.img"
        v-else
        :src="data['MODULE_D'].values[0].image"
      >
    </div>

    <div :class="$style.products" v-if="data['MODULE_E'].values.length">
      <swiper :options="swiperOptionProd">
        <swiper-slide v-for="(item, i) of data['MODULE_E'].values" :key="i">
          <div :class="$style.wrapper">
            <category-item
              tag="div"
              size="mini"
              :img="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-small'"
              :product-id="item.goodsInfo.id"
              :product-name="item.goodsInfo.productName"
              :price="item.goodsInfo.productSkuModels.length && item.goodsInfo.productSkuModels[0].price"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <you-like />

    <transition name="fade">
      <div :class="$style.haibao" v-if="haibao">
        <pl-svg name="close3" @click="haibao = ''" color="#fff" />
        <img @click="haibao = ''" :src="haibao" alt="">
      </div>
    </transition>
    <transition name="fade">
      <div :class="$style.pop" v-if="pop">
        <img :src="pop" alt="">
        <pl-svg @click="pop = ''" name="close3" color="#fff" />
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import TopText from '../../components/Top-Text.vue'
import CategoryItem from './components/CategoryItem.vue'
import YouLike from './components/YouLike.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'HomeTemplateA',
  components: {
    swiper,
    swiperSlide,
    TopText,
    CategoryItem,
    YouLike
  },
  data () {
    return {
      swiperOptionBanner: {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: true,
        loop: false,
        pagination: {
          el: '.home-banner-pagination',
          clickable: true
        }
      },
      swiperOptionGift: {
        slidesPerView: 3,
        pagination: {
          el: '.good-gift-pagination'
        }
      },
      swiperOptionProd: {
        slidesPerView: 2.5,
        slidesPerGroup: 3
      },
      date: moment().format('MM月DD日 dddd'),
      haibao: '',
      pop: ''
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['agencyCode', 'agentUser', 'mallName', 'userId', 'mallId']),
    ...mapState(['data88'])
  },
  activated () {
    this.showPop(500)
  },
  created () {
    this.showPop(500)
  },
  methods: {
    getRouteLink ({ type, value }) {
      const name = type === 1 ? 'Classify' : 'Lesson'
      const id = (type === 1 && value === '全部商品') ? '' : value
      return {
        name,
        params: {
          ...(type === 1 ? { optionId: id } : null),
          ...(type === 2 ? { productId: id } : null),
          ...(type === 2 && this.agentUser ? { brokerId: this.userId } : null) // 如果当前用户是helper，尝试获取该商品的brokerId
        }
      }
    },
    showPop (delay) {
      setTimeout(() => {
        this.pop = this.data88[this.mallId].pop
      }, delay)
    },
    showHaibao () {
      this.haibao = this.data88[this.mallId].haibao
    }
  }
}
</script>

<style module lang="scss">
  .home-template-a {
    .top {
      padding: 30px 40px;
    }
    .banner {
      height: 354px;
      .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: #fff;
      }
    }

    .gift {
      width: 686px;
      padding: 40px 30px 30px 30px;
      margin: 48px auto 80px;
      background-color: #fff;
      border-radius: $--radius1;
      box-sizing: border-box;
      .head {
        text-align: center;
        margin-bottom: 40px;
        .title {
          font-size: 36px;
          color: #000;
          font-weight: bold;
        }
        p {
          margin-top: 10px;
          font-size: 24px;
          color: #666;
        }
      }
    }

    .activity {
      margin-top: 41px;
      padding: 0 32px;
      height: 324px;
      .img {
        width: 100%;
        height: 100%;
        border-radius: $--radius1;
        overflow: hidden;
        object-fit: cover;
      }
    }

    .products {
      margin-top: 28px;
      margin-bottom: 40px;
      padding: 0 32px;
      .wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 248px;
        padding: 28px 0;
        background-color: #fff;
        border-radius: $--radius1;
        margin-right: 20px;
      }
    }
    .broker {
      margin-top: 30px
    }
    .youLike {
      padding: 0 32px;
    }
  }

  .img88 {
    width: 100%;
    padding-top: 16px;
    background-color: #f4f5f9;
  }
  .pop, .haibao {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
    z-index: 5;
    > img {
      width: 560px;
    }
    > svg {
      width: 48px;
      margin-top: 64px;
    }
  }
  .haibao {
    text-align: center;
    overflow: auto;
    z-index: 5;
    > img {
      width: 100%;
      justify-items: flex-start !important;
    }
    > svg {
      position: absolute;
      top: 12px;
      left: 20px;
      width: 48px;
      margin-top: 64px;
      z-index: 10;
    }
  }
</style>
<style lang="scss">
  .home-banner-pagination {
    position: absolute;
    bottom: 24px !important;
    text-align: center;
    z-index: 1;
    .swiper-pagination-bullet {
      width: 12px !important;
      height: 12px !important;
      background-color: rgba(255, 255, 255, .5) !important;
      &.swiper-pagination-bullet-active {
        background-color: #fff !important;
      }
    }
  }
  .good-gift-pagination {
    margin-top: 32px;
    text-align: center;
    .swiper-pagination-bullet {
      width: 8px !important;
      height: 16px;
      margin-right: 12px!important;
      background-color: #000;
      transform: rotate(45deg);
      border-radius: 4px;
    }
  }
</style>
