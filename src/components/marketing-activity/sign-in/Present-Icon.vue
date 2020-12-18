<template>
    <div @click="clickHandler">
        <!-- 未抽奖前普通奖品展示-->
        <div v-if="!hasSignin && !isGrandPrsent" style="margin-top: 10px">
            <img class="icon-bg" src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/present.png" alt="">
            <p class="not-sign">礼品</p>
        </div>
        <!-- 未抽奖前智慧礼品展示-->
        <div v-if="!hasSignin && isGrandPrsent" style="position: relative">
            <img class="smart-bg"
                 src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/smart_gift.png">
            <p :class="{'not-sign': !hasSignin}">智慧礼</p>
            <p class="last-question" v-if="isLastIcon" @click="showInfoModal = true">终题答案</p>
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
        <info-model :show.sync="showInfoModal" :answer="15" />
    </div>
</template>

<script>
import InfoModel from './Info-Modal'
export default {
    name: 'PresentIcon',
    components: { InfoModel },
    data () {
        return {
            showInfoModal: false
        }
    },
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
        },
        isLastIcon: {
            type: Boolean,
            default: false
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
  .icon-bg {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }

  .smart-bg{
    width: 113px;
    height: 72px;
    object-fit: contain;
    margin-bottom: -8px;
  }

  p {
    color: #F60000;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
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
  .last-question {
    position: absolute;
    bottom: -40px;
    background: #FE461F;
    padding: 0 10px;
    border-radius: 30px;
    color: #fff;
  }
</style>
