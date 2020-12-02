<template>
    <div>
        <div
            :class="$style.itemSelector"
            @click.capture="showExchangeCode = true"
        >
            <span :class="$style.label">兑换码</span>
            <span :class="$style.content">
                {{ !codeInfo ? '不使用兑换码' : localSeparator(codeInfo.exchangeCode, ' ', 4) }}
                <!--有默认兑换码信息时，不支持选择其他兑换码-->
                <pl-svg v-if="!codeInfo" name="icon-right" fill="#ccc" height="24" />
            </span>
        </div>
        <pl-popup
            :show.sync="showExchangeCode"
            title="选择兑换码"
            title-align="left"
        >
            <div :class="$style.exchangeCode">
                <p class="fz-28 gray-3">使用兑换码，免费学习</p>
                <pl-radio-group :class="$style.exchangeCodeList" v-model="code">
                    <pl-radio
                        v-for="(item, i) of exchangeCodeList"
                        :label="item.id"
                        :key="i"
                        position="right"
                    >
                        <div :class="$style.exchangeCodeItem">
                            <div :class="$style.info">
                                <span :class="$style.name">{{ item.name }}</span>
                                <span :class="$style.timeDesc">{{ item.timeDesc }}</span>
                                <!--兑换码列表是按照结束时间排序的，推荐第一个时间最早的兑换码-->
                                <span v-if="!i" :class="$style.recommend">推荐</span>
                            </div>
                            <div :class="$style.code">兑换码{{ item.exchangeCode | separator(' ', 4) }}</div>
                        </div>
                    </pl-radio>
                    <pl-radio
                        :label="''"
                        :key="100"
                    >
                        <span :class="$style.notChooseExchangeCode">不使用兑换码</span>
                    </pl-radio>
                </pl-radio-group>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import filter from '../../filter'
import { mapGetters } from 'vuex'
export default {
    name: 'SubmitOrderExchangeCode',
    data () {
        return {
            showExchangeCode: false,
            localSeparator: filter.separator,
            code: '',
            codeInfo: null
        }
    },
    props: {
        // 兑换码列表
        exchangeCodeList: {
            type: Array,
            default () {
                return []
            }
        },
        products: {
            type: Array,
            default () {
                return []
            }
        },
        productId: {
            type: String,
            default: ''
        }
    },
    watch: {
        code (val) {
            const codeInfo = this.exchangeCodeList.find(item => item.id === val) || null
            this.$emit('change', codeInfo)
            this.codeInfo = codeInfo
            this.$store.commit('submitOrder/setCurExchangeCode', codeInfo ? {
                productId: this.productId,
                id: codeInfo.id,
                exchangeCode: codeInfo.exchangeCode,
                startTime: codeInfo.startTime,
                endTime: codeInfo.endTime,
                name: codeInfo.name
            } : null)
        }
    },
    computed: {
        ...mapGetters('submitOrder', ['exchangeCodeInfo'])
    },
    mounted () {
        if (this.exchangeCodeInfo) {
            this.code = this.exchangeCodeInfo.id || ''
        }
    }
}
</script>

<style module lang="scss">
  .item-selector {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    line-height: 50px;
    font-size: 24px;
    background-color: #fff;
    .label {
      color: #333;
    }
  }
  .exchangeCode {
    padding: 0 24px;
    > .exchangeCode-list {
      margin-top: 24px;
      padding-bottom: 40px;

      .exchangeCode-item {
        overflow: hidden;
        font-size:24px;
        .info {
          position: relative;
          .name {
            display: inline-block;
            padding: 0 18px;
            border:2px solid #F2B036;
            border-radius:8px;
            line-height:66px;
            font-size:26px;
            color: #F2B036;
          }
          .time-desc {
            display: inline-block;
            margin-left: 20px;
            color: #858585;
          }
          .recommend {
            color:#FF0000;
            margin-left: 20px;
          }
        }
        .code {
          margin-top: 12px;
          font-size:26px;
          line-height:34px;
          color:#373737;
        }
        &.not-choose {
          position: relative;
          line-height: 72px;
        }
        .not-choose-exchangeCode{
          font-size:28px;
          line-height: 72px;
          color:#C1C1C1;
        }
        .choices {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          >svg {
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
