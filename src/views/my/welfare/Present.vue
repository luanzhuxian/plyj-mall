
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
        <!--礼品列表-->
        <div class="item-box">
            <div class="empty" v-if="!currentList.length">
                <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/newCouponIcon.png" width="400" />
                <span>暂无礼品券</span>
            </div>
            <div class="items" v-else v-for="(item,index) of currentList" :key="index">
                <div class="delete-box" v-if="isEdit">
                    <pl-svg @click="choose(item)" v-if="item.isSelect" name="icon-chenggong" fill="#FE7700" width="28" />
                    <pl-svg @click="choose(item)" v-else name="icon-chenggong" fill="#ccc" width="28" />
                </div>
                <div class="item">
                    <div class="item-content" @click="showDetail(item)">
                        <pl-svg v-if="activeId === 1" type="img" class="stamp" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/yiduihuan.png" width="200" height="200" />
                        <pl-svg v-if="activeId === 99" type="img" class="stamp" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/yiguoqi.png" width="200" height="200" />
                        <div class="content-img-box">
                            <img v-imgError :src="item.giftImage" alt="">
                        </div>
                        <div class="content-detail-box">
                            <div class="content-box">
                                <div content="content-detail">
                                    <p :class="{'detail-name': true,'color3': !activeId, 'color-c': activeId}">
                                        {{ item.giftName }}
                                    </p>
                                    <p :class="{'detail-coupon': true,'color6': !activeId, 'color-c':activeId}">
                                        {{ item.giftBrief }}
                                    </p>
                                    <p :class="{'detail-date': true,'color6': !activeId, 'color-c':activeId}">有效期:{{ item.useStartTime | dateFormat('YYYY.MM.DD') }}-{{ item.useEndTime | dateFormat('YYYY.MM.DD') }}</p>
                                    <p
                                        v-if="item.activityName"
                                        :class="{'detail-coupon': true,'color-EB5': !activeId,'color-c': activeId }"
                                    >
                                        <span :class="{'disabled': activeId}">来源：{{ item.activityName }}</span>
                                    </p>
                                </div>
                                <div class="content-button">
                                    <pl-button v-if="activeId === 0" round="round" background-color="#EB5C20" @click.prevent.stop="checkCode(item)">立即兑换</pl-button>
                                    <pl-button v-if="activeId === 1" :disabled="true" round="round" background-color="#EEEEEE">已兑换</pl-button>
                                    <pl-button v-if="activeId === 99" :disabled="true" round="round" background-color="#EEEEEE">立即兑换</pl-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item-description">
                        <p class="color6" v-for="desc in instructions" :key="desc" v-text="desc" />
                    </div>
                </div>
            </div>
        </div>
        <!--管理时，删除按钮-->
        <div class="delete-button" v-if="isEdit">
            <pl-button @click="deleteCode" size="squarelarge" background-color="#FE7700">删除</pl-button>
        </div>
        <!--核销码展示-->
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
                        <img v-imgError :src="qrcode" alt="">
                    </div>
                    <p class="code-num">{{ activeItem.redeemCode.slice(0 ,2) }} {{ activeItem.redeemCode.slice(2) | separator(' ', 4) }}</p>
                    <p class="code-description">请出示核销码给机构人员</p>
                </div>
                <div class="code-save">长按图片保存分享给好友</div>
                <div class="code-close">
                    <pl-svg @click="isCodeShow = false" name="icon-close3" width="50" fill="#fff" />
                </div>
            </div>
        </div>
        <!--奖品详情弹框-->
        <div class="present-detail" v-if="isShowDetail">
            <div class="detail-box">
                <img :src="activeItem.giftImage" alt="">
                <div class="content">
                    <div class="name">
                        <b>
                            {{ activeItem.giftName }}
                        </b>
                    </div>
                    <div class="desc">{{ activeItem.giftBrief }}</div>
                    <div class="date">
                        有效期:{{ activeItem.useStartTime | dateFormat('YYYY.MM.DD') }}-{{ activeItem.useEndTime | dateFormat('YYYY.MM.DD') }}
                    </div>
                    <div class="activity-name" v-if="activeItem.activityName">
                        来源：{{ activeItem.activityName }}
                    </div>
                </div>
                <div class="detail-close">
                    <pl-svg @click="isShowDetail = false" name="icon-close3" width="48" fill="#fff" />
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
            activeId: 0,
            tabs: [{ name: '未兑换', id: 0 }, { name: '已兑换', id: 1 }, { name: '已过期', id: 99 }],
            // 当前展示的礼品列表
            currentList: [],
            // 当前选中的礼品
            activeItem: {},
            // 二维码
            qrcode: '',
            // 是否编辑
            isEdit: false,
            // 是否显示核销码弹款
            isCodeShow: false,
            // 是否展示礼品详情
            isShowDetail: false,
            // 核销定时器
            timer: '',
            instructions: [
                '1.仅支持线下到店进行礼品兑换，兑换时请出示二维码;',
                '2.仅支持兑换有效期内进行礼品兑换，逾期未兑换，请与客服联系；',
                '3.我的礼品仅支持兑换礼品，不支持折算现金；',
                '4.请联系客服，到指定门店领取礼品；'
            ]
        }
    },
    watch: {
        activeId (newVal, oldVal) {
            // 切换Tab时, 取消可编辑状态
            this.isEdit = false
        },
        isEdit (newVal, oldVal) {
            // 关闭编辑状态时，删除上一步的选择
            if (!newVal) {
                for (const item of this.currentList) {
                    item.isSelect = false
                }
            }
        }
    },
    async activated () {
        try {
            // 打开'我的礼品'页面后，默认进入第一个Tab
            this.activeId = 0
            this.getList()
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        clearInterval(this.timer)
    },
    methods: {
        // 切换tab页
        async handleClick (item) {
            try {
                this.activeId = item.id
                await this.$nextTick()
                await this.getList()
            } catch (e) {
                throw e
            }
        },
        async getList () {
            try {
                const { result: res } = await getCityListByParentId({
                    current: 1,
                    size: 100,
                    status: this.activeId
                })
                const { records } = res
                for (const item of records) {
                    item.isSelect = false
                }
                this.currentList = records
            } catch (e) {
                throw e
            }
        },
        // 编辑
        async edit () {
            if (!this.currentList.length) return
            this.isEdit = !this.isEdit
        },
        // 选择礼品
        choose (item) {
            item.isSelect = !item.isSelect
        },
        // 删除礼品
        async deleteCode () {
            const deleteList = []
            for (const item of this.currentList) {
                if (item.isSelect) {
                    deleteList.push(item.id)
                }
            }
            if (!deleteList.length) {
                this.$warning('请选择删除的礼品')
            }
            try {
                await deleteGift(deleteList)
                this.$success('删除成功')
                await this.getList()
                this.isEdit = false
            } catch (e) {
                throw e
            }
        },
        // 核销礼品
        async checkCode (item) {
            this.isCodeShow = true
            this.activeItem = item
            this.qrcode = await generateQrcode({ size: 500, text: `${ item.redeemCode }` })
            this.checkCodeComplete(item.id)
        },
        // 核销中
        async checkCodeComplete (id) {
            clearInterval(this.timer)
            this.timer = setInterval(async () => {
                const { result: res } = await getGiftDetailById({ id })
                if (res.status) {
                    clearInterval(this.timer)
                    await this.getList()
                    await this.$confirm({
                        message: '核销成功',
                        viceMessage: '感谢您参与活动',
                        confirmText: '去逛逛'
                    })
                    this.$router.push({ name: 'Classify' })
                }
            }, 3000)
        },
        showDetail (item) {
            if (this.isEdit) return
            if (this.activeId !== 0) return
            this.activeItem = item
            this.isShowDetail = true
        }
    }
}
</script>

<style lang="scss" scoped>
  .color-E16{color: #E1622D!important;}
  .color-EB5{color: #EB5C20!important;}
  .color3 {color: #333333!important;}
  .color6 {color: #666666!important;}
  .color9 {color: #999999!important;}
  .color-c {color: #CCCCCC!important;}
  img {object-fit: cover!important;}
  /*tab栏样式*/
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
  /*删除按钮样式*/
  .delete-button{
    width: 100vw;
    position: fixed;
    bottom: 0;
    height: 96px;
    line-height: 96px;
    background-color: #FE7700;
    z-index: 1;
  }
  /*礼品列表样式*/
  .item-box{
    padding: 0 24px;
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
    .items{
      display: flex;
      width: 100%;
      /*选框*/
      .delete-box{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 10px;
        width: 80px;
        padding-top: 10px;
      }
      .item{
        width: 100vw;
        margin-top: 20px;
        overflow: hidden;
        .item-content{
          position: relative;
          display: flex;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background-color: #FFFFFF;
          .stamp{
            z-index: 200;
            position: absolute;
            top: -65px;
            right: 70px;
          }
          .content-img-box{
            width: calc(188px - 32px * 2);
            height: calc(165px - 22px - 18px);
            position: relative;
            padding: 22px 32px 18px;
            border-right: 6px dotted #f4f5f9;
            text-align: center;
            line-height: 165px;
            img{
              width: 124px;
              height: 124px;
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
            padding: 12px 28px;
            .content-box{
              position: relative;
              display: flex;
              height: calc(165px - 24px);
              justify-content: space-between;
            }
            .detail-name{
              width: calc(100vw - 188px - 24px * 2 - 120px);
              font-size: 24px;
              font-weight: bold;
              line-height: 30px;
              @include elps();
            }
            .detail-coupon{
              width: calc(100vw - 188px - 24px * 2 - 120px);
              margin-top: 6px;
              font-size: 22px;
              line-height: 32px;
              @include elps();
              > span{
                display: inline-block;
                max-width: 180px;
                line-height:32px;
                color: #EB5C20;
                @include elps();
                &.disabled {
                  font-size: 22px;
                  color: #cccc;
                }
              }
            }
            .detail-date{
              font-size: 20px;
              line-height: 28px;
            }
            .content-button{
              position: absolute;
              right: -12px;
              bottom: 4px;
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
  }
  /*核销码弹框样式*/
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
  /*奖品详情弹框样式*/
  .present-detail{
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
    .detail-box{
      width: 540px;
      > img {
        display: inline-block;
        vertical-align: middle;
        width: 540px;
        height: 540px;
      }
      .content {
        background-color: #fff;
        padding: 50px 30px 100px;
        .name {
          font-size:30px;
          line-height:40px;
          color:#333;
        }
        .desc {
          margin-top: 20px;
          font-size:24px;
          line-height:32px;
          color: #666;
        }
        .date {
          margin-top: 32px;
          font-size:24px;
          line-height:32px;
          color: #666;
        }
        .activity-name {
          margin-top: 20px;
          font-size:24px;
          line-height:32px;
          color: #EB5C20;
        }
      }
      .detail-close{
        padding-top: 32px;
        color: #FFFFFF;
        font-size: 32px;
        text-align: center;
      }
    }
  }
</style>
