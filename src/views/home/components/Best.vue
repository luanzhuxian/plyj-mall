<template>
  <div :class="$style.best">
    <div :class="$style.top">
      <span :class="$style.title">精品课程</span>
    </div>
    <ul :class="$style.proList">
      <li :class="$style.proItem" v-for="i of 6" :key="i">
        <img :class="$style.img" src="https://gdp.alicdn.com/imgextra/i3/263817957/O1CN01rVIC5i28eM2SiFhPT_!!263817957.jpg" alt="">
        <div :class="$style.itemContent">
          <p :class="$style.proName">
            少儿英语三节名师英语体验课程
          </p>
          <div :class="$style.bottom">
            <div :class="$style.priceBox">
              <div :class="$style.price">
                <span>¥</span>
                <span>1.9</span>
              </div>
              <div :class="$style.howManyBuy">
                999人报名
              </div>
            </div>
            <button>立即学习<!-- 立即报名 --></button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Best'
}
</script>

<style module lang="scss">
  .best {
    padding: 48px 24px 24px 24px;
    background-color: #f4f5f9;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .title {
      position: relative;
      font-size: 36px;
      font-weight: bold;
    }
  }
  .pro-list {
    display: grid;
    grid-template-columns: 340px 340px;
    grid-gap: 22px;
    margin-top: 20px;
  }
  .pro-item {
    width: 340px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #fff;
    .img {
      width: 340px;
      height: 228px;
      object-fit: cover;
    }
  }
  .item-content {
    padding: 16px;
    box-sizing: border-box;
    .pro-name {
      font-weight: bold;
      font-size: 24px;
      color: #000;
      @include elps-wrap(2);
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    > button {
      width: 124px;
      height: 48px;
      font-size: 26px;
      color: #fff;
      background-color: #fe7700;
      border-radius: 8px;
    }
  }
  .price-box {
    .price {
      font-size: 32px;
      font-weight: bold;
      color: #fe7700;
      span:nth-of-type(1) {
        font-size: 20px;
      }
    }
    .how-many-buy {
      font-size: 20px;
      color: #fe7700;
    }
  }
</style>
