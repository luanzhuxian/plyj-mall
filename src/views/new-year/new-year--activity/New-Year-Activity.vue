<template>
  <div class="new-year-activity">
    <!-- 活动详情展示 -->
    <div class="activity-detail">
      <div class="top">
        <!-- 礼品展示 -->
        <div v-if="presentList.length === 1" class="one-swiper">
          <img
            src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/bd63ba94-e164-411a-b62d-a5d7e803a59d.png"
          >
        </div>
        <swiper :options="swiperOption" v-if="presentList.length > 1" class="swiper">
          <swiper-slide v-for="(item,index) in presentList" :key="index" class="swiper-no-swiping">
            <div class="swiper-box">
              <img :src="item.headImgUrl">
              <p>
                <span>平衡车</span>
                <br>
                <span>价值1000元</span>
              </p>
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
              已有<span>122</span>人积攒我心中的年味
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
            <button v-if="false">活动未开始</button>
            <button v-if="false">立即参加活动</button>
            <div class="desc-control">
              <p>
                <span>12人已集齐年味</span>
                <span>可参与抽奖获得年味大奖</span>
              </p>
              <button @click="getMyNewYearCard">获得我的年味</button>
              <button v-if="false">立即抽奖</button>
            </div>
          </div>
          <div class="sign-in-icon-bottom">
            <div class="sign-in-icon-item" v-for="(item, index) in signInIconList" :key="index">
              <div v-if="!item.isPresent" class="icon-item">
                <div class="icon">
                  <img v-if="item.isSignIn"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/46322250-3be6-4c39-99fd-2b07fbde4915.png"
                       alt=""
                  >
                  <img v-else class="not-sign"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/30a904a8-a0ae-4154-895e-1f9aefd9a6bf.png"
                       alt=""
                  >
                  <span class="not-sign">{{ item.name }}</span>
                </div>
                <p>{{ item.desc }}</p>
              </div>
              <div v-else class="prensent-icon-item">
                <!-- 奖品为奖学金-->
                <div v-if="false">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png"
                    alt=""
                  >
                  <p>已获得</p>
                </div>
                <!-- 奖品为优惠券-->
                <div v-if="false">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                    alt=""
                  >
                  <p>已获得</p>
                </div>
                <!-- 奖品为礼品-->
                <div v-if="false">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                    alt=""
                  >
                  <p>已获得</p>
                </div>
                <!-- 未获得礼品-->
                <div v-if="false">
                  <span>
                    <pl-svg name="icon-welfare" width="70" fill="#ffe3c8" />
                  </span>
                  <p class="not-sign">礼品</p>
                </div>
                <!-- 最后年味大奖-->
                <div v-if="true">
                  <img
                    src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/65044768-ee0c-4987-907b-b69e71cb067c.png"
                    alt=""
                  >
                  <p :class="{'not-sign': !item.isSignIn}">年味大奖</p>
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
            已有<span>102人</span>获得年味奖品
          </div>
          <div class="no-sun-present" v-if="sunPresentList.length === 0">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png"
              alt=""
            >
          </div>
          <template v-else>
            <template v-for="(item, index) in sunPresentList">
              <div class="sun-present-item" v-if="index < 3 || showSunPresentListMore" :key="index">
                <!-- 礼品展示 -->
                <img v-if="item.giftType === 1"
                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png"
                     alt=""
                >
                <img v-else-if="item.giftType === 2"
                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                     alt=""
                >
                <img v-else
                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f53995cc-7c11-40ca-902c-4f34cda1d075.png"
                     alt=""
                >
                <!-- 头像-->
                <img class="avatar" :src="item.avatar" alt="">
                <!-- 礼品描述 -->
                <h3>
                  <p>{{ item.userName }}积攒了<span class="orange">3</span>个年味</p>
                  <p>
                    开启礼品 获得
                    <span v-if="item.giftType === 1">
                      <span class="orange">{{ item.price }}</span> 元{{ item.name }}
                    </span>
                    <span v-else-if="item.giftType === 2">
                      <span class="orange">{{ item.price }}</span> 元{{ item.name }}
                    </span>
                    <span v-else>
                      价值<span class="orange">{{ item.price }}</span> 元{{ item.name }}
                    </span>
                  </p>
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
            我获得<span>2个</span>年味奖品
          </div>
          <div class="no-sun-present" v-if="myPresentList.length === 0">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png"
              alt=""
            >
          </div>
          <template v-else>
            <template v-for="(item, index) in myPresentList">
              <div class="my-present-item" v-if="index < 3 || showMyPresentListMore" :key="index">
                <!-- 礼品展示 -->
                <span>
                  <img v-if="item.giftType === 1"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png"
                       alt=""
                  >
                  <img v-else-if="item.giftType === 2"
                       src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png"
                       alt=""
                  >
                  <img v-else :src="item.giftImg" alt="">
                  <i :class="{'grand-prize': item.isGrandPrize}">
                    年味大奖
                  </i>
                </span>
                <!-- 礼品描述 -->
                <h3>
                  <p>奖品 【{{ item.presentName }}】</p>
                  <p class="orange">
                    <span v-if="item.giftType === 1">满{{ 1000 }}减{{ 23213 }}</span>
                    <span v-else-if="item.giftType === 2">￥{{ 23 }}元</span>
                    <span v-else>产品介绍</span>
                  </p>
                  <p>有效期2020.3.19~2020.3.19</p>
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
        <p>2019.05.20 10:20:20至2018.06.20 10:20:20</p>
        <h3>2.抽奖时间</h3>
        <p>2019.12.12 10:20:20至2018.06.20 10:20:20</p>
        <h3>3.活动对象</h3>
        <p>所有会员</p>
        <h3>4.活动奖品</h3>
        <p>年味大礼</p>
        <h3>5.活动说明</h3>
        <span>
          在活动有效期内，集齐我心中的10个年味，即可参与抽奖，抽出年味大奖。用户积攒了一定数量的年味，即可获得相应的奖品
        </span>
        <span>获得的礼品将自动存入我的礼品中;</span>
        <span>获得的优惠券将自动存入我的卡包中</span>
        <span>获得的压岁钱将自动存入我的奖学金中 。</span>
      </div>
    </pl-popup>

    <!-- 显示分享海报 -->
    <div class="winning-prize poster" v-if="isShowSharePoster">
      <div class="prize-box poster-box">
        <img :src="sharePoster" alt="">
        <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
      </div>
      <div class="winning-prize-close poster-close">
        <pl-svg @click="isShowSharePoster = false" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>

    <!-- 显示年味海报 -->
    <div class="winning-prize poster" v-if="isShowNewYearPoster">
      <div class="prize-box poster-box">
        <img :src="newYearPoster" alt="">
        <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
      </div>
      <div class="winning-prize-close poster-close">
        <pl-svg @click="isShowNewYearPoster = false" name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>

    <!-- 中阶梯奖品弹框 -->
    <div class="bg-gray" v-if="false">
      <div class="present-box">
        <div class="top">
          恭喜您积攒6个年味
          <p class="has-underline">获得优惠券</p>
        </div>
        <div class="detail">
          <div class="coupon" v-if="false">
            <img
              v-if="false"
              src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/category-coupon.png" alt=""
            >
            <img v-else src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/full-coupon.png"
                 alt=""
            >
            <div class="wrap">
              <div class="left">
                <div class="coupon-price">
                  5000
                </div>
                <div class="desc">
                  <p>满5000减1000</p>
                  <p>双十二优惠券</p>
                </div>
                <p class="expiration">有效期 2019.4.15-2019.4.19</p>
              </div>
              <div class="right">
                立即<br>领取
              </div>
            </div>
          </div>
          <div class="product" v-if="false">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/bd63ba94-e164-411a-b62d-a5d7e803a59d.png"
              alt=""
            >
            <div class="product-detail">
              <h3>CHERRY机械键盘CHERRY机械键盘CHERRY机械键盘CHERRY机械键盘CHERRY机械键盘</h3>
              <h4>有效期：2019.4.15-2019.4.30</h4>
              <p>价值1000元的机械键盘一个</p>
            </div>
          </div>
          <div class="scholarship">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f3f449e6-43f1-4ddc-a68b-9a0a536a88e5.png"
              alt=""
            >
            <span>99999元</span>
          </div>
        </div>
        <div class="info">
          <p>优惠券已经自动存入您的我的卡包</p>
          <p>您可在我的卡包中查看</p>
        </div>
        <div class="footer">
          <button class="accept">开心收下</button>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
    <!-- 错过阶梯奖品弹框 -->
    <div class="bg-gray" v-if="false">
      <div class="present-box">
        <div class="top">
          很遗憾 您与奖品擦肩而过
          <p>新年喜临门 感谢您的参与</p>
        </div>
        <div class="detail">
          <div class="no-present">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/974d057c-214a-4e44-90b6-26ed88e28fac.png"
              alt=""
            >
          </div>
        </div>
        <div class="info">
          <p>您再获得6个年味即可参与抽奖</p>
        </div>
        <div class="footer">
          <button class="iKnow">朕知道了</button>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
    <!-- 中年味大奖前提示 -->
    <div class="bg-gray" v-if="false">
      <div class="grand-present-tip-box">
        <div class="top">
          <p>恭喜你已集齐我心中的年味</p>
          <p>请抽出我心中的年味大礼</p>
        </div>
        <div class="detail">
          <img
            class="gift"
            src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/ac9e7b86-69d4-4356-9ba7-c233e711056d.png"
            alt=""
          >
          <img class="light"
               src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/1565326e-6f2a-42f7-9303-c8ad3221f92b.png"
               alt=""
          >
        </div>
        <div class="footer">
          <button>立即抽奖</button>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
    <!-- 中年味大奖弹框 -->
    <div class="bg-gray" v-if="false">
      <div class="grand-present-box">
        <img
          src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/6d5c54f0-e972-4fd2-b28b-021a12c78e39.png"
          alt=""
        >
        <div class="top">恭喜你获得年味大礼</div>
        <div class="bottom">
          <div class="detail">
            <img
              src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png"
              alt=""
            >
            <h3>CHERRY机械键盘CHERRY机械键盘CHERRY机械键盘CHERRY机械键盘</h3>
            <h4>价值1000元的机械键盘一个</h4>
            <p>有效期：2019.4.15-2019.4.30</p>
          </div>
          <div class="footer">
            <button>开心收下</button>
          </div>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
    <!-- 错过年味大奖前弹框 -->
    <div class="bg-gray" v-if="false">
      <div class="present-box">
        <div class="top">
          很遗憾 您与奖品擦肩而过
          <p>新年喜临门 感谢您的参与</p>
        </div>
        <div class="detail">
          <div class="no-present">
            <img
              src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/974d057c-214a-4e44-90b6-26ed88e28fac.png"
              alt=""
            >
          </div>
        </div>
        <div class="footer">
          <div class="btns">
            <button class="iKnow">朕知道了</button>
            <button @click="backMainActivityCenter">返回主会场</button>
          </div>
        </div>
      </div>
      <div class="close">
        <pl-svg name="icon-close3" fill="#fff" width="40" />
      </div>
    </div>
  </div>
</template>

<script>
// import { getNewYearActivityDetail } from '../../../apis/new-year-activity'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { generateQrcode, drawRoundRect, cutArcImage, createText } from '../../../assets/js/util'
import { getServerTime } from '../../../apis/base-api'
import { mapGetters } from 'vuex'
import moment from 'moment'

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
      presentList: [
        {
          headImgUrl: 'https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/bd63ba94-e164-411a-b62d-a5d7e803a59d.png'
        },
        {
          headImgUrl: 'https://mallcdn.youpenglai.com/static/mall/2.0.0/activity/invitation-large.png'
        },
        {
          headImgUrl: 'https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/bd63ba94-e164-411a-b62d-a5d7e803a59d.png'
        }
      ],
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
      isShowSharePoster: false, // 是否显示分享海报
      isShowRule: false, // 是否显示活动规则
      signInIconList: [
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '灶', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '扫', desc: '送灶上天', isSignIn: true },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false },
        { name: '肉', desc: '送灶上天', isSignIn: false }
      ], // 签到图标表
      presentListType: 1, //  1- 好礼晒单 2-我的奖品
      sunPresentList: [
        {
          giftType: 1,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '满减券'
        },
        {
          giftType: 2,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '奖学金'
        },
        {
          giftType: 3,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '平衡车'
        },
        {
          giftType: 3,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '平衡车'
        },
        {
          giftType: 3,
          avatar: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png',
          userName: '加大哦空大',
          price: 1000,
          name: '平衡车'
        }
      ], // 好礼晒单列表
      showSunPresentListMore: false,
      myPresentList: [
        {
          giftType: 1,
          presentName: '满减券',
          isGrandPrize: true
        },
        {
          giftType: 2,
          presentName: '奖学金'
        },
        {
          giftType: 2,
          presentName: '奖学金'
        },
        {
          giftType: 3,
          presentName: '平衡车',
          giftImg: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
        }
      ], // 好礼晒单列表
      showMyPresentListMore: false,
      qrcode: '', // 当前活动的二维码
      sharePoster: '', // 分享海报
      isShowNewYearPoster: false, // 显示年味海报
      newYearPoster: '', // 年味海报
      dd: '', // 倒计时天数
      hh: '', // 倒计时小时数
      mm: '', // 倒计时分钟数
      ss: '' // 倒计时描述
    }
  },
  props: {
    // 活动id
    id: {
      type: String,
      default: ''
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
    // 是否能参与当前活动,不能参与返回主会场
    this.checkActivity()
    // 初始化页面
    this.init()
  },
  methods: {
    // 检查当前用户是否可参与当前活动
    async checkActivity () {
      try {
        // await getNewYearActivityDetail()
        this.canNotJoinCurrentActivity()
      } catch (e) {
        this.canNotJoinCurrentActivity()
        throw e
      }
    },
    // 初始化页面
    async init () {
      // await getNewYearActivityDetail()
      let qrcode = await generateQrcode(500, `${this.mallUrl}/new-year-activity${this.id ? '/' + this.id : ''}`, 100, null, null, 'url')
      this.qrcode = new Image()
      this.qrcode.src = qrcode

      // 启动倒计时
      let distanceTime
      let { result: serverTime } = await getServerTime()
      let now = moment(serverTime).valueOf()
      let start = moment(this.activeDetail.activityStartTime).valueOf()
      let end = moment(this.activeDetail.activityEndTime).valueOf()
      if (now < start) { // 活动未开始
        this.activityIsStart = false
        now = start - now
      } else if (end > now) { // 活动未结束
        this.activityIsStart = true
        distanceTime = end - now
      } else if (now > end) { // 活动未结束
        this.activityIsOver = true
      } else {
        this.canNotJoinCurrentActivity()
      }
      this.countdown(distanceTime)
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
    // 切换展示的奖品列表
    clickPrensentType (type) {
      this.presentListType = type
      this.showMyPresentListMore = false
      this.showSunPresentListMore = false
    },
    // 获得年味
    async getMyNewYearCard () {
      try {
        this.isShowNewYearPoster = false
        this.drawNewYearCardPoster('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/09dcc537-3c0b-4f04-8771-930aaaebdb08.png', '杀猪割年肉')
      } catch (e) {
        throw e
      }
    },
    // 生成年味海报
    async drawNewYearCardPoster (imgUrl, desc) { // 生成年味海报
      try {
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
      await setTimeout(() => {
        this.$warning('您无法参与活动，返回主会场，更多活动等您开启')
        this.backMainActivityCenter()
      }, 5000)
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

        .one-swiper {
          position: absolute;
          top: 200px;
          left: 50%;
          transform: translateX(-50%);

          > img {
            width: 244px;
            object-fit: cover;
            cursor: pointer;
          }
        }

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
                height: 170px;
                object-fit: cover;
              }

              > p {
                margin-top: 10px;
                text-align: center;

                span {
                  color: #FFF;
                  font-size: 24px;

                  &:last-child {
                    font-size: 20px;
                    color: #FFDCB3;
                  }
                }
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
                padding: 0 3px;
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
            }

            > .desc-control {
              display: flex;
              flex-direction: row;
              justify-content: space-around;

              p {
                display: inline-block;
                padding-right: 150px;

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
            padding: 0 20px;

            .sign-in-icon-item {
              padding: 10px 0;
              display: inline-block;

              .icon-item {
                display: inline-block;

                .icon {
                  position: relative;
                  text-align: center;

                  img {
                    width: 80px;
                    object-fit: cover;

                    &.not-sign {
                      width: 70px;
                    }
                  }

                  span {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    color: #FFE3C8;
                    font-size: 28px;

                    &.not-sign {
                      color: #FFFFFF;
                    }
                  }
                }

                > p {
                  color: #F60000;
                  font-size: 24px;
                  line-height: 40px;
                }
              }

              .prensent-icon-item {
                display: inline-block;

                > div {
                  position: relative;
                  text-align: center;

                  > img {
                    width: 100px;
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
                    width: 100px;
                    height: 100px;
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

            p:last-child {
              font-size:24px;
              color:#999;
            }

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
      padding: 0 40px 20px;

      h3 {
        font-size: 32px;
      }

      p {
        margin-bottom: 40px;
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
            font-size: 24px;
            color: #373737;
            font-weight: 400;
            width: 240px;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          h4 {
            font-size: 14px;
            font-weight: 400;
            color: #373737;
            margin: 10px 0;
          }

          p {
            font-size: 14px;
            color: #F01516;
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
