<template>
    <div :class="$style.burseDetail">

        <ul>
            <li>奖学金{{ burseStatus[detail.status] }}</li>
            <li>
                <span>奖学金名称</span>
                <span>
                    <template v-if="detail.activityType === 'GROUPBUGACTIVITY'">团购奖学金</template>
                    <template v-if="detail.activityType === 'LUCK_DRAW_ACTIVITY'">抽奖奖学金</template>
                    <template v-if="detail.activityType === 'SIGNIN_ACTIVITY'">签到奖学金</template>
                </span>
            </li>
            <li><span>奖学金金额</span><span>{{ detail.amount }} 元</span></li>
            <li><span>使用限制</span><span>全场通用</span></li>
            <li><span>开始时间</span><span>{{ detail.useStartTime }}</span></li>
            <li><span>结束时间</span><span>{{ detail.useEndTime }}</span></li>
        </ul>

        <div>使用关联订单</div>

        <div :class="$style.orderList" v-for="(item,index) in detail.list" :key="index">
            <div>
                <div>订单编号：{{ item.id }}</div>
                <div @click="$router.push({name:'OrderDetail',params:{orderId:item.id}})">去查看</div>
            </div>
            <div v-for="it in item.products" :key="it.productId">
                <div>
                    <img :src="it.productImg" alt="">
                </div>
                <div>
                    <div>{{ it.productName }}</div>
                    <div>{{ item.payTime }} 购买时使用</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { getBurseDetail } from './../../../apis/my-burse.js'
export default {
    name: 'MyBurseDetail',
    data () {
        return {
            detail: {
                list: []
            },
            // 奖学金状态 0：待领取；1：待使用； 2：已使用； 3：已过期 ； 4：已失效； 5：已删除
            burseStatus: ['待领取', '待使用', '已使用', '已过期', '已失效', '已删除']
        }
    },
    async activated () {
        try {
            const { params: { id } } = this.$route
            const { result } = await getBurseDetail(id)
            this.detail = result
        } catch (e) { throw e }
    }
}
</script>

<style lang="scss" module scoped>

  .burse-detail {
    padding: 24px;
    box-sizing: border-box;

    > ul {
      background: #FFFFFF;
      padding: 58px 40px 80px 40px;
      border-radius:20px;
      > li {
        display: flex;
        font-size: 28px;
        font-weight: 400;
        color: #373737;
        padding: 14px 0;
        > span {
          flex: 1;
        }
      }
      > li:nth-of-type(1) {
        display: block;
        font-size: 36px;
        font-weight: bold;
        text-align: center;
      }
    }

    > div:nth-of-type(1) {
      margin: 24px 0;
      padding-left: 16px;
      font-size: 28px;
      font-weight: 400;
    }

    > .order-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 26px;
      box-sizing: border-box;
      background: #FFFFFF;
      margin-bottom: 20px;
      > div:nth-of-type(1) {
        display:flex;
        font-size: 24px;
        width: 100%;
        margin-bottom: 26px;
        justify-content: space-between;
        > div:nth-of-type(2) {
          color: #FFFFFF;
          background: #FE7700;
          border-radius:20px;
          line-height: 34px;
          width:122px;
          text-align: center;
        }
      }
      > div:nth-of-type(n+2) {
        display: flex;
        margin-bottom: 12px;
        > div:nth-of-type(1) {
          width: 200px;
          > img {
            width: 200px;
            height: 136px;
          }
        }
        > div:nth-of-type(2) {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          margin-left: 26px;
          width: calc( 100% - 226px);
          font-size: 24px;
          font-weight: 400;
          > div {
            width: 100%;
          }
          > div:nth-of-type(2) {
            margin-top: 8px;
            font-size:20px;
            color: #999999;
            font-weight: 400;
          }
        }
      }
      > div:nth-last-of-type(1) {
        margin-bottom: 0;
      }
    }

  }

</style>
