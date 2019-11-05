<template>
  <div
    :class="$style.acquisition"
    v-if="showList.length"
  >
    <div :class="$style.title">已获得好礼晒单</div>
    <div :class="$style.todyCount">
      今日已有<i v-text="totalClaimers" />人获得豪礼大奖
    </div>
    <div :class="$style.list">
      <div
        :class="$style.item"
        v-for="(item, i) of showList"
        :key="i"
      >
        <img :class="$style.icon" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/box%402x.png" alt="">
        <img :class="$style.avatar" :src="item.avatar" alt="">
        <div :class="$style.itemRight">
          <p>{{ item.name }}<i>3</i>位好友</p>
          <p>开出了<i>1000</i>元满减券</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getActivityStatisiticData,
  getClaimGiftList
} from '../../../apis/invitenewcomers'
export default {
  name: 'AcquisitionGifts',
  data () {
    return {
      showList: [],
      totalClaimers: 0
    }
  },
  props: {
    activityId: {
      type: String,
      default: ''
    }
  },
  async activated () {
    try {
      await this.getOrdersShow()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getOrdersShow () {
      try {
        let { result } = await getClaimGiftList(this.activityId)
        this.showList = (result || []).slice(0, 3).map((item) => {
          return {
            name: item.userName || item.nickName,
            avatar: item.headImgUrl,
            inviteNum: item.helperNum,
            giftInfo: item.name
          }
        })
        let { result: claimerInfo } = await getActivityStatisiticData(this.activityId)
        this.totalClaimers = claimerInfo.claimerNum
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .acquisition {
    margin-top: 32px;
    padding: 32px 24px;
    background-color: #fff;
    border-radius: 20px;
  }
  .title {
    text-align: center;
    font-size: 28px;
    color: #000;
  }
  .tody-count {
    width: max-content;
    margin: 12px auto 40px;
    padding: 0 28px;
    font-size: 24px;
    color: #999;
    line-height: 50px;
    border-radius: 25px;
    background-color: #f2f2f2;
    > i {
      color: #FA4D2F;
    }
  }
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
  .icon {
    width: 48px;
    margin-right: 28px;
  }
  .avatar {
    width: 106px;
    height: 106px;
    margin-right: 24px;
    border-radius: 53px;
  }
  .item-right {
    > p {
      > i {
        color: #FA4D2F;
      }
      &:nth-of-type(1) {
        margin-bottom: 4px;
        font-size: 26px;
        line-height: 36px;
      }
      &:nth-of-type(2) {
        font-size: 22px;
        line-height: 32px;
        color: #999;
      }
    }
  }
</style>
