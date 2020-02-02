<template>
  <!--健康值兑换-->
  <div :class="$style.container">
    <div :class="$style.head">
      <h1>健康值兑换奖励</h1>
      <div>
        <span>我的奖励</span>
        <pl-svg name="icon-right" fill="#ccc" width="20" />
      </div>
    </div>
    <div :class="{
      [$style.content]:true,
      [$style.single]:awardList.length === 1,
      [$style.two]:awardList.length === 2,
      [$style.more]:awardList.length > 2
    }"
    >
      <div :class="$style.scroll">
        <div v-for="(item,index) in awardList" :key="index">
          <img src="https://mallcdn.youpenglai.com/static/beat-plague/7fc4ca52-a4f7-4a5d-a7ab-b8ed3c383aac.png" alt="">
          <div :class="$style.info">
            <p>1元体验299元水</p>
            <p>15个健康值可兑换</p>
            <div :class="$style.awardButton">可兑换</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Award',
  props: {
    awardList: {
      type: Array,
      default () {
        return [1]
      }
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
                    width: 316px;
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
        background: #FBA229;
    }
</style>
