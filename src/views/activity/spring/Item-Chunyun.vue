<template>
    <router-link
        :class="[$style.item, $style[size]]"
        tag="div"
        :to="{ name: 'SpringPloughing' }"
    >
        <div :class="$style.title">
            {{ data.name }}
        </div>
        <div :class="$style.imgWrapper">
            <img v-imgError :src="data.imageUrl" alt="">
        </div>
        <div :class="$style.countDownWrapper" v-if="size === 'small'">
            <span v-if="data.status === 0">距开始</span>
            <span v-if="data.status === 1">距结束</span>
            <span v-if="data.status === 2">已结束</span>
            <countdown
                v-if="~[0, 1].indexOf(data.status)"
                :duration="getDuration(data)"
                @finish="data.status += 1"
            >
                <template v-slot="{time}">
                    <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                    <span :class="$style.colon">天</span>
                    <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                    <span :class="$style.colon">:</span>
                    <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                </template>
            </countdown>
        </div>
        <div :class="$style.price">
            <div :class="$style.origin">
                <span :class="$style.left">
                    {{ `原价：￥${data.totalPrice}` }}
                </span>
                <span :class="$style.right" v-if="size === 'small'">
                    {{ `${data.salesVolume}人已买` }}
                </span>
            </div>
            <div :class="$style.current" @click.stop="submitOrder(data)">
                <template v-if="data.status === 2">
                    已结束
                </template>
                <template v-else>
                    <template v-if="data.stock">
                        <span v-if="data.status === 0">{{ `组合价：￥${data.discountTotalPrice}` }}</span>
                        <span v-if="data.status === 1">{{ `组合到手${data.discountTotalPrice}元` }}</span>
                    </template>
                    <template v-else>
                        太火爆，已抢空
                    </template>
                </template>
            </div>
        </div>
        <div :class="[$style.cornner, $style.topLeft]" />
        <div :class="[$style.cornner, $style.topRight]" />
        <div :class="[$style.cornner, $style.bottomRight]" />
        <div :class="[$style.cornner, $style.bottomLeft]" />
    </router-link>
</template>

<script>
import Countdown from '../components/Countdown.vue'
import { getDuration } from '../helper.js'

export default {
    name: 'ItemChunyun',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { }
            }
        },
        size: {
            type: String,
            default: 'large',
            validator: val => ~['small', 'medium', 'large'].indexOf(val)
        }
    },
    data () {
        return {}
    },
    methods: {
        getDuration,
        async submitOrder (item) {
            if (item.status === 0 || !item.stock) this.$router.push({ name: 'SpringPloughing' })
            if (item.status === 1) {
                const confirmList = []
                for (const prod of item.productModelList) {
                    confirmList.push({
                        productId: prod.productId,
                        skuCode1: prod.skuCode1,
                        skuCode2: prod.skuCode2,
                        count: prod.count,
                        price: prod.price,
                        agentUser: '',
                        productType: prod.productType
                    })
                }
                this.$store.commit('submitOrder/setOrderProducts', {
                    params: {
                        activeProduct: 5,
                        preActivity: 2,
                        activityId: item.id
                    },
                    products: confirmList
                })
            }
        }
    }
}
</script>

<style lang="scss" module>
.item {
  position: relative;
  box-sizing: border-box;
  padding: 40px 24px 48px;
  background: #428B42;
  border: 2px solid #A3D816;
  width: 100%;
  &.medium {
    width: 560px;
    .img-wrapper {
      height: 344px;
    }
  }
  &.small {
    padding: 20px 16px;
    width: 344px;
    .title {
      padding: 0 36px;
      width: 304px;
      height: 48px;
      line-height: 48px;
      font-size: 24px;
      letter-spacing: 4px;
    }
    .img-wrapper {
      margin-top: 20px;
      height: 208px;
    }
    .count-down-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 8px;
      height: 62px;
      line-height: 62px;
      background: #397432;
      font-size: 24px;
      color: #92F4C7;
      .block {
          display: inline-block;
          box-sizing: border-box;
          margin: 0 4px;
          width: 36px;
          height: 38px;
          line-height: 38px;
          text-align: center;
          background-color: #92F4C7;
          color: #4076cc;
          border-radius: 4px;
      }
    }
    .origin {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      font-size: 24px;
      .left {
        @include elps();
      }
      .right {
        font-size: 20px;
        color: #92F4C7;
        @include elps();
      }
    }
    .current {
      max-width: none;
      height: 60px;
      line-height: 60px;
      font-size: 28px;
      font-family: San Francisco Display;
      @include elps();
    }
    .cornner {
      width: 30px;
      height: 30px;
    }
  }

  .title {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 70px;
    width: 446px;
    height: 64px;
    line-height: 64px;
    background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/e009100a-579a-4369-8238-db258fb2d91b.png") no-repeat center;
    background-size: auto 100%;
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #DCFD8C;
    letter-spacing: 4px;
    text-align: center;
    @include elps();
  }
  .img-wrapper {
    margin-top: 32px;
    width: 100%;
    height: 426px;
    overflow: hidden;
  }
  .origin {
    margin-top: 24px;
    font-size: 36px;
    font-family: San Francisco Display;
    line-height: 42px;
    color: #FFFFFF;
    text-align: center;
    @include elps();
  }
  .current {
    margin: 12px auto 0;
    padding: 0 20px;
    max-width: fit-content;
    max-width: 100%;
    height: 90px;
    line-height: 90px;
    background: #DEF3CA;
    color: #A6482F;
    font-size: 44px;
    font-family: San Francisco Display;
    font-weight: bold;
    border-radius: 10px;
    text-align: center;
    @include elps();
  }
  .cornner {
    position: absolute;
    width: 46px;
    height: 46px;
    background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/1c11b4a5-091d-4f8d-a88c-e8334dfc9d88.png") no-repeat center;
    background-size: cover;
    &.top-left {
      top: 0;
      left: 0;
    }
    &.top-right {
      top: 0;
      right: 0;
      transform: rotate(90deg);
    }
    &.bottom-left {
      bottom: 0;
      left: 0;
      transform: rotate(270deg);
    }
    &.bottom-right {
      bottom: 0;
      right: 0;
      transform: rotate(180deg);
    }
  }
}
</style>
