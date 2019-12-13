<template>
  <div :class="$style.burseDetail">

    <ul>
      <li>奖学金{{ burseStatus[detail.status] }}</li>
      <li><span>奖学金名称</span><span>团购奖学金</span></li>
      <li><span>奖学金金额</span><span>{{ detail.amount }} 元</span></li>
      <li><span>使用限制</span><span>全场通用</span></li>
      <li><span>开始时间</span><span>{{ detail.useStartTime }}</span></li>
      <li><span>结束时间</span><span>{{ detail.useEndTime }}</span></li>
    </ul>

    <div>使用关联订单</div>

    <div>
      <div>
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575361333262&di=81376fedbaf7e235d47cc807f0196905&imgtype=0&src=http%3A%2F%2Fimg.11665.com%2Fimg01_p%2Fi1%2FT1y1CLFypeXXXXXXXX_%2521%25210-item_pic.jpg" alt="">
      </div>
      <div>
        <div>订单编号：956684864</div>
        <div>2019.11.11  11:43:12购买时使用</div>
        <div><span>-￥0.15</span><span>去看看</span></div>
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
      detail: {},
      burseStatus: ['待领取', '待使用', '已使用', '已过期', '已失效', '已删除']// 奖学金状态 0：待领取；1：待使用； 2：已使用； 3：已过期 ； 4：已失效； 5：已删除
    }
  },
  async activated () {
    try {
      let { params: { id } } = this.$route
      let { result } = await getBurseDetail(id)
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

    > div:nth-of-type(2) {
      display: flex;
      justify-content: space-between;
      padding: 46px 26px;
      box-sizing: border-box;
      background: #FFFFFF;
      > div:nth-of-type(1) {
        width: 20%;
        > img {
          width: 164px;
          height: 164px;
        }
      }
      > div:nth-of-type(2) {
        display: flex;
        flex-wrap: wrap;
        align-content: space-around;
        width: calc( 100% - 184px);
        font-size: 24px;
        font-weight: 400;
        > div {
          width: 100%;
        }
        > div:nth-of-type(2) {
          font-size:20px;
          color: #999999;
          font-weight: 400;
        }
        > div:nth-of-type(3) {
          display: flex;
          justify-content: space-between;
          > span:nth-of-type(2) {
            font-size:20px;
            display: inline-block;
            width: 122px;
            border-radius: 20px;
            text-align: center;
            color: #FFFFFF;
            line-height: 34px;
            background:#FE7700;
          }
        }
      }
    }

  }

</style>
