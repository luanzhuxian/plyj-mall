<template>
    <div>
        <!-- v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && redEnvelopeList.length && isScholarship" -->
        <div
            v-if="redEnvelopeList.length && isScholarship"
            :class="$style.itemSelector"
            @click.capture="showRedEnvelopePopup = true"
        >
            <pl-fields
                size="middle"
                :right-text="!currentRedEnvelope ? '有可用' : '-¥' + currentRedEnvelope.amount"
            >
                <div>
                    <pl-svg class="mr-10" name="icon-RedEnvelope" width="40" :vertical-align="-8" />
                    <span>奖学金（红包）</span>
                </div>
            </pl-fields>
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
                        <div :key="i" :class="$style.redEnvelopeItem" @click="redEnvelopeClick(item)">
                            <span>
                                <pl-svg name="icon-RedEnvelope" width="40" />
                            </span>
                            <span :class="$style.count">￥{{ item.amount }}</span>
                            <span v-if="item.amount > totalAmount" :class="$style.isOver">使用后超出抵用金额不返还</span>
                            <span :class="$style.choices">
                                <pl-svg v-if="currentRedEnvelope && item.id === currentRedEnvelope.id" name="icon-xuanzhong" width="40" />
                                <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                            </span>
                        </div>
                    </template>
                    <div :class="$style.redEnvelopeItem" @click="redEnvelopeClick(null)">
                        <span :class="$style.notChooseRedEnvelope">不使用</span>
                        <span :class="$style.choices">
                            <pl-svg v-if="!currentRedEnvelope" name="icon-xuanzhong" width="40" />
                            <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                        </span>
                    </div>
                </div>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import { getRedEnvelopeListByPrice } from '../../apis/my-coupon'
import moment from 'moment'
import { getServerTime } from '../../apis/base-api'

export default {
    name: 'SubmitOrderScholarship',
    data () {
        return {
            showRedEnvelopePopup: false,
            redEnvelopeList: []
        }
    },
    props: {
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
                return {
                    redPacket: null,
                    coupon: null
                }
            }
        },
        currentRedEnvelope: {
            type: Object,
            default () {
                return null
            }
        },
        products: {
            type: Array,
            default () {
                return []
            }
        },
        // 兑换码信息
        exchangeCodeInfo: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    computed: {
        isScholarship () {
            const { coupon, redPacket } = this.currentCoupon
            return (coupon ? coupon.scholarship : true) && (redPacket ? redPacket.scholarship : true)
        }
    },
    watch: {
        exchangeCodeInfo (val) {
            if (val) {
                this.$emit('update:currentRedEnvelope', null)
            }
        },
        isScholarship: {
            handler (val) {
                // 设置奖学金，虽然此时奖学金也发生了改变，但是切忌触发change事件
                // 因为一旦触发change事件，就会导致多请求一次数据
                // 所以这里仅仅只需要默默的修改当前选中的奖学金，更新数据在外部优惠券组件的change事件中完成
                if (!val) {
                    this.$emit('update:currentRedEnvelope', null)
                }
            }
        },
        // 优惠券修改时，对奖学金做出相应调整
        currentCoupon () {}
    },
    async mounted () {
        await this.getList()
    },
    methods: {
        async getList () {
            // 获取服务器时间
            const { result: serverTime } = await getServerTime()
            const { result } = await getRedEnvelopeListByPrice()
            this.redEnvelopeList = result.map(item => {
                const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
                const day = Math.floor(moment.duration(duration).asDays())
                item.timeDesc = ''
                if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                return item
            })
        },
        // 选择红包
        async redEnvelopeClick (item) {
            this.$emit('update:currentRedEnvelope', item)
            this.$emit('change', item)
            this.showRedEnvelopePopup = false
        }
    }
}
</script>

<style module lang="scss">
    .item-selector {
        margin-bottom: 20px;
        padding: 0 24px;
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
