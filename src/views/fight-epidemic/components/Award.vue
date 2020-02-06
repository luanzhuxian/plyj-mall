<template>
  <!--健康值兑换-->
  <div v-if="awardList.length" :class="$style.container">
    <div :class="$style.head">
      <div :class="$style.title">健康值兑换奖励</div>
      <div @click="$router.push({name:'MyPresent'})">
        <span>我的奖励</span>
        <pl-svg name="icon-right" fill="#ccc" width="20" />
      </div>
    </div>
    <div
      :class="{
        [$style.content]:true,
        [$style.single]:awardList.length === 1,
        [$style.two]:awardList.length === 2,
        [$style.more]:awardList.length > 2
      }"
    >
      <div :class="$style.scroll">
        <div v-for="(item,index) in awardList" :key="index">
          <img :src="item.giftImage" alt="">
          <div :class="$style.info">
            <p>{{ item.name }}</p>
            <p>{{ item.healthValue }}个健康值可兑换</p>
            <div :class="{
                   [$style.awardButton]:true,
                   [$style.awardCan]:item.reedemStatus === 0,
                   [$style.awardFinish]:item.reedemStatus === 1,
                   [$style.awardEnd]:item.reedemStatus === 2,
                 }"
                 @click="getAward(item)"
            >
              {{ reedemStatus[item.reedemStatus] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { reedemGift } from './../../../apis/fight-epidemic'
export default {
  name: 'Award',
  props: {
    awardList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      reedemStatus: ['可兑换', '已兑换', '已兑完']
    }
  },
  methods: {
    // 兑换奖励
    async getAward ({ activityId, giftId, reedemStatus }) {
      try {
        if (reedemStatus === 1) {
          this.$warning('该奖励您已兑换了哦~')
          return
        }
        if (reedemStatus === 2) {
          this.$warning('该奖励已经兑换完了，请选择其他奖励进行兑换')
          return
        }
        let { result } = await reedemGift({
          activityId,
          userId: this.$store.getters.userId,
          giftId
        })
        this.$success(`使用${result.healthValue}健康值，已成功兑换${result.name}`)
        this.$emit('success')
      } catch (e) { throw e }
    }
  }
}
</script>

<style module lang='scss'>
    .container {
        border-radius: 20px;
        overflow: hidden;
        background: #FFFFFF;
        > .head {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            box-sizing: border-box;
            padding: 30px 24px;
            border-bottom: 1px solid #E7E7E7;
            > div {
                > span {
                    font-size: 28px;
                    margin-right: 10px;
                }
            }
            > .title {
                font-size: 32px;
                font-weight: bold;
            }
        }
        > .content {
            padding: 30px 24px 40px 24px;
        }
        > .single {
            > .scroll > div {
                display: flex;
                justify-content: space-between;
                > img {
                    width: 222px;
                    height: 148px;
                    border-radius: 12px;
                }
                > .info {
                    position: relative;
                    width: calc(100% - 246px);
                    font-size: 28px;
                    font-weight: 600;
                    > p:nth-of-type(2) {
                        margin-top: 12px;
                        font-size: 24px;
                        color: #999999;
                    }
                    > .award-button {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                    }
                }
            }
        }
        > .two {
            > div {
                display: flex;
                justify-content: space-between;
                > div {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    width: 316px;
                    > img {
                        width: 100%;
                        height: 210px;
                        border-radius: 12px;
                    }
                    > .info {
                        margin-top: 20px;
                        font-size: 28px;
                        font-weight: 600;
                        text-align: center;
                        > p:nth-of-type(2) {
                            margin-top: 12px;
                            font-size: 24px;
                            text-align: center;
                            color: #999999;
                        }
                        > .award-button {
                            margin: 24px auto 0 auto;
                        }
                    }
                }
            }
        }
        > .more {
            overflow-y: auto;
            > .scroll {
                white-space: nowrap;
                > div {
                    display: inline-flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    width: 222px;
                    margin-right: 24px;
                    > img {
                        width: 100%;
                        height: 148px;
                        border-radius: 12px;
                    }
                    > .info {
                        margin-top: 20px;
                        font-size: 28px;
                        font-weight: 600;
                        text-align: center;
                        > p:nth-of-type(2) {
                            margin-top: 12px;
                            font-size: 24px;
                            text-align: center;
                            color: #999999;
                        }
                        > .award-button {
                            margin: 24px auto 0 auto;
                        }
                    }
                }
            }
        }
    }
    .award-button {
        width: 136px;
        line-height: 50px;
        border-radius: 25px;
        font-size: 24px;
        text-align: center;
        color: #FFFFFF;
    }
    .award-can {
        background: #FBA229;
    }
    .award-finish {
        background: #999999;
    }
    .award-end {
        color: #666666;
        background: #DDDDDD;
    }
</style>
