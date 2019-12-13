<template>
  <div :class="$style.springPloughing">
    <div :class="$style.countdown">
      <div :class="$style.globalEndCountdown">
        <span>距活动结束: </span>
        <span :class="$style.val + ' ' + $style.day">02</span>
        <span :class="$style.unit">天</span>
        <span :class="$style.val">23</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
      </div>
      <div :class="$style.topRight" @click="createPoster">活动海报</div>
      <div :class="$style.topRight" @click="showRules = true">活动规则</div>
    </div>

    <div :class="$style.content">
      <div :class="$style.groupName">
        新春开学季度第一弹
      </div>
      <div :class="$style.discount">
        <span>组合打包6折起</span>
        <span>|</span>
        <span>1222人已购</span>
      </div>
      <div :class="$style.endCountdown">
        <span>距活动结束: </span>
        <span :class="$style.val">02</span>
        <span :class="$style.unit">天</span>
        <span :class="$style.val">23</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
      </div>
      <div :class="$style.proList">
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <SpringPloughingProItem />
      </div>
      <div :class="$style.giftList">
        <div :class="$style.title">
          更享更多伴手礼
        </div>
        <SpringPloughingGiftItem />
        <SpringPloughingGiftItem />
      </div>
      <button :class="$style.buy">
        点击购买 组合到手3000元
      </button>
      <div :class="$style.corner + ' ' + $style.topLeft" />
      <div :class="$style.corner + ' ' + $style.topRight" />
      <div :class="$style.corner + ' ' + $style.bottomLeft" />
      <div :class="$style.corner + ' ' + $style.bottomRight" />
    </div>

    <div :class="$style.content">
      <div :class="$style.groupName">
        新春开学季度第二弹
      </div>
      <div :class="$style.discount">
        <span>组合打包6折起</span>
        <span>|</span>
        <span>1222人已购</span>
      </div>
      <div :class="$style.endCountdown">
        <span>距活动结束: </span>
        <span :class="$style.val">02</span>
        <span :class="$style.unit">天</span>
        <span :class="$style.val">23</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
      </div>
      <div :class="$style.proList">
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <button :class="$style.buy + ' ' + $style.notStart">
          暂未开启，敬请期待
        </button>
      </div>
      <div :class="$style.corner + ' ' + $style.topLeft" />
      <div :class="$style.corner + ' ' + $style.topRight" />
      <div :class="$style.corner + ' ' + $style.bottomLeft" />
      <div :class="$style.corner + ' ' + $style.bottomRight" />
    </div>

    <div :class="$style.content">
      <div :class="$style.groupName">
        新春开学季度第三弹
      </div>
      <div :class="$style.discount">
        <span>组合打包6折起</span>
        <span>|</span>
        <span>1222人已购</span>
      </div>
      <div :class="$style.endCountdown">
        <span>距活动结束: </span>
        <span :class="$style.val">02</span>
        <span :class="$style.unit">天</span>
        <span :class="$style.val">23</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
        <span :class="$style.unit">:</span>
        <span :class="$style.val">59</span>
      </div>
      <div :class="$style.proList">
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <SpringPloughingProItem />
        <button :class="$style.buy + ' ' + $style.ended">
          活动已结束
        </button>
      </div>
      <div :class="$style.corner + ' ' + $style.topLeft" />
      <div :class="$style.corner + ' ' + $style.topRight" />
      <div :class="$style.corner + ' ' + $style.bottomLeft" />
      <div :class="$style.corner + ' ' + $style.bottomRight" />
    </div>

    <pl-popup
      :show.sync="showRules"
      title="活动规则"
    >
      <ul :class="$style.rules">
        <li>1. 设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖</li>
        <li>2. 活动期间商品不退款，不支持线上发票</li>
        <li>3. 仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠</li>
        <li>4. 结束以时间和数量购买完截止结束</li>
      </ul>
    </pl-popup>

    <transition name="fade">
      <div v-if="showPoster" :class="$style.poster">
        <img :src="poster" alt="">
        <pl-svg name="icon-close3" width="36" @click="showPoster = false" />
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import SpringPloughingProItem from './components/Spring-Ploughing-Pro-Item.vue'
import SpringPloughingGiftItem from './components/Spring-Ploughing-Gift-Item.vue'
import { mapGetters } from 'vuex'
import {
  generateQrcode,
  createText,
  cutArcImage,
  loadImage
} from '../../assets/js/util'
const POSTER_BG = 'https://mallcdn.youpenglai.com/static/mall/2.0.0/activity/4b676734-b0c9-4aca-942d-ce62e481ebcf.jpeg'
export default {
  name: 'SpringPloughing',
  components: {
    SpringPloughingProItem,
    SpringPloughingGiftItem
  },
  data () {
    return {
      showRules: false,
      showPoster: false,
      poster: '',
      creating: false
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName'])
  },
  methods: {
    async createPoster () {
      if (this.creating) {
        return
      }
      if (this.poster) {
        this.showPoster = true
        return
      }
      this.creating = true
      const cvs = document.createElement('canvas')
      const ctx = cvs.getContext('2d')
      const Result = await Promise.all([
        loadImage(POSTER_BG),
        loadImage(this.avatar)
      ])
      const BG = Result[0]
      const AVATAR = await cutArcImage(Result[1])
      cvs.width = 638
      cvs.height = 1134
      ctx.fillStyle = '#397432'
      ctx.fillRect(0 , 0, 638, 88);
      ctx.drawImage(AVATAR, 20, 12, 64, 64)
      ctx.font = '24px Microsoft YaHei UI'
      ctx.fillStyle = '#fff'
      ctx.textBaseline = 'hanging'
      createText(ctx, 100, 32, this.userName + ' 邀你一起春耘计划', 34, 510, 1)
      ctx.drawImage(BG, 0, 88)
      const QR = await generateQrcode(200, location.href, 0, null, 0, 'canvas')
      ctx.drawImage(QR, 216, 826, 204, 204)
      this.poster = cvs.toDataURL('image/jpeg', 0.9)
      this.showPoster = true
      this.creating = false
    }
  }
}
</script>

<style module lang="scss">
  .spring-ploughing {
    display: flex;
    flex-direction: column;
    padding-bottom: 182px;
    background-color: #8dc607;
  }
  .countdown {
    position: relative;
    height: 674px;
    padding-top: 20px;
    background: #f9dfbe url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/7abb300e-640c-4a22-a540-2c837bf9401d.png") no-repeat center 20px;
    background-size: 100%;
    > .top-right {
      position: absolute;
      right: 0;
      top: 16px;
      width: 128px;
      font-size: 24px;
      color: #88DE9E;
      text-align: center;
      line-height: 50px;
      background-color: rgba(0, 0, 0, .5);
      border-radius: 40px 0 0 40px;
      &:nth-of-type(2) {
        margin-top: 66px;
      }
    }
  }
  .content {
    position: relative;
    width: 686px;
    padding: 24px;
    margin: 14px auto 48px;
    background-color: #428b42;
    box-shadow: 0 0 0 2px #A3D816 inset;
    box-sizing: border-box;
  }
  .group-name {
    width: 458px;
    margin: 16px auto;
    font-size: 28px;
    color: #dcfd8c;
    text-align: center;
    line-height: 68px;
    font-weight: bold;
    background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/e009100a-579a-4369-8238-db258fb2d91b.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .discount {
    margin-bottom: 20px;
    text-align: center;
    color: #88DE9E;
    font-size: 24px;
    > span:nth-of-type(2) {
      margin: 0 12px;
      vertical-align: 2px;
    }
  }

  .end-countdown, .global-end-countdown {
    width: 400px;
    margin: 0 auto;
    line-height: 80px;
    font-size: 24px;
    text-align: center;
    color: #88DE9E;
    background-color: #397432;
    border-radius: 20px;
    > .unit {
      padding: 0 4px;
    }
    > .val {
      display: inline-block;
      padding: 4px;
      line-height: 30px;
      color: #184B28;
      background-color: #8DE5A8;
      border-radius: 6px;
    }
  }
  .global-end-countdown {
    margin-top: 288px;
    background: none;
    > .val {
      background-color: #ffd6a7;
      &.day {
        background-color: #8DE5A8;
      }
    }
  }

  .gift-list {
    .title {
      margin: 24px 0;
      font-weight: bold;
      font-size: 40px;
      color: #fae47f;
      &:before {
        display: inline-block;
        content: '';
        width: 8px;
        height: 40px;
        vertical-align: -6px;
        border-radius: 4px;
        background-color: #fae47f;
      }
    }
  }

  .buy {
    display: block;
    width: 440px;
    margin: 48px auto 36px;
    line-height: 78px;
    font-size: 32px;
    color: #184b28;
    background-color: #8DE5A8;
    border-radius: 39px;
    font-weight: bold;
    box-shadow: 0 6px 12px rgba(132, 0 ,0, 0.16);
    &.not-start {
      font-weight: normal;
    }
    &.ended {
      color: #184B28;
      font-weight: normal;
      background-color: #67b875;
    }
  }
  .corner {
    position: absolute;
    width: 46px;
    height: 42px;
    z-index: 1;
    background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/1c11b4a5-091d-4f8d-a88c-e8334dfc9d88.png") no-repeat center center;
    background-size: 100% 100%;
    &.top-left {
      top: 0;
      left: 0;
    }
    &.top-right {
      top: 0;
      right: 0;
      transform: rotateY(180deg);
    }
    &.bottom-right {
      bottom: 0;
      right: 0;
      transform: rotateY(180deg) rotateX(180deg);
    }
    &.bottom-left {
      bottom: 0;
      left: 0;
      transform: rotateX(180deg);
    }
  }
  .rules {
    padding: 24px 24px 60px;
    font-size: 26px;
    line-height: 56px;
  }
  .poster {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 10;
    > img {
      margin-top: 20px;
    }
    > svg {
      margin-top: 20px;
    }
  }
</style>
