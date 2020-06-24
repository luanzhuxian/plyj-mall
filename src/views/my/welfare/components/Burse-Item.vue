<template>
    <div :class="$style.burseItem">
        <div :class="$style.content">
            <div :class="$style.edit" @click="check">
                <div :class="$style.btn">
                    <span v-if="isEdit" :class="{[$style.checked]: isEdit && item.checked}" />
                </div>
                <div :class="$style.img">
                    <img src="https://mallcdn.youpenglai.com/static/admall/2.11.0/red-envelope.png" alt="">
                </div>
            </div>
            <div :class="$style.desc">
                <div :class="$style.title">
                    <span :class="$style.name">{{ burseStatus[item.activityType] }}</span>
                    <span :class="$style.price">{{ item.amount }}</span>
                </div>
                <div>全场商品通用，暂不支持知识课程</div>
                <div>{{ item.useStartTime }} 领取</div>
            </div>
        </div>
        <div :class="$style.amount">
            <div :class="$style.btn"><span v-if="!isWatch" @click.stop="$router.push({name:'MyBurseDetail',params:{id:item.id}})">去查看</span></div>
        </div>
        <!--已使用，已过期图标-->
        <template v-if="hasStatusImg">
            <img v-if="useStatus === 2" src="https://mallcdn.youpenglai.com/static/mall/icons/olds/burse (1).png" style="width: 24.8vw" alt="">
            <img v-if="useStatus === 3" src="https://mallcdn.youpenglai.com/static/mall/icons/olds/burse.png" style="width: 24.8vw" alt="">
        </template>
    </div>
</template>

<script>
export default {
    name: 'BurseItem',
    props: {
        isWatch: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default () {
                return {}
            }
        },

        // 是否显示已使用，已过期图标
        hasStatusImg: {
            type: Boolean,
            default: false
        },

        // 使用状态  0：待领取；1：待使用； 2：已使用； 3：已过期 ； 4：已失效； 5：已删除  ;
        useStatus: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            burseStatus: {
                GROUPBUGACTIVITY: '团购奖学金',
                LUCK_DRAW_ACTIVITY: '抽奖奖学金',
                SIGNIN_ACTIVITY: '签到奖学金',
                NEWCOMER: '新人奖学金'
            }
        }
    },
    methods: {
        check () {
            if (this.isEdit) {
                this.item.checked = !this.item.checked
                this.$emit('select')
            }
        }
    }
}
</script>

<style module lang="scss" scoped>
  .burse-item {
    display: flex;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    background: #FFFFFF;
    padding: 46px 26px;
    border-radius: 20px;
    margin-top: 20px;
    > .content {
      display: flex;
      justify-content: flex-start;
      > .edit {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > .img {
            width: 115px;
            > img {
              width: 86px;
              vertical-align: middle;
            }
        }
        > .btn > span {
          display: inline-block;
          width: 36px;
          height: 36px;
          position: relative;
          top: 6px;
          border-radius: 18px;
          border: 2px solid #ccc;
          box-sizing: border-box;
          &.checked {
            position: relative;
            background-color: #F2B036;
            border: none;
            &:before {
              position: absolute;
              top: 20px;
              left: 7px;
              content: '';
              width: 10px;
              height: 3px;
              transform: rotate(45deg);
              background-color: #fff;
              border-radius: 2px;
            }
            &:after {
              position: absolute;
              top: 18px;
              left: 12px;
              content: '';
              width: 20px;
              height: 3px;
              transform: rotate(-45deg);
              background-color: #fff;
              border-radius: 2px;
            }
          }
          &.disabled {
            background-color: #ddd;
          }
        }
      }
      > .desc {
        color: #AAAAAA;
        font-size: 24px;
        font-weight: 300;
        white-space: nowrap;
        > div {
          margin-top: 10px;
          &.title {
            font-size: 30px;
            font-weight: 400;
            color: #373737;
            margin-top: 0;
            > .price {
              margin-left: 20px;
              font-weight: bold;
              color: #FF4622;
              &:before {
                display: inline-block;
                content: '￥';
                font-weight: 400;
              }
            }
          }
        }
      }
    }
    > .amount {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-content: flex-end;
      width: auto;
      > .btn {
        width: 122px;
        height: 34px;
        margin-top: 6px;
        text-align: right;
        > span {
          font-size:20px;
          display: inline-block;
          width: 122px;
          border-radius: 20px;
          text-align: center;
          color: #FFFFFF;
          line-height: 34px;
          background:#FE7700;
        }
      }

    }
    > img {
      position: absolute;
      top: -50px;
      right: 124px;
      transform: rotate(-35deg);
    }
  }
</style>
