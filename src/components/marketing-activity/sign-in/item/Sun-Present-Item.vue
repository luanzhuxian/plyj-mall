<template>
    <div class="sun-present-item">
        <!-- 礼品展示 -->
        <template>
            <!--大奖-->
            <!--<span v-if="awardType === 1 && flauntAward === 2" class="grand-present">
                <img class="small" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/small-gift-style.png">
                <i>{{ flauntAwardName }}</i>
            </span>-->
            <!-- 奖学金 -->
            <div class="grand-present">
                <img v-if="awardType === 2" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
                <!-- 优惠券 -->
                <img v-else-if="awardType === 3 || awardType === 4" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
                <!--普通奖品-->
                <img v-else class="small" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f53995cc-7c11-40ca-902c-4f34cda1d075.png">
            </div>
        </template>
        <!-- 头像-->
        <img class="avatar" :src="userImg" :onerror="DEFAULT_AVATAR">
        <!-- 礼品描述 -->
        <div class="intro">
            <p>{{ userName }}{{ actionName }}了<span class="orange">{{ signinNum }}个</span>{{ activeName }}</p>
            <p> 开启礼品 获得{{ awardName }} </p>
        </div>
    </div>
</template>

<script>
const default_avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
export default {
    name: 'SunPresentItem',
    props: {
        // 获奖用户头像
        userImg: {
            type: String,
            default: ''
        },
        // 获奖用户名
        userName: {
            type: String,
            default: ''
        },
        // 获奖奖品类型 1-礼品 2-奖学金 3-全场满减券 4-品类券
        awardType: {
            type: Number,
            default: 1
        },
        // 是否大奖 1-普通奖品 2-大奖
        // flauntAward: {
        //     type: Number,
        //     default: 1
        // },
        // 大奖名称
        flauntAwardName: {
            type: String,
            default: ''
        },
        // 签到次数
        signinNum: {
            type: Number,
            default: 1
        },
        // 奖品名称
        awardName: {
            type: String,
            default: ''
        },
        // 活动名称（名词，如：端午活动，智力题）
        activeName: {
            type: String,
            default: ''
        },
        // 动作名称（动词，如：打卡，签到）
        actionName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            DEFAULT_AVATAR: `this.src="${ default_avatar }"`
        }
    }
}
</script>

<style scoped lang="scss">
  .sun-present-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #c9c9c9;
    padding: 30px 0;
      &:nth-of-type(1) {
          padding-top: 0;
      }
      &:nth-last-of-type(1) {
          padding-bottom: 0;
          border-bottom: none;
      }

    .grand-present {
      position: relative;
      display: inline-block;
      width: 80px;

      i {
        padding: 0 8px;
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        width: 80px;
        height: 30px;
        border-radius: 20px;
        line-height: 30px;
        font-size: 20px;
        background-color: #2E9472;
        color: #fff;
      }
    }

    img {
      width: 80px;
      object-fit: contain;

      &.small {
        width: 60px;
      }

      &.avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 24px;
        object-fit: cover;
      }
    }

    .intro {
      text-align: left;
      font-size: 26px;
      line-height: 40px;
      color: #333;
        max-width: 380px;
      font-weight: 400;
        > p {
            @include elps();
            &:last-child {
                font-size: 24px;
                color: #999;
            }
        }

      .orange {
        color: #fa4d2f;
      }
    }
  }
</style>
