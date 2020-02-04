<template>
  <!--健康值兑换-->
  <div :class="$style.container">
    <div :class="$style.head">
      <h1>健康值兑换奖励</h1>
      <div @click="$router.push({name:'MyPresent'})">
        <span>我的奖励</span>
        <pl-svg name="icon-right" fill="#ccc" width="20" />
      </div>
    </div>
    <div
      v-if="awardList.length"
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
                   [$style.buttonCan]:item.reedemStatus === 0,
                   [$style.buttonFinish]:item.reedemStatus === 1,
                   [$style.buttonEnd]:item.reedemStatus === 2,
                 }"
                 @click="getAward(item)"
            >
              {{ reedemStatus[item.reedemStatus] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else :class="$style.noContent">
      暂无奖励数据
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
    async getAward ({ activityId, giftId }) {
      try {
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
        .no-content {
            padding: 40px 0;
            font-size: 30px;
            text-align:center;
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
    .button-can {
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
