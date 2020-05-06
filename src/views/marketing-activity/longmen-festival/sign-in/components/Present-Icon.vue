<template>
    <div class="prensent-icon-item" @click="clickHandler">
        <!-- 未抽奖前普通奖品展示-->
        <div v-if="!hasSignin && !isGrandPrsent">
            <pl-svg class="icon" name="icon-present" width="50" height="50" type="svg" />
            <img class="icon-bg" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-gift-icon.png" alt="">
            <p class="not-sign">礼品</p>
        </div>
        <!-- 未抽奖前粽粽大奖奖品展示-->
        <div v-if="!hasSignin && isGrandPrsent">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/admall/2.9.0/small-gift-style.png">
            <p :class="{'not-sign': !hasSignin}">粽粽大礼</p>
        </div>
        <!-- 已抽奖,但是未抽中-->
        <div v-if="hasSignin && (awardType === 0)">
            <img class="icon ml-5"
                 src="https://mallcdn.youpenglai.com/static/admall/2.9.0/sad-zongzi.png">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
            <p>未中奖</p>
        </div>
        <!-- 奖品为礼品-->
        <div v-if="hasSignin && (awardType === 1)">
            <img class="icon ml-2 mt--2"
                 :src="awardImg || 'https://mallcdn.youpenglai.com/static/admall/2.9.0/series-course.png'">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
            <p>已获得</p>
        </div>
        <!-- 奖品为奖学金-->
        <div v-if="hasSignin && (awardType === 2)">
            <img
                class="icon"
                src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
            <p>已获得</p>
        </div>
        <!-- 奖品为优惠券-->
        <div v-if="hasSignin && (awardType === 3 || awardType === 4)">
            <img
                class="icon"
                src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
            <p>已获得</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PresentIcon',
    props: {
        // 礼品节点详情
        detail: {
            type: Object,
            default () {
                return {}
            }
        },
        // 奖品所在节点是否
        hasSignin: Boolean,
        // 是否大奖
        isGrandPrsent: Boolean,
        // 获奖奖品类型 0-未中奖 1-礼品 2-奖学金 3-全场满减券 4-品类券
        awardType: {
            type: [Number, String],
            default: 0
        },
        // 奖品图片
        awardImg: {
            type: String,
            default: ''
        }
    },
    methods: {
        async clickHandler () {
            try {
                this.$emit('clickHandler', this.detail)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .prensent-icon-item {
    display: inline-block;

    > div {
      position: relative;
      text-align: center;
    }
  }

  .icon {
    position: absolute;
    top: 33px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: contain;
  }

  .icon-bg {
    width: 95px;
    height: 112px;
    object-fit: contain;
  }

  p {
    color: #FFA659;
    font-size: 20px;
    line-height: 40px;

    &.not-sign {
      color: #2E9472;
    }
  }

  .ml-5 {
    margin-left: 5px;
  }

  .ml-2 {
    margin-left: 2px;
  }

  .mt--2 {
    margin-left: 5px;
  }
</style>
