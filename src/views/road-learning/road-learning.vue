<template>
  <div class="road-learning">
    <div class="top">
      <div class="title-box">
        <div class="title-left" @click="$router.back()"><pl-icon name="icon-left" color="#fff" size="32" /></div>
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/icon-road-learning-title.png">
        <div class="title-right" @click="showRule = true">
          活动规则
        </div>
      </div>
      <div class="user-info">
        <img :src="avatar"><span>每日坚持签到 累计达10次即可抽大奖！</span>
      </div>
    </div>
    <div class="learning-step">
      <i class="point small" />
      <i class="point large" />
      <div v-if="activeStart">连续签到<span>{{ checkInDetail.continueCheckInNum }}</span>天，累计签到<span>{{ checkInDetail.totalCheckInNum }}</span>天</div>
      <div v-else>点亮见学之旅</div>
      <i class="point large" />
      <i class="point small" />
    </div>
    <div class="content">
      <div class="bg-complete" v-if="checkInDetail.totalCheckInNum === 10" />
      <div class="bg-uncomplete" v-if="checkInDetail.totalCheckInNum < 10" />
      <div class="content-time" v-if="activeDetail.status">
        <div v-if="!activeStart">开始倒计时：</div>
        <div v-else>结束倒计时：</div>
        <span>{{ dd }}</span>&nbsp;天&nbsp;<span>{{ hh }}</span><div class="time-padding">:</div><span>{{ mm }}</span><div class="time-padding">:</div><span>{{ ss }}</span>
      </div>
      <div class="content-time" v-else>
        <div>该活动已经结束</div>
      </div>
      <div class="content-step-box">
        <div class="step step1" :class="{'step-big':checkInDetail.totalCheckInNum >= 1}">
          <span v-if="checkInDetail.totalCheckInNum < 1">1</span>
          <pl-icon v-else @click="drawPoster (1)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step2" :class="{'step-big':checkInDetail.totalCheckInNum >= 2}">
          <span v-if="checkInDetail.totalCheckInNum < 2">2</span>
          <pl-icon v-else @click="drawPoster (2)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step3" :class="{'step-big':checkInDetail.totalCheckInNum >= 3}">
          <span v-if="checkInDetail.totalCheckInNum < 3">3</span>
          <pl-icon v-else @click="drawPoster (3)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step4" :class="{'step-big':checkInDetail.totalCheckInNum >= 4}">
          <span v-if="checkInDetail.totalCheckInNum < 4">4</span>
          <pl-icon v-else @click="drawPoster (4)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step5" :class="{'step-big':checkInDetail.totalCheckInNum >= 5}">
          <span v-if="checkInDetail.totalCheckInNum < 5">5</span>
          <pl-icon v-else @click="drawPoster (5)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step6" :class="{'step-big':checkInDetail.totalCheckInNum >= 6}">
          <span v-if="checkInDetail.totalCheckInNum < 6">6</span>
          <pl-icon v-else @click="drawPoster (6)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step7" :class="{'step-big':checkInDetail.totalCheckInNum >= 7}">
          <span v-if="checkInDetail.totalCheckInNum < 7">7</span>
          <pl-icon v-else @click="drawPoster (7)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step8" :class="{'step-big':checkInDetail.totalCheckInNum >= 8}">
          <span v-if="checkInDetail.totalCheckInNum < 8">8</span>
          <pl-icon v-else @click="drawPoster (8)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step9" :class="{'step-big':checkInDetail.totalCheckInNum >= 9}">
          <span v-if="checkInDetail.totalCheckInNum < 9">9</span>
          <pl-icon v-else @click="drawPoster (9)" name="icon-jiaoya" color="#FFF" size="30" />
        </div>
        <div class="step step10" :class="{'step-big':checkInDetail.totalCheckInNum >= 10}">
          <pl-icon v-if="checkInDetail.totalCheckInNum < 10" name="icon-liwu" color="#FFF" size="30" />
          <pl-icon v-else @click="drawPoster (10)" name="icon-liwu" color="#FFF" size="30" />
        </div>
        <div class="statistics" v-if="activeStart">
          已有 <span>{{ checkInDetail.checkInUserNum }}人</span>参与活动 <span>&nbsp;|&nbsp;</span> <div v-if="checkInDetail.totalCheckInNum < 10">还差 <span>{{ 10 - checkInDetail.totalCheckInNum }}次</span>签到，可冲击大奖</div> <div v-if="checkInDetail.totalCheckInNum === 10">恭喜你 已完成<span>10次</span>签到</div>
        </div>
      </div>
      <div class="btn-box">
        <div class="btn disabel" v-if="!activeStart && !activeEnd && activeDetail.status">活动未开始</div>
        <div class="btn active" @click="checkIn()" v-if="activeStart && !activeEnd&&!checkInDetail.hasCheckInToday && checkInDetail.totalCheckInNum < 10 && activeDetail.status">立即签到</div>
        <div class="btn disabel" v-if="activeStart && activeEnd || !activeDetail.status && checkInDetail.claimStatus !== 1">活动已结束</div>
        <div class="btn active" v-if="checkInDetail.totalCheckInNum === 10 && checkInDetail.claimStatus === 0" @click="claimGift() && activeDetail.status">点击抽大奖</div>
        <div class="btn active" v-if="checkInDetail.totalCheckInNum === 10 && checkInDetail.claimStatus === 1" @click="$router.push({name:'MyPresent'})">查看奖品</div>
        <div class="btn disabel" v-if="checkInDetail.totalCheckInNum === 10 && checkInDetail.claimStatus === 2 && activeDetail.status">很遗憾没有中奖</div>
        <div class="btn already" v-if="checkInDetail.hasCheckInToday && checkInDetail.totalCheckInNum !== 10 && activeDetail.status">今日已签到</div>
      </div>
    </div>
    <pl-popup :show.sync="showRule">
      <h2
        class="invioceIntroTitle"
        slot="title"
      >
        活动细则
      </h2>
      <div class="invioceIntroContent">
        <h3>1.活动时间</h3>
        <p>{{ activeDetail.activityStartTime }} 至 {{ activeDetail.activityEndTime }}
        </p>
        <h3>2.活动对象</h3>
        <p>所有会员
        </p>
        <h3>3.活动说明</h3>
        <div class="rule-explain" v-if="activeDetail.activityBrief">
          <p v-for="(item,index) of activeDetail.activityBrief.split('\n')" :key="index">
            {{ item }}
          </p>
        </div>
      </div>
    </pl-popup>
    <div class="winning-prize" v-if="winningShow">
      <div class="prize-box">
        <div class="prize-box-title">恭喜您获得</div>
        <p class="prize-box-description">奖品已自动存入您的我的礼品中</p>
        <p class="prize-box-description">您可在我的礼品中查看</p>
        <div class="item-content">
          <div class="content-img-box">
            <img :src="claimGiftDetail.giftImage" alt="">
          </div>
          <div class="content-detail-box">
            <div class="content-box">
              <div content="content-detail">
                <p class="detail-name">{{ claimGiftDetail.giftName }}</p>
                <p class="detail-coupon">{{ claimGiftDetail.giftBrief }}</p>
              </div>
            </div>
            <p class="detail-date color-c">有效期:{{ claimGiftDetail.useStartTime.split(' ')[0] }}-{{ claimGiftDetail.useEndTime.split(' ')[0] }}</p>
          </div>
        </div>
        <div class="prize-btn-box">
          <div class="prize-btn-know" @click="winningShow = false">朕知道了</div>
        </div>
      </div>
      <div class="winning-prize-close">
        <pl-icon @click="winningShow = false" name="icon-error" color="#fff" size="40" />
      </div>
    </div>
    <div class="winning-prize" v-if="unWinningShow">
      <div class="prize-box">
        <div class="prize-box-title">很遗憾未中奖</div>
        <p class="prize-box-description">奖品已派送完</p>
        <p class="prize-box-description">感谢您参与活动</p>
        <div class="prize-btn-box">
          <div class="prize-btn-know" @click="$router.back()">返回主会场</div>
        </div>
        <div class="prize-btn-box">
          <div class="unprize-btn-know" @click="unWinningShow = false">朕知道了</div>
        </div>
      </div>
      <div class="winning-prize-close">
        <pl-icon @click="unWinningShow = false" name="icon-error" color="#fff" size="40" />
      </div>
    </div>
    <div class="winning-prize poster" v-if="posterShow">
      <div class="prize-box poster-box">
        <img :src="post" alt="">
        <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
      </div>
      <div class="winning-prize-close poster-close">
        <pl-icon @click="posterShow = false" name="icon-error" color="#fff" size="40" />
      </div>
    </div>
  </div>
</template>

<script>
import { generateQrcode } from '../../assets/js/util'
import { getIDRoadLearningDetail, getRoadLearningDetail, getCheckInDetail, getCheckIn, claimGift } from '../../apis/road-learning'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'RoadLearning',
  data () {
    return {
      timer: '',
      showRule: false,
      winningShow: false,
      unWinningShow: false,
      posterShow: false,
      activeStart: false,
      activeEnd: false,
      activeDetail: {},
      checkInDetail: {},
      claimGiftDetail: {},
      dd: '',
      hh: '',
      mm: '',
      ss: '',
      qrcode: '',
      post: ''
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['avatar', 'mallUrl', 'userId'])
  },
  async created () {
    if (!this.userId) {
      try {
        await this.$alert({
          message: '新用户无法参加见学之旅，请先绑定手机号',
          confirmText: '去绑定手机号码'
        })
        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
          name: this.$route.name,
          params: { id: this.id }
        }))
        this.$router.push({ name: 'BindMobile' })
      } catch (e) {
        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
          name: this.$route.name,
          params: { id: this.id }
        }))
        this.$router.push({ name: 'BindMobile' })
      }
    }
    await this.getDetail()
    this.getCheckInDetail()
    let qrcode = await generateQrcode(500, `${this.mallUrl}/road-learning/${this.id ? this.id : ''}`, 100, null, null, 'url')
    this.qrcode = new Image()
    this.qrcode.src = qrcode
  },
  methods: {
    async getDetail () {
      let distanceTime, result
      if (this.id) {
        const { result: res } = await getIDRoadLearningDetail(this.id)
        result = res
      } else {
        const { result: res } = await getRoadLearningDetail()
        result = res
      }
      if (!result) {
        this.$router.back()
        this.$warning('暂无活动')
        return
      }
      this.activeDetail = result
      let now = Date.now()
      let start = moment(this.activeDetail.activityStartTime).valueOf()
      let end = moment(this.activeDetail.activityEndTime).valueOf()
      if (now < start) {
        this.activeStart = false
        distanceTime = start - now
      } else {
        this.activeStart = true
        distanceTime = end - now
        if (end < now) {
          this.activeEnd = true
        }
      }
      this.countdown(distanceTime)
    },
    countdown (datetime) {
      if (datetime < 0) return
      this.timer = setInterval(() => {
        let { _data } = moment.duration(datetime)
        let d = String(_data.days + moment().daysInMonth() * _data.months)
        let h = String(_data.hours)
        let m = String(_data.minutes)
        let s = String(_data.seconds)
        datetime -= 1000
        if (datetime <= 0) {
          clearInterval(this.timer)
          this.getDetail()
        }
        this.dd = d.padStart(2, '0')
        this.hh = h.padStart(2, '0')
        this.mm = m.padStart(2, '0')
        this.ss = s.padStart(2, '0')
      }, 1000)
    },
    async getCheckInDetail () {
      const { result: res } = await getCheckInDetail(this.activeDetail.id)
      this.checkInDetail = res
    },
    async checkIn () {
      await getCheckIn(this.activeDetail.id)
      await this.getCheckInDetail()
      this.drawPoster()
    },
    async claimGift () {
      const { result: res } = await claimGift(this.activeDetail.id)
      await this.getCheckInDetail()
      this.claimGiftDetail = res
      if (this.checkInDetail.claimStatus === 1) {
        this.winningShow = true
      } else if (this.checkInDetail.claimStatus === 2) {
        this.unWinningShow = true
      }
    },
    async drawPoster (index) {
      this.posterShow = true
      let canImg = new Image()
      canImg.crossOrigin = ''
      canImg.src = `https://mallcdn.youpenglai.com/static/mall/2.0.0/road-learning/jianxue${index || this.checkInDetail.totalCheckInNum}.jpg?time=${Date.now()}`
      canImg.onload = async () => {
        let canvas = document.createElement('canvas')
        canvas.width = canImg.width
        canvas.height = canImg.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(canImg, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(this.qrcode, 20, 1200, 150, 150)
        let post = canvas.toDataURL('image/jpeg', 0.7)
        this.post = post
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
  .road-learning{
    height: 100vh;
    width: 100vw;
    background:linear-gradient(180deg,rgba(246,4,49,1) 0%,rgba(246,70,79,1) 35%,rgba(253,98,78,1) 120%);
    .top{
      height: 598px;
      background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/goldenEgg.png') no-repeat center 80px;;
      background-size: 72% 90%;
      .title-box{
        display: flex;
        justify-content: space-between;
        .title-left{
          width:68px;
          height:68px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 24px 20px;
          background:rgba(235,135,126,1);
          border-radius:50%;
        }
        img{
          width: 518px;
          height: 78px;
          margin-top: 64px;
        }
        .title-right{
          width:60px;
          height:60px;
          display: flex;
          align-items: center;
          margin: 24px 20px;
          padding: 4px;
          text-align: center;
          background:rgba(235,135,126,1);
          border-radius:50%;
          color: #FFFFFF;
          font-size:20px;
          letter-spacing:2px;
          font-weight:400;
          line-height:24px;
        }
      }
      .user-info{
        display: flex;
        justify-content: center;
        font-size: 32px;
        font-weight: 400;
        color: #FFFFFF;
        img{
          width: 52px;
          height: 52px;
          margin-right: 10px;
          border-radius: 50%;
        }
      }
      .golden-egg{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 532px;
          height: 518px;
        }
      }
    }
    .learning-step{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-size:36px;
      font-weight: bold;
      line-height:40px;
      color:#FFFFFF;
      div{
        margin: 0 23px;
      }
      span{
        color: #FCED4F;
      }
      .point{
        display: inline-flex;
        background: #FFFFFF;
        border-radius: 50%;
        margin: 0 5px;
      }
      .small{
        width: 8px;
        height: 8px;
      }
      .large{
        width: 12px;
        height: 12px;
      }
    }
    .content{
      width: 710px;
      height: 516px;
      margin: 20px;
      background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/eggBg.png');
      background-size: 100% 100%;
      .bg-uncomplete{
        width: 710px;
        height: 416px;
        position: absolute;
        background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/eggBgUncomplete.png') no-repeat center 138px;
        background-size: 100% 37%;
      }
      .bg-complete{
        width: 710px;
        height: 416px;
        position: absolute;
        background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/eggBgComplete.png') no-repeat center 138px;
        background-size: 100% 37%;
      }
      .content-time{
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36px;
        font-weight: bold;
        line-height: 40px;
        color: #FFFFFF;
        >span{
          display: inline-flex;
          padding: 4px 3px;
          background: #FFFFFF;
          border-radius: 8px;
          color: #F84F4E;
          font-size: 28px;
          font-weight: bold;
        }
        .time-padding{
          padding: 0 5px;
        }
      }
      .content-step-box{
        width: 100%;
        height: 320px;
        position: relative;
        .step{
          width: 50px;
          height: 50px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          background-color: #EB554E;
          border-radius: 50%;
          border: 4px solid #FFFFFF;
          font-size: 24px;
          font-weight: 400;
          line-height: 40px;
          color: #FFFFFF;
          >span{
            opacity: 0.5;
          }
        }
        .step-big{
          width: 60px;
          height: 60px;
        }
        .step1{
          top: 28px;
          left: 64px;
        }
        .step2{
          top: 28px;
          left: 180px;
        }
        .step3{
          top: 65px;
          left: 292px;
        }
        .step4{
          top: 100px;
          left: 180px;
        }
        .step5{
          top: 140px;
          left: 73px;
        }
        .step6{
          top: 175px;
          left: 180px;
        }
        .step7{
          top: 175px;
          left: 292px;
        }
        .step8{
          top: 175px;
          left: 402px;
        }
        .step9{
          top: 175px;
          left: 522px;
        }
        .step10{
          top: 175px;
          left: 632px;
        }
      }
      .btn-box{
        padding: 0 65px;
        .btn{
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 0;
          border-radius:20px;
          font-size: 36px;
        }
        .disabel{
          color: #EEEEEE;
          background:linear-gradient(180deg,rgba(204,204,204,1) 0%,rgba(185,185,185,1) 100%);
        }
        .active{
          color: #FFFFFF;
          background:linear-gradient(180deg,rgba(247,76,78,1) 0%,rgba(254,53,56,1) 100%);
          box-shadow:0 6px 14px rgba(129,0,0,0.24);
        }
        .already{
          color: #fda0a1;
          background:linear-gradient(180deg,rgba(247,76,78,1) 0%,rgba(254,53,56,1) 100%);
          box-shadow:0 6px 14px rgba(129,0,0,0.24);
        }
      }
    }
  }
  .invioceIntroTitle {
    font-size: 36px;
    margin: 60px 0;
    text-align: center;
  }
  .invioceIntroContent {
    padding: 0 40px;
    h3 {
      font-size: 32px;
    }
    a {
      color: $--primary-color;
    }
    p {
      margin-bottom: 52px;
      font-size: 28px;
      line-height: 38px;
    }
    .rule-explain{
      margin-bottom: 52px;
      >p{
        margin-bottom: 1px;
      }
    }
  }
  .winning-prize{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background:rgba(0,0,0,0.65);
    padding: 300px 122px 0 122px;
    .prize-box{
      padding: 40px 16px;
      background-color: #FA4D2F;
      border-radius:20px;
      .prize-box-title{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
        font-size:60px;
        font-weight:400;
        line-height:38px;
        color:#FFFFFF;
      }
    }
    .winning-prize-close{
      margin-top: 64px;
      text-align: center;
    }
    .prize-box-description{
      text-align: center;
      font-size:20px;
      font-weight:400;
      line-height:30px;
      color:#EEEEEE;
      letter-spacing:2px;
      opacity: 0.8;
    }
  }
  .poster{
    padding: 20px 110px 0 110px;
    .poster-box{
      padding: 0;
      background: none;
      border: none;
      img{
        width: 100%;
      }
      .press-save{
        padding: 14px 0;
        text-align: center;
        background: #FEDB63;
        color: #FA4D2F;
        font-size: 28px;
        font-weight: 400;
      }
    }
    .poster-close{
      margin-top: 20px;
    }
  }
  .item-content{
    position: relative;
    display: flex;
    margin-top: 32px;
    background-color: #FFFFFF;
    border-radius: 12px;
    .stamp{
      z-index: 200;
      position: absolute;
      top: -65px;
      right: 70px;
    }
    .content-img-box{
      width: 120px;
      height: 84px;
      position: relative;
      padding: 6px 18px;
      border-right: 3px dotted #FA4D2F;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content-img-box:before{
      position: absolute;
      top: -10px;
      right: -14px;
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #FA4D2F;
    }
    .content-img-box:after{
      position: absolute;
      bottom: -2px;
      right: -14px;
      content: '';
      width: 20px;
      height: 10px;
      border-radius: 20px 20px 0 0;
      background-color: #FA4D2F;
    }
    .content-detail-box{
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 0 18px;
      .content-box{
        display: flex;
        justify-content: space-between;
      }
      .detail-name{
        font-size: 18px;
        color: #333333;
        line-height: 34px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .detail-coupon{
        width: 270px;
        color: #E1622D;
        font-size: 18px;
        line-height: 32px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .detail-date{
        font-size: 18px;
        color: #999999;
        line-height: 32px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .prize-btn-box{
    margin-top: 48px;
    padding: 0 80px;
    .prize-btn-know{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 18px;
      background:#FECD4C;
      border:2px solid #FFE09D;
      opacity:1;
      border-radius:276px;
      color: #A56113;
      font-size:26px;
      font-weight:bold;
    }
    .unprize-btn-know{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 18px;
      background:#FD7B63;
      border:2px solid #FD9D8C;
      opacity:1;
      border-radius:276px;
      color: #FFFFFF;
      font-size:26px;
      font-weight:bold;
    }
  }
  .statistics{
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 0;
    justify-content: center;
    padding: 16px 0;
    font-size: 24px;
    font-weight: 400;
    color: #A4981A;
    span{
      color: #F94345;
      font-weight: bold;
    }
  }
</style>
