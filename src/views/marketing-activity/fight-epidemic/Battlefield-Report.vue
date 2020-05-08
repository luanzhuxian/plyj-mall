<template>
    <div :class="$style.battlefieldReport">
        <div :class="$style.banner">
            <img src="https://mallcdn.youpenglai.com/static/beat-plague/dd0bb858-2faa-4be3-9eba-5a6edf68687a.png" alt="">
        </div>
        <div :class="$style.map" ref="map">
            <!--<img v-imgError :src="epidemicMap" alt="">-->
        </div>
        <div :class="$style.nationwide">
            <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/beat-plague/%23%E5%85%A8%E5%9B%BD%E7%96%AB%E6%83%85%23%402x.png" alt="">
        </div>
        <div :class="$style.count" v-if="epidemicData">
            <div>
                <p v-text="epidemicData.confirmed" style="color: #DD5D32;" />
                <p>确诊病例</p>
            </div>
            <div>
                <p v-text="epidemicData.suspectedCount" style="color: #dda201;" />
                <p>疑似病例</p>
            </div>
            <div>
                <p v-text="epidemicData.deadCount" style="color: #000;" />
                <p>死亡病例</p>
            </div>
            <div>
                <p v-text="epidemicData.cure" style="color: #3B7DB7;" />
                <p>治愈病例</p>
            </div>
        </div>

        <div :class="$style.module" v-if="data.content || data.mediaUrl">
            <div :class="$style.title">
                战疫宣誓  与您携手
            </div>
            <div :class="$style.toPatriarch">
                <PlVideo
                    v-if="data.mediaUrl"
                    :url="data.mediaUrl"
                    :radius="0"
                    :width="750"
                    :height="422"
                />
                <template v-if="data.content && data.content.length > 30">
                    <article :style="{ '--line': line }">
                        <p>致家长书：</p>
                        <p v-text="data.content" />
                    </article>
                    <button @click="line = 100" v-show="line !== 100">查看更多</button>
                </template>
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
                    <div :class="$style.datetime" v-text="item.pubDateStr" />
                    <div :class="$style.content">
                        <div :class="$style.title" v-text="item.title" />
                        <div :class="$style.detail" v-text="item.summary" />
                        <div :class="$style.from">
                            来源：{{ item.source }}
                        </div>
                    </div>
                </div>
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
                            <img v-imgError :src="item.img" alt="">
                            <span>来源：{{ item.from }}</span>
                        </div>
                        <div :class="$style.title">
                            <p v-text="item.desc" />
                        </div>
                    </div>
                </swiperSlide>
            </swiper>
        </div>

        <div :class="$style.module">
            <div :class="$style.title">
                防疫我必须知道的事
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
import PlVideo from '../../../components/common/Video.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import axios from 'axios'
import { getReportDetail } from '../../../apis/fight-epidemic'
import China from '../../../../static/china.json'
import moment from 'moment'
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
                slidesPerView: 1.15,
                spaceBetween: 30,
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
            news: [],

            // 视频数据
            data: {}
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async created () {
    },
    async mounted () {
        const res = await request.get(`https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/beat-plague/data/battlefield-report-data.json?time=${ Date.now() }`)
        const {
            news,
            epidemicMap,
            epidemicData,
            touched,
            dataList
        } = res.data
        for (const item of news) {
            item.pubDateStr = moment(item.pubDate).fromNow()
        }
        this.news = news
        this.epidemicMap = epidemicMap
        this.epidemicData = epidemicData
        this.touched = touched
        if (this.id) {
            try {
                const { result } = await getReportDetail(this.id)
                const { content, mediaUrl } = result
                this.data = {
                    content,
                    mediaUrl
                }
            } catch (e) {
                throw e
            }
        }
        const myChart = window.echarts.init(this.$refs.map)
        const option = { tooltip: {
            formatter (params, ticket, callback) {
                return `${ params.seriesName }<br />${ params.name }：${ params.value }`
            }
        },
        visualMap: {
            type: 'piecewise',
            left: 20,
            bottom: 80,
            itemWidth: 50,
            itemHeight: 30,
            pieces: [
                // 不指定 max，表示 max 为无限大（Infinity）。
                { min: 5000, color: '#390f0f' },
                // 不指定 max，表示 max 为无限大（Infinity）。
                { min: 1000, max: 4999, color: '#70161d' },
                { min: 500, max: 999, color: '#cb2a2f' },
                { min: 100, max: 499, color: '#e55a4e' },
                { min: 10, max: 99, color: '#f59e83' },
                { min: 1, max: 9, color: '#fdebcf' }
            ],
            textStyle: {
                fontSize: 24
            },
            show: true
        },
        geo: {
            map: 'china',
            roam: false,
            zoom: 1,
            label: {
                normal: {
                    show: true,
                    fontSize: 14,
                    color: '#ff8500'
                }
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                    areaColor: '#F3B329',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
        series: [
            {
                name: '感染人数',
                type: 'map',
                geoIndex: 0,
                data: dataList
            }
        ] }
        window.echarts.registerMap('china', China)
        myChart.setOption(option)
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
  /*.map > img {
    width: 100%;
  }*/
  .map {
    width: 750px;
    height: 428px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 68px;
    background-color: #3B7DB7;
    > img {
      width: 200px;
    }
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
    padding-bottom: 22px;
    &:nth-last-of-type(1) {
      padding-bottom: 0;
    }
    > .timeRad {
      position: absolute;
      left: 0;
      top: 0;
      width: 1.6vw;
      height: 1.6vw;
      border-radius: 50%;
      background-color: #3B7DB7;
      background-clip: content-box;
      border: 1.2vw solid #DDEDFA;
      z-index: 2;
    }
    > .timeLine {
      position: absolute;
      top: 2vw;
      left: 1.733vw;
      bottom: 0;
      width: .533vw;
      background-color: #DDEDFA;
    }
    > .datetime {
      font-size: 3.733vw;
      line-height: 3.733vw;
      color: #aaa;
      margin-bottom: 2.266vw;
      padding-left: 6.666vw;
    }
    > .content {
      width: 80vw;
      background-color: #f8f8f8;
      border-radius: 1.6vw;
      padding: 4.8vw 3.2vw;
      margin-left: 6.666666666666667vw;
      box-sizing: border-box;
      > .title {
        color: #444;
        font-size: 4.266666666666667vw;
        line-height: 5.6vw;
        font-weight: 700;
        margin-bottom: 26px;
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
      display: flex;
      align-items: center;
      padding: 0 26px;
      height: 90px;
      font-size: 24px;
      background-color: #F8FAFF;
      > p {
        line-height: 40px;
        @include elps-wrap(2);
      }
    }
  }
</style>
