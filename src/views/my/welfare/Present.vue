

<template>
  <div>
    <div class="tab-box">
      <div class="pl-tab pl-tab__small">
        <div
          v-for="(item, i) of tabs"
          :key="i"
          class="pl-tab__pane color9"
          :class="{ active: item.id === activeId }"
          @click="handleClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div @click="edit" class="management">管理</div>
    </div>
    <div class="code-mongolian" v-if="isCodeShow">
      <div class="code-box">
        <div class="code-box-title">
          <p class="code-title">
            礼品兑换
          </p>
          <p class="code-date">
            使用有效期至 2019-10-10  22:00:00
          </p>
        </div>
        <div class="code-box-content">
          <div class="code-img">
            <img :src="qrcode" alt="">
          </div>
          <p class="code-num">5239 5174 1521</p>
          <p class="code-description">请出示给维码给机构人员</p>
        </div>
        <div class="code-save">长按图片保存分享给好友</div>
        <div class="code-close">
          <pl-icon @click="codeShow" name="icon-error" size="50" color="ffffff" />
        </div>
      </div>
    </div>
    <div class="item-box" v-show="activeId === 1">
      <div class="empty" v-if="false">
        <pl-icon name="icon-zanwulipin" type="svg" width="240" height="240" />
        <span>暂无优惠卷</span>
      </div>
      <div class="items" v-else>
        <div class="delete-box" v-if="isEdit">
          <pl-icon name="icon-xuanzhong" color="#FE7700" size="28" />
        </div>
        <div class="item">
          <div class="item-content">
            <div class="content-img-box">
              <img src="../../../assets/images/order-complete-bg.png" alt="">
            </div>
            <div class="content-detail-box">
              <div content="content-detail">
                <p class="detail-name color3">CHERRY机械键盘</p>
                <p class="detail-coupon color-E16">砍价活动礼品兑换券</p>
                <p class="detail-date color-c">有效期:2019.4.15-2019.4.30</p>
              </div>
              <div class="content-button">
                <pl-button round="round" background-color="#EB5C20">立即兑换</pl-button>
              </div>
            </div>
          </div>
          <div class="item-description">
            <p class="color6">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
            <p class="color6">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
            <p class="color6">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
          </div>
        </div>
      </div>
    </div>
    <div class="item-box" v-show="activeId === 2">
      <div class="empty">
        <pl-icon name="icon-zanwulipin" type="svg" width="240" height="240" />
        <span>暂无优惠卷</span>
      </div>
      <div class="items">
        <div class="delete-box" v-if="isEdit">
          <pl-icon name="icon-xuanzhong" color="#FE7700" size="28" />
        </div>
        <div class="item">
          <div class="item-content">
            <pl-icon class="stamp" name="icon-yiduihuan" type="svg" width="200" height="200" />
            <div class="content-img-box">
              <img src="../../../assets/images/order-complete-bg.png" alt="">
            </div>
            <div class="content-detail-box">
              <div content="content-detail">
                <p class="detail-name color-c">CHERRY机械键盘</p>
                <p class="detail-coupon color-c">砍价活动礼品兑换券</p>
                <p class="detail-date color-c">有效期:2019.4.15-2019.4.30</p>
              </div>
              <div class="content-button">
                <pl-button :disabled="true" round="round" background-color="#EB5C20">立即兑换</pl-button>
              </div>
            </div>
          </div>
          <div class="item-description">
            <p class="color-c">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
            <p class="color-c">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
            <p class="color-c">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
          </div>
        </div>
      </div>
    </div>
    <div class="item-box" v-show="activeId === 3">
      <div class="empty">
        <pl-icon name="icon-zanwulipin" type="svg" width="240" height="240" />
        <span>暂无优惠卷</span>
      </div>
      <div class="items">
        <div class="delete-box" v-if="isEdit">
          <pl-icon name="icon-xuanzhong" color="#FE7700" size="28" />
        </div>
        <div class="item">
          <div class="item-content">
            <pl-icon class="stamp" name="icon-yiguoqi" type="svg" width="200" height="200" />
            <div class="content-img-box">
              <img src="../../../assets/images/order-complete-bg.png" alt="">
            </div>
            <div class="content-detail-box">
              <div content="content-detail">
                <p class="detail-name color-c">CHERRY机械键盘</p>
                <p class="detail-coupon color-c">砍价活动礼品兑换券</p>
                <p class="detail-date color-c">有效期:2019.4.15-2019.4.30</p>
              </div>
              <div class="content-button">
                <pl-button :disabled="true" round="round" background-color="#EB5C20">立即兑换</pl-button>
              </div>
            </div>
          </div>
          <div class="item-description">
            <p class="color-c">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
            <p class="color-c">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
            <p class="color-c">1.2i按时递交阿斯利康觉得爱上邓丽君阿三</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { generateQrcode } from '../../../assets/js/util'
  export default {
    name: 'HelperPoster',
    data () {
      return {
        qrcode: '',
        tabs: [{ name: '未兑换', id: 1 }, { name: '已兑换', id: 2 }, { name: '已过期', id: 3 }],
        activeId: 1,
        isEdit: false,
        isCodeShow: false
      }
    },
    computed: {
    },
    async mounted () {
      this.qrcode = await generateQrcode(500, `${this.mallUrl}/my/apply-helper?shareUserId=${'adasds'}`, 0, null, null, 'url')
    },
    async activated () {
    },
    methods: {
      handleClick (item) {
        this.activeId = item.id
      },
      async edit () {
        await this.$confirm({ html: `<p>兑换成功</p><p>感谢您参与活动</p>`, confirmText: '去逛逛' })
        this.isEdit = !this.isEdit
      },
      codeShow () {
        this.isCodeShow = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .color-E16{
    color: #E1622D;
  }
  .color3 {
    color: #333333;
  }
  .color6 {
    color: #666666;
  }
  .color9 {
    color: #999999;
  }
  .color-c {
    color: #CCCCCC;
  }
  .code-mongolian{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    background:rgba(0,0,0,0.65);
    z-index: 1;
    .code-box{
      flex: 1;
      .code-box-title{
        border-radius: 20px 20px 0 0;
        background-color: #F7F7F7;
        padding: 28px 40px 20px;
        .code-title{
          font-size: 36px;
          font-weight: bold;
        }
        .code-date{
          margin-top: 12px;
          font-size: 28px;
          color: #666;
          font-weight: bold;
        }
      }
      .code-box-content{
        padding: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 0 0 20px 20px;
        .code-img{
          width: 300px;
          height: 300px;
          border: 1px solid #CCCCCC;
          border-radius: 8px;
          padding: 14px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .code-num{
          color: #333333;
          font-size: 52px;
          font-weight: bold;
          padding-top: 20px;
        }
        .code-description{
          padding-top: 15px;
          font-size: 30px;
          color: #999999;
        }
      }
      .code-save{
        padding-top: 32px;
        color: #FFFFFF;
        font-size: 32px;
        text-align: center;
      }
      .code-close{
        padding-top: 32px;
        color: #FFFFFF;
        font-size: 32px;
        text-align: center;
      }
    }
  }
  .empty{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80vh;
    span{
      margin-top: 40px;
      font-size: 34px;
      color: #333333;
    }
  }
  .tab-box{
    display: flex;
    justify-content: space-between;
    padding: 0 24px 0 12px;
    background-color: #FFFFFF;
    .pl-tab {
      display: inline-flex;
      align-items: center;
      padding: 0 12px;
      color: #333;
      font-size: 32px;
      > div {
        padding: 0;
        margin: 0 32px;
        height: 80px;
        line-height: 80px;
      }
      &__pane {
        position: relative;
        &:after {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          width: 100%;
          background-color: #F2B036;
        }
        &.active {
          color: #F2B036;
          &:after {
            content: '';
          }
        }
      }
    }
    .management{
      display: inline-flex;
      align-items: center;
      height: 80px;
      background-color: #FFFFFF;
      color: #333333;
      font-size: 32px;
    }
  }
  .item-box{
    padding: 0 24px;
    .items{
      display: flex;
      width: 2000px;
    }
    .delete-box{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 10px;
      width: 80px;
      padding-top: 10px;
    }
    .item{
      width: 702px;
      margin-top: 20px;
      overflow: hidden;
      .item-content{
        position: relative;
        display: flex;
        background-color: #FFFFFF;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        .stamp{
          z-index: 200;
          position: absolute;
          top: -65px;
          right: 70px;
        }
        .content-img-box{
          width: 236px;
          height: 140px;
          position: relative;
          padding: 8px 24px;
          border-right: 6px dotted #f4f5f9;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .content-img-box:before{
          position: absolute;
          top: -10px;
          right: -14px;
          content: '';
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #f4f5f9;
        }
        .content-img-box:after{
          position: absolute;
          bottom: 0;
          right: -14px;
          content: '';
          width: 20px;
          height: 10px;
          border-radius: 20px 20px 0 0;
          background-color: #f4f5f9;
          /*background-color: #e60000;*/
        }
        .content-detail-box{
          display: flex;
          flex: 1;
          justify-content: space-between;
          padding: 18px 20px 10px 24px;
          .detail-name{
            font-size: 24px;
            line-height: 34px;
          }
          .detail-coupon{
            margin-top: 10px;
            font-size: 22px;
            line-height: 32px;
          }
          .detail-date{
            position: absolute;
            bottom: 20px;
            font-size: 20px;
            line-height: 24px;
          }
          .content-button{
            margin-top: 20px;
          }
        }
      }
      .item-description{
        background-color: #FFFFFF;
        margin-top: 2px;
        padding: 20px 24px;
        p{
          font-size: 24px;
          line-height: 40px;
        }
      }
    }
  }
</style>
