<template>
  <div :class="$style.home + ' home'">
    <!--<Welcome organization-name="有鹏来教育" />-->
    <top-text
      :title="mallName"
      :tip="moment().format('MM月DD日 dddd')"
    />
    <!-- banner -->
    <div :class="$style.banner + ' radius-20'">
      <div :class="$style.bannerWarp">
        <swiper :options="swiperOption">
          <template v-for="(item, index) of banner">
            <swiperSlide :key="index">
              <div :class="$style.swiperSlide">
                <!-- 商品 -->
                <router-link
                  tag="img"
                  v-lazy="item.fileId"
                  v-if="item.link && item.linkType === 'goods'"
                  alt=""
                  :to="{ name: 'Lesson', params: { productSeq: item.contentId } }"
                />
                <!-- 分类 -->
                <router-link
                  tag="img"
                  v-lazy="item.fileId"
                  v-else-if="item.link && item.linkType === 'category'"
                  alt=""
                  :to="{ name: 'Classify', params: { optionId: item.link.split('/').splice(-1, 1)[0] } }"
                />
                <!-- 其它 -->
                <img
                  v-else
                  v-lazy="item.fileId"
                  alt=""
                >
                <div :class="$style.bannerInfo">
                  <div v-if="item.productName || item.title">
                    <div
                      :class="$style.name"
                      v-text="item.productName || item.title"
                    />
                    <Grade
                      size="mini"
                      :grade="item.grade || 5"
                    />
                  </div>
                  <div
                    v-if="item.productDesc"
                    :class="$style.desc"
                    v-text="item.productDesc"
                  />
                </div>
              </div>
            </swiperSlide>
          </template>
        </swiper>
      </div>
      <div :class="'swiper-pagination ' + $style.pagination" />
    </div>

    <div
      :class="$style.module"
      v-if="modules[0]"
      style="margin-top: 16vw"
    >
      <module-title
        size="middle"
        title="甄选好礼"
      />
      <feature-lesson-item
        v-for="item of modules[0]"
        :key="item.sequenceNbr"
        :title="item.productName"
        :img="item.productImage[0].mediaUrl"
        :original-price="item.priceModels[0].originPrice"
        :price="item.priceModels[0].price"
        :product-seq="item.contentId"
        :desc="item.productDesc"
      />
    </div>

    <!--<div :class="$style.module" v-if="modules[1]" style="margin-top: 10vw">-->
    <!--<module-title size="middle" title="其他商品" />-->
    <!--<lesson-item-->
    <!--v-for="(item, i) of modules[1]"-->
    <!--:key="i"-->
    <!--:id="item.contentId"-->
    <!--:title="item.productName"-->
    <!--:count="item.salesVolume"-->
    <!--:price="item.priceModels[0].price"-->
    <!--:original-price="item.priceModels[0].originPrice"-->
    <!--:img="item.productImage[0].mediaUrl"-->
    <!--:desc="item.productDesc"-->
    <!--/>-->
    <!--</div>-->

    <!--<div :class="$style.module" v-if="modules[2]" style="margin-top: 10vw">-->
    <!--<lesson-item-->
    <!--v-for="(item, i) of modules[2]"-->
    <!--:key="i"-->
    <!--:id="item.contentId"-->
    <!--:title="item.productName"-->
    <!--:count="item.salesVolume"-->
    <!--:price="item.priceModels[0].price"-->
    <!--:original-price="item.priceModels[0].originPrice"-->
    <!--:img="item.productImage[0].mediaUrl"-->
    <!--:desc="item.productDesc"-->
    <!--/>-->
    <!--</div>-->

    <MaybeYouLike style="margin-top: 10.6vw" />

    <!-- 预约礼 -->
    <!--<Appointment v-if="false" />-->

    <!-- 特色体验课 -->
    <!--<div :class="$style.module" v-if="false">-->
    <!--<module-title size="middle" title="特色体验课" tip="随时退" prefix-icon="time" />-->
    <!--<feature-lesson-item-->
    <!--title="标题标题标题"-->
    <!--count="12"-->
    <!--time="2"-->
    <!--price="29.9"-->
    <!--original-price="400"-->
    <!--img="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550730650039&di=9c554dce4d207908d08f3523a517ec91&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201804%2F24%2F20180424214700_NkJwC.png"-->
    <!--:key="1"-->
    <!--/>-->
    <!--</div>-->

    <!-- 免费试听 -->
    <!--<div :class="$style.module" v-if="false">-->
    <!--<module-title size="middle" title="免费试听" />-->
    <!--<audition-item-->
    <!--img="https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1550723440&di=10270b14349d827ed30d2118ee258425&src=http://b-ssl.duitang.com/uploads/item/201612/06/20161206171416_EeSiT.png"-->
    <!--title="标题标题标题1"-->
    <!--count="12"-->
    <!--:tags="['新手', '成人', '零基础']"-->
    <!--:key="1"-->
    <!--/>-->
    <!--<audition-item-->
    <!--img="https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1550723440&di=10270b14349d827ed30d2118ee258425&src=http://b-ssl.duitang.com/uploads/item/201612/06/20161206171416_EeSiT.png"-->
    <!--title="标题标题标题2"-->
    <!--count="10"-->
    <!--:tags="['新手', '成人', '零基础']"-->
    <!--:key="2"-->
    <!--/>-->
    <!--</div>-->

    <!-- 特惠团购 -->
    <!--<div :class="$style.module" v-if="false">-->
    <!--<module-title size="middle" title="特惠团购" />-->
    <!--<group-buying-->
    <!--img="https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1550723440&di=dfe8eafbeea80f87381b26277eacc257&src=http://b-ssl.duitang.com/uploads/item/201611/09/20161109231418_sUQBA.jpeg"-->
    <!--title="标题标题标题1"-->
    <!--price="29.9"-->
    <!--original-price="400"-->
    <!--:key="1"-->
    <!--/>-->
    <!--<group-buying-->
    <!--img="https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1550723440&di=dfe8eafbeea80f87381b26277eacc257&src=http://b-ssl.duitang.com/uploads/item/201611/09/20161109231418_sUQBA.jpeg"-->
    <!--title="标题标题标题1"-->
    <!--price="29.9"-->
    <!--original-price="400"-->
    <!--:key="2"-->
    <!--/>-->
    <!--</div>-->

    <!-- 本校课程 -->
    <!--<div :class="$style.module" v-if="false">-->
    <!--<module-title size="middle" title="本校课程" tip="查看所有" suffix-icon="right" :route="{ name: 'AllLesson' }" />-->
    <!--<lesson-item-->
    <!--img="https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1550734295&di=018ce7c328ab977c6af33e156a836294&src=http://i1.bbs.fd.zol-img.com.cn/g5/M00/00/0A/ChMkJlmfovWITHSiAAWdzwefynIAAf9fQDOBdIABZ3n187.jpg"-->
    <!--count="300"-->
    <!--title="标题标题标题标题1"-->
    <!--:tags="['名师', '正式课', '15人以下']"-->
    <!--price="5999"-->
    <!--originalPrice="6999"-->
    <!--:key="1"-->
    <!--/>-->
    <!--<lesson-item-->
    <!--img="https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1550734295&di=018ce7c328ab977c6af33e156a836294&src=http://i1.bbs.fd.zol-img.com.cn/g5/M00/00/0A/ChMkJlmfovWITHSiAAWdzwefynIAAf9fQDOBdIABZ3n187.jpg"-->
    <!--title="标题标题标题标题2"-->
    <!--count="300"-->
    <!--:tags="['名师', '正式课', '15人以下']"-->
    <!--price="5999.9"-->
    <!--originalPrice="6999"-->
    <!--:key="2"-->
    <!--/>-->
    <!--</div>-->

    <!-- 名师风采 -->
    <!--<div :class="$style.module" v-if="false">-->
    <!--<module-title size="middle" title="名师风采" />-->
    <!--<div :class="$style.teachers">-->
    <!--<teacher-card-->
    <!--img="https://f11.baidu.com/it/u=3808317761,3997703229&fm=72"-->
    <!--name="张老师"-->
    <!--type="英语 高级教师"-->
    <!--desc="教龄10年，有非常丰富的教学经验"-->
    <!--:key="1"-->
    <!--/>-->
    <!--<teacher-card-->
    <!--img="https://f11.baidu.com/it/u=3808317761,3997703229&fm=72"-->
    <!--name="张老师"-->
    <!--type="英语 高级教师"-->
    <!--desc="教龄10年，有非常丰富的教学经验"-->
    <!--:key="2"-->
    <!--/>-->
    <!--<teacher-card-->
    <!--img="https://f11.baidu.com/it/u=3808317761,3997703229&fm=72"-->
    <!--name="张老师"-->
    <!--type="英语 高级教师"-->
    <!--desc="教龄10年，有非常丰富的教学经验"-->
    <!--:key="3"-->
    <!--/>-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Grade from '../../components/Grade.vue'
import ModuleTitle from '../../components/Module-Title.vue'
import FeatureLessonItem from '../../components/item/Feature-Lesson-Item.vue'
// import AuditionItem from '../../components/item/Audition-Item.vue'
// import GroupBuying from '../../components/Group-Buying-Item.vue'
// import LessonItem from '../../components/item/Lesson-Item.vue'
// import TeacherCard from '../../components/Teacher-Card.vue'
// import Welcome from '../../components/Welcome.vue'
import TopText from '../../components/Top-Text.vue'
// import Appointment from '../../components/Appointment.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getHomeData, getHomeProduct } from '../../apis/home'
import MaybeYouLike from '../../components/Maybe-You-Like'
export default {
  name: 'Home',
  components: {
    swiper,
    swiperSlide,
    Grade,
    ModuleTitle,
    FeatureLessonItem,
    // AuditionItem,
    // GroupBuying,
    // LessonItem,
    // TeacherCard,
    // Welcome,
    // Appointment,
    TopText,
    MaybeYouLike
  },
  data () {
    return {
      moment,
      swiperOption: {
        autoplay: true,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      banner: [],
      homeData: [],
      modules: [],
      maybeLike: []
    }
  },
  computed: {
    ...mapGetters(['userId', 'mallName'])
  },
  async created () {
    try {
      let { result } = await getHomeData()
      this.homeData = result
      this.getBanner()
      this.getModule()
    } catch (e) {
      throw e
    }
  },
  mounted () {
  },
  methods: {
    async getBanner () {
      let banner = this.homeData.filter(item => item.moduleType === 'BANNER')[0]
      if (banner && banner.values.length) {
        let goods = []
        this.banner = banner.values
        for (let val of banner.values) {
          if (val.link && val.linkType === 'goods') {
            goods.push(val.link.split('/').splice(-1, 1)[0])
          // } else {
          //   other.push(val)
          }
        }
        // let { result } = await getHomeProduct(goods)
        // this.banner = [...other, ...result]
      }
    },
    async getModule () {
      let module = this.homeData.filter(item => item.moduleType === 'MODULE').filter(item => /A|C|E/.test(item.moduleSuffix))
      for (let m of module) {
        let ids = []
        for (let val of m.values || []) {
          if (val.link) ids.push(val.link)
        }
        let { result } = await getHomeProduct(ids)
        for (let item of result) {
          // 按照价格从低到高排序
          item.priceModels.sort((a, b) => {
            return a.price - b.price
          })
        }
        this.modules.push(result)
      }
    },
    demo () {
      console.log(document.body.id = 'base')
    },
    demo2 () {
      console.log(document.body.id = 'demo')
    }
  }
}
</script>
<style module lang="scss">
  .home {
    padding: 28px 40px 100px 28px;
  }
  /* 轮播图 */
  .banner {
    position: relative;
    margin-top: 52px;
    background-color: #fff;
    overflow: visible;
    border: 1px solid #fff;
    box-shadow: 0 20px 40px rgba(0, 0, 0, .1);
  }
  .banner-warp {
    margin-top: -16px;
  }
  .swiper-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 614px;
      height: 346px;
      border-radius: 14px;
      object-fit: cover;
    }
  }
  .banner-info {
    width: 614px;
    margin-top: 16px;
    margin-bottom: 25px;
    > div {
      display: flex;
      align-items: center;
    }
    .name {
      font-size: 32px;
      font-weight: bold;
      margin-right: 20px;
    }
    .desc {
      font-size: 20px;
      @include elps-wrap(1);
    }
  }
  .pagination {
    width: 100%;
    margin-top: 30px;
  }
  .module {
    margin-bottom: 80px;
  }
  .teachers {
    display: flex;
    width: 100%;
    margin-top: 28px;
    overflow: auto;
  }
</style>
<style lang="scss">
  .home {
    .swiper-pagination-bullet {
      position: relative;
      width: 24px;
      height: 6px;
      margin-left: 8px;
      border-radius: 3px;
      transition: width .3s linear;
      background-color: $--font-color_gray3;
      opacity: 1;
      &.swiper-pagination-bullet-active {
        width: 50px;
        background-color: $--warning-color;
      }
    }
  }
</style>
