<template>
  <div :class="$style.activityView" ref="activityView">
    <div :class="$style.activityDataView">
      <div :class="$style.headerView">
        <div>
          <span>----------</span>
          <span>千家机构携手双十二</span>
          <span>----------</span>
        </div>
        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/double-twelve-header.png"
             alt=""
        >
      </div>
      <div :class="$style.separator">
        ********** <span>双十二疯狂同学会总数据</span> **********
      </div>
      <div :class="$style.dataView">
        <div :class="$style.itemView">
          <h4>活动预约</h4>
          <h3>
            <span v-text="orderTotalNum" />
            <b>人</b>
          </h3>
        </div>
        <div :class="$style.itemView">
          <h4>参与机构</h4>
          <h3>
            <span v-text="organNum" />
            <b>家</b>
          </h3>
        </div>
        <div :class="$style.itemView">
          <h4>总助力榜</h4>
          <h3>
            <span v-text="helpTotalNum" />
            <b>次</b>
          </h3>
        </div>
        <button @click="createPoster">
          帮我助力
        </button>
      </div>
      <!-- 弹幕 -->
      <div :class="$style.barrageView">
        <transition-group
          @:before-enter="beforeEnter"
          @:enter="enter"
        >
          <div v-for="item in barrageData" :key="item.id" :class="$style.itemView">
            <img :src="item.img" alt="">
            <span>{{ `${item.userName}预约成功` }}</span>
            <span>{{ `${item.minutes}分钟前` }}</span>
          </div>
        </transition-group>
      </div>
      <!-- 底部装饰 -->
      <div :class="$style.redFrame" />
      <div :class="$style.dashLine" />
    </div>
    <div :class="$style.userDataView">
      <div :class="$style.dataView">
        <div>
          <h4>
            <img :src="organ.logo" width="48px" height="68px">
            <pl-icon name="icon-your-data" width="240" height="60" type="svg" />
          </h4>
          <h5>
            全国排名:
            <span>{{ `第${nationalRankings}名` }}</span>
          </h5>
          <h5>
            活动预约:
            <span>{{ `${orderNum}人` }}</span>
          </h5>
          <h5>
            总助力数:
            <span>{{ `${helpNum}人` }}</span>
          </h5>
        </div>
        <div :class="$style.operationView">
          <pl-icon v-if="!isJoin" name="icon-join" width="780" height="210" type="svg" @click="join" />
          <div v-if="isJoin">
            <pl-icon v-if="helpTimes === 3" name="icon-help1" width="780" height="144" type="svg" @click="help" />
            <pl-icon v-if="helpTimes !== 3" name="icon-help" width="780" height="144" type="svg" />
            <div :class="$style.helpTimesView">
              {{ `X${helpTimes}` }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  预约成功弹框 -->
    <div :class="$style.successfulAppointmentDialog" v-if="showSuccessfulAppointment">
      <pl-icon name="icon-successful-appointment" width="240" height="60" type="svg" />
      <div :class="$style.contentView">
        您已成功预约吉的堡教育集团
        <br>
        携手双十二疯狂同学学会
      </div>
      <button>帮我助力</button>
      <b @click="showSuccessfulAppointment = false">
        <pl-svg name="close3" color="#fff" width="48" type="icon" />
      </b>
    </div>

    <!-- 海报弹框 -->
    <transition name="fade">
      <div :class="$style.posterView" v-if="isSharePoster">
        <div :class="$style.savePosterView">
          <img :src="poster" alt="">
          <div :class="$style.saveButtonView">
            长按识别或保存二维码，分享给朋友吧！
          </div>
          <pl-svg name="close3" color="#fff" @click="isSharePoster = false" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { generateQrcode, cutArcImage } from '../../assets/js/util'

const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
export default {
  name: 'DoubleTwelveDayActivity',
  data () {
    return {
      orderTotalNum: 26225, // 活动预约总人数
      organNum: 333, // 参与机构数
      helpTotalNum: 1554821, // 总助力榜
      orderNum: 3256, // 活动预约人数
      helpNum: 1004821, // 总助力数
      nationalRankings: 1, // 全国总排名
      barrageData: [
        {
          id: 1,
          img: '', // 购买者头像
          username: '展示柜', // 购买者名称
          minutes: 2 // 购买时长
        },
        {
          id: 2,
          img: '',
          username: 'asddsad',
          minutes: 3
        },
        {
          id: 3,
          img: '',
          username: 'dasdadd回答厚度和ad',
          minutes: 4
        },
        {
          id: 4,
          img: '',
          username: 'dasdadd回答厚度和ad',
          minutes: 4
        },
        {
          id: 5,
          img: '',
          username: 'dasdadd回答厚度和ad',
          minutes: 4
        }
      ], // 弹幕数据
      showSuccessfulAppointment: false, // 显示预约成功弹出框
      isSharePoster: true, // 显示分享海报
      organ: {
        logo: '', // 机构名称
        name: '中国觉得破傲' // 机构名称
      },
      username: 'cuidjai', // 用户名称
      userImg: '', // 用户头像
      isJoin: true, // 是否已预约
      helpTimes: 2, // 助力次数
      poster: '' // 海报背景
    }
  },
  methods: {
    beforeEnter (el) {
      //  弹幕进入前动画
      el.style.cssText = `left: 100%;`
    },
    enter (el) {
      //  弹幕进入时动画
      el.style.cssText = `left: 0;`
    },
    async createPoster () { // 生产海报
      if (this.poster) {
        this.isSharePoster = true
      }

      let canvas = document.createElement('canvas')
      canvas.width = 600
      canvas.height = 800
      let ctx = canvas.getContext('2d')

      // 绘制海报背景图片
      let posterBg = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/help-me-up.png'
      ctx.drawImage(posterBg, 32, 32, 128, 128)

      //  绘制机构LOGO
      let organLogo = this.organ.logo
      ctx.drawImage(organLogo, 32, 32, 128, 128)

      //  绘制机构名称
      fontStyle(ctx, 'bold 48px Microsoft YaHei UI', '#000', 'top')(ctx, 192, 74, this.organ.logo.name, 68, 800, 1)

      // 绘制用户头像
      let userImg = cutArcImage(this.userImg || avatar)
      ctx.drawImage(userImg, 32, 32, 128, 128)

      // 绘制用户名称以及"邀您助力"
      fontStyle(ctx, 'bold 48px Microsoft YaHei UI', '#000', 'top')(ctx, 192, 74, `${this.username} 邀您助力`, 68, 800, 1)

      try {
        // 生成二维码
        let qrcode = await generateQrcode(300, window.location.href, 0, organLogo, 10, 'canvas')

        //  绘制二维码
        ctx.drawImage(qrcode, 750, 1352, 320, 320)

        // 显示海报
        this.isSharePoster = true
      } catch (e) {
        throw e
      }
    },
    join () {
      /* 立即预约 */
    },
    help () {
      /* 助力 */
      if (this.helpTimes >= 3) {

      }
    }
  },
  watch: {
    showSuccessfulAppointment (val) {
      //  显示弹框时背景灰化
      if (val) {
        this.$refs.activityView.style.cssText = ` filter: grayscale(100%);`
      } else {
        this.$refs.activityView.style.cssText = ''
      }
    },
    isSharePoster (val) {
      //  显示弹框时背景灰化
      if (val) {
        this.$refs.activityView.style.cssText = ` filter: grayscale(100%);`
      } else {
        this.$refs.activityView.style.cssText = ''
      }
    }
  }
}

/**
     * 设置文字基本属性
     * @param ctx {CanvasRenderingContext2D} 2d context
     * @param font {String} 字体
     * @param color {String} 颜色
     * @param verticalAlign {String} 文字对齐方式
     * @returns {createText} {Function} 绘制文字的函数
     */
function fontStyle (ctx, font, color, verticalAlign) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textBaseline = verticalAlign
  return createText
}

/**
     * 绘制文本
     * @param ctx {CanvasRenderingContext2D} 2d context
     * @param x {Number} 文本开始的x坐标
     * @param y {Number} 文本开始的y坐标
     * @param width {Number} 每行文本的最大宽度
     * @param text {String} 文本
     * @param lineHeight {Number} 行高
     * @param lineNumber {Number} 行数（超过行数时，以...结尾）
     */
function createText (ctx, x, y, text, lineHeight, width, lineNumber) {
  // 填充商品名称
  let charArr = []
  let strArr = []
  let txtWidth = 0
  let lineCount = 0 // 文字行数
  let ellipsisWidth = ctx.measureText('...').width
  for (let i = 0; i < text.length; i++) {
    let char = text[i]
    charArr.push(char)
    txtWidth += ctx.measureText(char).width
    if (lineCount === lineNumber - 1 && txtWidth + ellipsisWidth >= width) {
      // 最后一行的文字
      charArr.push('...')
      strArr.push(charArr.join(''))
      break
    }
    // 文本换行
    if (txtWidth >= width || i === text.length - 1) {
      lineCount++
      strArr.push(charArr.join(''))
      txtWidth = 0
      charArr = []
    }
  }
  for (let [i, str] of strArr.entries()) {
    ctx.fillText(str, x, y + lineHeight * i)
  }
  return ctx.measureText(strArr[0]).width
}
</script>

<style module lang="scss">
  .gray-bg {
    filter: grayscale(100%);
  }

  .activity-view {
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/double_twelve_day_bg.png") no-repeat scroll;
    background-size: cover;
    width: 100vw;
    height: 101vh;
    position: relative;

    .activity-data-view {
      width: 671px;
      height: 950px;
      position: absolute;
      z-index: 20;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(180deg, rgba(253, 250, 243, 1) 0%, rgba(253, 250, 243, 1) 94%, rgba(230, 84, 87, 1) 100%);

      .header-view {
        width: 97%;
        height: 156px;
        background: #FD0036;
        margin: 30px auto 0;

        > div {
          text-align: center;

          span {
            font-size: 28px;
            font-weight: bold;
            line-height: 34px;
            color: #FFF;

            &:nth-child(2) {
              margin: 0 20px;
            }
          }
        }

        img {
          width: 97%;
          margin-top: 28px;
        }
      }

      .separator {
        text-align: center;
        font-size: 26px;
        line-height: 36px;
        color: #F95A68;
        letter-spacing: 2px;
        margin-top: 10px;

        span {
          margin: 0 20px;
          letter-spacing: normal;
        }
      }

      .data-view {
        padding-left: 42px;
        text-align: center;

        .item-view {
          text-align: left;
          margin-top: 40px;

          h4 {
            font-size: 40px;
            font-weight: 800;
            line-height: 56px;
            color: #333;
          }

          h3 {
            font-size: 68px;
            line-height: 80px;
            color: #D34240;

            b {
              margin-left: 10px;
              font-size: 32px;
              font-weight: 400;
              color: #776E67;
            }
          }
        }

        button {
          display: inline-block;
          width: 266px;
          height: 78px;
          line-height: 78px;
          background: #EE7832;
          border-radius: 160px;
          font-size: 36px;
          text-align: center;
          color: #FFF;
        }
      }

      .barrage-view {
        position: absolute;
        z-index: 30;
        bottom: 224px;
        right: 20px;
        height: 200px;
        overflow: hidden;

        .item-view {
          width: 306px;
          height: 56px;
          line-height: 56px;
          background: rgba(0, 0, 0, 1);
          opacity: 0.5;
          border-radius: 8px;
          padding: 0 12px;
          margin-bottom: 16px;

          &:nth-child(2) {
            opacity: 0.3;
          }

          &:nth-child(3) {
            opacity: 0.1;
          }

          img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }

          span {
            color: #FFF7E6;
            font-size: 22px;

            &:nth-child(2) {
              margin: 12px;
            }
          }
        }
      }

      .red-frame {
        width: 682px;
        height: 30px;
        background: rgba(160, 34, 37, 1);
        border-radius: 10px;
        position: absolute;
        bottom: 15px;
        z-index: -1;
      }

      .dash-line {
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/20191018/data_bg.png") no-repeat center;
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 671px;
        height: 30px;
      }
    }

    .user-data-view {
      position: absolute;
      width: 698px;
      height: 720px;
      background: #E8333C;
      border-radius: 46px;
      top: 632px;
      left: 50%;
      transform: translateX(-50%);

      .data-view {
        width: 606px;
        height: 250px;
        background: #E84655;
        border: 8px solid #FFF;
        border-radius: 20px;
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        padding-top: 20px;
        padding-left: 18px;

        > :first-child {
          padding: 10px;
          width: 462px;
          height: 224px;
          background: #FCECDF;
          border-radius: 10px;
          border-top: 2px;
          border-top-color: #9C5156;
          border-right: 2px;
          border-right-color: #9C5156;

          h4 {
            margin-bottom: 16px;

            img {
              vertical-align: baseline;
              margin-right: 10px;
            }
          }

          h5 {
            font-size: 32px;
            font-weight: 400;
            line-height: 50px;
            color: #565776;

            span {
              margin-left: 10px;
              font-weight: bold;
            }
          }
        }

        .operation-view {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: -350px;

          > div {
            height: 250px;

            .help-times-view {
              width: 68px;
              height: 68px;
              line-height: 68px;
              text-align: center;
              background: #425796;
              border-radius: 50%;
              border-bottom: 1px solid #121F53;
              color: #FFF;
              font-size: 36px;
              position: absolute;
              bottom: 20px;
              left: 350px;
            }
          }
        }
      }
    }

    .successful-appointment-dialog {
      position: fixed;
      top: 438px;
      left: 50%;
      transform: translateX(-50%);
      width: 506px;
      height: 346px;
      background: rgba(250, 77, 47, 1);
      border-radius: 20px;
      z-index: 50;
      text-align: center;
      padding: 42px;

      .content-view {
        margin-top: 24px;
        font-size: 20px;
        line-height: 28px;
        color: #EEEEEE;
        letter-spacing: 4px;
      }

      button {
        margin: 48px auto 0;
        width: 346px;
        height: 74px;
        background: rgba(254, 205, 76, 1);
        border: 2px solid rgba(255, 224, 157, 1);
        border-radius: 276px;
        font-size: 26px;
        font-weight: bold;
        line-height: 74px;
        color: #A56113;
      }

      b {
        width: 24px;
        height: 24px;
        background: transparent;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -100px;
      }
    }

    /*海报样式*/
    .poster-view {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      top: 100px;

      .save-poster-view {
        .save-button-view {
        }
      }
    }
  }
</style>
