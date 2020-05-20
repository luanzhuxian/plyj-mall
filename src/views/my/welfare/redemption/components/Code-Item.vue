<template>
    <div>
        <div :class="$style.item">
            <div :class="[$style.content, showInstruction? $style.noBottomBorder:'', isUsed || isExpired ? $style.unavailable: '']">
                <div :class="$style.left">
                    <div :class="$style.title" v-text="name" />
                    <div :class="[$style.textWhite, $style.mtMb20]">
                        支持兑换{{ productTotal }}款商品
                    </div>
                    <div :class="$style.textWhite">
                        有效期:{{ startTime | dateFormat('YYYY.MM.DD') }}-{{ endTime | dateFormat('YYYY.MM.DD') }}
                    </div>
                </div>
                <div :class="$style.right">
                    <div :class="$style.button" @click.stop="clickHandler" v-text="buttonText" />
                    <div :class="[$style.textWhite, $style.mtMb20]">
                        已使用{{ useTotal }}/{{ total }}个
                    </div>
                    <div v-if="showInstructionControl" :class="[$style.textWhite, $style.instruction]" @click.stop="showInstruction = !showInstruction">
                        使用说明
                        <pl-svg
                            :class="{ [$style.instructionControl]: showInstruction }"
                            name="icon-arrow-down"
                            fill="#FFF"
                            width="10"
                        />
                    </div>
                </div>
            </div>
            <!-- 使用说明 -->
            <transition name="fade">
                <div v-if="showInstruction" :class="$style.instructionContent">
                    <!-- 分隔线 -->
                    <div :class="$style.lineBetween" />
                    <div :class="$style.instructionInfo" v-text="instruction" />
                </div>
            </transition>
            <!--已使用戳-->
            <img v-if="isUsed" :class="$style.stamp" src="https://mallcdn.youpenglai.com/static/mall/icons/olds/burse (1).png" alt="">
            <!--已过期戳-->
            <img v-else-if="isExpired" :class="$style.stamp" src="https://mallcdn.youpenglai.com/static/mall/icons/olds/burse.png" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name: 'CodeItem',
    props: {
        // 兑换券id
        id: {
            type: String,
            default: ''
        },
        // 兑换券名称
        name: {
            type: String,
            default: ''
        },
        // 可兑换的商品总数
        productTotal: {
            type: Number,
            default: 0
        },
        // 当前兑换券已兑换次数
        useTotal: {
            type: Number,
            default: 0
        },
        // 当前兑换券可兑换的总次数
        total: {
            type: Number,
            default: 0
        },
        // 使用开始时间
        startTime: {
            type: String,
            default: ''
        },
        // 使用结束时间
        endTime: {
            type: String,
            default: ''
        },
        // 服务器当前时间
        currentTime: {
            type: String,
            default: ''
        },
        // 使用说明
        instruction: {
            type: String,
            default: '去使用'
        },
        // 是否已使用
        isUsed: {
            type: Boolean,
            default: false
        },
        // 是否已过期
        isExpired: {
            type: Boolean,
            default: false
        },
        // 按钮文案
        buttonText: {
            type: String,
            default: '去使用'
        },
        // 是否显示 使用说明 控制按钮，默认显示
        showInstructionControl: {
            type: Boolean,
            default: true
        },
        // 是否默认展开使用说明
        isShowInstruction: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            // 是否显示使用说明
            showInstruction: false
        }
    },
    created () {
        this.showInstruction = this.isShowInstruction
    },
    methods: {
        clickHandler () {
            this.$emit('codeItemClick', this.id)
        }
    }
}
</script>

<style  module lang="scss">
  .text-white{
    font-size:20px;
    color: #FFF;
  }
  .mt-mb-20 {
    margin: 12px 0;
  }
  .unavailable {
    opacity: 0.6;
  }
  .item {
    position: relative;
    margin-top: 28px;
    overflow: hidden;
    .content {
      display: flex;
      border-radius:20px;
      padding: 0 34px;
      background:linear-gradient(196deg,rgba(248,187,75,1) 0%,rgba(254,154,67,1) 76%,rgba(254,154,67,1) 100%);
      transition: borderRadius .1s linear;
      &.noBottomBorder{
        border-radius: 20px 20px 0 0;
      }
      .left {
        flex: 1;
        padding: 38px 0;
        border-right: 1px #FFF dashed;
        .title{
          font-size:36px;
          font-weight:bold;
          color: #FFF;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        min-width: 214px;
        padding: 38px 0 38px 42px;
        > div {
          text-align: center;
        }
        .button {
          border-radius:40px;
          padding: 0 24px;
          line-height:42px;
          flex-wrap: nowrap;
          font-size:28px;
          background-color: #FFF;;
          color: #F8BB4B;
        }
        .instruction{
          > svg {
            width: 18px;
            line-height: 18px;
            vertical-align: middle;
            transform: rotate(0);
            transition: transform .2s linear;
            &.instructionControl {
              transform: rotate(-180deg);
            }
          }
        }
      }
    }
  }
  .stamp {
    position: absolute;
    top: -30px;
    right: 280px;
    z-index: 1;
    width: 160px;
  }
  .instructionContent {
    position: relative;
    padding: 0 34px;
    background-color: #FFF;
    min-height: 120px;
    .line-between {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0px;
      height: 0;
      z-index: 2;

      &:after {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 100%;
        height: 20px;
        background: radial-gradient(circle, #FFF 50%, transparent 50%) center center;
        background-size: 20px 22px;
      }
    }
    .instructionInfo {
      padding-top: 22px;
      line-height:32px;
      font-size:20px;
      color: #727272;
    }
  }

</style>
