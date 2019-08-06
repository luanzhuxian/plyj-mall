<template>
  <div :class="$style.appointmentDetail">
    <div
      :class="$style.top"
      :style="{ backgroundImage: `url(${'https://img.alicdn.com/tfs/TB15pj3bHY1gK0jSZTEXXXDQVXa-380-320.png'})`}"
    >
      <div :class="$style.topContent">
        <a :class="$style.callService" href="">
          <pl-svg name="call-service" />
        </a>
        <div :class="$style.top">
          <img :class="$style.img" src="https://img.alicdn.com/tfs/TB15pj3bHY1gK0jSZTEXXXDQVXa-380-320.png">
          <div :class="$style.name">
            吉地堡少儿英语
          </div>
        </div>
        <div :class="$style.bottom">
          <p :class="$style.desc">
            吉的堡教育，致力于2-12岁幼儿园及英语培训学校。结合
            全球最尖端的语言学习工具， 配合最专业的课程规划...
          </p>
          <div :class="$style.address">
            <pl-svg name="address4" />
            <span :class="$style.addressContent">陕西省西安市天谷七路新加坡腾飞科汇城</span>
            <button :class="$style.copyAddress" @click="copy('陕西省西安市天谷七路新加坡腾飞科汇城')">复制</button>
          </div>
        </div>
      </div>
    </div>

    <div
      :class="{
        [$style.module]: true,
        [$style.a]: true
      }"
    >
      <div :class="$style.moduleTitle">
        <pl-svg :class="$style.moduleIcon" name="school_show" />
        <span :class="$style.title">校区展示</span>
        <pl-svg :class="$style.enter" name="enter" />
      </div>
      <ul :class="$style.contentList">
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
      </ul>
    </div>

    <div
      :class="{
        [$style.module]: true,
        [$style.b]: true
      }"
    >
      <div :class="$style.moduleTitle">
        <pl-svg :class="$style.moduleIcon" name="five_pointed" />
        <span :class="$style.title">学员风采</span>
        <pl-svg :class="$style.enter" name="enter" />
      </div>
      <ul :class="$style.contentList">
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
        <li :style="{ backgroundImage: `url(https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg)` }" />
      </ul>
    </div>

    <div
      :class="{
        [$style.module]: true,
        [$style.c]: true
      }"
    >
      <div :class="$style.moduleTitle">
        <pl-svg :class="$style.moduleIcon" name="video" />
        <span :class="$style.title">宣传视频</span>
      </div>
    </div>

    <div
      :class="{
        [$style.module]: true,
        [$style.d]: true
      }"
    >
      <div :class="$style.moduleTitle">
        <pl-svg :class="$style.moduleIcon" name="school_intro" />
        <span :class="$style.title">校区介绍</span>
      </div>
    </div>

    <div
      :class="{
        [$style.module]: true,
        [$style.e]: true
      }"
    >
      <div :class="$style.moduleTitle">
        <pl-svg :class="$style.moduleIcon" name="aptitude" />
        <span :class="$style.title">相关资质</span>
      </div>
      <ul :class="$style.contentList">
        <li>
          <img src="https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg" alt="">
          <p>资质认证</p>
        </li>
        <li>
          <img src="https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg" alt="">
        </li>
        <li>
          <img src="https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg" alt="">
        </li>
        <li>
          <img src="https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg" alt="">
        </li>
        <li />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppointmentDetailVue',
  methods: {
    copy (text) {
      this.$copyText(text).then((e) => {
        this.$success('已复制')
      }, function (e) {
        alert('Can not copy')
      })
    }
  }
}
</script>

<style module lang="scss">
  .appointment-detail {
    .top {
      height: 706px;
      margin-bottom: 20px;
      background-color: #fff;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: auto 578px;
      overflow: hidden;
    }
    .top-content {
      position: relative;
      width: 702px;
      height: 290px;
      margin: 367px auto 0;
      padding: 24px 30px;
      box-sizing: border-box;
      background-color: #f2b036;
      border-radius: 20px;
      box-shadow: 0 40px 40px -40px rgb(242, 176, 54);
      > .call-service {
        position: absolute;
        top: -74px;
        right: 26px;
        > svg {
          width: 128px;
        }
      }
      > .top {
        display: flex;
        align-items: center;
        height: max-content;
        background-color: transparent;
        > .img {
          width: 88px;
          height: 88px;
          margin-right: 18px;
          object-fit: cover;
          border-radius: 20px;
          background-color: #fff;
        }
        > .name {
          font-size: 40px;
          font-weight: bold;
        }
      }
      > .bottom {
        margin-top: 20px;
        padding-left: 16px;
        border-left: 1px solid #000;
        > .desc {
          margin-bottom: 20px;
          font-size: 24px;
        }
        > .address {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24px;
          color: #9D6C12;
          > svg {
            width: 34px;
            margin-right: 8px;
          }
          > .address-content {
            width: 452px;
            font-size: 24px;
            @include elps()
          }
          > .copy-address {
            width: 100px;
            height: 44px;
            font-size: 24px;
            color: #9D6C12;
            border-radius: 22px;
            background-color: #f9c668;
          }
        }
      }
    }
  }
  .module {
    margin-top: 20px;
    padding: 24px;
    background-color: #fff;
    &.a > .content-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow: auto;
      > li {
        width: 320px;
        height: 230px;
        min-width: 320px;
        margin-right: 20px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        border-radius: 20px;
      }
    }
    &.b > .content-list {
      display: grid;
      grid-template-columns: 340px 340px;
      justify-content: space-between;
      grid-row-gap: 22px;
      overflow: auto;
      > li {
        width: 340px;
        height: 340px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        border-radius: 20px;
      }
    }
    &.e {
      padding: 0;
      overflow: auto;
      > .module-title {
        padding: 24px;
        margin-bottom: 8px;
      }
      > .content-list {
        position: relative;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        white-space: nowrap;
        padding-bottom: 64px;
        overflow: auto;
        border: 1px solid transparent;
        /*&:after {*/
          /*position: relative;*/
          /*display: inline-block;*/
          /*content: '';*/
          /*width: 24px !important;*/
          /*height: 24px !important;*/
        /*}*/
        > li {
          display: inline-block;
          width: 282px;
          height: max-content;
          min-width: 282px;
          margin-top: 0;
          margin-left: 24px;
          border-radius: 20px;
          box-shadow: 0 5px 10px rgba(0, 0, 0, .1);
          &:nth-last-of-type(1) {
            min-width: 1px;
            height: 1px;
          }
          > img {
            width: 100%;
            height: auto;
            padding: 28px;
          }
          > p {
            padding: 16px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            border-top: 1px solid #e7e7e7;
          }
        }
      }
    }
  }
  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    > .module-icon {
      width: 36px;
      margin-right: 12px;
    }
    > .enter {
      width: 48px;
    }
    > .title {
      flex: 1;
      font-size: 36px;
      font-weight: bold;
    }
  }
</style>
