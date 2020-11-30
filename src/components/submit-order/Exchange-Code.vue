<template>
    <div>
        <div
            :class="$style.itemSelector"
            @click.capture="exchangeCode.isDefault ? '' : showExchangeCode = true"
        >
            <span :class="$style.label">兑换码</span>
            <span :class="$style.content">
                {{ !exchangeCode.id ? '不使用兑换码' : localSeparator(exchangeCode.exchangeCode, ' ', 4) }}
                <!--有默认兑换码信息时，不支持选择其他兑换码-->
                <pl-svg v-if="!exchangeCode.isDefault" name="icon-right" fill="#ccc" height="24" />
            </span>
        </div>
        <pl-popup
            :show.sync="showExchangeCode"
            title="选择兑换码"
            title-align="left"
        >
            <div :class="$style.exchangeCode">
                <p class="fz-28 gray-3">使用兑换码，免费学习</p>
                <div :class="$style.exchangeCodeList">
                    <template v-for="(item, i) of exchangeCodeList">
                        <div :key="i" :class="$style.exchangeCodeItem" @click="exchangeCodeClick(item)">
                            <div :class="$style.info">
                                <span :class="$style.name">{{ item.name }}</span>
                                <span :class="$style.timeDesc">{{ item.timeDesc }}</span>
                                <!--兑换码列表是按照结束时间排序的，推荐第一个时间最早的兑换码-->
                                <span v-if="!i" :class="$style.recommend">推荐</span>
                                <span :class="$style.choices">
                                    <pl-svg v-if="item.id === exchangeCode.id" name="icon-xuanzhong" width="40" />
                                    <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                                </span>
                            </div>
                            <div :class="$style.code">兑换码{{ item.exchangeCode | separator(' ', 4) }}</div>
                        </div>
                    </template>
                    <div :class="[$style.exchangeCodeItem, $style.notChoose]" @click="exchangeCodeClick({})">
                        <span :class="$style.notChooseExchangeCode">不使用兑换码</span>
                        <span :class="$style.choices">
                            <pl-svg v-if="!exchangeCode.id" name="icon-xuanzhong" width="40" />
                            <pl-svg v-else name="icon-weixuanzhong1" width="40" />
                        </span>
                    </div>
                </div>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import filter from '../../filter'
export default {
    name: 'SubmitOrderExchangeCode',
    data () {
        return {
            showExchangeCode: false,
            localSeparator: filter.separator
        }
    },
    props: {
        // 当前选择的兑换码
        exchangeCode: {
            type: Object,
            default () {
                return {
                }
            }
        },
        // 兑换码列表
        exchangeCodeList: {
            type: Array,
            default () {
                return []
            }
        }
    },
    methods: {
        // 选择兑换码, 选择完成后，重新计算价格
        async exchangeCodeClick (item) {
            this.$emit('change', item)
            this.showExchangeCode = false
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
      margin-top: 48px;
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
          margin-bottom: 54px;
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
