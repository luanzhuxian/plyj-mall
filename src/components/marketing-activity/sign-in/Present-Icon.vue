<template>
    <div class="prensent-icon-item" @click="clickHandler">
        <!-- 未抽奖前普通奖品展示-->
        <div v-if="!hasSignin && !isGrandPrsent">
            <img class="icon-bg" src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/present.png" alt="">
            <p class="not-sign">礼品</p>
        </div>
        <!-- 未抽奖前粽粽大奖奖品展示-->
        <div v-if="!hasSignin && isGrandPrsent">
            <img class="smart-bg"
                 src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/smart_gift.png">
            <p :class="{'not-sign': !hasSignin}">智慧礼</p>
        </div>
        <!-- 已抽奖,但是未抽中-->
        <div v-if="hasSignin && (awardType === 0)">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/present.png">
            <p>未中奖</p>
        </div>
        <!-- 奖品为礼品-->
        <div v-if="hasSignin && (awardType === 1)">
            <img
                class="icon-bg"
                :src="awardImg">
            <p>已获得</p>
        </div>
        <!-- 奖品为奖学金-->
        <div v-if="hasSignin && (awardType === 2)">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/scholarship.png">
            <p>已获得</p>
        </div>
        <!-- 奖品为优惠券-->
        <div v-if="hasSignin && (awardType === 3 || awardType === 4)">
            <img
                class="icon-bg"
                src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/reduction.png">
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
        clickHandler () {
            if (!this.detail.hasSignin) return
            this.$emit('clickHandler', this.detail)
        }
    }
}
</script>

<style scoped lang="scss">
  .prensent-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95px;
    margin-bottom: 30px;
  }
  .icon-bg {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }

  .smart-bg{
    width: 82px;
    height: 66px;
  }

  p {
    color: #F60000;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    margin-left: -10px;
    &.not-sign {
      color: #373737;
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
