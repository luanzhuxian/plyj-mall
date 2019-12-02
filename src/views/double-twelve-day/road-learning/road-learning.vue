<template>
  <div class="road-learning">
    <div class="top">
      <div class="title-box">
        <div class="title-left">
          <pl-svg v-if="isShare" @click="$router.replace({name: 'Activity'})" name="icon-shouye" fill="#fff" width="40" />
          <pl-svg v-else @click="$router.back()" name="icon-left" fill="#fff" width="32" />
        </div>
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/icon-road-learning-title.png">
        <div class="title-right rule-btn" @click="showRule = true">
          活动规则
        </div>
        <div class="title-right" @click="drawSharePoster ()">
          分享海报
        </div>
      </div>
      <div class="user-info">
        <img :src="avatar"><span>每日坚持签到 累计达10次即可抽大奖！</span>
      </div>

      <swiper :options="swiperOption" v-if="obtainGifts.length > 1" class="swiper">
        <swiper-slide v-for="(item,index) in obtainGifts" :key="index" class="swiper-no-swiping">
          <div class="swiper-box">
            <img :src="item.headImgUrl">
            <div style="margin-left: 6px"><span v-if="item.nickName">{{ formatName(item.nickName) }}</span>中了{{ item.giftName }}</div>
          </div>
        </swiper-slide>
      </swiper>

      <div v-if="obtainGifts.length === 1" class="swiper1">
        <img :src="obtainGifts[0].headImgUrl">
        <div style="margin-left: 6px"><span v-if="obtainGifts[0].nickName">{{ formatName(obtainGifts[0].nickName) }}</span>中了{{ obtainGifts[0].giftName }}</div>
      </div>

      <div class="ui-base u-p3d">
        <div class="ball-c" />
        <!-- 四个组 -->
        <div class="base u-p3d" v-if="gifts.length === 4">
          <div class="ball-base u-p3d ball-1"><div class="ball"><img :src="gifts[0].giftImage" alt=""><div>奖品四</div></div></div>
          <div class="ball-base u-p3d ball-2"><div class="ball"><img :src="gifts[1].giftImage" alt=""><div>奖品三</div></div></div>
          <div class="ball-base u-p3d ball-3"><div class="ball"><img :src="gifts[2].giftImage" alt=""><div>奖品二</div></div></div>
          <div class="ball-base u-p3d ball-4"><div class="ball"><img :src="gifts[3].giftImage" alt=""><div>奖品一</div></div></div>
        </div>
        <!-- 三个组 -->
        <div class="base u-p3d" v-if="gifts.length === 3">
          <div class="ball-base u-p3d ball-5">
            <div class="ball">
              <img :src="gifts[0].giftImage" alt=""><div>奖品三</div>
            </div>
          </div>
          <div class="ball-base u-p3d ball-6">
            <div class="ball">
              <img :src="gifts[1].giftImage" alt=""><div>奖品二</div>
            </div>
          </div>
          <div class="ball-base u-p3d ball-7">
            <div class="ball">
              <img :src="gifts[2].giftImage" alt=""><div>奖品一</div>
            </div>
          </div>
        </div>
        <!-- 两个组 -->
        <div class="base u-p3d" v-if="gifts.length === 2">
          <div class="ball-base u-p3d ball-1">
            <div class="ball">
              <img :src="gifts[0].giftImage" alt=""><div>奖品二</div>
            </div>
          </div>
          <div class="ball-base u-p3d ball-3">
            <div class="ball">
              <img :src="gifts[1].giftImage" alt=""><div>奖品一</div>
            </div>
          </div>
        </div>
        <!-- 一个组 -->
        <div class="base u-p3d" v-if="gifts.length === 1">
          <div class="ball-base u-p3d ball-1">
            <div class="ball">
              <img :src="gifts[0].giftImage" alt=""><div>奖品一</div>
            </div>
          </div>
        </div>
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
          <pl-svg v-else @click="drawPoster (1)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step2" :class="{'step-big':checkInDetail.totalCheckInNum >= 2}">
          <span v-if="checkInDetail.totalCheckInNum < 2">2</span>
          <pl-svg v-else @click="drawPoster (2)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step3" :class="{'step-big':checkInDetail.totalCheckInNum >= 3}">
          <span v-if="checkInDetail.totalCheckInNum < 3">3</span>
          <pl-svg v-else @click="drawPoster (3)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step4" :class="{'step-big':checkInDetail.totalCheckInNum >= 4}">
          <span v-if="checkInDetail.totalCheckInNum < 4">4</span>
          <pl-svg v-else @click="drawPoster (4)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step5" :class="{'step-big':checkInDetail.totalCheckInNum >= 5}">
          <span v-if="checkInDetail.totalCheckInNum < 5">5</span>
          <pl-svg v-else @click="drawPoster (5)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step6" :class="{'step-big':checkInDetail.totalCheckInNum >= 6}">
          <span v-if="checkInDetail.totalCheckInNum < 6">6</span>
          <pl-svg v-else @click="drawPoster (6)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step7" :class="{'step-big':checkInDetail.totalCheckInNum >= 7}">
          <span v-if="checkInDetail.totalCheckInNum < 7">7</span>
          <pl-svg v-else @click="drawPoster (7)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step8" :class="{'step-big':checkInDetail.totalCheckInNum >= 8}">
          <span v-if="checkInDetail.totalCheckInNum < 8">8</span>
          <pl-svg v-else @click="drawPoster (8)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step9" :class="{'step-big':checkInDetail.totalCheckInNum >= 9}">
          <span v-if="checkInDetail.totalCheckInNum < 9">9</span>
          <pl-svg v-else @click="drawPoster (9)" name="icon-jiaoya" fill="#FFF" width="30" />
        </div>
        <div class="step step10" :class="{'step-big':checkInDetail.totalCheckInNum >= 10}">
          <pl-svg v-if="checkInDetail.totalCheckInNum < 10" name="icon-liwu" fill="#FFF" width="30" />
          <pl-svg v-else @click="drawPoster (10)" name="icon-liwu" fill="#FFF" width="30" />
        </div>
        <div class="statistics" v-if="activeStart">
          已有 <span>{{ checkInDetail.checkInUserNum }}人</span>参与活动 <span>&nbsp;|&nbsp;</span> <div v-if="checkInDetail.totalCheckInNum < 10">还差 <span>{{ 10 - checkInDetail.totalCheckInNum }}次</span>签到，可冲击大奖</div> <div v-if="checkInDetail.totalCheckInNum === 10">恭喜你 已完成<span>10次</span>签到</div>
        </div>
      </div>
      <div class="btn-box">
        <div class="btn disabel" v-if="!activeStart && !activeEnd && activeDetail.status === 1">活动未开始</div>
        <div class="btn active" @click="checkIn ()" v-if="activeStart && !activeEnd&&!checkInDetail.hasCheckInToday && checkInDetail.totalCheckInNum < 10 && activeDetail.status === 2">
          <pl-svg v-show="loadingShow" class="rotate loading" name="icon-btn-loading" fill="#fff" width="40" />
          立即签到
        </div>
        <div class="btn disabel" v-if="!activeDetail.status && (checkInDetail.claimStatus !== 1)">活动已结束</div>
        <div class="btn active" v-if="checkInDetail.totalCheckInNum === 10 && checkInDetail.claimStatus === 0 && activeDetail.status === 2" @click="claimGift()">
          <pl-svg v-show="loadingShow" class="rotate loading" name="icon-btn-loading" fill="#fff" width="40" />
          点击抽大奖
        </div>
        <div class="btn active" v-if="checkInDetail.totalCheckInNum === 10 && checkInDetail.claimStatus === 1" @click="$router.push({name:'MyPresent'})">查看奖品</div>
        <div class="btn disabel" v-if="checkInDetail.totalCheckInNum === 10 && checkInDetail.claimStatus === 2 && activeDetail.status === 2">很遗憾没有中奖</div>
        <div class="btn already" v-if="checkInDetail.hasCheckInToday && checkInDetail.totalCheckInNum !== 10 && activeStart && !activeEnd && activeDetail.status === 2">今日已签到</div>
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
        <pl-svg @click="winningShow = false" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
    <div class="winning-prize" v-if="unWinningShow">
      <div class="prize-box">
        <div class="prize-box-title">很遗憾未中奖</div>
        <p class="prize-box-description">感谢您参与活动</p>
        <div class="prize-btn-box">
          <div class="prize-btn-know" @click="$router.back()">返回主会场</div>
        </div>
        <div class="prize-btn-box">
          <div class="unprize-btn-know" @click="unWinningShow = false">朕知道了</div>
        </div>
      </div>
      <div class="winning-prize-close">
        <pl-svg @click="unWinningShow = false" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
    <div class="winning-prize poster" v-if="posterShow">
      <div class="prize-box poster-box">
        <img :src="post" alt="">
        <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
      </div>
      <div class="winning-prize-close poster-close">
        <pl-svg @click="posterShow = false" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>

    <div class="winning-prize poster" v-if="sharePosterShow">
      <div class="prize-box poster-box">
        <img :src="sharePost" alt="">
        <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
      </div>
      <div class="winning-prize-close poster-close">
        <pl-svg @click="sharePosterShow = false" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
  </div>
</template>

<script>
import { generateQrcode } from '../../../assets/js/util'
import { getIDRoadLearningDetail, getRoadLearningDetail, getCheckInDetail, getCheckIn, claimGift, getRoadLearningGifts, getObtainGiftsList } from '../../../apis/road-learning'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'RoadLearning',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      isShare: false,
      timer: '',
      showRule: false,
      winningShow: false,
      unWinningShow: false,
      posterShow: false,
      sharePosterShow: false,
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
      post: '',
      sharePost: '',
      gifts: [],
      obtainGifts: [],
      swiperOption: {
        effect: 'coverflow',
        slidesPerView: 2,
        centeredSlides: false,
        coverflowEffect: {
          rotate: 50,
          stretch: 5,
          depth: 5,
          modifier: 1,
          slideShadows: false
        },
        direction: 'vertical',
        autoHeight: true,
        autoplay: true,
        loop: true,
        noSwiping: true
      },
      lottering: false,
      canClick: true,
      loadingShow: false
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
  beforeRouteEnter (to, from, next) {
    next(vm => { //  这里的vm指的就是vue实例，可以用来当做this使用
      if (from.name !== 'Activity') {
        vm.isShare = true
      } else {
        vm.isShare = false
      }
    })
  },
  async activated () {
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
  },
  async created () {
    await this.getDetail()
    this.getCheckInDetail()
    this.getGifts()
    this.getObtainGifts()
    setInterval(() => {
      this.getObtainGifts()
    }, 10000)
    let qrcode = await generateQrcode(500, `${this.mallUrl}/road-learning${this.id ? '/' + this.id : ''}`, 100, null, null, 'url')
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
      this.id = this.activeDetail.id
      let now = Date.now()
      let start = moment(this.activeDetail.activityStartTime).valueOf()
      let end = moment(this.activeDetail.activityEndTime).valueOf()
      if (now < start) {
        this.activeStart = false
        this.activeEnd = false
        distanceTime = start - now
      } else {
        this.activeStart = true
        distanceTime = end - now
        if (end < now) {
          this.activeEnd = true
        } else {
          this.activeEnd = false
        }
      }
      this.countdown(distanceTime)
    },
    async getGifts () {
      const { result: res } = await getRoadLearningGifts({ activityId: this.activeDetail.id })
      this.gifts = res.reverse()
    },
    async getObtainGifts () {
      const { result: res } = await getObtainGiftsList(this.activeDetail.id)
      this.obtainGifts = res.records
    },
    countdown (datetime) {
      if (datetime < 0) return
      this.timer = setInterval(async () => {
        let { _data } = moment.duration(datetime)
        let d = String(Math.floor(moment.duration(datetime).asDays()))
        let h = String(_data.hours)
        let m = String(_data.minutes)
        let s = String(_data.seconds)
        datetime -= 1000
        if (datetime <= 0) {
          clearInterval(this.timer)
          await this.getDetail()
          setTimeout(async () => {
            this.obtainGifts = []
            this.id = ''
            await this.getDetail()
            this.getCheckInDetail()
            this.getGifts()
          }, 5000)
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
      if (this.lottering) return
      if (this.checkInDetail.totalCheckInNum === 10 && this.checkInDetail.claimStatus === 1) {
        await this.$confirm({
          message: ' 奖品已领取，快去礼品库中看看~~ ',
          confirmText: '立即查看'
        })
        this.$router.push({ name: 'MyPresent' })
      }
    },
    async checkIn () {
      if (!this.doubleClick()) {
        return
      }
      this.loadingShow = true
      try {
        await getCheckIn(this.activeDetail.id)
      } catch (e) {
        throw e
      }
      await this.getCheckInDetail()
      this.loadingShow = false
      this.drawPoster()
    },
    doubleClick () {
      if (this.canClick) {
        this.canClick = !this.canClick
        setTimeout(() => {
          this.canClick = true
        }, 2000)
        return true
      } else {
        return false
      }
    },
    async claimGift () {
      if (!this.doubleClick()) {
        return
      }
      this.loadingShow = true
      const { result: res } = await claimGift(this.activeDetail.id)
      this.lottering = true
      await this.getCheckInDetail()
      this.loadingShow = false
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
    },
    async drawSharePoster () {
      this.sharePosterShow = true
      let canImg = new Image()
      canImg.crossOrigin = ''
      canImg.src = `https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/1610999569_9928678801_%E8%A7%81%E5%AD%A6%E4%B9%8B%E6%97%85%E5%88%86%E4%BA%AB%E6%B5%B7%E6%8A%A5-2.jpg?time=${Date.now()}`
      canImg.onload = async () => {
        let canvas = document.createElement('canvas')
        canvas.width = canImg.width
        canvas.height = canImg.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(canImg, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(this.qrcode, 270, 1050, 250, 250)
        let post = canvas.toDataURL('image/jpeg', 0.7)
        this.sharePost = post
      }
    },
    formatName (name) {
      let newStr
      if (name.length === 2) {
        newStr = name.substr(0, 1) + '*'
      } else if (name.length > 2) {
        let char = ''
        for (let i = 0, len = name.length - 2; i < len; i++) {
          char += '*'
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1)
      } else {
        newStr = name
      }

      return newStr
    }
  },
  destroyed () {
    clearInterval(this.timer)
    this.loadingShow = false
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
      background: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/goldenEgg.png') no-repeat center 60px;
      background-size: 72% 70%;
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
          margin-top: 70px;
        }
        .title-right{
          width:60px;
          height:60px;
          display: flex;
          align-items: center;
          margin: 24px 5px 0 35px;
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
        .rule-btn {
          position: absolute;
          right: 80px;
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
          .loading{
            margin-right: 10px;
          }
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
    z-index: 1;
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

  @-webkit-keyframes cir1 {
    0% {-webkit-transform:rotateY(0deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateY(-360deg) rotateZ(0deg);}
  }
  @keyframes cir1 {
    0% {transform:rotateY(0deg) rotateZ(0deg);}
    100% {transform:rotateY(-360deg) rotateZ(0deg);}
  }
  @-webkit-keyframes cir2 {
    0% {-webkit-transform:rotateY(-90deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateY(-450deg) rotateZ(0deg);}
  }
  @keyframes cir2 {
    0% {transform:rotateY(-90deg) rotateZ(0deg);}
    100% {transform:rotateY(-450deg) rotateZ(0deg);}
  }
  @-webkit-keyframes cir3 {
    0% {-webkit-transform:rotateY(-180deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateY(-540deg) rotateZ(0deg);}
  }
  @keyframes cir3 {
    0% {transform:rotateY(-180deg) rotateZ(0deg);}
    100% {transform:rotateY(-540deg) rotateZ(0deg);}
  }
  @-webkit-keyframes cir4 {
    0% {-webkit-transform:rotateY(-270deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateY(-630deg) rotateZ(0deg);}
  }
  @keyframes cir4 {
    0% {transform:rotateY(-270deg) rotateZ(0deg);}
    100% {transform:rotateY(-630deg) rotateZ(0deg);}
  }
  /*第二组*/
  @-webkit-keyframes cir5 {
    0% {-webkit-transform:rotateY(0deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateY(-360deg) rotateZ(0deg);}
  }
  @keyframes cir5 {
    0% {transform:rotateY(0deg) rotateZ(0deg);}
    100% {transform:rotateY(-360deg) rotateZ(0deg);}
  }
  @-webkit-keyframes cir6 {
    0% {-webkit-transform:rotateY(-120deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateY(-480deg) rotateZ(0deg);}
  }
  @keyframes cir6 {
    0% {transform:rotateY(-120deg) rotateZ(0deg);}
    100% {transform:rotateY(-480deg) rotateZ(0deg);}
  }
  @-webkit-keyframes cir7 {
    0% {-webkit-transform:rotateY(-240deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateY(-600deg) rotateZ(0deg);}
  }
  @keyframes cir7 {
    0% {transform:rotateY(-240deg) rotateZ(0deg);}
    100% {transform:rotateY(-600deg) rotateZ(0deg);}
  }

  @keyframes cir {
    0% {transform:rotateX(80deg) rotateY(0deg) rotateZ(0deg);}
    100% {transform:rotateX(80deg) rotateY(0deg) rotateZ(-360deg);}
  }
  @-webkit-keyframes cir {
    0% {-webkit-transform:rotateX(80deg) rotateY(0deg) rotateZ(0deg);}
    100% {-webkit-transform:rotateX(80deg) rotateY(0deg) rotateZ(-360deg);}
  }

  .u-p3d{
    -webkit-transform-style:preserve-3d !important;
    transform-style:preserve-3d !important;
  }
  .ui-base {position:relative;width:400px;height:0px;margin:20px auto;
    -webkit-perspective:1000px;
    -webkit-perspective-origin:50% 0%;
    perspective:1000px;
    perspective-origin:50% 0%;
  }
  .base{
    position:relative;
    left: 20px;
    width:350px;height:350px;
    -webkit-transform:rotateX(80deg) rotateY(-10deg);
    transform:rotateX(80deg) rotateY(-10deg);
    -webkit-backface-visibility:hidden;
    backface-visibility:hidden;
    animation:cir 10s linear 0s infinite;
  }
  .ball-base {position:absolute;top:175px;left:-50px;width:225px;height:127px;
    -webkit-transform-origin:225px 0px;
    transform-origin:225px 0px;
  }
  .ball{
    width:130px;
    height:166px;
    display: flex;
    flex-direction: column;
    position:absolute;
    left:0;
    top:0;
    text-align:center;
    overflow:hidden;
    -webkit-transition:all 2s ease-out 0ms;
    transition:all 2s ease-out 0ms;
    -webkit-transform-origin:50% 50%;
    transform-origin:50% 50%;
    border:2px solid rgba(252,237,79,1);
    box-shadow:0px 8px 20px rgba(0,0,0,0.2);
    opacity:1;
    border-radius:12px;
    img{
      width: 130px;
      height: 130px;
    }
    >div{
      height: 36px;
      background-color: #FFFFFF;
      color: #DB4C4C;
      font-size: 20px;
      line-height: 36px;
      text-align: center;
    }
  }
  .ball-c {position:absolute;width:512px;height:363px;left:-10%;top:0px;color:#fff;font-size:24px;
    -webkit-transform-origin:50% 50%;
    transform-origin:50% 50%;
    background:url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/road-learning/egg.png') no-repeat center;
    background-size: 100% 100%;
  }
  .ball {color:#fff;opacity:1;}
  .ball-1 .ball {
    transform:rotateY(10deg) rotateZ(10deg);
    animation:cir1 10s linear 0s infinite;
    -webkit-transition-delay:1500ms !important;
    transition-delay:1500ms !important;
  }
  .ball-2 .ball {
    -webkit-animation:cir2 10s linear 0s infinite;
    animation:cir2 10s linear 0s infinite;
    -webkit-transition-delay:1100ms !important;
    transition-delay:1100ms !important;
  }
  .ball-3 .ball {
    -webkit-animation:cir3 10s linear 0s infinite;
    animation:cir3 10s linear 0s infinite;
    -webkit-transition-delay:700ms !important;
    transition-delay:700ms !important;
  }
  .ball-4 .ball {
    -webkit-animation:cir4 10s linear 0s infinite;
    animation:cir4 10s linear 0s infinite;
    -webkit-transition-delay:300ms !important;
    transition-delay:300ms !important;
  }

  /*第二组*/
   .ball-5 .ball {
     -webkit-animation:cir5 10s linear 0s infinite;
     animation:cir5 10s linear 0s infinite;
     -webkit-transition-delay:1100ms !important;
     transition-delay:1100ms !important;
   }
  .ball-6 .ball {
    -webkit-animation:cir6 10s linear 0s infinite;
    animation:cir6 10s linear 0s infinite;
    -webkit-transition-delay:700ms !important;
    transition-delay:700ms !important;
  }
  .ball-7 .ball {
    -webkit-animation:cir7 10s linear 0s infinite;
    animation:cir7 10s linear 0s infinite;
    -webkit-transition-delay:300ms !important;
    transition-delay:300ms !important;
  }

  .ball-1 {
    -webkit-transform:rotateX(-90deg) rotateY(0deg) translateX(-50px) translateY(-70px);
    transform:rotateX(-90deg) rotateY(0deg) translateX(-50px) translateY(-70px);
  }
  .ball-2 {
    -webkit-transform:rotateX(-90deg) rotateY(90deg) translateX(-50px) translateY(-70px);
    transform:rotateX(-90deg) rotateY(90deg) translateX(-50px) translateY(-70px);
  }
  .ball-3 {
    -webkit-transform:rotateX(-90deg) rotateY(180deg) translateX(-50px) translateY(-70px);
    transform:rotateX(-90deg) rotateY(180deg) translateX(-50px) translateY(-70px);
  }
  .ball-4 {
    -webkit-transform:rotateX(-90deg) rotateY(270deg) translateX(-50px) translateY(-70px);
    transform:rotateX(-90deg) rotateY(270deg) translateX(-50px) translateY(-70px);
  }

/*第二组*/
  .ball-5 {
    -webkit-transform:rotateX(-90deg) rotateY(0deg) translateX(-50px) translateY(-70px);
    transform:rotateX(-90deg) rotateY(0deg) translateX(-50px) translateY(-70px);
  }
  .ball-6 {
    -webkit-transform:rotateX(-90deg) rotateY(120deg) translateX(-50px) translateY(-70px);
    transform:rotateX(-90deg) rotateY(120deg) translateX(-50px) translateY(-70px);
  }
  .ball-7 {
    -webkit-transform:rotateX(-90deg) rotateY(240deg) translateX(-50px) translateY(-70px);
    transform:rotateX(-90deg) rotateY(240deg) translateX(-50px) translateY(-70px);
  }

  .swiper{
    height: 100px;
    position: absolute;
    .swiper-box{
      display:flex;
      flex-direction:row;
      align-items:center;
      margin-left:20px;
      color:#FFFFFF;
      font-size: 20px;
      >img {
        width: 44px;
        height: 44px;
        border-radius:50%
      }
    }
  }
  .swiper1{
    position:absolute;
    display:flex;
    flex-direction:row;
    align-items:center;
    margin-left:20px;
    margin-top:30px;
    color:#FFFFFF;
    font-size: 20px;
      >img {
        width: 44px;
        height: 44px;
        border-radius:50%
      }
  }
</style>
