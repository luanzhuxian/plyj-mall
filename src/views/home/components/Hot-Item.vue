<template>
  <div :class="$style.hotItem">
    <div :class="$style.top">
      <span :class="$style.title">热销单品</span>
      <p :class="$style.more">
        <span>查看更多</span>
        <pl-svg name="right" color="#ccc" />
      </p>
    </div>

    <div :class="$style.proBox">
      <div :class="{ [$style.first]: true, [$style.proItem]: true }">
        <img :class="$style.img" src="https://img.alicdn.com/tfs/TB1t9C9axv1gK0jSZFFXXb0sXXa-990-400.jpg_1080x1800Q90s50.jpg" alt="">
        <div :class="$style.content">
          <div :class="$style.proName">
            青苗幼儿早教班
          </div>
          <div :class="$style.proPrice">
            <div :class="$style.price">
              <span>¥</span>
              <span>10000</span>
            </div>
            <span :class="$style.howManyPay">33人付款</span>
          </div>
          <ul :class="$style.tags">
            <li
              :class="$style.tag" v-for="(item, i) of tags"
              :key="i"
              v-text="item"
              :style="{ color: color[i] }"
            />
          </ul>
        </div>
      </div>

      <div :class="$style.other">
        <div :class="$style.proItem">
          <img :class="$style.img" src="https://img.alicdn.com/tfs/TB1t9C9axv1gK0jSZFFXXb0sXXa-990-400.jpg_1080x1800Q90s50.jpg" alt="">
          <div :class="$style.content">
            <div :class="$style.proName">
              青苗幼儿早教班
            </div>
            <div :class="$style.proPrice">
              <div :class="$style.price">
                <span>¥</span>
                <span>10000</span>
              </div>
              <span :class="$style.howManyPay">33人付款</span>
            </div>
            <ul :class="$style.tags">
              <li
                :class="$style.tag" v-for="(item, i) of tags"
                :key="i"
                v-text="item"
                :style="{ color: color[i] }"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotItem',
  data () {
    return {
      tags: [
        '线下',
        '智能白板',
        '智能白板智能白板智能',
        '白板'
      ],
      color: [
        '#E83B27',
        '#92B1E5',
        '#F3BE41',
        '#60C684'
      ]
    }
  }
}
</script>

<style module lang="scss">
  .hot-item {
    padding: 34px 24px 0;
    background-color: #F4F5F9;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .title {
        position: relative;
        font-size: 36px;
        font-weight: bold;
        &:after {
          position: absolute;
          right: -36px;
          content: 'HOT';
          width: 44px;
          line-height: 24px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          font-weight: normal;
          background: linear-gradient(60deg, #FE7700 25%, rgba(255, 255, 255, .5), #FE7700 85%);
          background-size: 200%;
          border-radius: 12px;
          animation: bgc-move 2s ease infinite;
        }
      }
      .more {
        font-size: 24px;
        color: #999;
        > svg {
          width: 20px;
          margin-left: 6px;
          vertical-align: -2px;
        }
      }
    }
  }
  .pro-box {
    margin-top: 20px;
  }
  .pro-item {
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    width: 340px;
    .img {
      width: 340px;
      height: 340px;
      object-fit: cover;
    }
    .content {
      padding: 16px;
      margin-bottom: 6px;
      .pro-name {
        height: 72px;
        font-size: 28px;
        font-weight: bold;
        line-height: 36px;
        @include elps-wrap(2);
      }
      .pro-price {
        margin-top: 16px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        .price {
          span {
            color: #FE7700;
            &:nth-of-type(1) {
              font-size: 24px;
              font-weight: 600;
            }
            &:nth-of-type(2) {
              font-size: 40px;
              font-weight: bold;
            }
          }
        }
        .how-many-pay {
          display: inline-block;
          font-size: 20px;
          color: #999;
        }
      }
      .tags {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 8px;
        .tag {
          margin-right: 8px;
          margin-bottom: 8px;
          padding: 0 12px;
          font-size: 20px;
          line-height: 28px;
          border: 1px solid currentColor;
          box-sizing: border-box;
          border-radius: 6px;
        }
      }
    }
    &.first {
      width: 100%;
      .img {
        width: 100%;
        height: 296px;
        object-fit: cover;
      }
      .content {
        .pro-name {
          height: 36px;
          @include elps();
        }
      }
      .tags {
        .tag {
          margin-right: 12px;
          padding: 0 12px;
          font-size: 24px;
          line-height: 36px;
          border: 1px solid currentColor;
          box-sizing: border-box;
          border-radius: 8px;
        }
      }
      .how-many-pay {
        font-size: 24px !important;
      }
    }
  }
  .other {
    display: flex;
    margin-top: 22px;
  }
  @keyframes bgc-move {
    0% { background-position: 150% 0 }
    100% { background-position: -50% 0 }
  }
</style>
