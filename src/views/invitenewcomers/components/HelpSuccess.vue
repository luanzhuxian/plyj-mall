<template>
  <div class="help-success">
    <overlay>
      <div class="center-box">
        <div class="help-success">
          <div class="title">助力成功</div>
          <p class="description">
            您已获得新人礼包 ，请在我的卡包中查看<br>
            感谢你的好友助力，您也可发起邀新有礼活动<br>
            领取豪礼大奖哦！
          </p>
          <div style="text-align: center">
            <div class="btn-do" @click="close">
              我也来翻豪礼
            </div>
          </div>
        </div>
        <div style="text-align: center;">
          <span class="btn-close" @click="close">
            <pl-icon type="icon" name="icon-close" color="white" />
          </span>
        </div>
      </div>
    </overlay>
  </div>
</template>

<script>
import Overlay from './Overlay'

export default {
  name: 'HelpSuccess',
  components: {
    Overlay
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.help-success {
  width: 506px;
  height: 644px;
  border-radius: 20px;

  .center-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .help-success {
      width: 466px;
      height: 346px;
      padding-top: 40px;
      margin-bottom: 60px;
      background: rgba(250,77,47,1);
      border-radius: 20px;

      .title {
        color: white;
        margin-bottom: 20px;
        font-size: 60px;
        text-align: center;
        font-family: HYLingXinJ;
      }

      .description {
        margin-bottom: 48px;
        font-size: 20px;
        color: white;
        text-align: center;
      }

      .btn-do {
        display: inline-block;
        width: 346px;
        height: 74px;
        line-height: 74px;
        background: rgba(254,205,76,1);
        border: 2px solid rgba(255,224,157,1);
        border-radius: 276px;
        color: #a56113;
        font-size: 26px;
      }
    }

    .btn-close {
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    border: 1px solid white;
    border-radius: 50%;
  }
  }
}
</style>
