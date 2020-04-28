<template>
    <div :class="$style.personalCenter">
        <div :class="$style.top">
            <img v-imgError :src="avatar" alt="头像">
            <div :class="$style.basicInfo">
                <span :class="$style.main" v-text="userName" />
                <div :class="$style.sub">
                    <span :class="$style.level" v-text="roleName" />
                    <span v-if="isHelperModuleShow && lockStatus === 0" :class="$style.lockStatus">已禁用</span>
                    <router-link
                        v-if="isApplyBtnShow"
                        :class="$style.applyBtn"
                        :to="{ name: 'ApplyHelper' }"
                    >
                        <pl-svg name="icon-helper-apply" width="158" height="44" />
                    </router-link>
                    <div v-if="isProgressBtnShow" :class="$style.progress">
                        <span
                            v-if="applyStatus === 'AWAIT'"
                            :class="$style.progressLeft"
                            v-text="'Helper审核中...'"
                        />
                        <span
                            :class="$style.progressRight"
                            v-text="'查看进度'"
                            @click="isModalShow = true"
                        />
                    </div>
                </div>
            </div>
            <div :class="$style.setting">
                <router-link v-if="!isAdmin" :to="{ name: 'Setting' }">
                    <pl-svg name="icon-setting-white" width="42" fill="#fff" />
                </router-link>
            </div>
        </div>

        <div :class="$style.content" v-if="loaded">
            <!-- 金库 -->
            <router-link
                v-if="isHelper"
                :class="[$style.panel, $style.finance]"
                :to="{ name: 'Coffers' }"
            >
                <div>
                    <p>可提现润笔（元）</p>
                    <p>
                        <span v-text="balance || '0.00'" />
                        <!-- <span :class="$style.withdrawTip">提现</span> -->
                    </p>
                </div>
                <div>
                    <p>今日润笔（元）</p>
                    <p v-text="currentBalance || '0.00'" />
                </div>
                <pl-svg :class="$style.myRight" name="icon-right" size="18" fill="#ccc" />
            </router-link>

            <div :class="$style.waitPay" v-if="count.prePayOrder" @click="$router.push({ name: 'WaitPayBalance' })">
                <pl-svg name="icon-dingdan" width="28" height="28" fill="#fff" /> 待付尾款订单 <i>{{ count.prePayOrder }}</i> <pl-svg name="icon-right" fill="#fff" width="24" />
            </div>

            <!-- 我的订单 -->
            <div :class="$style.panel">
                <div :class="$style.orderStatus">
                    <router-link :to="{ name: 'Orders', params: { status: 'WAIT_PAY' } }">
                        <pl-svg name="icon-wait-pay" width="72" height="90" />
                        <span
                            :class="{ [$style.badge]: true, [$style.oval]: count.waitPayment > 99 }"
                            v-if="count.waitPayment"
                            v-text="count.waitPayment > 99 ? '99+' : count.waitPayment"
                        />
                    </router-link>
                    <router-link :to="{ name: 'Orders', params: { status: 'WAIT_SHIP' } }">
                        <pl-svg name="icon-wait-ship" width="72" height="90" />
                        <span
                            :class="{ [$style.badge]: true, [$style.oval]: count.waitDelivery > 99 }"
                            v-if="count.waitDelivery"
                            v-text="count.waitDelivery > 99 ? '99+' : count.waitDelivery"
                        />
                    </router-link>
                    <router-link :to="{ name: 'Orders', params: { status: 'WAIT_RECEIVE' } }">
                        <pl-svg name="icon-wait-receive" width="72" height="88" />
                        <span
                            :class="{ [$style.badge]: true, [$style.oval]: count.waitCollect > 99 }"
                            v-if="count.waitCollect"
                            v-text="count.waitCollect > 99 ? '99+' : count.waitCollect"
                        />
                    </router-link>
                    <router-link :to="{ name: 'RefundList', params: { status: 'ALL_ORDER' } }">
                        <pl-svg name="icon-after-sale" width="108" height="88" />
                        <span
                            :class="{ [$style.badge]: true, [$style.badgeAfterSale]: true, [$style.oval]: count.afterSale > 99 }"
                            v-if="count.afterSale"
                            v-text="count.afterSale > 99 ? '99+' : count.afterSale"
                        />
                    </router-link>
                    <div :class="$style.segmentation">
                        <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/my/my-segmentation.png" alt="">
                    </div>
                    <router-link :to="{ name: 'Orders', params: { status: 'ALL_ORDER' } }">
                        <pl-svg name="icon-my-order-list" width="96" height="90" />
                    </router-link>
                </div>
                <div v-if="newFreight.length > 0" :class="$style.newLogistics">
                    <div :class="$style.logisticsTitle">
                        最新物流
                    </div>
                    <swiper :options="swiperOption" style="overflow: hidden;">
                        <swiper-slide
                            :class="$style.swiperSlide"
                            v-for="(item, i) of newFreight"
                            :key="i"
                        >
                            <router-link
                                :class="$style.logisticsContent"
                                :to="{ name: 'Freight', params: { orderId: item.orderId }, query: { img: item.productImageUrls[0] } }"
                            >
                                <div :class="$style.contentLeft">
                                    <img v-imgError v-img-error :src="item.productImageUrls[0]">
                                </div>
                                <div :class="$style.contentRight">
                                    <div :class="$style.deliveryStatus">
                                        派送中
                                    </div>
                                    <div :class="$style.deliveryDetails" v-text="item.orderLogisticTrackModel.content" />
                                </div>
                            </router-link>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
            <!-- 优惠劵 -->
            <div :class="$style.panel">
                <div :class="$style.welfare">
                    <router-link :to="{ name: 'MyCoupon'}" :class="$style.welfareItem">
                        <pl-svg name="icon-coupon" width="72" height="72" />
                        <div>
                            <h5>我的卡券</h5>
                            <!-- <span>福利多多帮你省钱</span> -->
                        </div>
                    </router-link>
                    <router-link :to="{ name: 'MyPresent'}" :class="$style.welfareItem">
                        <pl-svg name="icon-present" width="72" height="72" type="svg" />
                        <div>
                            <h5>我的礼品</h5>
                            <!-- <span>到店核销领礼品</span> -->
                        </div>
                    </router-link>
                    <router-link :to="{ name: 'MyBurse'}" :class="$style.welfareItem">
                        <img src="https://mallcdn.youpenglai.com/static/mall/my/a3fb1993-79ef-4533-bd1a-de1cd98226e9.png" alt="">
                        <div>
                            <h5>我的奖学金</h5>
                            <!-- <span>和优惠券叠加使用</span> -->
                        </div>
                    </router-link>
                    <router-link :to="{ name: 'LiveLibrary'}" :class="$style.welfareItem">
                        <pl-svg name="icon-live-library" width="72" height="72" type="svg" />
                        <div>
                            <h5>我的视频库</h5>
                            <!-- <span>到店核销领礼品</span> -->
                        </div>
                    </router-link>
                </div>
            </div>
            <router-link
                v-if="isApplyBtnShow"
                :class="[$style.panel, $style.tip]"
                :to="{ name: 'WhatsHelper' }"
            >
                <span :class="$style.tipCircle" />
                <span>成为Helper，第一桶金从这里开始>></span>
            </router-link>
            <!-- helper -->
            <div :class="[$style.panel, $style.helper]" v-if="isHelperModuleShow && lockStatus">
                <router-link to="" @click.native="toHelperManagementPage">
                    <pl-svg name="icon-helper-management" width="120" height="115" />
                </router-link>
                <router-link :to="{ name: 'HelperPoster' }">
                    <pl-svg name="icon-helper-invatation" width="120" height="115" />
                </router-link>
                <router-link :to="{ name: 'ShopPoster'}">
                    <pl-svg name="icon-helper-poster" width="120" height="115" />
                </router-link>
                <router-link :to="{ name: 'ShopQrcode'}">
                    <pl-svg name="icon-helper-qrcode" width="120" height="115" />
                </router-link>
            </div>
            <you-like :class="$style.recommend" :is-my="true" />
            <modal
                ref="modal"
                :show.sync="isModalShow"
                title="Helper认证审核进度"
                title-align="left"
                hide-footer
                close-on-click-overlay
            >
                <Progress
                    :class="$style.progressModal"
                    :steps="progress"
                    :active="0"
                />
            </modal>
        </div>

        <div :class="$style.skeleton" v-else>
            <div :class="[$style.skeleton1, $style.panel]">
                <div :class="$style.itemSmall" v-for="(item, index) of 5" :key="index">
                    <div :class="[$style.icon, $style.skeAnimation]" />
                    <div :class="[$style.text, $style.skeAnimation]" />
                </div>
            </div>
            <div :class="[$style.skeleton2, $style.panel]">
                <div :class="$style.itemLarge" v-for="(item, index) of 4" :key="index">
                    <div :class="[$style.icon, $style.skeAnimation]" />
                    <div :class="[$style.text, $style.skeAnimation]" />
                </div>
            </div>
            <div :class="[$style.skeleton3, $style.title]">
                <div :class="[$style.text, $style.skeAnimation]" />
            </div>
            <div :class="$style.skeleton4">
                <div :class="$style.item" v-for="(item, index) of 4" :key="index">
                    <div :class="[$style.itemImage, $style.skeAnimation]" />
                    <div :class="$style.itemContent">
                        <div :class="[$style.main, $style.skeAnimation]" />
                        <div :class="[$style.sub, $style.skeAnimation]" />
                        <div :class="[$style.text, $style.skeAnimation]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import youLike from './../home/components/YouLike.vue'
import Modal from '../../components/penglai-ui/Modal.vue'
import Progress from '../../components/common/Progress.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { orderPhysicalorderSummary, getHelperApplicationProgress } from '../../apis/order-manager'
import { getNewFreight } from '../../apis/my'
import { getAduitNotice, updateNoticeStatus } from '../../apis/broker-manager'
import { mapGetters, mapActions } from 'vuex'
import { Get_ADUIT_NOTICE } from '../../store/mutation-type'

// const orderStatusMapCamel = {
//   new: 'NEW',
//   waitPayment: 'WAIT_PAY',
//   waitDelivery: 'WAIT_SHIP',
//   waitCollect: 'WAIT_RECEIVE',
//   comment: 'FINISHED',
//   afterSale: 'AFTER_SALE'
// }

export default {
    name: 'My',
    components: {
        youLike,
        Modal,
        Progress,
        swiper,
        swiperSlide
    },
    data () {
        return {
            loaded: false,
            count: {},
            swiperOption: {
                direction: 'vertical',
                autoHeight: true,
                autoplay: true,
                height: window.innerWidth / 750 * 88
            },
            newFreight: [],
            progress: [],
            applyStatus: 'NOT_APPLY',
            isModalShow: false
        }
    },
    computed: {
        ...mapGetters(['avatar', 'userName', 'isAdmin', 'userId', 'currentBalance', 'balance', 'roleName', 'roleCode', 'lockStatus']),
        isHelper () {
            return this.roleCode === 'HELPER'
        },

        // applyStatus: NOT_APPLY: 未申请 , AWAIT：待审核, PASS：审核通过, REJECT：审核驳回
        isApplyBtnShow () {
            return this.roleCode === 'MEMBERSHIP' && (this.applyStatus === 'NOT_APPLY' || this.applyStatus === 'REJECT')
        },

        // 是否可查询helper申请进度
        isProgressBtnShow () {
            return this.roleCode === 'MEMBERSHIP' && (this.applyStatus === 'AWAIT' || this.applyStatus === 'REJECT')
        },

        // 是否有权限看到helper模块
        isHelperModuleShow () {
            return this.roleCode === 'ENTERPRISE_ADMIN' ||
        this.roleCode === 'ADMIN' ||
        this.roleCode === 'EMPLOYEE'
        }
    },
    created () {
        if (this.roleCode === 'VISITOR') {
            this.loaded = true
        } else {
            this.loaded = false
            this.getRecentExpressInfo()
            this.getNotice()
        }
    },
    async activated () {
        try {
            if (this.roleCode === 'VISITOR') {
                await this.$confirm({
                    message: '为了您的账号安全，请绑定手机号',
                    confirmText: '去绑定',
                    closeOnClickMask: false
                })
                setTimeout(() => {
                    this.$router.push({ name: 'BindMobile' })
                }, 1000)
            } else {
                // 下面方法在此钩子函数调用，因为返回此页面时需要刷新数据
                await Promise.all([this.orderPhysicalorderSummary(), this.getProgress()])
                this.loaded = true
            }
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        this.isModalShow = false
    },
    methods: {
        ...mapActions({
            getAuditNotice: Get_ADUIT_NOTICE
        }),

        // 获取各个状态订单数量
        async orderPhysicalorderSummary () {
            try {
                const { result } = await orderPhysicalorderSummary(this.userId)
                this.count = result
                if (result.prePayOrder && result.prePayOrder > 99) {
                    result.prePayOrder = '99+'
                }
            } catch (e) {
                throw e
            }
        },

        // 获取物流信息
        async getRecentExpressInfo () {
            try {
                const { result } = await getNewFreight()
                this.newFreight = result
            } catch (e) {
                throw e
            }
        },

        // 获取helper申请进度
        async getProgress () {
            try {
                const { result } = await getHelperApplicationProgress()
                this.applyStatus = (result && result.status) ? result.status : 'NOT_APPLY'

                // 没有申请过helper
                if (!result) return

                // 申请过helper且正在审核或驳回
                if (result.status === 'AWAIT') {
                    this.progress = [{
                        text: '正在审核认证资料；', desc: '审核时间为1-3个工作日'
                    }, {
                        text: '提交Helper认证资料；', desc: result.applyTime.replace(/-/g, '.')
                    }]
                } else if (result.status === 'REJECT') {
                    this.progress = [{
                        text: 'Helper认证资料被驳回', desc: result.auditTime.replace(/-/g, '.')
                    }, {
                        text: '正在审核认证资料；', desc: '审核时间为1-3个工作日'
                    }, {
                        text: '提交Helper认证资料；', desc: result.applyTime.replace(/-/g, '.')
                    }]
                }
            } catch (e) {
                throw e
            }
        },
        async getNotice () {
            const { result: noticeData } = await getAduitNotice()
            if (noticeData && noticeData.noticeStatus === 2) {
                if (noticeData.status === 'PASS') {
                    this.$alert({
                        message: '审核结果',
                        viceMessage: '恭喜你，helper审核已通过！',
                        confirmText: '朕知道了',
                        confirmStyle: {
                            fontWeight: 'bold'
                        }
                    })
                } else if (noticeData.status === 'REJECT') {
                    await this.$alert({
                        message: '审核结果',
                        viceMessage: `helper审核驳回${ noticeData.agentWriteBack ? `，${ noticeData.agentWriteBack }` : '' }`,
                        confirmText: '重新申请',
                        confirmStyle: {
                            color: noticeData.status === 'REJECT' ? '#D2524C' : null,
                            fontWeight: 'bold'
                        }
                    })
                    this.$router.push({ name: 'ApplyHelper' })
                }
                await updateNoticeStatus()
                this.getAuditNotice()
            }
        },
        toHelperManagementPage () {
            const PROD = 'mall.youpenglai.com'
            const DEV = 'dev.xijun.youpenglai.com'
            const QA = 'qa.xijun.youpenglai.com'
            const LOCAL = 'localhost'
            let destination
            switch (window.location.hostname) {
                case PROD:
                    destination = 'http://admall.youpenglai.com/h5/home'
                    break
                case DEV:
                    destination = 'http://192.168.130.33:8083/h5/home'
                    break
                case QA:
                    destination = 'http://192.168.130.35:8082/h5/home'
                    break
                case LOCAL:
                    destination = 'http://localhost:5000/h5/home'
                    break

        // default:
        //   break
            }
            window.location.href = destination
        }
    }
}
</script>

<style module lang="scss">
.personal-center {
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: 90px;
}
.content {
    position: relative;
    top: -24px;
    padding: 0 24px 40px;
}
.panel {
    position: relative;
    background: #fff;
    border-radius: 20px;
    margin-bottom: 24px;
    overflow: hidden;
}

/* 头部 starts */
.top {
    position: relative;
    display: flex;
    align-items: center;
    padding: 16px 32px 54px 46px;
    background-color: #f2b036;
    img {
        width: 110px;
        height: 110px;
        object-fit: cover;
        border-radius: 50%;
    }
}
.basic-info {
    flex: 1;
    padding-left: 32px;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    .main {
        font-weight: bold;
        margin-bottom: 8px;
        font-size: 42px;
        font-weight: bold;
        color: #fff;
        line-height: 58px;
        width: 500px;
        @include elps();
    }
    .sub {
        display: flex;
        align-items: center;
        line-height: 44px;
    }
    .level {
        font-size: 20px;
        font-weight: bolder;
        color: #fff;
        &:before {
            content: 'Lv';
            margin-right: 8px;
        }
    }
    .lock-status {
        display: inline-flex;
        font-size: 20px;
        font-weight: bolder;
        color: #fff;
        line-height: 28px;
        margin-left: 10px;
        background-color: #d1d1d1;
        padding: 4px 20px;
        border-radius: 22px;
    }
    .apply-btn {
        margin-left: 32px;
        margin-right: -16px;
        height: 44px;
        line-height: 44px;
    }
    .progress {
        display: flex;
        margin-left: 32px;
        overflow: hidden;
        border-radius: 10px;
        border: 1px solid #fff;
        span,
        a {
            display: inline-block;
            height: 44px;
            line-height: 44px;
            font-size: 20px;
            text-align: center;
        }
        .progress-left {
            padding: 0 10px;
            background-color: #fff;
            color: #fe7700;
        }
        .progress-right {
            display: inline-block;
            width: 120px;
            background-color: #f2b036;
            color: #fff;
        }
    }
}
.setting {
    position: absolute;
    top: 36px;
    right: 32px;
}
/* 头部 ends */

/* 小金库 starts */
.finance {
    display: flex;
    align-items: center;
    padding: 28px 28px 32px 40px;
    background-color: #fff;
    .my-right {
        width: 18px;
    }
    > div:not(.my-right) {
        flex: 1;
        display: inline-flex;
        flex-direction: column;
        color: #999;
        > p {
            &:nth-of-type(1) {
                font-size: 26px;
                margin-bottom: 8px;
            }
            &:nth-of-type(2) {
                font-size: 46px;
            }
        }
    }
}
// .withdraw-tip {
//   margin-left: 48px;
//   line-height: 44px;
//   font-weight: normal;
//   font-size: 28px;
//   color: #85A5FF;
// }
/* 小金库 ends */

/* 订单 starts */
.order-status {
    padding: 30px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    a {
        position: relative;
        font-size: 20px;
        &:nth-last-of-type(1) .badge {
            right: -14px;
        }
    }
    svg {
        height: 85px;
    }
    .badge {
        display: inline-flex;
        justify-content: center;
        position: absolute;
        top: -8px;
        right: -32px;
        width: 50px;
        height: 50px;
        line-height: 46px;
        font-size: 28px;
        text-align: center;
        transform: scale(.5);
        transform-origin: 0 0;
        color: #fff;
        // background: url("../../assets/images/my/circle.png") no-repeat center center;
        background-color: #f2b036;
        background-size: 100%;
        border-radius: 50%;
        border: 2px solid #fff;
        &.badge-after-sale {
            right: -20px;
        }
        &.oval {
            padding: 0 10px;
            width: auto;
            right: -40px;
        }
    }
    .segmentation {
        position: absolute;
        right: 130px;
        > img {
            height: 90px;
        }
    }
}

.new-logistics {
    padding: 16px 32px 24px;
    background-color: #fbfbfb;
    .swiperSlide {
        height: 146px;
    }
    .logistics-title {
        font-size: 24px;
        color: #666;
        line-height: 34px;
        margin-bottom: 16px;
    }
    .logistics-content {
        display: flex;
        flex-direction: row;
        .content-left {
            width: 88px;
            height: 88px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .content-right {
            padding-left: 24px;
            .delivery-status {
                font-size: 28px;
                font-weight: 400;
                color: #1890ff;
                line-height: 40px;
            }
            .delivery-details {
                margin-top: 14px;
                font-size: 24px;
                color: #666;
                line-height: 34px;
            }
        }
    }
}
/* 订单 ends */

/* 我的优惠券 + 我的礼品 start */
.welfare {
    display: flex;
    position: relative;
    .segmentation {
        width: 2px;
        height: 86px;
        background: rgba(238, 238, 238, 1);
        opacity: 1;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    .welfare-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        margin: 28px 20px;
        > img {
            width: 130px;
            height: 72px;
        }
        > div {
            margin-top: 20px;
            text-align: center;
            > h5 {
                height: 44px;
                font-size: 24px;
                line-height: 44px;
                color: #333;
            }
            > span {
                height: 34px;
                font-size: 24px;
                font-weight: 400;
                line-height: 34px;
                color: #999;
                opacity: 1;
            }
        }
    }
}

/* 我的优惠券 + 我的礼品 end */
/* helper starts */
.helper {
    padding: 32px 25px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    > svg {
        height: 114px;
    }
}
/* helper ends */

/* tip starts */
.tip {
    display: flex;
    align-items: center;
    padding: 0 30px;
    height: 88px;
    line-height: 56px;
    font-size: 26px;
    color: #98832e;
    background-color: #fcf0de;
}
.tip-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #98832e;
    margin-right: 20px;
}
/* tip ends */

.recommend {
    margin-top: 32px;
    padding: 0 !important;
}

.progress-modal {
    box-sizing: border-box;
    padding-top: 40px;
    height: 600px;
}

// .audit-results {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background:rgba(0,0,0,0.65);
//   z-index: 111;
//   .share-bg {
//     width:490px;
//     display: flex;
//     flex-direction: column;
//     background:rgba(255, 255, 255, 1);
//     opacity:1;
//     border-radius: 20px;
//     margin: 220px auto;
//     > div {
//       display: inline-flex;
//       justify-content: center;
//     }
//     .title {
//       margin-top: 50px;
//       font-size: 32px;
//       font-weight: 600;
//       line-height: 44px;
//       color: #333333;
//     }
//     .content {
//       margin-top: 50px;
//       font-size: 28px;
//       font-weight: 400;
//       line-height: 40px;
//       color: #999999;
//     }
//     .button {
//       height: 88px;
//       align-items: center;
//       border-top: 1px solid #E7E7E7;
//       font-size: 32px;
//       font-weight: 500;
//       line-height: 44px;
//       color: #1890FF;
//     }
//   }
// }

/* skeleton start */
.skeleton {
    position: relative;
    top: -24px;
    padding: 0 24px 40px;
}
.skeleton1,
.skeleton2 {
    padding: 32px 25px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item-small {
        height: 95px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
        .text {
            width: 70px;
            height: 30px;
        }
    }
    .item-large {
        height: 114px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
        }
        .text {
            width: 99px;
            height: 30px;
        }
    }
}
.skeleton3 {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    .text {
        width: 182px;
        height: 42px;
    }
}
.skeleton4 {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    .item {
        margin-bottom: 22px;
        background-color: #fff;
        border-radius: 20px;
        width: 332px;
        overflow: hidden;
    }
    .item-image {
        height: 332px;
        width: 332px;
        object-fit: cover;
    }
    .item-content {
        padding: 16px 14px 20px;
    }
    .main {
        width: 90%;
        height: 25px;
    }
    .sub {
        margin-top: 20px;
        width: 60%;
        height: 25px;
    }
    .text {
        margin-top: 16px;
        width: 30%;
        height: 25px;
    }
}
.wait-pay {
    display: flex;
    align-items: center;
    width: max-content;
    margin: 54px auto 32px;
    padding: 0 32px;
    line-height: 64px;
    font-size: 26px;
    color: #fff;
    background-color: #f86156;
    box-shadow: 0 10px 20px rgba(0, 0, 0, .16);
    border-radius: 32px;
    > svg {
        vertical-align: -4px;
    }
    > i {
        display: inline-block;
        width: 42px;
        height: 42px;
        margin: 0 15px 0 32px;
        text-align: center;
        line-height: 42px;
        font-size: 20px;
        color: #dc3b3b;
        font-weight: bold;
        background-color: #fff;
        border-radius: 50%;
    }
}
.skeAnimation {
    @include skeAnimation(#eee);
}
/* skeleton end */

</style>
