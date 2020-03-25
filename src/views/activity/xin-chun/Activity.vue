<template>
    <div :class="$style.activity">
        <router-link
            :class="{
                [$style.item]: true,
                [$style.left]: false,
                [$style.small]: false,
                [$style.large]: true
            }"
            :style="{
                background,
                boxShadow
            }"
            tag="div"
            :to="{ name: 'NewYearActivity', params: { id: nwEvent.id } }"
        >
            <div :class="$style.info">
                <div :class="$style.sub">
                    翻开记忆的味道
                </div>
                <pl-svg name="icon-nianwei" width="264" height="54" />
                <div :class="$style.btn">
                    立即参加
                </div>
            </div>
            <div :class="$style.imgWrapper">
                <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/61795ee4-ca67-49c5-b5c2-d3f8769e98dc.png" alt="">
            </div>
        </router-link>

        <router-link
            v-if="false"
            :class="{
                [$style.item]: true,
                [$style.right]: false,
                [$style.small]: false,
                [$style.large]: false
            }"
            tag="div"
            :to="{ name: '' }"
        >
            <div :class="$style.imgWrapper">
                <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/2545d06c-3ae5-431b-926e-0feb36572222.png" alt="">
            </div>
            <div :class="$style.info">
                <div :class="$style.sub">
                    快来领取
                </div>
                <pl-svg name="icon-lao-dai-xin" width="264" height="54" />
                <div :class="$style.btn">
                    立即查看
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Activity',
    inject: ['parent'],
    props: {
        background: {
            type: String,
            default: '#FFF'
        },
        boxShadow: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    },
    computed: {
        ...mapGetters(['nwEvent'])
    }
}
</script>

<style module lang="scss">
  .activity {
    display: flex;
    justify-content: space-between;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .item {
    box-sizing: border-box;
    border-radius: 20px;
    &.large {
      &.item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 40px 70px 40px 45px;
        width: 100%;
        height: 268px;
      }
      .img-wrapper {
        width: 176px;
        height: 176px;
        overflow: hidden;
      }
      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .sub {
        margin-bottom: 8px;
        font-size: 24px;
        font-family: PingFang SC;
        color: #B48A64;
      }
      .btn {
        position: relative;
        margin-top: 28px;
        width: 232px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: linear-gradient(180deg, #FB873A 0%, #F64C1B 100%);
        border-radius: 16px;
        font-size: 28px;
        font-weight: bold;
        color: #FFFFFF;
        &:after {
          position: absolute;
          top: 50%;
          right: 30px;
          transform: translateY(-50%);
          content: '';
          width: 0;
          height: 0;
          border-width: 10px;
          border-color: transparent transparent transparent #FFFFFF;
          border-style: solid;
          border-radius: 4px;
        }
      }
    }

    &.small {
      &.left {
        .img-wrapper {
          width: 156px;
          height: 164px;
          overflow: hidden;
        }
      }
      &.right {
        .img-wrapper {
          width: 176px;
          height: 140px;
          overflow: hidden;
        }
      }
      &.item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0px 40px;
        width: 332px;
        height: 422px;
      }
      .info {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .sub {
        margin-bottom: 8px;
        font-size: 24px;
        font-family: PingFang SC;
        color: #B48A64;
      }
      .btn {
        position: relative;
        margin-top: 28px;
        width: 232px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: linear-gradient(180deg, #FB873A 0%, #F64C1B 100%);
        border-radius: 16px;
        font-size: 28px;
        font-weight: bold;
        color: #FFFFFF;
        &:after {
          position: absolute;
          top: 50%;
          right: 30px;
          transform: translateY(-50%);
          content: '';
          width: 0;
          height: 0;
          border-width: 10px;
          border-color: transparent transparent transparent #FFFFFF;
          border-style: solid;
          border-radius: 4px;
        }
      }
    }
  }
</style>
