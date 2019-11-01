<template>
  <div class="share-layer">
    <overlay>
      <!-- <div class="btn-share-circle">
        <pl-icon type="svg" name="icon-three-dot" height="40" width="40" />
      </div> -->
      <div class="guide-line">
        <div>
          <i class="circle en" />
          <i class="circle ws" />
        </div>
      </div>
      <div class="content">
        <div class="title">点击右上角图标</div>
        <p class="desc">
          分享活动给好友，邀请好友注册成为会员<br>
          一起参与领红包活动！
        </p>
        <div class="btn-known" @click="close">知道了</div>
      </div>
    </overlay>
  </div>
</template>

<script>
import Overlay from './Overlay'

export default {
  name: 'ShareLayer',
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
.share-layer {
  .btn-share-circle {
    position: fixed;
    right: 10px;
    top: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    width: 80px;
    border-radius: 50%;
    background-color: #d8d8d8;
  }

  .guide-line {
    position: fixed;
    top: 12px;
    right: 58px;
    width: 185px;
    height: 430px;
    border-right: 1px dashed white;
    border-bottom: 1px dashed white;

    div {
      position: relative;
      height: 100%;
      width: 100%;

      .circle {
        position: absolute;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: white;
      }

      .en {
        right: -5px;
        top: -5px;
      }

      .ws {
        left: -5px;
        bottom: -4px;
      }
    }
  }

  .content {
    position: fixed;
    top: 418px;
    width: 100%;
    color: white;
    text-align: center;

    .title {
      font-size: 34px;
      margin-bottom: 12px;
    }

    .desc {
      font-size: 28px;
      margin-bottom: 48px;
    }

    .btn-known {
      display: inline-block;
      width: 190px;
      height: 64px;
      line-height: 64px;
      border: 1px solid white;
      border-radius: 4px;
      font-size: 34px;
    }
  }
}
</style>
