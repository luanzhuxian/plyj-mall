<template>
  <router-link
    :class="$style.maisong"
    tag="div"
    :to="{ name: 'Classify' }"
  >
    <div
      :class="{
        [$style.background]: true,
        [$style.bg1]: type === 5 || type === 6,
        [$style.bg2]: type === 7
      }"
    >
      <div :class="$style.wrapper">
        <div :class="$style.title" v-if="data.otherValue">
          {{ data.otherValue }}
        </div>
        <ul :class="$style.list" v-if="data.values.length">
          <li
            :class="{
              [$style.listItem]: true,
              [$style.small]: data.values.length === 3,
              [$style.middle]: data.values.length === 2,
              [$style.large]: data.values.length === 1
            }"
            v-for="(item, i) of data.values"
            :key="i"
          >
            <div :class="$style.imgWrapper">
              <img :src="item.image + '?x-oss-process=style/thum-middle'" alt="">
            </div>
            <div :class="$style.info">
              <pl-icon name="icon-gift-1" type="svg" v-if="i === 0" />
              <pl-icon name="icon-gift-2" type="svg" v-if="i === 1" />
              <pl-icon name="icon-gift-3" type="svg" v-if="i === 2" />
              <div :class="$style.sub">
                {{ item.name }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Maisong',
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    },
    type: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style module lang="scss">
  .maisong {
    margin-top: 32px;
    background: linear-gradient( 180deg, rgba(249, 217, 205, 1) 0%, rgba(243, 178, 119, 1) 11%, rgba(241, 163, 91, 1) 100%);
    border-radius: 20px;
    overflow: hidden;
    .background {
      &.bg-1 {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-gift-1.jpg") no-repeat center top;
        background-size: 100% auto;
      }
      &.bg-2 {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-gift-2.jpg") no-repeat center top;
        background-size: 100% auto;
      }
    }
    .wrapper {
      position: relative;
      padding: 112px 24px 48px;
    }
    .title {
      display: inline-block;
      padding: 0 20px;
      height: 52px;
      line-height: 52px;
      background:#FFF;
      border-radius: 292px;
      font-size: 28px;
      font-weight: 800;
      color: #EC7905;
      text-align: center;
      margin-bottom: 40px;
    }
    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      &-item {
        width: 206px;
        border-radius: 20px;
        overflow: hidden;
        &:nth-of-type(1) {
          .info {
            svg {
              color: #EC7A05;
            }
            .sub {
              background: #EC7A05;
            }
          }
        }
        &.large {
          display: flex;
          padding: 0;
          width: 100%;
          background-color: #FFF;
          .img-wrapper {
            width: 380px;
            height: 252px;
            overflow: hidden;
          }
          .info {
            flex: 1;
            width: 0;
            justify-content: center;
          }
          svg {
            margin-bottom: 20px;
            width: 110px;
            height: 68px;
          }
          .sub {
            padding: 0 26px;
            width: 95%;
            height: 52px;
            line-height: 52px;
            font-size: 36px;
          }
        }
        &.middle {
          width: 310px;
          .img-wrapper {
            height: 210px;
          }
          svg {
            margin-bottom: 20px;
            width: 110px;
            height: 68px;
          }
          .sub {
            height: 52px;
            line-height: 52px;
            font-size: 32px;
          }
        }
      }
      .img-wrapper {
        height: 136px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .info {
        padding: 16px 26px 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background: #FFF;
      }
      svg {
        margin-bottom: 12px;
        width: 70px;
        height: 22px;
        color: #B1712F;
      }
      .sub {
        padding: 0 12px;
        min-width: 128px;
        max-width: 100%;
        height: 34px;
        line-height: 34px;
        background: #B1712F;
        border-radius: 268px;
        font-size: 24px;
        font-weight: bold;
        color: #FFF;
        text-align: center;
        @include elps();
      }
    }
  }
</style>
