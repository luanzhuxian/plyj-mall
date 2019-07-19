<template lang="html">
  <div :class="$style.templateNew">
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
      <div class="banner-pagination" slot="pagination" />
    </swiper>
    <div :class="$style.gift" v-if="data['MODULEA'].values.length">
      <div :class="$style.head">
        <div :class="$style.title">
          甄选好礼
        </div>
        <p>为了帮您甄选好礼，您知道我有多努力吗？</p>
      </div>
      <swiper :class="$style.swiper" :options="swiperOptionGift">
        <swiper-slide v-for="(item, i) of data['MODULEA'].values" :key="i">
          <!-- <category-item
            tag="div"
            size="mini"
            :img="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-small'"
            :is-active="item.agentProduct"
            :product-id="item.goodsInfo.id"
            :product-name="item.goodsInfo.productName"
            :price="item.goodsInfo.productSkuModels.length && item.goodsInfo.productSkuModels[0].price"
          /> -->
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
          v-if="data['MODULEA'].values.length > 3"
          class="good-gift-pagination"
          slot="pagination"
        />
      </swiper>
    </div>

    <div :class="$style.activity" v-if="data['MODULEB'].values.length">
      <router-link
        :class="$style.imgWrapper"
        v-if="data['MODULEB'].values[0].type && data['MODULEB'].values[0].value"
        tag="img"
        :src="data['MODULEB'].values[0].image"
        :to="getRouteLink(data['MODULEB'].values[0])"
      />
      <img
        :class="$style.img"
        v-else
        :src="data['MODULEB'].values[0].image"
      >
    </div>

    <div :class="$style.products" v-if="data['MODULEC'].length">
      <swiper :options="swiperOptionProd" style="overflow: visible">
        <swiper-slide v-for="(item, i) of data['MODULEC'].values" :key="i">
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

    <div :class="$style.activity" v-if="data['MODULED'].values.length">
      <router-link
        :class="$style.imgWrapper"
        v-if="data['MODULED'].values[0].linkType && data['MODULED'].values[0].link"
        tag="img"
        :src="data['MODULED'].values[0].image"
        :to="getRouteLink(data['MODULED'].values[0])"
      />
      <img
        :class="$style.img"
        v-else
        :src="data['MODULED'].values[0].image"
      >
    </div>

    <div :class="$style.products" v-if="data['MODULEE'].values.length">
      <swiper :options="swiperOptionProd" style="overflow: visible">
        <swiper-slide v-for="(item, i) of data['MODULEE'].values" :key="i">
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
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'

export default {
  name: 'TemplateNew',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: true,
        loop: false,
        pagination: {
          el: '.banner-pagination',
          clickable: true
        }
      }
    }
  },
  computed: {
    ...mapGetters(['agencyCode', 'agentUser', 'mallName', 'userId'])
  },
  created () {},
  methods: {
    // getRouteLink ({ type, value }) {
    //   const name = type === 1 ? 'Classify' : 'Lesson'
    //   const id = (type === 1 && value === '全部商品') ? '' : value
    //   return {
    //     name,
    //     params: {
    //       ...(type === 1 ? { optionId: id } : null),
    //       ...(type === 2 ? { productId: id } : null),
    //       ...(type === 2 && this.agentUser ? { brokerId: this.userId } : null) // 如果当前用户是helper，尝试获取该商品的brokerId
    //     }
    //   }
    // }
  }
}
</script>

<style module lang="scss">
  import './index.scss';
</style>
<style lang="scss">
  .swiper-slide {
    display: inline-flex;
    justify-content: center;
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
      background-color: #d8d8d8;
      border-radius: 5px !important;
      margin: 0 16px 0 0 !important;
      transform: rotate(45deg);
      opacity: 1;
      &.swiper-pagination-bullet-active {
        background-color: #333;
      }
    }
  }
</style>
