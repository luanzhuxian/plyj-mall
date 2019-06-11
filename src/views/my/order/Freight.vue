<template>
  <div :class="$style.freight">
    <div :class="[$style.panel, $style.panelTop]">
      <img
        v-img-error
        :src="img"
        alt=""
      >
      <div :class="$style.middle">
        <div
          :class="$style.main"
          v-text="lastRecord"
        />
        <div :class="$style.sub">
          <span v-text="courierCompany" />
          <span v-text="courierNo" />
        </div>
      </div>
      <div :class="$style.right">
        <a :href="`tel: ${courierCompanyMobile}`">
          <pl-svg
            :class="$style.icon"
            name="service"
          />
          <div :class="$style.iconText">
            物流客服
          </div>
        </a>
      </div>
    </div>
    <div
      v-if="freightData.length > 0"
      :class="[$style.panel, $style.panelBottom]"
    >
      <ul :class="$style.freightList">
        <li
          v-for="item of freightData"
          :key="item.msgTime"
          :class="$style.freightItem"
        >
          <div :class="$style.datetime">
            <span :class="$style.date">{{ item.msgTime * 1000 | dateFormat('MM-DD') }}</span>
            <span :class="$style.time">{{ item.msgTime * 1000 | dateFormat('HH:mm') }}</span>
          </div>

          <div
            :class="$style.freightContent"
            v-text="item.content"
          />
        </li>
      </ul>
    </div>
    <p
      :class="$style.tip"
      v-else-if="!loading"
    >
      暂无物流信息
    </p>
  </div>
</template>

<script>
import { getFreightData, getOrderDetail } from '../../../apis/order-manager'

export default {
  name: 'Freight',
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      img: '',
      freightData: [],
      courierCompany: '',
      courierNo: '',
      courierCompanyMobile: '',
      lastRecord: ''
    }
  },
  async activated () {
    try {
      this.loading = true
      let orderDetail = await getOrderDetail(this.orderId)
      this.orderDetail = orderDetail.result
      this.img = orderDetail.result.productInfoModel.productDetailModels[0].productImg
      let { result } = await getFreightData(this.orderId)
      result.trackModelList.sort((a, b) => b.msgTime - a.msgTime)
      this.freightData = result.trackModelList
      this.courierCompany = result.courierCompany
      this.courierNo = result.courierNo
      this.courierCompanyMobile = result.courierCompanyMobile
      this.lastRecord = result.trackModelList.slice(-1)[0].content
    } catch (e) {
      throw e
    } finally {
      this.loading = false
    }
  }
}
</script>

<style module lang="scss">
  .freight {
    box-sizing: border-box;
    padding: 20px 24px;
    min-height: 100vh;
  }
  .orderPro {
    margin-bottom: 30px;
  }
  .freightItem {
    display: flex;
    padding-bottom: 30px;
    &:nth-of-type(1) {
      .datetime {
        color: #333;
      }
      .freightContent {
        color: #333;
        &:before {
          background: linear-gradient(180deg, #FFAF00, #FE7700);
        }
      }
    }
    &:nth-last-of-type(1) {
      padding-bottom: 0;
      > .freightContent {
        &:after {
          display: none;
        }
        &:before {
          left: 11px;
          width: 42px;
          height: 42px;
          border-radius: 21px;
          background: #fff url("../../../assets/images/shipped.png") no-repeat center center;
          background-size: 50%;
          border: 1px solid #D8D8D8;
          box-sizing: border-box;
        }
      }
    }
  }
  .datetime {
    display: inline-flex;
    flex-direction: column;
    text-align: right;
    color: #999;
    > .date {
      font-size: 22px;
      line-height: 32px;
    }
    > .time {
      font-size: 18px;
      line-height: 26px;
    }
  }
  .freightContent {
    position: relative;
    flex: 1;
    padding-left: 62px;
    font-size: 22px;
    line-height: 32px;
    color: #999;
    &:before {
      position: absolute;
      content: '';
      left: 24px;
      top: 10px;
      width: 14px;
      height: 14px;
      border-radius: 7px;
      background: #D8D8D8;
      z-index: 2;
    }
    &:after {
      position: absolute;
      content: '';
      left: 31px;
      top: 24px;
      width: 1px;
      height: 130%;
      border-radius: 7px;
      background-color: #D8D8D8;
      z-index: 1;
    }
  }
  .tip {
    font-size: 24px;
    text-align: center;
    color: $--font-color_gray3;
  }
  .panel {
    background-color: #fff;
    border-radius: $--radius1;
    margin-bottom: 20px;
  }
  .panel-top {
    padding: 16px 24px 24px;
    display: flex;
    align-items: center;
    > img {
      width: 80px;
      height: 80px;
    }
    .middle {
      padding-left: 20px;
      flex: 1;
      color: #000;
    }
    .right {
      padding: 0 48px;
      height: 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #F0F0F0;
      > a {
        display: block;
        text-align: center;
      }
    }
    .main {
      font-size: 28px;
      line-height: 40px;
    }
    .sub {
      font-size: 24px;
      line-height: 34px;
      > span:nth-of-type(1) {
        margin-right: 10px;
      }
    }
    .icon {
      width: 35px;
      margin-bottom: 6px;
    }
    .icon-text {
      font-size: 16px;
      color: #999;
      line-height: 22px;
    }
  }
  .panel-bottom {
    padding: 34px 32px 48px;
  }
</style>
