<template>
    <div :class="$style.invitenewcomers">
        <div v-show="!loading" :class="$style.center">
            <board
                :data="detail"
                :active-id="activityId"
                :share-user-id="shareUserId"
                @open="createHaibao"
            />
            <AcquisitionGifts :activity-id="activityId" />
        </div>

        <!-- 骨架屏 -->
        <div v-show="loading" :class="$style.skeleton">
            <div :class="$style.skeletonA">
                <div :class="$style.skeletonB" />
                <div :class="$style.skeletonC" />
                <div :class="$style.skeletonD" />
                <div :class="$style.skeletonE" />
            </div>
        </div>

        <you-like :is-my="true" />
        <!--<div :class="$style.ruleNav" @click="isShowRule = true">
      活动规则
    </div>-->
        <!--<div :class="$style.poster">
      <pl-svg v-if="creating" name="btn-loading" color="#000" class="rotate" @click="createHaibao" />
      <pl-svg v-else name="haibao" @click="createHaibao" />
      海报
    </div>-->
        <pl-popup
            :show="isShowRule"
            title="活动细则"
            @close="isShowRule = false"
        >
            <div :class="$style.ruleContent">
                <h3>1.活动时间</h3>
                <p>{{ startTime }} 至 {{ endTime }}</p>
                <h3>2.活动对象</h3>
                <p>所有会员</p>
                <h3>3.活动说明</h3>
                <p v-html="activityBrief" />
            </div>
        </pl-popup>

        <transition name="fade">
            <div :class="$style.posterWrap" v-if="showHaibao" @click="showHaibao = false">
                <img v-imgError :src="this.poster" alt="">
                <pl-svg name="icon-close3" width="30" />
            </div>
        </transition>
    </div>
</template>

<script>
import moment from 'moment'
import Board from './components/Board'
import AcquisitionGifts from './components/Acquisition-Gifts.vue'
import youLike from '../../../home/components/YouLike.vue'
import { share } from '../../../../assets/js/wechat/wechat-share'
import { mapGetters } from 'vuex'
import {
    getActiveDetail,
    inviterStatisitic
} from '../../../../apis/invitenewcomers'
import { loadImage, generateQrcode, createText, drawRoundRect, cutArcImage } from '../../../../assets/js/util'
export default {
    name: 'InviteNewcomers',
    components: {
        Board,
        youLike,
        AcquisitionGifts
    },
    data () {
        return {
            isShowRule: false,
            loading: false,
            detail: null,
            creating: false,
            showHaibao: false,
            poster: ''
        }
    },
    props: {
        activityId: {
            type: String,
            default: ''
        },
        shareUserId: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['appId', 'mallUrl', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
        isNewUser () {
            return this.userId === ''
        },
        startTime () {
            if (this.detail) {
                return moment(this.detail.invitingEventsEntity.activityStartTime).format('YYYY-MM-DD HH:mm:ss')
            }
            return ''
        },
        endTime () {
            if (this.detail) {
                return moment(this.detail.invitingEventsEntity.activityEndTime).format('YYYY-MM-DD HH:mm:ss')
            }
            return ''
        },
        activityBrief () {
            if (this.detail) {
                return (this.detail.invitingEventsEntity.activityBrief || '').replace(/\n/g, '<br>')
            }
            return ''
        }
    },
    async activated () {
    // 暂存分享者的id, 而不是自己的id
        if (this.shareUserId && this.userId !== this.shareUserId) {
            sessionStorage.setItem('INVITE_NEW_USERS_SHAERID', this.shareUserId)
        }
        await this.init()
    },
    methods: {
        async init () {
            try {
                this.loading = true

                // 获取活动详情
                const { result } = await getActiveDetail(this.activityId)
                this.detail = result

                // 如果分享id和自己的id相等，则刷新一次，以提高分享配置的成功率
                if (this.shareUserId && this.userId === this.shareUserId) {
                    location.replace(`/${ this.mallDomain }/yx/${ this.activityId }`)
                    return
                }

                // 配置微信分享
                this.share(this.shareUserId)
                this.loading = false
            } catch (e) {
                throw e
            }
        },
        share (shareUserId) {
            let willHide = ['menuItem:share:timeline']

            // 如果已经存在分享id，此时页面不允许分享
            if (shareUserId || !this.userId) {
                willHide = ['menuItem:share:appMessage', 'menuItem:share:timeline']
                inviterStatisitic(this.activityId, shareUserId)
            }
            const shareUrl = `${ this.mallUrl }/yx/${ this.activityId }/${ this.userId }?noCache=${ Date.now() }`
            share({
                appId: this.appId,
                title: `${ this.userName }已领取豪礼`,
                desc: '快来参加活动，一起领取豪礼！',
                link: shareUrl,
                imgUrl: this.logoUrl,
                willHide
            })
        },
        async createHaibao () {
            if (this.poster) {
                this.showHaibao = true
                return
            }
            try {
                this.creating = true
                let userImg = await loadImage(this.avatar)
                userImg = await cutArcImage(userImg)
                const img = await loadImage('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/%E9%82%80%E6%96%B0%E6%9C%89%E7%A4%BC%E5%88%86%E4%BA%AB%E6%B5%B7%E6%8A%A5%E5%88%87%E5%9B%BE%402x.jpg')
                const cvs = document.createElement('canvas')
                let ctx = null
                const shareUrl = `${ this.mallUrl }/yx/${ this.activityId }/${ this.userId }?t=${ Date.now() }`
                const qrcode = await generateQrcode({ size: 300, text: shareUrl, type: 'canvas' })
                const endTime = `活动结束时间 ${ moment(this.detail.invitingEventsEntity.activityEndTime).format('YYYY年MM月DD日 hh:mm:ss') }`
                cvs.width = 654
                cvs.height = 1162
                ctx = cvs.getContext('2d')
                ctx.font = '24px Microsoft YaHei UI'
                const textWIdth = ctx.measureText(endTime).width
                const rectWidth = textWIdth + 28
                const rectX = (654 - rectWidth) / 2
                ctx.drawImage(img, 0, 0, 654, 1162)
                ctx.drawImage(qrcode, 250, 940, 150, 150)
                ctx.drawImage(userImg, 80, 793, 52, 52)
                ctx.font = 'bold 34px Microsoft YaHei '
                ctx.fillText(`${ this.userName }`, 145, 833)
                ctx.fillStyle = '#A3260F'
                const nameWidth = ctx.measureText(this.userName).width
                ctx.fillText(`与您分享精彩活动`, `${ 154 + nameWidth }`, 833)
                ctx.save()
                drawRoundRect({
                    ctx,
                    x: rectX,
                    y: 316,
                    width: rectWidth,
                    height: 44,
                    radius: 22,
                    fillStyle: '#fd806a'
                })
                ctx.restore()
                ctx.fillStyle = '#d1ee10'
                ctx.baseline = 'hanging'
                ctx.font = '24px Microsoft YaHei UI'
                createText({
                    ctx,
                    x: rectX + 14,
                    y: 348,
                    text: endTime,
                    lineHeight: 44
                })
                this.poster = cvs.toDataURL('image/jpeg')
                this.showHaibao = true
            } catch (e) {
                this.$error(e.message)
            } finally {
                this.creating = false
            }
        }
    }
}
</script>

<style lang="scss" module>
.invitenewcomers {
  padding-bottom: 90px;
  .center {
    padding: 32px 24px;
  }
  .rule-nav, .poster {
    position: fixed;
    top: 368px;
    right: 0;
    padding: 0 14px;
    height: 48px;
    line-height: 50px;
    background: linear-gradient(90deg,rgba(255,229,115,1) 0%,rgba(255,188,45,1) 100%);
    border-radius: 48px 0px 0px 48px;
    font-size: 24px;
    font-weight: 400;
    color: #000;
    text-align: center;
    > svg {
      width: 24px;
      height: 24px;
      vertical-align: -4px;
      > path {
        fill: #000;
      }
    }
  }
  .rule-nav {
    top: 436px;
  }

  .rule-content {
    padding: 0 40px;
    h3 {
      font-size: 32px;
    }

    p {
      margin-bottom: 60px;
      font-size: 28px;
    }
  }
}

  .skeleton {
    padding: 32px 24px;
  }
  .skeleton-a {
    padding: 32px 24px;
    background-color: #fa4d2f;
    border-radius: 20px;
  }
  .skeleton-b {
    height: 126px;
    border-radius: 20px;
    @include skeAnimation(#feca41)
  }
  .skeleton-c {
    width: 448px;
    height: 56px;
    margin: 48px auto 0;
    border-radius: 10px;
    @include skeAnimation(#eee)
  }
  .skeleton-d {
    width: 540px;
    height: 50px;
    margin: 24px auto 0;
    border-radius: 10px;
    @include skeAnimation(#eee)
  }
  .skeleton-e {
    width: 452px;
    height: 110px;
    margin: 64px auto 0;
    border-radius: 55px;
    @include skeAnimation(#feca41)
  }
  .poster-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 20px 110px 0 110px;
    background-color: rgba(0, 0, 0, .65);
    z-index: 2005;
    img{
      width: 100%;
    }
    > svg {
      display: block;
      width: 40px;
      height: 40px;
      margin: 20px auto 0;
    }
  }
</style>
