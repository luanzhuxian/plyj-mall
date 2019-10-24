
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
            礼品核销
          </p>
          <p class="code-date">
            使用有效期至 {{ activeItem.useEndTime }}
          </p>
        </div>
        <div class="code-box-content">
          <div class="code-img">
            <img :src="qrcode" alt="">
          </div>
          <p class="code-num">{{ activeItem.redeemCode.slice(0 ,2) }} {{ activeItem.redeemCode.slice(2) | separator(' ', 4) }}</p>
          <p class="code-description">请出示核销码给机构人员</p>
        </div>
        <div class="code-save">长按图片保存分享给好友</div>
        <div class="code-close">
          <pl-icon @click="codeShow" name="icon-error" size="50" color="ffffff" />
        </div>
      </div>
    </div>
    <div class="delete-button" v-if="isEdit">
      <pl-button @click="deleteCode" size="squarelarge" background-color="#FE7700">删除</pl-button>
    </div>
    <div class="item-box" v-show="activeId === 0">
      <div class="empty" v-if="!data0.length">
        <pl-icon name="icon-youhuiquan1" type="svg" width="240" height="240" />
        <span>暂无礼品券</span>
      </div>
      <div class="items" v-else v-for="(item,index) of data0" :key="index">
        <div class="delete-box" v-if="isEdit">
          <pl-icon @click="choose(item)" v-if="item.isSelect" name="icon-xuanzhong" color="#FE7700" size="28" />
          <pl-icon @click="choose(item)" v-else name="icon-success1" color="#ccc" size="28" />
        </div>
        <div class="item">
          <div class="item-content">
            <div class="content-img-box">
              <img :src="item.giftImage" alt="">
            </div>
            <div class="content-detail-box">
              <div class="content-box">
                <div content="content-detail">
                  <p class="detail-name color3">{{ item.giftName }}</p>
                  <p class="detail-coupon color-E16">{{ item.giftBrief }}</p>
                </div>
                <div class="content-button">
                  <pl-button round="round" background-color="#EEEEEE" @click="checkCode(item)">立即兑换</pl-button>
                </div>
              </div>
              <p class="detail-date color-c">有效期:{{ item.useStartTime.replace(/-/g,'.').split(' ')[0] }}-{{ item.useEndTime.replace(/-/g,'.').split(' ')[0] }}</p>
            </div>
          </div>
          <div class="item-description">
            <p class="color6" v-for="desc in instructions" :key="desc" v-text="desc" />
          </div>
        </div>
      </div>
    </div>
    <div class="item-box" v-show="activeId === 1">
      <div class="empty" v-if="!data1.length">
        <pl-icon name="icon-youhuiquan1" type="svg" width="240" height="240" />
        <span>暂无礼品券</span>
      </div>
      <div class="items" v-else v-for="(item,index) of data1" :key="index">
        <div class="delete-box" v-if="isEdit">
          <pl-icon @click="choose(item)" v-if="item.isSelect" name="icon-xuanzhong" color="#FE7700" size="28" />
          <pl-icon @click="choose(item)" v-else name="icon-success1" color="#ccc" size="28" />
        </div>
        <div class="item">
          <div class="item-content">
            <pl-icon class="stamp" name="icon-yiduihuan" type="svg" width="200" height="200" />
            <div class="content-img-box">
              <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/order-complete-bg.png" alt="">
            </div>
            <div class="content-detail-box">
              <div class="content-box">
                <div content="content-detail">
                  <p class="detail-name color-c">{{ item.giftName }}</p>
                  <p class="detail-coupon color-c">{{ item.giftBrief }}</p>
                </div>
                <div class="content-button">
                  <pl-button :disabled="true" round="round" background-color="#EEEEEE">立即兑换</pl-button>
                </div>
              </div>
              <p class="detail-date color-c">有效期:{{ item.useStartTime.replace(/-/g,'.').split(' ')[0] }}-{{ item.useEndTime.replace(/-/g,'.').split(' ')[0] }}</p>
            </div>
          </div>
          <div class="item-description">
            <p class="color6" v-for="desc in instructions" :key="desc" v-text="desc" />
          </div>
        </div>
      </div>
    </div>
    <div class="item-box" v-show="activeId === 99">
      <div class="empty" v-if="!data99.length">
        <pl-icon name="icon-youhuiquan1" type="svg" width="240" height="240" />
        <span>暂无礼品券</span>
      </div>
      <div class="items" v-else v-for="(item,index) of data99" :key="index">
        <div class="delete-box" v-if="isEdit">
          <pl-icon @click="choose(item)" v-if="item.isSelect" name="icon-xuanzhong" color="#FE7700" size="28" />
          <pl-icon @click="choose(item)" v-else name="icon-success1" color="#ccc" size="28" />
        </div>
        <div class="item">
          <div class="item-content">
            <pl-icon class="stamp" name="icon-yiguoqi" type="svg" width="200" height="200" />
            <div class="content-img-box">
              <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/order-complete-bg.png" alt="">
            </div>
            <div class="content-detail-box">
              <div class="content-box">
                <div content="content-detail">
                  <p class="detail-name color-c">{{ item.giftName }}</p>
                  <p class="detail-coupon color-c">{{ item.giftBrief }}</p>
                </div>
                <div class="content-button">
                  <pl-button :disabled="true" round="round" background-color="#EEEEEE">立即兑换</pl-button>
                </div>
              </div>
              <p class="detail-date color-c">有效期:{{ item.useStartTime.replace(/-/g,'.').split(' ')[0] }}-{{ item.useEndTime.replace(/-/g,'.').split(' ')[0] }}</p>
            </div>
          </div>
          <div class="item-description">
            <p class="color6" v-for="desc in instructions" :key="desc" v-text="desc" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateQrcode } from '../../../assets/js/util'
import { getCityListByParentId, deleteGift, getGiftDetailById } from '../../../apis/my-coupon'
export default {
  name: 'HelperPoster',
  data () {
    return {
      activeItem: {},
      qrcode: '',
      tabs: [{ name: '未兑换', id: 0 }, { name: '已兑换', id: 1 }, { name: '已过期', id: 99 }],
      activeId: 0,
      isEdit: false,
      isCodeShow: false,
      data0: [],
      data1: [],
      data99: [],
      timer: '',
      instructions: [
        '1.仅支持线下到店进行礼品兑换，兑换时请出示二维码;',
        '2.仅支持兑换有效期内进行礼品兑换，逾期未兑换，请与客服联系；',
        '3.我的礼品仅支持兑换礼品，不支持折算现金；',
        '4.请联系客服，到指定门店领取礼品；'
      ]
    }
  },
  computed: {
  },
  created () {
    this.getList()
  },
  async mounted () {
    this.getList()
  },
  async activated () {
    this.activeId = 0 // 打开'我的礼品'页面后，默认进入第一个Tab
  },
  deactivated () {
    clearInterval(this.timer)
  },
  methods: {
    async deleteCode () {
      const array = []
      let data = []
      if (this.activeId === 0) {
        data = this.data0
      }
      if (this.activeId === 1) {
        data = this.data1
      }
      if (this.activeId === 99) {
        data = this.data99
      }
      for (const item of data) {
        if (item.isSelect) {
          array.push(item.id)
        }
      }
      if (!array.length) {
        this.$warning('请选择删除的礼品')
      }
      try {
        await deleteGift(array)
        this.$success('删除成功')
        this.getList()
        this.isEdit = false
      } catch (e) {
        throw e
      }
    },
    choose (item) {
      item.isSelect = !item.isSelect
    },
    async checkCode (item) {
      this.isCodeShow = true
      this.activeItem = item
      this.qrcode = await generateQrcode(500, `${this.mallUrl}/my/apply-helper?shareUserId=${item.redeemCode}`, 0, null, null, 'url')
      this.checkCodeComplete(item.id)
    },
    async checkCodeComplete (id) {
      this.timer = setInterval(async () => {
        const { result: res } = await getGiftDetailById({ id: id })
        if (res.status) {
          clearInterval(this.timer)
          this.getList()
          await this.$confirm({ html: `<p>兑换成功</p><p>感谢您参与活动</p>`, confirmText: '去逛逛' })
          this.$router.push({ name: 'Classify' })
        }
      }, 3000)
    },
    async getList () {
      const { result: res } = await getCityListByParentId({ status: this.activeId })
      const records = res.records
      for (const item of records) {
        item.isSelect = false
      }
      if (this.activeId === 0) {
        this.data0 = records
      }
      if (this.activeId === 1) {
        this.data1 = records
      }
      if (this.activeId === 99) {
        this.data99 = records
      }
    },
    handleClick (item) {
      this.activeId = item.id
      this.getList()
    },
    async edit () {
      let data = []
      if (this.activeId === 0) {
        data = this.data0
      }
      if (this.activeId === 1) {
        data = this.data1
      }
      if (this.activeId === 99) {
        data = this.data99
      }
      if (!data.length) return
      this.isEdit = !this.isEdit
    },
    codeShow () {
      this.isCodeShow = false
    }
  },
  watch: {
    activeId (newVal, oldVal) {
      /* 切换Tab时，1- 取消可编辑状态； 2- 取消所离开Tab优惠券的选中状态 */
      this.isEdit = false
      for (const item of this[`data${oldVal}`]) {
        item.isSelect = false
      }
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
  .delete-button{
    width: 100vw;
    position: fixed;
    bottom: 0;
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
        }
        .content-detail-box{
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 18px 20px 10px 24px;
          .content-box{
            display: flex;
            justify-content: space-between;
          }
          .detail-name{
            font-size: 24px;
            line-height: 34px;
          }
          .detail-coupon{
            width: 200px;
            margin-top: 10px;
            font-size: 22px;
            line-height: 32px;
          }
          .detail-date{
            margin-top: 15px;
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
