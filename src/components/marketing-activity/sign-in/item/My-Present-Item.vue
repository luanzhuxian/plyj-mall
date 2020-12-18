<template>
    <div class="my-present-item">
        <!-- 礼品展示 -->
        <span>
            <!-- 礼品 -->
            <img v-if="awardType === 1" :src="awardImg">
            <!-- 奖学金 -->
            <img v-else-if="awardType === 2" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
            <!-- 全场满减券/品类券 -->
            <img v-else-if="awardType === 3 || awardType === 4" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
        </span>
        <!-- 礼品描述 -->
        <div class="info">
            <p>奖品 【{{ awardTypeDesc[awardType] }}】 </p>
            <p class="orange">{{ awardName }}</p>
            <!-- <p class="date">有效期 {{ date }}</p> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'SunPresentItem',
    props: {
        // 获奖奖品类型 1-礼品 2-奖学金 3-全场满减券 4-品类券
        awardType: {
            type: Number,
            default: 1
        },
        // 奖品图片
        awardImg: {
            type: String,
            default: ''
        },
        // 奖品名称
        awardName: {
            type: String,
            default: ''
        },
        // 大奖名称
        flauntAwardName: {
            type: String,
            default: ''
        },
        date: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            awardTypeDesc: {
                1: '礼品',
                2: '奖学金',
                3: '全场满减券',
                4: '品类券'
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .my-present-item {
    display: flex;
    align-items: center;
    margin: 15px 30px;
    border-bottom: 1px solid #c9c9c9;
    padding-left: 20px;
    padding-bottom: 15px;

    > span {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #FF9F4B;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 100px;
        border-radius: 50%;
        object-fit: contain;
      }

      i {
        display: none;
      }

      .grand-prize {
        padding: 0 8px;
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        background-color: #2E9472;
        border-radius: 20px;
        height: 30px;
        line-height: 30px;
        width: 80px;
        font-size: 20px;
        color: #FFF;
      }
    }

    .info {
      text-align: left;
      font-size: 26px;
      font-weight: 400;
      line-height: 40px;
      color: #333;
      margin-left: 54px;
        > p {
            max-width: 380px;
            @include elps();
        }

      .orange {
        color: #fa4d2f;
      }
        .date {
            font-size: 24px;
            color: #999;
        }
    }
  }
</style>
