<template>
    <div :class="$style.together" v-if="detail">
        <div v-if="detail.preActivity === 1" :class="$style.preTogether">
            <div :class="$style.preText" />
            <div :class="$style.line" />
            <div>
                <together-count-down
                    activity-text="距活动开始仅剩"
                    :endtime="detail.activityProductModel.activityStartTime"
                    @done="started"
                />
                <div :class="$style.desc">
                    预交定金翻{{ detail.activityProductModel.multipltNumber }}倍，
                    最低{{ Number(detail.activityProductModel.lowestPrice).toFixed(2) }}元可得商品</div>
            </div>
        </div>
        <div v-if="detail.preActivity === 2" :class="$style.nowTogether">
            <div :class="$style.nowText" />
            <div :class="$style.line" />
            <div>
                <together-count-down
                    @done="ended"
                    activity-text="距活动结束仅剩"
                    :endtime="detail.activityProductModel.activityEndTime"
                />
                <div :class="$style.desc">
                    <div :class="$style.progress">
                        <div :class="$style.percent" :style="{width: (detail.activityProductModel.number / detail.activityProductModel.stock) * 100 + '%' }" />
                    </div>
                    <div>{{ detail.activityProductModel.stock || 0 }}人</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TogetherCountDown from '../../../components/product-detail/Together-Count-Down.vue'

export default {
    components: {
        TogetherCountDown
    },
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        started () {
            this.$emit('started')
        },
        ended () {
            this.$emit('ended')
        },
        countFinished () {
            this.$set(this.detail, 'serverTime', '')
            this.$set(this.detail, 'shoppingTimeLong', '')
        }
    }
}
</script>

<style module lang="scss">
  .together{
    .pre-together{
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_bg.png") no-repeat;
      background-size: 100% 100%;
      height: 100px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      .pre-text{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_text.png") no-repeat;
        background-size: 100% 100%;
        width: 64px;
        height: 66px;
      }
    }
    .now-together{
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_bg.png") no-repeat;
      background-size: 100% 100%;
      height: 100px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      .now-text{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/pre_text.png") no-repeat;
        background-size: 100% 100%;
        width: 64px;
        height: 66px;
      }
    }
    .line{
      width: 2px;
      height: 66px;
      background: #ffffff;
      margin: 0 16px;
    }
    .desc{
      display: flex;
      color: #ffffff;
      align-items: center;
      font-size: 20px;
      height: 34px;
      margin-top: 2px;
      .progress{
        width: 480px;
        height: 10px;
        background: rgba(255, 255, 255, .5);
        border-radius: 206px;
        display: flex;
        align-items: center;
        margin-right: 16px;
        .percent{
          height: 10px;
          background: #ffffff;
          border-radius: 206px;
        }
      }
    }
  }
</style>
