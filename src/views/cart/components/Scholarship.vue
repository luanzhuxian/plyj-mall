<template>
    <div>
        <div
            v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && redEnvelopeList.length && activeProduct === 1 && currentCoupon.scholarship !== 0"
            :class="$style.itemSelector"
            @click.capture="showRedEnvelopePopup = true"
        >
            <pl-fields
                size="middle"
                text="奖学金（红包）"
                icon="icon-RedEnvelope"
                :icon-gap="12"
                show-right-icon
                :right-text="!currentRedEnvelope.id ? '有可用' : '-¥' + currentRedEnvelope.amount"
                left-text-weight="bold"
            />
        </div>
        <pl-popup
            :show.sync="showRedEnvelopePopup"
            title="奖学金（红包）"
            title-align="left"
        >
            <div :class="$style.redEnvelope">
                <p class="fz-28 gray-3">仅支持选择一个奖学金进行抵扣</p>
                <div :class="$style.redEnvelopeList">
                    <template v-for="(item, i) of redEnvelopeList">
                        <div :key="i" :class="$style.redEnvelopeItem" @click="redEnvelopeClick(item, false)">
                            <span>
                                <pl-svg name="icon-RedEnvelope" width="40" />
                            </span>
                            <span :class="$style.count">￥{{ item.amount }}</span>
                            <span v-if="item.amount > (totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0))" :class="$style.isOver">使用后超出抵用金额不返还</span>
                            <span :class="$style.choices">
                                <pl-svg v-if="item.id === currentRedEnvelope.id" name="icon-xuanzhong" width="40" />
                                <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                            </span>
                        </div>
                    </template>
                    <div :class="$style.redEnvelopeItem" @click="redEnvelopeClick({}, true)">
                        <span :class="$style.notChooseRedEnvelope">不使用</span>
                        <span :class="$style.choices">
                            <pl-svg v-if="!currentRedEnvelope.id" name="icon-xuanzhong" width="40" />
                            <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                        </span>
                    </div>
                </div>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import { getRedEnvelopeListByPrice } from '../../../apis/my-coupon'
import moment from 'moment'
export default {
    name: 'SubmitOrderScholarship',
    data () {
        return {
            currentRedEnvelope: {},
            redEnvelopeList: [],
            showRedEnvelopePopup: false
        }
    },
    async mounted () {
        try {
            await this.getRedEnvelopeList()
        } catch (e) {
            throw e
        }
    },
    props: {
        activeProduct: {
            type: Number,
            default: 1
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        freight: {
            type: Number,
            default: 0
        },
        // 当前选择的优惠券
        currentCoupon: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    watch: {
        currentCoupon (coupon) {
            // 设置奖学金
            if (coupon.scholarship === 0) {
                this.currentRedEnvelope = {}
            } else {
                coupon.scholarship = 1
                this.currentRedEnvelope = this.redEnvelopeList[0] || {}
            }
        },
        currentRedEnvelope (newVal, oldVal) {
            if (newVal.id !== oldVal.id) {
                this.$emit('change', JSON.parse(JSON.stringify(newVal)))
            }
        }
    },
    methods: {
        // 获取红包列表，必须放置于获取优惠券之后
        async getRedEnvelopeList () {
            const CONFIRM_LIST = JSON.parse(sessionStorage.getItem('CONFIRM_LIST'))
            // 只有普通商品支持使用红包
            if (this.activeProduct !== 1) return
            const amount = CONFIRM_LIST.map(item => item.price * item.count).reduce((total, price) => total + price)
            try {
                const { result } = await getRedEnvelopeListByPrice(amount)
                const { serverTime } = this
                this.redEnvelopeList = result.map(item => {
                    const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
                    const day = Math.floor(moment.duration(duration).asDays())
                    item.timeDesc = ''
                    if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                    return item
                })
            } catch (e) {
                throw e
            }
        },
        // 选择红包
        async redEnvelopeClick (item) {
            this.currentRedEnvelope = item
        }
    }
}
</script>

<style module lang="scss">
    .item-selector {
        margin-bottom: 20px;
        padding-left: 24px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
    }
    .red-envelope {
        padding: 0 24px;
        >.red-envelope-list {
            margin-top: 20px;
            padding-bottom: 40px;
            .red-envelope-item {
                height: 60px;
                line-height: 60px;
                position: relative;

                .count {
                    margin-left: 24px;
                    font-size:32px;
                    color:#373737;
                }
                .is-over {
                    margin-left: 20px;
                    font-size:24px;
                    color:#999999;
                }
                .choices {
                    line-height: 0;
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .not-choose-red-envelope {
                    font-size:28px;
                    line-height: 72px;
                    color:#C1C1C1;
                }
            }
            svg {
                vertical-align: text-bottom;
            }
        }
    }
</style>
