<template>
  <div :class="$style.battlefieldReport">
    <div :class="$style.banner">
      <img src="https://mallcdn.youpenglai.com/static/beat-plague/dd0bb858-2faa-4be3-9eba-5a6edf68687a.png" alt="">
    </div>
    <div :class="$style.map">
      <img :src="epidemicMap" alt="">
    </div>
    <div :class="$style.nationwide">#全国疫情#</div>
    <div :class="$style.count" v-if="epidemicData">
      <div>
        <p v-text="epidemicData.cure" />
        <p>治愈病例</p>
      </div>
      <div>
        <p v-text="epidemicData.added" />
        <p>新增病例</p>
      </div>
      <div>
        <p v-text="epidemicData.confirmed" />
        <p>确诊病例</p>
      </div>
    </div>

    <div :class="$style.module">
      <div :class="$style.title">
        最新消息
      </div>
      <div :class="$style.news">
        <div
          :class="$style.newsItem"
          v-for="(item, i) of news"
          :key="i"
        >
          <div :class="$style.timeRad" />
          <div :class="$style.timeLine" />
          <div :class="$style.datetime" v-text="item.datetime" />
          <div :class="$style.content">
            <div :class="$style.title" v-text="item.title" />
            <div :class="$style.detail" v-text="item.desc" />
            <div :class="$style.from">
              来源：{{ item.from }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :class="$style.module">
      <div :class="$style.title">
        战役宣誓  与您携手
      </div>
      <div :class="$style.toPatriarch">
        <PlVideo
          url="http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/bJRquiluD-w7kubp13-xLdwHNVY-QUTVF31F-du0Z9OUK-gwXI-1580448044753.mp4"
          :radius="0"
          :width="750"
          :height="422"
        />
        <article :style="{ '--line': line }">
          <p>致家长书：</p>
          <p>
            亲爱的家长亲爱的家长亲爱的家战亲爱的家长,
            亲爱的家长亲爱的家长亲爱的家战亲爱的家长,
            亲爱的家长亲爱的家长亲爱的家战亲爱的家长
          </p>
        </article>
        <button @click="line = 100" v-show="line !== 100">查看更多</button>
      </div>
    </div>

    <div :class="$style.module">
      <div :class="$style.title">
        那些感动我的瞬间
      </div>
      <swiper :options="swiperOptions">
        <swiperSlide v-for="(item, i) of touched" :key="i">
          <div :class="$style.imageText">
            <div :class="$style.image">
              <img :src="item.img" alt="">
              <span>来源：{{ item.from }}</span>
            </div>
            <div :class="$style.title" v-text="item.desc" />
          </div>
        </swiperSlide>
      </swiper>
    </div>

    <div :class="$style.module">
      <div :class="$style.title">
        防役我必须知道的事
      </div>
      <div :class="$style.imageText">
        <img
          src="https://mallcdn.youpenglai.com/static/beat-plague/928e0156-28ab-42bd-85fd-d7f634aa78d4.png"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script>
import PlVideo from '../../components/common/Video.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import axios from 'axios'
const request = axios.create({
  responseType: 'json'
})
export default {
  name: 'BattlefieldReport',
  components: {
    PlVideo,
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOptions: {
        autoplay: true,
        slidesPerView: 1.2,
        spaceBetween: 100,
        loop: true
      },
      line: 2,
      // 疫情分别图
      epidemicMap: '',
      // 治愈的
      epidemicData: null,
      // 感动瞬间
      touched: [],
      // 新闻
      news: []
    }
  },
  async created () {
    request.get(`https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/beat-plague/data/battlefield-report-data.json?time=${Date.now()}`)
      .then(res => {
        const data = res.data
        let {
          news,
          epidemicMap,
          epidemicData,
          touched
        } = data
        this.news = news
        this.epidemicMap = epidemicMap
        this.epidemicData = epidemicData
        this.touched = touched
        console.log(data)
      })
      .catch(e => {
        alert(e.message)
      })
  }
}
</script>

<style module lang="scss">
  .battlefieldReport {
    padding-bottom: 100px;
    background-color: #fff;
  }
  .banner {
    > img {
      width: 750px;
      height: 360px;
    }
  }
  .count {
    display: flex;
    justify-content: space-around;
    margin-bottom: 24px;
    padding-top: 30px;
    background-color: #F4F4F4;
    > div > p {
      text-align: center;
      &:nth-of-type(1) {
        margin-bottom: 16px;
        font-size: 40px;
        font-weight: bold;
        color: #3B7DB7;
      }
      &:nth-of-type(2) {
        margin-bottom: 32px;
        font-size: 30px;
        color: #373737;
      }
    }
  }
  .nationwide {
    line-height: 68px;
    font-size: 40px;
    font-weight: bolder;
    color: #fff;
    text-align: center;
    background-color: #3B7DB7;
  }
  .province {
    line-height: 68px;
    font-size: 40px;
    font-weight: bolder;
    color: #fff;
    text-align: center;
    background-color: #5DA5E3;
  }
  .module {
    margin-top: 42px;
    > .title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 40px;
      font-weight: bold;
      color: #373737;
      &:before {
        display: inline-block;
        content: '';
        width: 10px;
        height: 38px;
        margin-right: 12px;
        background-color: #3B7DB7;
      }
    }
  }
  .toPatriarch {
    padding-bottom: 26px;
    text-align: center;
    background-color: #F8FAFF;
    > article {
      padding: 20px 28px;
      font-size: 30px;
      line-height: 44px;
      color: #373737;
      text-align: left;
      > p:nth-of-type(2) {
        text-indent: 60px;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //-webkit-box为旧的属性值，2012年最新的标准草案为flex，如果把值该为flex，将不支持多行省略号。
        -webkit-line-clamp: var(--line); //webkit支持此属性，并且是一个不规范的属性，没有出现在css规范的草案中。必须结合display: -webkit-box和-webkit-box-orient: vertical;属性一起使用
        -webkit-box-orient: vertical;
      }
    }
    > button {
      width: 242px;
      line-height: 52px;
      text-align: center;
      color: #fff;
      font-size: 32px;
      background-color: #3B7DB7;
      border-radius: 26px;
    }
  }
  .news {
    padding: 0 22px;
  }
  .news-item {
    position: relative;
    border-radius: 20px;
    margin-bottom: 20px;
    &:nth-last-of-type(1) {
      > .timeLine {
        display: none;
      }
    }
    > .timeRad {
      position: absolute;
      left: 0;
      top: 0;
      width: 1.6vw;
      height: 1.6vw;
      border-radius: 50%;
      background: #00b377;
      border: 1.2vw solid #e5f7f1;
      z-index: 2;
    }
    > .timeLine {
      position: absolute;
      top: 2vw;
      left: 1.7333333333333334vw;
      bottom: -5.33333333vw;
      width: .5333333333333333vw;
      background-color: #e5f7f1;
    }
    > .datetime {
      font-size: 3.7333333333333334vw;
      line-height: 3.7333333333333334vw;
      color: #aaa;
      margin-bottom: 2.2666666666666666vw;
      padding-left: 6.666666666666667vw;
    }
    > .content {
      width: 80vw;
      background-color: #f8f8f8;
      border-radius: 1.6vw;
      padding: 4.8vw 3.2vw;
      margin-bottom: 4.8vw;
      margin-left: 6.666666666666667vw;
      box-sizing: border-box;
      > .title {
        color: #444;
        font-size: 4.266666666666667vw;
        line-height: 5.6vw;
        font-weight: 700;
      }
      > .detail {
        margin-bottom: 20px;
        font-size: 3.7333333333333334vw;
        line-height: 5.333333333333333vw;
        color: #666;
        text-align: justify;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; //-webkit-box为旧的属性值，2012年最新的标准草案为flex，如果把值该为flex，将不支持多行省略号。
        -webkit-line-clamp: var(--line2); //webkit支持此属性，并且是一个不规范的属性，没有出现在css规范的草案中。必须结合display: -webkit-box和-webkit-box-orient: vertical;属性一起使用
        -webkit-box-orient: vertical;
      }
      > .from {
        color: #ccc;
        font-size: 3.2vw;
        line-height: 3.2vw;
      }
    }
  }
  .imageText {
    > img {
      width: 750px;
    }
    > .image {
      position: relative;
      height: 422px;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      > span {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 96px;
        padding: 0 28px;
        line-height: 126px;
        font-size: 28px;
        color: #fff;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
        box-sizing: border-box;
      }
    }
    > .title {
      padding: 0 26px;
      line-height: 82px;
      font-size: 32px;
      background-color: #F8FAFF;
      @include elps();
    }
  }
</style>
