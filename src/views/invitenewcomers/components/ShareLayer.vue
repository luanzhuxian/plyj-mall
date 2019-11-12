<template>
  <div class="share-layer">
    <overlay>
      <!--<div class="guide-line">
        <div>
          <i class="circle en" />
          <i class="circle ws" />
        </div>
      </div>-->
      <div class="content">
        <div class="title">复制链接，立即注册</div>
        <p class="desc" v-text="url" />
        <div class="btn-known" @click="close">复制</div>
      </div>
    </overlay>
  </div>
</template>

<script>
import Overlay from './Overlay'
import { mapGetters } from 'vuex'
export default {
  name: 'ShareLayer',
  components: {
    Overlay
  },
  computed: {
    ...mapGetters(['userId', 'mallUrl']),
    url () {
      return `${this.mallUrl}/invitenewcomers/${this.activityId}/${this.userId}`
    }
  },
  props: {
    activityId: {
      type: String,
      default: ''
    }
  },
  methods: {
    close () {
      this.$copyText(this.url)
        .then(e => {
          this.$success('复制成功')
        }, e => {
          console.error(e)
        })
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
      padding: 0 20px;
      font-size: 24px;
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
