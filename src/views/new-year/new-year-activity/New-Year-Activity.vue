<template>
  <div class="new-year-activity">
    <!-- 活动详情展示 -->
    <div class="activity-detail">
      <div class="top">
        <!-- 礼品展示 -->
        <swiper :options="swiperOption" v-if="presentList.length > 1" class="swiper">
          <swiper-slide v-for="(item,index) in presentList" :key="index" class="swiper-no-swiping">
            <div class="swiper-box">
              <img :src="item.awardImg" :class="{ 'no-desc': !item.show }">
              <p v-if="item.show">{{ item.awardName }}</p>
            </div>
          </swiper-slide>
        </swiper>
        <!-- 展示海报按钮 -->
        <button class="show-poster" @click="showPoster">
          <pl-svg name="icon-haibao" height="25" />
          <span>海报</span>
        </button>
        <!-- 展示活动规则按钮 -->
        <button class="show-rule" @click="isShowRule = true">
          活动规则
        </button>
      </div>
      <div class="bottom">
        <!-- 活动倒计时 -->
        <div class="count-down">
          <div class="desc">
            <h3>
              已有<span>{{ activeDetail.signinNumber }}</span>人积攒我心中的年味
            </h3>
            <div v-if="!activityIsOver">
              距活动{{ activityIsStart? '结束' : '开始' }}仅剩<span>{{ dd }}</span>天<span>{{ hh }}</span>：<span>{{ mm }}</span>：<span>{{ ss }}</span>
            </div>
            <div v-else>活动已结束</div>
          </div>
        </div>
        <!-- 参与活动 -->
        <div class="join-activity">
          <div class="control-top">
            <button v-if="!activityIsOver && !activityIsStart">活动未开始</button>
            <button v-else-if="!activityIsOver && activityIsStart && !hasParticipate" @click="hasParticipate = true">立即参加活动</button>
            <div class="desc-control" v-else-if="!activityIsOver && activityIsStart && hasParticipate">
              <!-- 获得我的年味，显示条件: 上一个年味礼品已被领取 + 当前图标为年味图标 + 当前图标未签到/已签到但是没有礼品 -->
              <template v-if="previousPresentIsReceive && currentSignIn.name && (!currentSignIn.hasSignin || (currentSignIn.hasSignin && !currentSignIn.hasAward))">
                <p class="no-padding">
                  <span>今日可获得{{ currentSignIn.hasSignin? 0 : 1 }}个年味</span>
                  <span>还差{{ activeDetail.differenceNumber }}个年味即可参与年味大礼的抽奖</span>
                </p>
                <!-- 当前节点为已签到，灰化 -->
                <button
                  :class="{disabled: currentSignIn.hasSignin }"
                  :disabled="currentSignIn.hasSignin"
                  @click="getMyNewYearCard"
                >
                  获得我的年味
                </button>
              </template>
              <!-- 立即领奖，显示条件: 上一个节点的礼品未领取 或者 当前节点已签到 + 当前节点有礼品 -->
              <template v-if="(currentSignIn.hasSignin && currentSignIn.hasAward) || !previousPresentIsReceive">
                <p>
                  <span>{{ activeDetail.completeNumber }}人已集齐年味</span>
                  <span>可参与抽奖获得年味大奖</span>
                </p>
                <!-- 当前礼品已领取，按钮灰化 -->
                <button
                  :disabled="currentSignIn.awardType !== ''"
                  :class="{disabled: currentSignIn.awardType !== '' }"
                  @click="receivePresent"
                >
                  立即抽奖
                </button>
              </template>
            </div>
            <!-- 活动已结束，但上一个年味的礼品未领取 -->
            <button v-else-if="activityIsOver && (!previousPresentIsReceive || isGrandPrsentSignIn)" @click="receivePresent">立即抽奖</button>
            <button v-else>活动已结束</button>
          </div>
          <div class="sign-in-icon-bottom">
            <div class="sign-in-icon-item" v-for="(item, index) in signInIconList" :key="index">
              <div v-if="!item.isPresent" class="icon-item"
                   @click="drawNewYearCardPoster(item.posterUrl, item.materialDesc, item.hasSignin)"
              >
                <div class="icon">
                  <img v-if="item.hasSignin" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/46322250-3be6-4c39-99fd-2b07fbde4915.png">
                  <img v-else class="not-sign" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/30a904a8-a0ae-4154-895e-1f9aefd9a6bf.png">
                  <span class="not-sign">{{ item.materialDesc }}</span>
                </div>
                <p :class="{'not-sign': !item.hasSignin}">{{ item.name }}</p>
              </div>
              <div v-else class="prensent-icon-item">
                <!-- 未抽奖前普通奖品展示-->
                <div v-if="!item.hasSignin && !item.isGrandPrsent">
                  <span>
                    <pl-svg name="icon-welfare" width="60" fill="#ffe3c8" />
                  </span>
                  <p class="not-sign">礼品</p>
                </div>
                <!-- 未抽奖前年味大奖奖品展示-->
                <div v-if="!item.hasSignin && item.isGrandPrsent">
                  <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/65044768-ee0c-4987-907b-b69e71cb067c.png">
                  <p :class="{'not-sign': !item.hasSignin}">年味大奖</p>
                </div>
                <!-- 已抽奖,但是未抽中-->
                <div v-if="item.hasSignin && (item.awardType === 0)">
                  <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/974d057c-214a-4e44-90b6-26ed88e28fac.png">
                  <p>未中奖</p>
                </div>
                <!-- 奖品为礼品-->
                <div v-if="item.hasSignin && (item.awardType === 1)">
                  <img :src="item.awardImg">
                  <p>已获得</p>
                </div>
                <!-- 奖品为奖学金-->
                <div v-if="item.hasSignin && (item.awardType === 2)">
                  <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
                  <p>已获得</p>
                </div>
                <!-- 奖品为优惠券-->
                <div v-if="item.hasSignin && (item.awardType === 3 || item.awardType === 4)">
                  <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
                  <p>已获得</p>
                </div>
              </div>
              <div v-if="(index !== signInIconList.length -1) && ((index + 1) % 5 !== 0)" class="underline" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 已获得奖品展示区 -->
    <div class="present-list">
      <div class="top">
        <button @click="clickPrensentType(1)" :class="{'is-selected': presentListType === 1}">
          <span>好礼晒单</span>
          <span class="underline" />
        </button>
        <div class="divider-line" />
        <button @click="clickPrensentType(2)" :class="{'is-selected': presentListType === 2}">
          <span>我的奖品</span>
          <span class="underline" />
        </button>
      </div>
      <div class="bottom">
        <div class="sun-present" v-if="presentListType === 1">
          <div class="statistics">
            已有<span>{{ sunPresentListTotal }}人</span>获得年味奖品
          </div>
          <div class="no-sun-present" v-if="sunPresentList.length === 0">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png">
          </div>
          <template v-else>
            <template v-for="(item, index) in sunPresentList">
              <div class="sun-present-item" v-if="index < 3 || showSunPresentListMore" :key="index">
                <!-- 礼品展示 -->
                <!-- 奖学金 -->
                <img v-if="item.awardType === 2" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
                <!-- 优惠券 -->
                <img v-else-if="item.awardType === 3 || item.awardType === 4" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
                <img v-else src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f53995cc-7c11-40ca-902c-4f34cda1d075.png">
                <!-- 头像-->
                <img class="avatar" :src="item.userImg">
                <!-- 礼品描述 -->
                <h3>
                  <p>{{ item.userName }}积攒了<span class="orange">{{ item.signinNum }}</span>个年味</p>
                  <p> 开启礼品 获得{{ item.awardName }} </p>
                </h3>
              </div>
            </template>
            <div
              v-if="sunPresentList.length > 3 && !showSunPresentListMore"
              class="more"
              @click="showSunPresentListMore = true"
            >
              查看更多
            </div>
          </template>
        </div>
        <div class="my-present" v-if="presentListType === 2">
          <div class="statistics">
            我获得<span>{{ myPresentList.length }}个</span>年味奖品
          </div>
          <div class="no-sun-present" v-if="myPresentList.length === 0">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png">
          </div>
          <template v-else>
            <template v-for="(item, index) in myPresentList">
              <div class="my-present-item" v-if="index < 3 || showMyPresentListMore" :key="index">
                <!-- 礼品展示 -->
                <span>
                  <!-- 礼品 -->
                  <img v-if="item.awardType === 1" :src="item.awardImg">
                  <!-- 奖学金 -->
                  <img v-else-if="item.awardType === 2" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
                  <!-- 全场满减券/品类券 -->
                  <img v-else-if="item.awardType === 3 || item.awardType === 4" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
                  <i :class="{'grand-prize': item.isGrandPrsent}"> 年味大奖</i>
                </span>
                <!-- 礼品描述 -->
                <h3>
                  <p>奖品 【{{ awardTypeDesc[item.awardType] }}】 </p>
                  <p class="orange">{{ item.awardName }}</p>
                </h3>
              </div>
            </template>
            <div
              v-if="myPresentList.length > 3 && !showMyPresentListMore"
              class="more"
              @click="showMyPresentListMore = true"
            >
              查看更多
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 活动规则 -->
    <pl-popup
      title="活动细则"
      :show="isShowRule"
      @close="isShowRule = false"
    >
      <div class="rule-content">
        <h3>1.活动时间</h3>
        <p>{{ activeDetail.activityStartTime }}至{{ activeDetail.activityEndTime }}</p>
        <h3>2.活动对象</h3>
        <p>{{ activeDetail.activity_member }}</p>
        <h3>3.活动奖品</h3>
        <p>年味大礼</p>
        <h3>4.活动说明</h3>
        <template v-if="activeDetail.activityRule">
          <span v-for="(item,index) of activeDetail.activityRule.split('\n')" :key="index">
            {{ item }}
          </span>
        </template>
        <template v-else>
          <span>暂无活动说明</span>
        </template>
      </div>
    </pl-popup>

    <!-- 显示分享海报 -->
    <div class="winning-prize poster" v-if="isShowSharePoster">
      <div class="prize-box poster-box">
        <img :src="sharePoster">
        <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
      </div>
      <div class="winning-prize-close poster-close">
        <pl-svg @click="isShowSharePoster = false" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>

    <!-- 显示年味海报 -->
    <div class="winning-prize poster" v-if="isShowNewYearPoster">
      <div class="prize-box poster-box">
        <img :src="newYearPoster">
        <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
      </div>
      <div class="winning-prize-close poster-close">
        <pl-svg @click="hiddenNewYearCardPoster" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>

    <!-- 中阶梯奖品弹框 -->
    <div class="bg-gray" v-if="isShowPresentPopup && !currentSignIn.isLastIcon && presentStage === 1">
      <div class="present-box">
        <div class="top">
          恭喜您积攒{{ activeDetail.signedInNumber }}个年味
          <p class="has-underline">获得{{ awardTypeDesc[currentPresentDetail.awardType] }}</p>
        </div>
        <div class="detail">
          <div class="product" v-if="currentPresentDetail.awardType === 1">
            <img :src="currentPresentDetail.awardImg">
            <div class="product-detail">
              <h3>{{ currentPresentDetail.awardName }}</h3>
              <h4>有效期：{{ currentPresentDetail.formatStartTime }}-{{ currentPresentDetail.formatEndTime }}</h4>
            </div>
          </div>
          <div class="scholarship" v-if="currentPresentDetail.awardType === 2">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f3f449e6-43f1-4ddc-a68b-9a0a536a88e5.png">
            <span>{{ currentPresentDetail.awardName }}</span>
          </div>
          <div class="coupon" v-if="currentPresentDetail.awardType === 3 || currentPresentDetail.awardType === 4">
            <img v-if="currentPresentDetail.awardType === 4" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/category-coupon.png">
            <img v-else src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/full-coupon.png">
            <div class="wrap">
              <div class="left">
                <div class="coupon-price">
                  {{ currentPresentDetail.price }}
                </div>
                <div class="desc">
                  <p>{{ currentPresentDetail.awardName }}</p>
                  <p>{{ awardTypeDesc[currentPresentDetail.awardType] }}</p>
                </div>
                <p class="expiration">有效期 {{ currentPresentDetail.formatStartTime }}-{{ currentPresentDetail.formatEndTime }}</p>
              </div>
              <div class="right">
                立即<br>领取
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          <p>{{ awardTypeDesc[currentPresentDetail.awardType] }}已经自动存入您的{{ awardPackage[currentPresentDetail.awardType] }}</p>
          <p>您可在{{ awardPackage[currentPresentDetail.awardType] }}中查看</p>
        </div>
        <div class="footer">
          <button class="accept" @click="isShowPresentPopup = false">开心收下</button>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" @click="isShowPresentPopup = false" />
      </div>
    </div>
    <!-- 错过阶梯奖品弹框 -->
    <div class="bg-gray" v-if="isShowPresentPopup && !currentSignIn.isLastIcon && presentStage === 2">
      <div class="present-box">
        <div class="top">
          很遗憾 您与奖品擦肩而过
          <p>新年喜临门 感谢您的参与</p>
        </div>
        <div class="detail">
          <div class="no-present">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/974d057c-214a-4e44-90b6-26ed88e28fac.png">
          </div>
        </div>
        <div class="info">
          <p>您再获得{{ activeDetail.nextPresentIndex - activeDetail.signedInNumber }}个年味即可参与抽奖</p>
        </div>
        <div class="footer">
          <button class="iKnow" @click="isShowPresentPopup = false">朕知道了</button>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" @click="isShowPresentPopup = false" />
      </div>
    </div>
    <!-- 中年味大奖前提示 -->
    <div class="bg-gray" v-if="isShowPresentPopup && currentSignIn.isLastIcon && presentStage === 0">
      <div class="grand-present-tip-box">
        <div class="top">
          <p>恭喜你已集齐我心中的年味</p>
          <p>请抽出我心中的年味大礼</p>
        </div>
        <div class="detail">
          <img class="gift" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/ac9e7b86-69d4-4356-9ba7-c233e711056d.png">
          <img class="light" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/1565326e-6f2a-42f7-9303-c8ad3221f92b.png">
        </div>
        <div class="footer">
          <button @click="receivePresent">立即抽奖</button>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" @click="isShowPresentPopup = false" />
      </div>
    </div>
    <!-- 中年味大奖弹框 -->
    <div class="bg-gray" v-if="isShowPresentPopup && currentSignIn.isLastIcon && presentStage === 1">
      <div class="grand-present-box">
        <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/6d5c54f0-e972-4fd2-b28b-021a12c78e39.png">
        <div class="top">恭喜你获得年味大礼</div>
        <div class="bottom">
          <div class="detail">
            <img :src="currentPresentDetail.awardImg">
            <h3>{{ currentPresentDetail.awardName }}</h3>
            <p>有效期：{{ currentPresentDetail.formatStartTime }}-{{ currentPresentDetail.formatEndTime }}</p>
          </div>
          <div class="footer">
            <button @click="isShowPresentPopup = false">开心收下</button>
          </div>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" @click="isShowPresentPopup = false" />
      </div>
    </div>
    <!-- 错过年味大奖弹框 -->
    <div class="bg-gray" v-if="isShowPresentPopup && currentSignIn.isLastIcon && presentStage === 2">
      <div class="present-box">
        <div class="top">
          很遗憾 您与奖品擦肩而过
          <p>新年喜临门 感谢您的参与</p>
        </div>
        <div class="detail">
          <div class="no-present">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/974d057c-214a-4e44-90b6-26ed88e28fac.png">
          </div>
        </div>
        <div class="footer">
          <div class="btns">
            <button class="iKnow" @click="isShowPresentPopup = false">朕知道了</button>
            <button @click="backMainActivityCenter">返回主会场</button>
          </div>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" @click="isShowPresentPopup = false" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getObtainedSunPresentList,
  getPresentList,
  getSignInIconList,
  checkInCurrentNewYearIcon,
  receivePresent,
  checkIsParticipateableActivity,
  statisticsViews
} from '../../../apis/new-year-activity'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { generateQrcode, drawRoundRect, cutArcImage, createText } from '../../../assets/js/util'
import { getServerTime } from '../../../apis/base-api'
import { mapGetters } from 'vuex'
import moment from 'moment'

let activity_member = {
  '0': '所有注册用户',
  '1': 'Helper用户',
  '2': '普通会员',
  '3': '商家指定用户'
}
let default_present_img = 'https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/bd63ba94-e164-411a-b62d-a5d7e803a59d.png'

export default {
  name: 'NewYearActivity',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      isShare: false, // 是否为分享页面
      activityIsStart: false, // 当前活动是否开始
      activityIsOver: false, // 活动是否已结束
      hasParticipate: false, // 是否已经参与活动
      isShowSharePoster: false, // 是否显示分享海报
      isShowRule: false, // 是否显示活动规则
      isShowPresentPopup: false, // 是否显示中奖提示
      previousPresentIsReceive: true, // 上一个节点的礼品是否已领取
      isGrandPrsentSignIn: false, // 是否已经抽奖最终大奖
      showSunPresentListMore: false, // 是否显示所有好友晒单列表
      showMyPresentListMore: false, // 是否显示所有我的奖品
      isShowNewYearPoster: false, // 是否显示年味海报
      timer: '',
      activeDetail: {},
      presentList: [],
      signInIconList: [], // 签到图标表
      currentSignIn: {}, // 当前要签到节点
      currentPresentDetail: {}, // 当前获得奖品的信息
      sunPresentList: [], // 好礼晒单列表
      sunPresentListTotal: 0,
      myPresentList: [], // 我的礼品列表
      qrcode: '', // 当前活动的二维码
      sharePoster: '', // 分享海报
      newYearPoster: '', // 年味海报
      dd: '', // 倒计时天数
      hh: '', // 倒计时小时数
      mm: '', // 倒计时分钟数
      ss: '', // 倒计时描述
      presentListType: 1, //  1- 好礼晒单 2-我的奖品
      presentStage: '', // 当前获得奖品的阶段 0-领取前提示，1-中奖， 2-未中奖
      swiperOption: {
        direction: 'horizontal',
        effect: 'coverflow',
        speed: 1000,
        loop: true,
        slidesPerView: 3,
        spaceBetween: 24,
        autoplay: {
          delay: 1000, // 1秒切换一次
          disableOnInteraction: false,
          stopOnLast: false
        },
        observer: true,
        observeParents: true
      },
      awardTypeDesc: {
        '1': '礼品',
        '2': '奖学金',
        '3': '全场满减券',
        '4': '品类券'
      },
      awardPackage: {
        '1': '我的礼品',
        '2': '我的奖学金',
        '3': '我的卡券',
        '4': '我的卡券'
      }
    }
  },
  props: {
    // 活动id
    id: {
      type: String,
      default: '1207183225756172288'
    }
  },
  computed: {
    ...mapGetters(['avatar', 'mallUrl', 'userId'])
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'Activity') {
        vm.isShare = true
      } else {
        vm.isShare = false
      }
    })
  },
  async activated () {
    // 是否绑定手机,未绑定手机,去绑定手机
    if (!this.userId) {
      try {
        await this.$alert({
          message: '新用户无法参加我心中的年味，请先绑定手机号',
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
    await statisticsViews(this.id) // 统计访问量
    // 是否能参与当前活动,不能参与返回主会场
    this.checkActivity()
  },
  methods: {
    // 检查当前用户是否可参与当前活动
    async checkActivity () {
      try {
        let { result } = await checkIsParticipateableActivity(this.id)
        if (!result) { // 若当前用户无法参与当前活动直接跳到主会场
          this.canNotJoinCurrentActivity()
          return
        }
        // 初始化页面
        this.init()
      } catch (e) {
        throw e
      }
    },
    // 初始化页面
    async init () {
      this.getObtainedSunPresentList()
      this.getPresentList()
      this.getSignInIconList()
      // 生成当前活动的二维码
      let qrcode = await generateQrcode(500, `${this.mallUrl}/new-year-activity${this.id ? '/' + this.id : ''}`, 100, null, null, 'url')
      this.qrcode = new Image()
      this.qrcode.src = qrcode
    },
    // 获取好友晒单奖品列表
    async getObtainedSunPresentList () {
      try {
        let { result } = await getObtainedSunPresentList(this.id, 1, 50)
        this.sunPresentListTotal = result.receiveUserNumber
        this.sunPresentList = result.flauntAwardsModels
      } catch (e) {
        throw e
      }
    },
    // 获取年味大奖列表
    async getPresentList () {
      try {
        let { result } = await getPresentList(this.id)
        // 年味大奖列表awardType只为1(礼品)，其他类型不可作为年味大奖
        this.presentList = result.map(item => {
          item.awardImg = item.show ? item.awardImg : default_present_img
          item.awardName = item.show ? item.awardName : '****'
          return item
        })
        // 轮播图至少有三个才能旋转
        if (this.presentList.length === 1) {
          this.presentList.push(this.presentList[0])
          this.presentList.push(this.presentList[0])
        }
        // 轮播图至少有三个才能旋转
        if (this.presentList.length === 2) {
          this.presentList.push(this.presentList[0])
          this.presentList.push(this.presentList[1])
        }
      } catch (e) {
        throw e
      }
    },
    // 获取年味大奖列表
    async getSignInIconList () {
      try {
        let { result } = await getSignInIconList(this.id)
        let {
          notes,
          name,
          userScope,
          activityStartTime,
          activityEndTime,
          activityRule,
          currentSignin,
          nextSigninNote,
          signinNumber,
          completeNumber
        } = result

        // 获取节点是否有奖品 + 获取已领取的奖品
        this.myPresentList.length = 0
        let presentList = []
        for (let i = 0; i < notes.length; i++) {
          let item = notes[i]
          // awardType ''表示尚未签到 0 未抽中 1 礼品 2 奖学金 3 全场满减券 4 品类券/**/
          // 当前节点有奖品,提取出奖品信息
          if (item.hasAward) {
            presentList.push({
              presentIndex: i,
              isPresent: true,
              hasSignin: item.awardType !== '',
              hasAward: item.hasAward,
              awardImg: item.awardImg,
              awardType: item.awardType,
              isGrandPrsent: i === notes.length - 1
            })
          }
          // item.awardType > 0,说明为当前已经的抽中奖品
          if (item.awardType) {
            this.myPresentList.push({
              awardImg: item.awardImg,
              awardType: item.awardType,
              awardName: item.awardName,
              isGrandPrsent: i === notes.length - 1
            })
          }
        }

        let currentIndex = notes.findIndex(item => item.index === nextSigninNote)

        this.currentSignIn = notes[currentIndex]
        this.currentSignIn.isLastIcon = currentIndex === notes.length - 1
        // 上一个节点无礼品 或者 有礼品且awardType !== ''表示礼品已经被领取
        this.previousPresentIsReceive = currentIndex ? (notes[currentIndex - 1].hasAward && notes[currentIndex - 1].awardType !== '') || !notes[currentIndex - 1].hasAward : true
        // 大奖是否被领取，是-最后一个年味，且awardType !== ''
        this.isGrandPrsentSignIn = this.currentSignIn.isLastIcon ? this.currentSignIn.awardType !== '' : false

        // 最后一个节点已签到，但未领取年味大奖, 弹框提示领取最终奖品
        if (this.currentSignIn.isLastIcon && !this.isGrandPrsentSignIn) {
          this.isShowPresentPopup = true
          this.presentStage = 0
        }

        let nextPresentIndex = notes.findIndex((item, index) => item.hasAward && index > currentIndex)

        // 活动信息
        this.activeDetail = {
          name, // 活动名称
          activityStartTime,
          activityEndTime,
          activityRule, // 活动细则
          currentSignin, // 今日是否已签到
          nextSigninNote, // 下一个要签到的节点
          signinNumber, // 积攒我心中的年味的人数
          completeNumber, // 集齐年味的人数
          signedInNumber: currentIndex, // 已经签到的个数
          differenceNumber: notes.length - currentIndex, // 还差多少个年味即可抽年味大奖
          nextPresentIndex, // 还差多少个年味即可参与抽奖
          currentReceivePresentNote: this.previousPresentIsReceive ? this.currentSignIn.index : notes[currentIndex - 1].index,
          activity_member: activity_member[userScope]
        }

        // 将奖品信息添加到签到数组中
        for (let i = presentList.length - 1; i > -1; i--) {
          let item = presentList[i]
          notes.splice(item.presentIndex + 1, 0, item)
        }

        // 只要存在一个签到,即表示已经参与活动
        if (this.activeDetail.nextSigninNote !== 1) this.hasParticipate = true

        this.signInIconList = notes

        // 启动倒计时
        {
          let distanceTime
          let { result: serverTime } = await getServerTime()
          let now = serverTime
          let start = moment(this.activeDetail.activityStartTime).valueOf()
          let end = moment(this.activeDetail.activityEndTime).valueOf()
          if (start > now) { // 活动未开始
            this.activityIsStart = false
            distanceTime = start - now
          } else if (end > now) { // 活动未结束
            this.activityIsStart = true
            distanceTime = end - now
          } else if (now > end) { // 活动未结束
            this.activityIsOver = true
          } else {
            this.canNotJoinCurrentActivity()
          }
          this.countdown(distanceTime)
        }
      } catch (e) {
        throw e
      }
    },
    // 获得年味
    async getMyNewYearCard () {
      try {
        if (this.currentSignIn.hasSignin) return
        await checkInCurrentNewYearIcon(this.id, this.activeDetail.nextSigninNote)

        /* ********修改相应的参数，不刷新页面******** */
        this.currentSignIn.hasSignin = true
        let currentIndex = this.signInIconList.findIndex(item => item.index === this.currentSignIn.index)
        this.signInIconList[currentIndex].hasSignin = true
        this.activeDetail.currentSignin = true
        let nextIcon = this.signInIconList.find(item => item.index > this.activeDetail.nextSigninNote)
        this.activeDetail.nextSigninNote = nextIcon ? nextIcon.index : ''
        this.activeDetail.completeNumber = this.currentSignIn.isLastIcon ? this.activeDetail.completeNumber++ : this.activeDetail.completeNumber
        this.activeDetail.currentReceivePresentNote = this.currentSignIn.index
        this.activeDetail.signedInNumber++
        // 统计签到人数
        this.activeDetail.signinNumber = this.activeDetail.nextSigninNote === 1 ? this.activeDetail.signinNumber++ : this.activeDetail.signinNumber
        // 显示海报
        this.drawNewYearCardPoster(this.currentSignIn.posterUrl, this.currentSignIn.name, this.currentSignIn.hasSignin)
      } catch (e) {
        throw e
      }
    },
    // 领取奖品
    async receivePresent () {
      try {
        if (!this.currentSignIn.hasAward || this.currentSignIn.awardType !== '') return
        let { result } = await receivePresent(this.id, this.activeDetail.currentReceivePresentNote)
        /* 显示中奖信息弹框 */
        this.isShowPresentPopup = true
        this.presentStage = result.awardType ? 1 : 2 // 当前获得奖品的阶段 0-领取前提示，1-中奖， 2-未中奖
        /* 初始化获奖信息 */
        result.formatStartTime = moment(result.startTime).format('YYYY-MM-DD')
        result.formatEndTime = moment(result.endTime).format('YYYY-MM-DD')
        result.price = result.awardType === 3 || result.awardType === 4 ? result.awardName.split('减')[1] : 0
        this.currentPresentDetail = result
        /* ********修改相应的参数，不刷新页面******** */
        this.isGrandPrsentSignIn = this.currentSignIn.isLastIcon ? this.currentSignIn.awardType !== '' : false
        let deviation = this.previousPresentIsReceive ? 1 : -1
        let currentIndex = this.signInIconList.findIndex(item => item.index === this.currentSignIn.index)
        this.signInIconList[currentIndex + deviation].hasSignin = true
        this.signInIconList[currentIndex + deviation].awardImg = result.hasAward
        this.signInIconList[currentIndex + deviation].awardType = result.awardType
        this.signInIconList[currentIndex + deviation].isGrandPrsent = this.isGrandPrsentSignIn
        this.previousPresentIsReceive = true
        if (this.isGrandPrsentSignIn) result.isGrandPrsent = true
        this.myPresentList.push(result)
      } catch (e) {
        throw e
      }
    },
    // 生成活动分享海报
    async showPoster () { // 显示分享海报
      try {
        if (this.sharePoster) {
          this.isShowSharePoster = true
          return
        }
        let bgImgUrl = 'https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/160d4ff6-7691-4d29-9239-0b0730454007.png'
        let bgImg = await this.loadImage(bgImgUrl)
        let canvas = document.createElement('canvas')
        canvas.width = bgImg.width
        canvas.height = bgImg.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        drawRoundRect(ctx, canvas.width / 2 - 100, canvas.height / 2 + 200, 200, 200, 2, '#FE613F', '#FE613F')
        ctx.drawImage(this.qrcode, canvas.width / 2 - 100, canvas.height / 2 + 200, 200, 200)
        let sharePoster = canvas.toDataURL('image/jpeg', 0.7)
        this.sharePoster = sharePoster
        this.isShowSharePoster = true
      } catch (e) {
        throw e
      }
    },
    // 生成年味海报
    async drawNewYearCardPoster (imgUrl, desc, isSignIN) { // 生成年味海报
      if (!isSignIN) return
      try {
        this.isShowNewYearPoster = false
        let bgImg = await this.loadImage(imgUrl)
        let canvas = document.createElement('canvas')
        canvas.width = bgImg.width
        canvas.height = bgImg.height
        let ctx = canvas.getContext('2d')
        // 绘制背景
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        // 绘制头像
        let default_avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
        let avatar = this.avatar || default_avatar
        avatar = await this.loadImage(avatar)
        avatar = await cutArcImage(avatar)
        drawRoundRect(ctx, 50, 810, 60, 60, 30, '#FE613F', '#FE613F')
        ctx.drawImage(avatar, 50, 810, 60, 60)
        // 绘制年味描述
        ctx.font = '20px bold'
        ctx.fillStyle = '#000'
        ctx.textBaseline = 'hanging'
        createText(ctx, 118, 820, desc, 34, 138, 1)
        createText(ctx, 118, 850, '我心中的年味', 34, 138, 1)

        // 绘制二维码
        drawRoundRect(ctx, 242, 800, 80, 80, 2, '#FE613F', '#FFF')
        ctx.drawImage(this.qrcode, 242, 800, 80, 80)

        // 绘制二维码旁的文字
        ctx.font = '20px bold'
        ctx.fillStyle = '#000'
        ctx.textBaseline = 'hanging'
        createText(ctx, 332, 800, '长按识别保存图片分享给好友，一起参与活动', 24, 136, 3)

        let sharePoster = canvas.toDataURL('image/jpeg', 0.7)
        this.newYearPoster = sharePoster
        this.isShowNewYearPoster = true
      } catch (e) {
        throw e
      }
    },
    // 加载图片
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
    },
    // 无法参与活动，返回主会场
    async canNotJoinCurrentActivity () {
      this.$warning('您无法参与活动，返回主会场，更多活动等您开启')
      await setTimeout(() => {
        this.backMainActivityCenter()
      }, 3000)
    },
    // 切换展示的奖品列表
    clickPrensentType (type) {
      this.presentListType = type
      this.showMyPresentListMore = false
      this.showSunPresentListMore = false
    },
    // 隐藏年味海报
    hiddenNewYearCardPoster () {
      this.isShowNewYearPoster = false
      // 最后一个节点已签到，但未领取年味大奖, 弹框提示领取最终奖品
      if (this.currentSignIn.isLastIcon && !this.isGrandPrsentSignIn) {
        this.isShowPresentPopup = true
        this.presentStage = 0
      }
    },
    // 返回主会场
    backMainActivityCenter () {
      this.$router.replace({ name: 'Activity' })
    },
    // 倒计时
    countdown (datetime) {
      if (datetime < 0) return
      this.timer = setInterval(async () => {
        let { _data } = moment.duration(datetime)
        let d = String(Math.floor(moment.duration(datetime).asDays()))
        let h = String(_data.hours)
        let m = String(_data.minutes)
        let s = String(_data.seconds)
        datetime -= 1000
        // 跨天更新当前签到信息
        if (this.dd !== d) {
          this.previousPresentIsReceive = (this.currentSignIn.hasAward && this.currentSignIn.awardType !== '') || !this.currentSignIn.hasAward
          let currentIndex = this.signInIconList.findIndex(item => item.index > this.currentSignIn.index)
          this.currentSignIn = currentIndex > 0 ? this.signInIconList[currentIndex] : {}
          this.activeDetail.currentReceivePresentNote = this.currentSignIn.index
        }
        if (datetime <= 0) {
          clearInterval(this.timer)
          setTimeout(async () => { // 倒计时结束, 重新渲染页面
            this.init()
          }, 5000)
        }
        this.dd = d.padStart(2, '0')
        this.hh = h.padStart(2, '0')
        this.mm = m.padStart(2, '0')
        this.ss = s.padStart(2, '0')
      }, 1000)
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
  .new-year-activity {
    width: 100vw;
    background-color: #c40e1a;
    padding-bottom: 60px;
    position: relative;

    .activity-detail {
      min-height: 580px;
      background: url('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/575c43ec-15c3-47fe-be5f-948fc9d55d8c.png') top no-repeat;
      background-size: contain;

      .top {
        position: relative;
        padding-top: 160px;

        .swiper {
          width: 80vw;
          position: absolute;
          top: 200px;
          left: 50%;
          transform: translateX(-50%);

          .swiper-no-swiping {
            .swiper-box {
              background-color: #EE4620;
              height: 250px;
              overflow: hidden;
              border-radius: 20px;

              > img {
                width: 240px;
                object-fit: cover;
                height: 200px;
                &.no-desc {
                  height: 100%;
                }
              }

              > p {
                margin-top: 6px;
                text-align: center;
                color: #FFF;
                font-size: 24px;
              }
            }
          }
        }

        .show-poster {
          position: absolute;
          right: 0;
          top: 350px;
          width: 100px;
          height: 48px;
          line-height: 48px;
          border: 1px solid rgba(255, 227, 200, 1);
          background: linear-gradient(90deg, rgba(255, 152, 26, 1) 0%, rgba(238, 70, 32, 1) 100%);
          border-radius: 24px 0px 0px 24px;
          z-index: 1;
          letter-spacing: 2px;

          > svg {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            vertical-align: middle;
          }

          > span {
            display: inline-block;
            margin-left: 32px;
            font-size: 20px;
            color: #FFF;
          }
        }

        .show-rule {
          position: absolute;
          right: 0;
          top: 410px;
          width: 120px;
          height: 48px;
          line-height: 48px;
          border: 1px solid rgba(255, 227, 200, 1);
          background: linear-gradient(90deg, rgba(255, 152, 26, 1) 0%, rgba(238, 70, 32, 1) 100%);
          border-radius: 24px 0px 0px 24px;
          z-index: 1;
          font-size: 20px;
          color: #FFF;
          text-align: right;
          padding-right: 8px;
          letter-spacing: 2px;
        }
      }

      .bottom {
        position: relative;

        .count-down {
          margin-top: 320px;
          height: 140px;
          background: url('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8ea9af77-c778-4909-82ad-7424312dd48a.png') top no-repeat;
          background-size: cover;

          .desc {
            padding-top: 40px;
            text-align: center;
            line-height: 40px;

            > h3 {
              font-size: 28px;
              color: #620003;

              span {
                color: #FE461F;
              }
            }

            > div {
              font-size: 26px;
              color: #FE461F;

              span {
                text-align: center;
                display: inline-block;
                background-color: #FE461F;
                color: #FFF;
                margin: 0 2px;
                padding: 0 2px;
                min-width: 32px;
                height: 36px;
              }
            }
          }
        }

        .join-activity {
          margin: -2px 13px 0;
          min-height: 500px;
          background: #FFF;
          border-radius: 20px;
          border: rgba(254, 70, 31, 1) 28px solid;

          .control-top {
            padding: 30px 0;
            display: flex;
            justify-content: center;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

            button {
              height: 64px;
              width: 220px;
              line-height: 64px;
              font-size: 26px;
              color: rgba(255, 227, 200, 1);
              background: rgba(254, 70, 31, 1);
              border-radius: 10px;
              text-align: center;
              &.disabled {
                filter: grayscale(50%);
              }
            }

            > .desc-control {
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              padding: 0 24px;

              p {
                display: inline-block;
                padding-right: 150px;
                &.no-padding {
                  padding-right: 20px;
                }

                span {
                  display: block;
                  font-size: 26px;

                  &:last-child {
                    font-size: 22px;
                    color: #313131;
                    padding-top: 10px;
                  }
                }
              }
            }
          }

          .sign-in-icon-bottom {
            padding: 20px;

            .sign-in-icon-item {
              padding: 10px 0;
              display: inline-block;

              .icon-item {
                display: inline-block;

                .icon {
                  position: relative;
                  text-align: center;

                  img {
                    width: 90px;
                    object-fit: cover;

                    &.not-sign {
                      width: 90px;
                    }
                  }

                  span {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    color: #FFE3C8;
                    font-size: 42px;

                    &.not-sign {
                      color: #FFFFFF;
                    }
                  }
                }

                > p {
                  color: #F60000;
                  font-size: 24px;
                  line-height: 40px;
                  &.not-sign {
                    color: #373737;
                  }
                }
              }

              .prensent-icon-item {
                display: inline-block;

                > div {
                  position: relative;
                  text-align: center;

                  > img {
                    width: 90px;
                    object-fit: cover;
                  }

                  > p {
                    color: #F60000;
                    font-size: 24px;
                    line-height: 40px;

                    &.not-sign {
                      color: #000;
                    }
                  }

                  > span {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    background-color: #FD461F;
                    position: relative;
                    display: inline-block;

                    > svg {
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translateX(-50%) translateY(-50%);
                    }
                  }
                }
              }

              .underline {
                display: inline-block;
                width: 18px;
                border: 1px solid #FF8A8A;
                margin: 60px 6px;
              }
            }
          }
        }
      }
    }

    .present-list {
      min-height: 500px;
      padding-bottom: 20px;
      margin: 18px 13px 0;
      background-color: #FFFFFF;
      border-radius: 20px;

      .top {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;

        button {
          color: #787878;
          font-size: 32px;
          position: relative;

          .underline {
            display: none;
          }

          &.is-selected {
            color: #FE461F;

            span {
              position: relative;
              z-index: 1;
            }

            .underline {
              width: 100%;
              position: absolute;
              bottom: 4px;
              z-index: 0;
              display: block;
              border-bottom: #FFDC34 solid 10px;
            }
          }
        }

        .divider-line {
          margin: 0 100px;
          display: inline-block;
          width: 0px;
          height: 34px;
          border: 2px solid rgba(201, 201, 201, 1);
        }
      }

      .bottom {
        text-align: center;

        .statistics {
          margin: 0 150px;
          height: 54px;
          line-height: 54px;
          background: rgba(255, 227, 200, 1);
          border-radius: 34px;
          font-size: 26px;
          color: rgba(98, 0, 3, 1);

          span {
            color: #FA4D2F;
          }
        }

        .no-sun-present {
          margin-top: 40px;
          text-align: center;

          > img {
            width: 200px;
          }
        }

        .sun-present-item {
          display: flex;
          align-items: center;
          margin: 15px 30px;
          border-bottom:1px solid #C9C9C9;
          padding-bottom: 15px;

          > img {
            width: 80px;
            object-fit: contain;

            &.avatar {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              margin-left: 30px;
              object-fit: cover;
            }
          }

          h3 {
            text-align: left;
            margin-left: 25px;
            font-size: 26px;
            line-height: 40px;
            color: #333;
            font-weight: 400;

            p:last-child {
              font-size:24px;
              color:#999;
            }

            .orange {
              color: #FA4D2F;
            }
          }
        }

        .my-present-item {
          display: flex;
          align-items: center;
          margin: 15px 30px;
          border-bottom:1px solid #C9C9C9;
          padding-left: 20px;
          padding-bottom: 15px;
          > span {
            position: relative;
            img {
              width: 80px;
              object-fit: cover;
            }
            i {
              display: none;
            }
            .grand-prize {
              padding: 0 8px;
              display: block;
              position: absolute;
              top: 0;
              left: 50%;
              background:#FEC252;
              border-radius:20px;
              height:30px;
              line-height: 30px;
              width:80px;
              font-size:20px;
              color:#FE4923;
            }
          }
          h3 {
            text-align: left;
            font-size:26px;
            font-weight:400;
            line-height:40px;
            color:#333;
            margin-left: 70px;

            .orange {
              color: #FA4D2F;
            }
          }
        }
        .more {
          font-size:26px;
          line-height:35px;
          color:#333;
        }
      }
    }

    .rule-content {
      padding: 0 40px 40px;

      h3 {
        font-size: 32px;
        margin-top: 40px;
        margin-bottom: 10px;
      }

      p {
        font-size: 28px;
      }

      span {
        display: block;
        font-size: 28px;
      }
    }
  }

  /* 海报样式 */
  .winning-prize {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.65);
    padding: 300px 122px 0 122px;
    z-index: 1;

    .prize-box {
      padding: 40px 16px;
      background-color: #FA4D2F;
      border-radius: 20px;

      .prize-box-title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
        font-size: 60px;
        font-weight: 400;
        line-height: 38px;
        color: #FFFFFF;
      }
    }

    .winning-prize-close {
      margin-top: 64px;
      text-align: center;
    }

    .prize-box-description {
      text-align: center;
      font-size: 20px;
      font-weight: 400;
      line-height: 30px;
      color: #EEEEEE;
      letter-spacing: 2px;
      opacity: 0.8;
    }
  }

  .poster {
    padding: 50px 110px 0 110px;

    .poster-box {
      padding: 0;
      background: none;
      border: none;

      img {
        width: 100%;
      }

      .press-save {
        padding: 14px 0;
        text-align: center;
        background: #FEDB63;
        color: #FA4D2F;
        font-size: 28px;
        font-weight: 400;
      }
    }

    .poster-close {
      margin-top: 20px;
    }
  }

  .bg-gray {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.65);

    /* 关闭按钮 */
    .close {
      margin-top: 900px;
      text-align: center;
    }
  }

  /* 中奖弹框样式 */
  .present-box {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #FFF;
    width: 540px;
    padding-bottom: 20px;
    border-radius: 10px;

    .top {
      padding-top: 60px;
      height: 170px;
      text-align: center;
      background: url("https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/29b608e1-4954-4676-aa03-7f4c322d52c9.png") center top no-repeat;
      background-size: cover;
      font-size: 40px;
      color: #FFDCB3;

      p {
        position: relative;
        padding-top: 10px;
        font-size: 30px;
        line-height: 40px;

        &.has-underline {
          &:after, &:before {
            position: absolute;
            top: 50%;
            transform: translateY(-30%);
            content: '';
            width: 74px;
            height: 0px;
            border: 1px solid #FFDCB3;
          }

          &:before {
            left: 100px;
          }

          &:after {
            right: 100px;
          }
        }
      }
    }

    .detail {
      margin: 20px 0;

      /* 优惠券样式 */
      .coupon {
        padding: 0 20px;
        position: relative;

        img {
          width: 500px;
        }

        .wrap {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;

          .left {
            padding: 34px 0 0 50px;

            .coupon-price {
              display: inline-block;
              font-size: 55px;
              color: #ED2E50;

              &:before {
                content: '￥';
                font-size: 17px;
                transform: translateX(-10px);
              }
            }

            .desc {
              display: inline-block;
              margin-left: 30px;
            }

            .expiration {
              margin-top: 10px;
            }
          }

          .right {
            font-size: 24px;
            line-height: 28px;
            color: #FFF;
            position: absolute;
            right: 70px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      /* 礼品样式 */
      .product {
        margin: 0 20px;
        display: flex;
        box-sizing: border-box;
        border: 1px solid #F01516;

        img {
          width: 180px;
          height: 120px;
          object-fit: cover;
          vertical-align: middle;
        }

        .product-detail {
          padding: 12px 0 0 20px;
          height: 120px;
          box-sizing: border-box;
          flex: 1;
          background-color: #FFE9E9;

          h3 {
            font-size: 32px;
            color: #373737;
            font-weight: 400;
            width: 240px;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 20px;
          }

          h4 {
            font-size: 20px;
            font-weight: 400;
            color: #373737;
            margin: 10px 0;
          }
        }
      }

      /* 奖学金样式 */
      .scholarship {
        text-align: center;
        position: relative;

        span {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          color: #FFDCB3;
        }
      }

      /* 错过奖品 */
      .no-present {
        text-align: center;

        img {
          width: 170px;
        }
      }
    }

    .info {
      text-align: center;
      font-size: 20px;
      line-height: 26px;
      color: #A8A8A8;
      padding-bottom: 20px;
    }

    .footer {
      border-top: 1px solid #E7E7E7;
      padding-top: 20px;
      text-align: center;
      font-size: 30px;
      text-align: center;

      .accept {
        width: 326px;
        height: 52px;
        background: linear-gradient(180deg, #F5651A 0%, #F01B15 100%);
        box-shadow: 0px 3px 6px #F01C15;
        border-radius: 50px;
        line-height: 52px;
        color: #FFDCB3;
      }

      .iKnow {
        color: #F01516;
      }

      .btns {
        font-size: 30px;
        color: #A8A8A8;
        display: flex;

        button {
          flex: 1;
          position: relative;
        }

        .iKnow:after {
          position: absolute;
          right: 0;
          top: -7px;
          content: '';
          width: 0px;
          height: 57px;
          border: 1px solid #E7E7E7;
        }
      }
    }
  }

  /* 中年味大奖开奖前 */
  .grand-present-tip-box {
    position: fixed;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    background-color: transparent;
    position: relative;
    text-align: center;

    .top {
      font-size: 40px;
      line-height: 56px;
      color: #FFDCB3;
    }

    .detail {
      .gift {
        margin-left: 30px;
      }

      .light {
        position: absolute;
        left: 50%;
        margin-left: -35%;
        top: 20px;
        z-index: -1;
        animation: rotateAndScale 3s linear infinite;
      }
    }

    .footer {
      padding-top: 60px;
      text-align: center;

      button {
        width: 326px;
        height: 52px;
        background: linear-gradient(180deg, #F5651A 0%, #F01B15 100%);
        box-shadow: 0px 3px 6px #F01C15;
        border-radius: 50px;
        font-size: 30px;
        line-height: 52px;
        color: #FFDCB3;
      }
    }
  }

  @keyframes rotateAndScale {
    0% {
      transformtransform: scale(1.3, 1.3) rotate(0deg);
      transform-origin: center;
      opacity: 0.2
    }
    50% {
      transform: scale(1, 1) rotate(180deg);
      transform-origin: center;
      opacity: 1
    }
    98% {
      transform: scale(2, 2) rotate(360deg);
      transform-origin: center;
      opacity: 0
    }
    100% {
      transform: scale(2, 2) rotate(360deg);
      transform-origin: center;
      opacity: 0
    }
  }

  /* 中年味大奖 */
  .grand-present-box {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);

    > img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -120px;
      z-index: -1;
    }

    .top {
      background-color: #FFF;
      width: 400px;
      height: 70px;
      line-height: 70px;
      margin: 0 auto;
      border-radius:20px 20px 0 0;
      text-align: center;
      font-size:30px;
      color:#F01516;
    }

    .bottom {
      background:#FFF;
      box-shadow:0px 3px 5px #FF0000;
      border-radius:42px;
      padding: 10px 10px 20px 10px;
      width: 500px;
      .detail {
        text-align: center;
        border-radius:30px;
        padding: 60px 0;
        background: #F01516 url("https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/83e5925d-2d8a-4dd8-b009-755f3b2823d1.png") bottom no-repeat;
        background-size: contain;
        > img{
          width: 260px;
          height: 150px;
          object-fit: cover;
        }
        h3 {
          padding-top: 20px;
          margin: 0 auto;
          color: #FFF;
          font-weight: 400;
          width: 400px;
          overflow: hidden;
          word-break: keep-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size:30px;
          line-height:40px;
        }
        h4 {
          padding: 10px 0;
          font-size:20px;
          font-weight:400;
          line-height:26px;
          color:#FFDCB3;
        }
        p {
          font-size:20px;
          color:#FFF;
        }
      }

      .footer {
        padding-top: 30px;
        text-align: center;

        button {
          width: 326px;
          height: 52px;
          background: linear-gradient(180deg, #F5651A 0%, #F01B15 100%);
          box-shadow: 0px 3px 6px #F01C15;
          border-radius: 50px;
          font-size: 30px;
          line-height: 52px;
          color: #FFDCB3;
        }
      }
    }
  }
</style>
