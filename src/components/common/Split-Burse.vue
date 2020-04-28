<template>
    <!-- 瓜分奖学金弹窗 -->
    <div @click.stop="" v-show="show" :class="$style.burseMask">
        <div :class="$style.burseContainer">
            <div :class="$style.head">
                <img v-imgError src="https://mallcdn.youpenglai.com/static/mall/2.0.0/tuan/8fd96d5d-6096-48b2-b2e2-f5e67587264e.png" :class="$style.head">
            </div>
            <!--中间内容-->
            <div :class="$style.con">
                <div :class="$style.conList">
                    <div :class="$style.conItem" v-for="(item,index) in list" :key="index">
                        <!--左边-->
                        <div>
                            <div><pl-svg width="240" height="58" name="icon-together-buy-success" /></div>
                            <div>立即瓜分<span>{{ item.prize }}元</span>奖学金</div>
                        </div>
                        <!--右边-->
                        <div>
                            <!--瓜分-->
                            <div v-if="item.status === 1" status="1">
                                <div>恭喜瓜得</div>
                                <div>{{ item.amount }}元</div>
                            </div>
                            <!--未瓜分-->
                            <div v-if="item.status === 0" status="0" @click="dispatchBurse(item)">
                                <span>瓜分</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="$style.conFooter">
                    <div @click="$router.push({name:'MyBurse'})">查看奖学金</div>
                    <div>请在我的→我的奖学金中查看已获得奖学金</div>
                </div>
            </div>
            <!--关闭-->
            <div :class="$style.burseClose" @click="show = false">
                <span>
                    <pl-svg @click="sharePosterShow = false" name="icon-close3" fill="#fff" width="40" />
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { getDelayBurseList, dispatchBurse } from './../../apis/my-burse.js'
export default {
    name: 'SplitBurse',
    data () {
        return {
            show: false,
            list: []
        }
    },
    async activated () {
        try {
            const { status, result } = await getDelayBurseList()
            if (status === 200) {
                this.list = result
                this.list.length === 0 ? this.show = false : this.show = true
            }
        } catch (e) { throw e }
    },
    methods: {
        async dispatchBurse (row) {
            try {
                await dispatchBurse({ id: row.id, activityId: row.activityId })
                row.status = 1
            } catch (e) { throw e }
        }
    }
}
</script>

<style module lang='scss' scoped>
  .burse-mask {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.65);
    > .burse-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
      > .head {
        > img {
          width: 654px;
          height: 392px;
        }
      }
      > .con {
        width: 522px;
        position: relative;
        top: -15px;
        left: 7px;
        padding-bottom: 180px;
        background: #c82b1a;
        border-radius: 0 0 24px 24px;
        overflow: hidden;
        > .con-list {
          padding: 12px 12px 12px 4px;
          box-sizing: border-box;
          max-height: 530px;
          overflow-y: auto;
          > .con-item {
            display: flex;
            width: 100%;
            height: 156px;
            justify-content: space-between;
            margin-bottom: 10px;
            background: url('https://mallcdn.youpenglai.com/static/mall/2.0.0/tuan/00d06469-2d78-4d25-b276-06971e07e864.png') 0/(100%,100%) no-repeat;
            > div:nth-of-type(1) {
              display: flex;
              align-content: center;
              flex-wrap: wrap;
              text-align: left;
              margin-left: 20px;
              > div:nth-of-type(2) {
                width: 100%;
                font-size: 28px;
                color: #FFFFFF;
                > span {
                  color: #FFEC11;
                  font-weight: normal;
                }
              }
            }
            > div:nth-of-type(2) {
              width: 140px;
              display: flex;
              align-items: center;
              > div[status = '1'] {
                color: #F43739;
                > div {
                  font-size: 24px;
                  font-weight: bold;
                }
                > div:nth-of-type(2) {
                  font-size: 36px;
                  white-space : nowrap;
                }
              }
              > div[status = '0'] {
                width:96px;
                height:96px;
                box-sizing: border-box;
                padding: 24px 0;
                font-size: 36px;
                font-weight: bold;
                color: #FFFFFF;
                background:linear-gradient(90deg,rgba(239,45,48,1) 0%,rgba(255,78,79,1) 100%);
                box-shadow:0px 6px 16px rgba(129,0,0,0.32);
                border-radius:50%;
              }
            }
          }
        }
        > .con-footer {
          width: 100%;
          box-sizing: border-box;
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 24px;
          text-align: center;
          background: #FF482C;
          > div:nth-of-type(1) {
            display: inline-block;
            margin-bottom: 24px;
            font-size: 36px;
            color: #FB181A;
            padding: 18px 68px;
            background: #FFEE76;
            border-radius:54px;
            &:after {
              display: inline-block;
              content: '';
              width: 0;
              height: 0;
              margin-left: 6px;
              border: 13px solid rgba(0,0,0,0);
              border-left: 26px solid  #FB181A;
            }
          }
          > div:nth-of-type(2) {
            font-size: 24px;
            color: #FFFFFF;
          }
        }
      }
      > .burse-close {
        width: 100%;
        > span {
          display: inline-block;
          padding: 0 10px;
        }
      }
    }
  }

</style>
