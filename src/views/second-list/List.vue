<template>
  <div class="bg">
    <div class="top">
      <div>秒杀专场</div>
      <div class="line" />
      <div @click="getSecondList(2)">
        <div class="status" :class="status === 2 ? 'current' : ''">已开抢</div>
        <div class="time" :class="status === 2 ? 'current' : ''">14:00</div>
      </div>
      <div class="line" />
      <div @click="getSecondList(1)">
        <div class="status" :class="status === 1 ? 'current' : ''">进行中</div>
        <div class="time" :class="status === 1 ? 'current' : ''">14:00</div>
      </div>
      <div class="line" />
      <div @click="getSecondList(0)">
        <div class="status" :class="status === 0 ? 'current' : ''">即将开抢</div>
        <div class="time" :class="status === 0 ? 'current' : ''">14:00</div>
      </div>
    </div>
    <ul class="list">
      <li v-for="(item, k) in secondList" :key="k" @click="jumpToDetail(item.id)">
        <div class="img">
          <img :src="item.productImage">
          <div class="count-down">
            <count-down
              activity-text="距开始"
              starttime=""
              endtime=""
            />
          </div>
        </div>
        <div>
          <div class="title">{{ item.productName }}</div>
          <div class="tips">限量秒杀，下单仅24.5</div>
          <div class="progress">
            <div class="inner" :style="{width: '50%'}" />
          </div>
          <div class="focus">100人已关注</div>
          <div class="price-bar">
            <div class="price">10000</div>
            <div class="original">原价<del>10000</del></div>
            <div class="view-btn">查看</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { secondActivityPage } from '../../apis/product'
import CountDown from './Count-Down'
export default {
  name: 'List',
  components: {
    CountDown
  },
  data () {
    return {
      status: 0,
      secondList: []
    }
  },
  create () {
    this.getSecondList(0)
  },
  methods: {
    getSecondList (status) {
      this.status = status
      let params = {
        status
      }
      secondActivityPage(params).then(res => {
        this.secondList = res.result.records
      })
    },
    jumpToDetail (id) {
      this.$router.push({ name: 'Lesson', params: { productId: id, brokerId: null } })
    }
  }
}
</script>

<style lang="scss" scoped>
.bg{
  background: #E0030C;
  min-height: 100vh;
  .top{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 34px 68px 20px 26px;
    background: #E0030C;
    z-index: 11;
    .line{
      width: 2px;
      height: 26px;
      background: #ffffff;
    }
    .status{
      font-size: 30px;
      margin-bottom: 14px;
      text-align: center;
      color: #ffffff;
      &.current{
        font-weight: bold;
        font-size: 36px;
        text-shadow: 0 2px 4px rgba(148, 7, 7, .4);
      }
    }
    .time{
      background: #940707;
      border: 2px solid #ffffff;
      font-size: 32px;
      width:120px;
      text-align: center;
      height:40px;
      line-height: 40px;
      box-shadow: 0 4px 8px rgba(148, 7, 7, .4);
      border-radius: 198px;
      color: #ffffff;
      &.current{
        background: #ffffff;
        color: #E0030C;
      }
    }
  }
  .list{
    padding: 156px 24px 24px;
    li{
      display: flex;
      padding: 16px;
      background: #ffffff;
      border-radius: 12px;
      margin-top: 20px;
      .img{
        width: 280px;
        height: 188px;
        margin-right: 16px;
        position: relative;
        .count-down{
          position: absolute;
          left: 0;
          bottom: 0;
          width: 280px;
          height: 52px;
          background: rgba(0, 0, 0, .65);
          border-radius: 0 0 12px 12px;
        }
      }
      .title{
        width: 360px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 28px;
        font-weight: bold;
      }
      .tips{
        font-size: 28px;
        color: #EA618E;
        line-height: 36px;
        margin-top: 4px;
      }
      .progress{
        width: 272px;
        height: 14px;
        background: #FFD2D2;
        border-radius: 206px;
        margin-top: 12px;
        .inner{
          background: #F55959;
          height: 14px;
          border-radius: 206px;
        }
      }
      .focus{
        font-size: 20px;
        color: #FE3C5E;
        line-height: 40px;
      }
      .price-bar{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .price{
          font-size: 36px;
          font-weight: bold;
          color: #FE3C5E;
          &:before {
            content: '¥';
            font-size: 24px;
          }
        }
        .original{
          font-size: 20px;
          color: #999999;
          del{
            &:before {
              content: '¥';
            }
          }
        }
        .view-btn{
          width: 82px;
          text-align: center;
          height: 38px;
          line-height: 38px;
          color: #ffffff;
          font-size: 24px;
          background: linear-gradient(231deg,rgba(238,144,111,1) 0%,rgba(233,70,115,1) 100%);
          opacity: 1;
          border-radius: 260px;
        }
      }
    }
  }
}
</style>
