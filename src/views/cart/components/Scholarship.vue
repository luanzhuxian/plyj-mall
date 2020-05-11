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
export default {
    name: 'SubmitOrderScholarship',
    data () {
        return {
            showRedEnvelopePopup: false
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
        },
        currentRedEnvelope: {
            type: Object,
            default () {
                return {}
            }
        },
        redEnvelopeList: {
            type: Array,
            default () {
                return []
            }
        }
    },
    watch: {
        // 监听优惠券的修改
        currentCoupon (coupon) {
            // 设置奖学金，虽然此时奖学金也发生了改变，但是切忌触发change事件
            // 因为一旦触发change事件，就会导致多请求一次数据
            // 所以这里仅仅只需要默默的修改当前选中的奖学金，更新数据在外部优惠券组件的change事件中完成
            if (coupon.scholarship === 0) {
                this.$emit('update:currentRedEnvelope', {})
            } else {
                coupon.scholarship = 1
                this.$emit('update:currentRedEnvelope', this.redEnvelopeList[0] || {})
            }
        }
    },
    methods: {
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
