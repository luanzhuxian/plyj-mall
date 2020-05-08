<template>
    <div :class="$style.freight">
        <div :class="[$style.panel, $style.panelTop]">
            <img v-imgError
                 v-img-error
                 :src="img + '?x-oss-process=style/thum'"
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
                        name="icon-service"
                    />
                    <div :class="$style.iconText">
                        物流客服
                    </div>
                </a>
            </div>
        </div>
        <pl-timeline
            v-if="freightData.length > 0"
            :class="$style.timeline"
        >
            <pl-timeline-item
                v-for="(item, i) of freightData"
                :key="i"
                :timestamp="item.msgTime * 1000"
            >
                <div
                    :class="$style.freightContent"
                    v-text="item.content"
                />
            </pl-timeline-item>
        </pl-timeline>
        <p
            :class="$style.tip"
            v-else-if="!loading"
        >
            暂无物流信息
        </p>
    </div>
</template>

<script>
import { getFreightData } from '../../../apis/order-manager'

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
            this.img = this.$route.query.img || ''
            const { result } = await getFreightData(this.orderId)
            result.trackModelList.sort((a, b) => b.msgTime - a.msgTime)
            this.freightData = result.trackModelList
            this.courierCompany = result.courierCompany
            this.courierNo = result.courierNo
            this.courierCompanyMobile = result.courierCompanyMobile
            if (this.freightData.length > 0) {
                this.lastRecord = this.freightData[0].content
            }
        } catch (e) {
            throw e
        } finally {
            this.loading = false
        }
    },
    deactivated () {
        this.lastRecord = ''
    }
}
</script>

<style module lang="scss">
  .freight {
    box-sizing: border-box;
    padding: 20px 24px;
    min-height: 100vh;
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
      word-break: break-all;
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
      height: 35px;
      margin-bottom: 6px;
    }
    .icon-text {
      font-size: 16px;
      color: #999;
      line-height: 22px;
    }
  }
  .timeline {
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
  }
</style>
