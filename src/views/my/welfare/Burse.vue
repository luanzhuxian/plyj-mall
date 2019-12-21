<template>
  <div :class="$style.burseContainer">

    <!--抬头-->
    <div :class="$style.burseTitle">
      <ul>
        <li>我的奖学金（红包）</li>
        <li>{{ burseMes.waitUseAmount }}</li>
        <li @click="$router.push({name:'Classify'})">立即使用</li>
      </ul>
      <ul>
        <li>累计获得奖学金</li>
        <li>{{ burseMes.cumulativeAmount }}</li>
      </ul>
    </div>

    <!--奖学金列表-->
    <load-more
      ref="loadMore"
      :form="form"
      :request-methods="getBurseList"
      @refresh="refreshList"
      @more="refreshList"
      no-content-tip="不敢相信你还没领到奖学金，快去参加活动吧"
      :no-icon="true"
    >
      <img style="width: 400px;" slot="icon" src="https://mallcdn.youpenglai.com/static/admall/f20994d7-316b-43e9-be44-4f78dc6fc295.png" alt="">
      <burse-item :item="item" v-for="(item,index) in burseList" :key="index" />
    </load-more>

    <!--无奖学金情况-->
    <div :class="$style.burseNone">
      <div v-if="burseList.length === 0" @click="$router.push({name:'Home'})" :class="$style.goHome">返回首页参加活动</div>
    </div>
    <!-- <div :class="$style.burseNone" v-if="burseList.length === 0">
      <img src="https://mallcdn.youpenglai.com/static/admall/f20994d7-316b-43e9-be44-4f78dc6fc295.png" alt="">
      <div>不敢相信你还没领到奖学金</div>
      <div>快去参加活动吧</div>
      <div>返回首页参加活动</div>
    </div> -->

    <!--footer-->
    <div :class="$style.burseFooter" @click="$router.push({name:'MyBurseRecord'})">
      历史使用记录
    </div>

  </div>
</template>

<script>
import BurseItem from './components/Burse-Item.vue'
import LoadMore from './../../../components/common/Load-More.vue'
import { getBurseMes, getBurseList } from './../../../apis/my-burse.js'

export default {
  name: 'MyBurse',
  components: { BurseItem, LoadMore },
  props: {},
  data () {
    return {
      form: {
        status: 1, //  奖学金状态 0：待领取；1：待使用； 2：已使用； 3：已过期 ； 4：已失效； 5：已删除
        current: 1,
        size: 10
      },
      burseMes: {
        cumulativeAmount: 0, // 累计
        waitUseAmount: 0// 待使用
      },
      burseList: [], // 待使用列表
      getBurseList
    }
  },
  async activated () {
    try {
      let { status, result } = await getBurseMes({})
      if (status === 200) {
        this.burseMes = result
        await this.$nextTick()
        this.$refresh = this.$refs.loadMore.refresh
        this.$refresh()
      }
    } catch (e) { throw e }
  },
  methods: {
    refreshList (list) {
      this.burseList = list
    }
  }
}
</script>

<style module lang="scss" scoped>

.burse-container {
  box-sizing: border-box;
  padding: 24px;

  > .burse-title {
    display: flex;
    justify-content: space-between;
    background: url(https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/1575270325759.png) 0/cover no-repeat;
    border-radius: 20px;
    padding: 34px;
    > ul {
      > li:nth-of-type(1) {
        font-size: 24px;
        font-weight: 400;
        color: #FFE7DF;
      }
      > li:nth-of-type(2) {
        font-size: 56px;
        font-weight: bold;
        color: #FFFFFF;
        padding: 2vw 0;
      }
      > li:nth-of-type(3) {
        font-size: 28px;
        color: #FA7135;
        border-radius: 8px;
        background: #FFFFFF;
        text-align: center;
        height:40px;
        line-height: 40px;
        width: 182px;
      }
    }
    > ul:nth-last-of-type(1) >li:nth-last-of-type(1) {
      font-weight: normal;
      color: #FFE7DF;
      text-align: right;
    }
  }

  .hidden-list {
    height: 1px;
    overflow: hidden;
  }

  .burse-none {
    text-align: center;
    // > img {
    //   width: 400px;
    //   margin: 90px 0 70px 0;
    // }
    // > div:nth-last-of-type(1) {
    //   margin-top: 42px;
    //   background:rgba(255,244,235,1);
    //   border:2px solid rgba(254,119,0,1);
    //   border-radius:8px;
    //   width: 280px;
    //   display: inline-block;
    //   line-height: 60px;
    // }
    > div {
      font-size:28px;
      font-weight:400;
      margin-bottom: 16px;
      color: #5A5A5A;
    }
    .go-home {
      margin-top: 42px;
      background:rgba(255,244,235,1);
      border:2px solid rgba(254,119,0,1);
      border-radius:8px;
      width: 280px;
      display: inline-block;
      line-height: 60px;
    }
  }

  .burse-footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #FA7135;
    font-size:32px;
    font-weight:400;
    color: #FFFFFF;
    text-align: center;
    z-index: 9;
    padding: 28px 0;
  }

}

</style>
