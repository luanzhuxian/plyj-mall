<template>
  <div :class="$style.bestRecommend">
    <div :class="$style.title">
      精品推荐
    </div>
    <div :class="$style.product">
      <div :class="$style.img" :style="{ backgroundImage: `url(https://img.alicdn.com/tfs/TB1t9C9axv1gK0jSZFFXXb0sXXa-990-400.jpg_1080x1800Q90s50.jpg)` }">
        <div :class="$style.type">
          体验课
        </div>
        <div :class="$style.howManyBuy">
          <pl-svg name="hot" />
          <span>1万人报名</span>
        </div>
      </div>

      <div :class="$style.content">
        <div :class="$style.name">
          缤纷鸟少儿英语缤纷鸟少儿英语缤纷鸟少儿
          英语缤纷鸟少儿英语
        </div>
        <Tags size="middle" />
        <div :class="$style.bottom">
          <div :class="$style.priceBox">
            <span>¥</span>
            <span>0</span>
            <del>¥550</del>
          </div>
          <button>立即报名</button>
        </div>
      </div>
    </div>
    <!-- 瀑布流 -->
    <div :class="$style.waterfallBox">
      <ul :class="$style.waterfall" v-if="listLeft.length">
        <li
          v-for="(item, i) of listLeft"
          :key="i"
          :class="{
            [$style.item]: true,
            [$style.long]: i % 2 === 1
          }"
        >
          <img :class="$style.img" :src="item.img" alt="">
          <div :class="$style.content">
            <p :class="$style.name" v-text="item.name" />
            <p :class="$style.desc" v-text="item.desc" />
            <p :class="$style.bottom">
              <span :class="$style.price" v-text="item.price" />
              <span :class="$style.many">
                <i v-text="item.many" />人付款
              </span>
            </p>
          </div>
        </li>
      </ul>
      <ul :class="$style.waterfall" v-if="listRight.length">
        <li
          v-for="(item, i) of listRight"
          :key="i"
          :class="{
            [$style.item]: true,
            [$style.long]: (i + 1) % 2 === 1
          }"
        >
          <img :class="$style.img" :src="item.img" alt="">
          <div :class="$style.content">
            <p :class="$style.name" v-text="item.name" />
            <p :class="$style.desc" v-text="item.desc" />
            <p :class="$style.bottom">
              <span :class="$style.price" v-text="item.price" />
              <span :class="$style.many">
                <i v-text="item.many" />人付款
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <button :class="$style.seeAll">
      <span>查看全部</span>
      <pl-svg name="right" color="#272536" />
    </button>
    <footer :class="$style.footer">
      — 技术支持 朋来科技 —
    </footer>
  </div>
</template>

<script>
import Tags from './Tags.vue'
export default {
  name: 'BestRecommend',
  components: {
    Tags
  },
  data () {
    return {
      data: []
    }
  },
  created () {
    for (let i = 0; i < 19; i++) {
      this.data.push({
        name: '韩都衣舍旗舰店'.repeat(Math.random() * 4 + 1),
        price: i + 1,
        many: 333 + i,
        desc: '韩都衣舍旗舰店韩都衣舍旗舰店韩都衣舍旗舰店',
        img: 'https://img.alicdn.com/bao/uploaded/i1/TB12Dlyb3FY.1VjSZFqXXadbXXa.jpg_190x190Q75s0.jpg_.webp'
      })
    }
  },
  computed: {
    listLeft () {
      return this.data.filter((item, i) => i % 2 === 0)
    },
    listRight () {
      return this.data.filter((item, i) => (i + 1) % 2 === 0)
    }
  },
  methods: {
    /**
     * 计算长图的下标
     * 下标出现有如下规律：
     * 1,2,5,6,9,10,13,14
     */
    setLongImage (i) {
      console.log(i + 4 - (i + 1), i + 4 - (i + 1) === 3)
      return i + 4 - i + 1 === 3
    }
  }
}
</script>

<style module lang="scss">
  .best-recommend {
    padding: 0 24px;
    color: #000;
    background: linear-gradient(180deg, #DFE4F3, #ECEAF7);
  }
  .title {
    position: relative;
    text-align: center;
    line-height: 114px;
    font-size: 36px;
    font-weight: bolder;
    color: #F2B036;
    letter-spacing: 14px;
    &:after, &:before {
      position: absolute;
      top: 50%;
      content: '';
      width: 20px;
      height: 4px;
      background-color: currentColor;
    }
    &:after {
      right: 32%;
    }
    &:before {
      left: 30%;
    }
  }
  .product {
    margin-bottom: 56px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #fff;
    .img {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      height: 470px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      .type {
        padding: 6px 24px;
        margin: 20px 0 0 20px;
        font-size: 28px;
        color: #fff;
        background-color: #F2B036;
        border-radius: 10px;
      }
      .how-many-buy {
        width: 100%;
        font-size: 28px;
        padding-left: 20px;
        padding-bottom: 16px;
        padding-top: 16px;
        color: #fff;
        background: linear-gradient(0, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
        svg {
          width: 36px;
          vertical-align: -2px;
          path {
          }
        }
      }
    }
  }
  .content {
    padding: 16px;
    .name {
      font-size: 32px;
      line-height: 42px;
      font-weight: bold;
      color: #000;
      @include elps-wrap(2);
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .priceBox {
      > span {
        color: #fe7700;
        &:nth-of-type(1) {
          font-size: 28px;
        }
        &:nth-of-type(2) {
          font-size: 48px;
          font-weight: bold;
        }
      }
      > del {
        margin-left: 12px;
        font-size: 28px;
        color: #999;
      }
    }
    > button {
      margin-top: 22px;
      padding: 12px 26px;
      font-size: 32px;
      color: #fff;
      background-color: #fe7700;
      border-radius: 8px;
    }
  }
  .waterfall-box {
    display: grid;
    grid-template-columns: 340px 340px;
    grid-gap: 22px;
  }
  .waterfall {
    .item {
      width: 340px;
      margin-bottom: 22px;
      color: #000;
      border-radius: 20px;
      overflow: hidden;
      background-color: #fff;
      &.long {
        color: red;
        .img {
          width: 340px;
          height: 454px;
          object-fit: cover;
        }
      }
      .img {
        width: 340px;
        height: 340px;
        object-fit: cover;
      }
      .content {
        padding: 16px;
        .name {
          margin-bottom: 6px;
          line-height: 31px;
          font-size: 24px;
          color: #000;
        }
        .desc {
          line-height: 24px;
          font-size: 20px;
          color: #999;
        }
        .bottom {
          display: flex;
          align-items: flex-end;
          margin-top: 20px;
          line-height: 38px;
          .price {
            font-size: 32px;
            color: #fe7700;
            &:before {
              content: '¥';
              font-size: 20px;
            }
          }
          .many {
            font-size: 20px;
            color: #999;
          }
        }
      }
    }
  }
  .see-all {
    width: 100%;
    height: 100px;
    margin-bottom: 36px;
    font-size: 26px;
    color: #000;
    border-radius: 20px;
    background-color: #FEF7F4;
    > svg {
      width: 26px;
      margin-left: 10px;
      vertical-align: -4px;
    }
  }
  .footer {
    padding-bottom: 50px;
    font-size: 26px;
    color: #999;
    text-align: center;
  }
</style>
