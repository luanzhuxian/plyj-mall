<template>
  <div :class="$style.activityView" ref="activityView">
    <div :class="$style.topBox">
      <div :class="$style.title">
        <div>
          --------- 千家机构携手双十二 ---------
        </div>
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/double-twelve-header-1571393161453.png" alt="">
      </div>
      <p :class="$style.dataTitle"><span>**********</span> <i>双十二疯狂同学会总数据</i> <span>**********</span></p>

      <div :class="$style.moduelData">
        <div :class="$style.dataName">活动预约</div>
        <div :class="$style.value">
          <i v-text="entDetail.totalReservation || 0" />人
        </div>
      </div>

      <div :class="$style.moduelData">
        <div :class="$style.dataName">参与机构</div>
        <div :class="$style.value">
          <i v-text="entDetail.participatingInstitutions || 0" />家
        </div>
      </div>

      <div :class="$style.moduelData">
        <div :class="$style.dataName">总助力榜</div>
        <div :class="$style.value">
          <i v-text="entDetail.totalAssisting || 0" />次
        </div>
      </div>
      <div :class="$style.helpMe" @click="share">帮我助力</div>
      <!-- 分隔线 -->
      <div :class="$style.lineBetween" />
      <!-- 轴 -->
      <div :class="$style.axle" />
    </div>

    <div :class="$style.bottom">
      <div :class="$style.content">
        <div>
          <div>
            <div :class="$style.contentBox">
              <div :class="$style.contentTop">
                <img :class="$style.logo" :src="logoUrl" alt="">
                <pl-icon name="icon-your-data" color="#565776" size="48" />
              </div>
              <div :class="$style.data">
                <span>全国排名：</span>
                <span>第{{ entDetail.ranking || 0 }}位</span>
              </div>
              <div :class="$style.data">
                <span>活动预约：</span>
                <span>{{ entDetail.numberOfReservations || 0 }}人</span>
              </div>
              <div :class="$style.data">
                <span>总助力数：</span>
                <span>{{ entDetail.assistingNumber || 0 }}次</span>
              </div>
            </div>
          </div>
        </div>
        <img
          :class="$style.subscribe"
          v-if="!entDetail.alreadyReserved"
          src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/%E7%AB%8B%E5%8D%B3%E9%A2%84%E7%BA%A6.png"
          alt=""
          @click="showPop = true"
        >
        <div :class="$style.subscribe + ' ' + $style.twoIcon" v-if="entDetail.alreadyReserved">
          <img
            src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/help1.png"
            alt=""
            v-if="entDetail.numberOfBoosts < 3"
            @click="userHelp"
          >
          <img
            src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/help2.png"
            alt=""
            v-else
          >
          <div :class="$style.count">
            x {{ entDetail.numberOfBoosts }}
          </div>
        </div>
      </div>
    </div>

    <pl-popup :show.sync="showPop" title="在线预约">
      <form :class="$style.popForm">
        <div class="fz-26 gray-3">预约后您的私人顾问将会电话联系您</div>
        <label>
          <input v-model="reservationName" type="text" placeholder="请输入预约姓名">
          <pl-icon v-show="reservationName" @click="reservationName = ''" :class="$style.clean" name="icon-close1" color="#ccc" size="30" />
        </label>
        <label>
          <input v-model="reservationMobile" type="text" placeholder="请输入预约手机">
          <pl-icon v-show="reservationMobile" @click="reservationMobile = ''" :class="$style.clean" name="icon-close1" color="#ccc" size="30" />
        </label>
        <div :class="$style.tip">
          <pl-icon name="icon-safe" type="svg" width="25" height="25" />
          <span>无强行推销</span>
          <pl-icon name="icon-safe" type="svg" width="25" height="25" />
          <span>不泄露用户手机号码</span>
        </div>
        <pl-button :loading="loading" size="large" type="warning" @click.prevent="subscribe">
          确认预约
        </pl-button>
      </form>
    </pl-popup>

    <!-- 预约成功 -->
    <transition name="fade">
      <div :class="$style.success" v-show="showSuccess">
        <div :class="$style.successContent">
          <p>预约成功</p>
          <p>您已成功预约吉的堡教育集团</p>
          <p>携手双十二疯狂同学学会</p>
          <div @click="share">帮我助力</div>
          <pl-icon name="icon-error" size="48" color="#fff" @click="showSuccess = false" />
        </div>
      </div>
    </transition>

    <!-- 预约成功 -->
    <transition name="fade">
      <div :class="$style.share" v-if="showShare">
        <img :src="haiBao || 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/help-me-up.png'" alt="">
        <template v-if="!haiBaoLoading">
          <p>长按图片保存分享给好友</p>
          <pl-icon name="icon-error" size="48" color="#fff" @click="showShare = false" />
        </template>
        <pl-icon class="rotate" v-else name="icon-btn-loading" size="48" color="#fff" @click="showShare = false" />
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import { generateQrcode, cutArcImage, createText, drawRoundRect } from '../../assets/js/util'
import {
  userHelp,
  appointmentOnline,
  getEntDetail
} from '../../apis/double-twelve-day'
import { mapGetters } from 'vuex'
const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
export default {
  name: 'DoubleTwelveDayActivity',
  data () {
    return {
      form: {
        current: 1,
        size: 10
      },
      entDetail: {},
      showPop: false,
      showSuccess: false,
      showShare: false,
      loading: false,
      appointmentMobile: '',
      reservationName: '',
      reservationMobile: '',
      haiBao: '',
      haiBaoLoading: false
    }
  },
  computed: {
    ...mapGetters(['logoUrl', 'openId', 'mobile', 'realeName', 'mallName', 'avatar', 'userName'])
  },
  async activated () {
    this.reservationMobile = this.mobile || ''
    this.reservationName = this.realName || ''
    try {
      let { result } = await getEntDetail()
      this.entDetail = result
    } catch (e) {
      throw e
    }
  },
  watch: {
  },
  methods: {
    async userHelp () {
      try {
        await userHelp()
        let { result } = await getEntDetail()
        this.entDetail = result
      } catch (e) {
        throw e
      }
    },
    async subscribe () {
      let {
        openId,
        reservationMobile,
        reservationName
      } = this
      try {
        if (!reservationMobile) {
          this.$warning('请输入手机号')
          return
        }
        if (!reservationName) {
          this.$warning('请输入姓名')
          return
        }
        this.loading = true
        await appointmentOnline({
          openId: openId,
          mobile: reservationMobile,
          reservationName: reservationName
        })
        this.showPop = false
        this.showSuccess = true
        let { result } = await getEntDetail()
        this.entDetail = result
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async share () {
      this.showShare = true
      if (this.haiBao) {
        return
      }
      this.haiBaoLoading = true
      let codeCanvas
      let cvs
      let ctx
      let bg
      let logo
      let mallNameWidth
      let mallNameStartX // 商城名称开始横坐标
      let mallName = this.mallName // 商城名称开始横坐标
      let avatar = this.avatar
      let userName = this.userName.substring(0, 3) + '.. 最爱雅集 邀您助力'
      try {
        codeCanvas = await generateQrcode(300, location.href, 0, null, 0, 'canvas')
        cvs = document.createElement('canvas')
        cvs.width = 606
        cvs.height = 766
        ctx = cvs.getContext('2d')
        bg = await this.loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/help-me-up.png')
        ctx.drawImage(bg, 0, 0, cvs.width, cvs.height)
        logo = await this.loadImage(this.logoUrl)
        ctx.drawImage(codeCanvas, 223, 518, 184, 184)
        // 绘制商城名称
        ctx.font = '36px bold'
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        mallNameWidth = ctx.measureText(mallName).width
        if (mallNameWidth > 350) {
          // 名字过长，截取名字
          while (true) {
            mallName = mallName.substr(0, mallName.length - 1)
            mallNameWidth = ctx.measureText(mallName).width
            if (mallNameWidth <= 350) {
              mallName += '...'
              mallNameWidth = ctx.measureText(mallName).width
              break
            }
          }
        }
        mallNameStartX = (cvs.width - 44 - 20 - mallNameWidth) / 2
        ctx.drawImage(logo, mallNameStartX, 212, 44, 44)
        createText(ctx, mallNameStartX + 44 + 20, 218, mallName, 50)
        /* 绘制用户姓名 */
        // 先绘制矩形
        drawRoundRect(ctx, 120, 416, 384, 64, 12, '#FF9810', '#FF9810')
        // 绘制头像
        if (avatar) {
          avatar = await this.loadImage(avatar)
          avatar = await cutArcImage(avatar)
          ctx.drawImage(avatar, 144, 426, 44, 44)
        } else {
          drawRoundRect(ctx, 144, 426, 44, 44, 22, '#fff', '#fff')
        }
        // 绘制用户姓名
        ctx.font = '24px bold'
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'top'
        createText(ctx, 200, 438, userName, 34)
        this.haiBao = cvs.toDataURL()
      } catch (e) {
        this.$error('生成海报失败')
        this.showShare = false
        throw e
      } finally {
        this.haiBaoLoading = false
      }
    },
    async loadImage (src) {
      let img = new Image()
      img.crossOrigin = ''
      img.src = src + '?time=' + Date.now()
      return new Promise((resolve, reject) => {
        img.onload = function () {
          resolve(img)
        }
        img.onerror = function (e) {
          reject(e)
        }
      })
    }
  }
}
</script>

<style module lang="scss">
  .activity-view {
    padding-top: 20px;
    background: #ff4e5a url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/double_twelve_day_bg.png") no-repeat fixed;
    background-size: 100% 100%;
  }
  .top-box{
    position: relative;
    width: 672px;
    height: 970px;
    margin: 0 auto;
    padding: 24px 28px;
    background-color: #FDFAF3;
    /*background: radial-gradient(circle, #fdfaf3 93%, #ff5d5000 93%) no-repeat;*/
    background-size: 100%;
    box-sizing: border-box;
    z-index: 2;
    > .title {
      height: 156px;
      padding-top: 10px;
      text-align: center;
      font-size: 28px;
      line-height: 40px;
      color: #fff;
      font-weight: bold;
      background-color: #FD0036;
      box-sizing: border-box;
      > img {
        margin-top: 16px;
        width: 95%;
        transform: translate(-5px);
      }
    }
  }
  .data-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    font-size: 26px;
    color: #F95A68;
    > span {
      display: inline-block;
      line-height: 36px;
      letter-spacing: 3px;
      transform: translateY(4px);
    }
    > i {
      display: inline-block;
      line-height: 36px;
    }
  }
  .moduel-data {
    margin-top: 30px;
    > .data-name {
      font-size: 40px;
    }
    > .value {
      margin-top: 5px;
      font-size: 32px;
      color: #776e67;
      > i {
        color: #d34240;
        font-size: 68px;
        font-weight: bold;
      }
    }
  }
  .help-me {
    width: 266px;
    height: 78px;
    margin: 40px auto 0;
    line-height: 78px;
    color: #fff;
    font-size: 36px;
    text-align: center;
    background-color: #ee7832;
    border-radius: 39px;
  }
  .line-between {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 56px;
    background: linear-gradient(180deg, #FDFAF3, #E65457);
    z-index: 2;
    &:after {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      content: '';
      width: 100%;
      height: 20px;
      background: radial-gradient(circle, #9C2029 45%, #9C2029 45%, #00000000 45%) center center;
      background-size: 20px 22px;
    }
    &:before {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      content: '';
      width: 100%;
      height: 4px;
      background-color: #9C2029;
    }
  }
  .axle {
    position: absolute;
    bottom: -8px;
    left: 50%;
    width: 105%;
    height: 30px;
    transform: translate(-50%);
    background-color: #A02225;
    border-radius: 10px;
    z-index: 1;
  }
  .bottom {
    width: 718px;
    margin: 0 auto;
    padding-top: 392px;
    padding-bottom: 40px;
    transform: translateY(-368px);
    background-color: #e8333c;
    border: 8px solid #f66c76;
    border-radius: 40px;
    z-index: 1;
  }
  .content {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 606px;
    height: 338px;
    margin: 0 auto;
    padding: 22px;
    border: 8px solid #fff;
    background-color: #e84655;
    border-radius: 20px;
    box-sizing: border-box;
    > div {
      width: 462px;
      height: 292px;
      background-color: #cdabaa;
      border-radius: 10px;
      > div {
        height: 274px;
        background-color: #9C5156;
        border-radius: 10px;
      }
    }
    .subscribe {
      position: absolute;
      right: 12px;
      width: 78px;
      background: none;
      &.two-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      > .count {
        width: 68px;
        height: 68px;
        margin-top: 10px;
        line-height: 68px;
        font-size: 26px;
        color: #fff;
        text-align: center;
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/num-bg.png") no-repeat center center;
        background-size: 90%;
      }
      > img {
        width: 78px;
      }
    }
  }
  .content-box {
    width: 452px;
    height: 276px;
    padding: 16px;
    background-color: #FCECDF;
    border-radius: 10px;
    transform: translateY(10px);
    box-sizing: border-box;
    .data {
      margin-top: 16px;
      font-size: 32px;
      line-height: 44px;
      color: #565776;
      font-weight: bold;
    }
  }
  .logo {
    width: 68px;
    height: 68px;
  }
  .content-top {
    display: flex;
    align-items: center;
    > i {
      margin-left: 12px;
    }
  }

  .pop-form {
    position: relative;
    padding: 0 24px 20px;
    > label {
      position: relative;
      display: block;
      > input {
        width: 100%;
        height: 80px;
        margin-top: 26px;
        margin-bottom: 20px;
        padding: 0 20px;
        border: 1px solid #ccc;
        font-size: 32px;
        border-radius: 20px;
        background-color: #F4F5F9;
      }
    }
    > .tip {
      font-size: 24px;
      margin-bottom: 44px;
      > svg {
        margin-right: 15px;
        vertical-align: -2px;
      }
      > span {
        margin-right: 15px;
      }
    }
    .clean {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .success {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    z-index: 2005;
  }
  .success-content {
    position: relative;
    width: 506px;
    height: 346px;
    background-color: #FA4D2F;
    border-radius: 20px;
    > p {
      text-align: center;
      font-size: 20px;
      line-height: 28px;
      color: #eee;
      &:nth-of-type(1) {
        margin: 22px 0 42px 0;
        font-size: 50px;
        font-weight: bold;
        line-height: 56px;
        color: #fff;
      }
    }
    > div {
      width: 346px;
      height: 74px;
      margin: 48px auto 0;
      text-align: center;
      line-height: 74px;
      color: #A56113;
      font-size: 26px;
      background-color: #fecd4c;
      border-radius: 37px;
    }

    > i {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      bottom: -114px;
    }
  }
  .share {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 3000;
    > img {
      width: 602px;
    }
    > i {
      margin-top: 48px;
    }
    > p {
      margin-top: 32px;
      color: #fff;
      font-size: 32px;
    }
  }
</style>
