<template>
    <div
        :class="{
            [$style.item]: true,
            [$style.icon]: true,
            [$style.isSingleCourse]: productType === 2,
            [$style.isSeriesCourse]: productType === 3
        }"
        @click="goDetail"
    >
        <img :class="$style.coverImg" v-imgError :src="coverImg" alt="">
        <div :class="$style.desc">
            <div :class="$style.title">{{ productName }}</div>
            <div :class="$style.lecturer" v-if="lecturerName">
                主讲人： {{ lecturerName }}
            </div>
            <div :class="$style.bottom">
                <span :class="$style.price">
                    <b v-if="sellingPrice">{{ Number((sellingPrice / 100).toFixed(2)) }}</b>
                    <span v-else>免费</span>
                    <div>
                        <del :class="$style.del" v-if="originPrice && sellingPrice !== originPrice">{{ Number((originPrice / 100).toFixed(2)) }}</del>
                    </div>
                </span>
                <button v-if="exhcangeStatus === 1" :class="[$style.btn, $style.usedBtn]">已购买</button>
                <button v-else-if="exhcangeStatus === 2" :class="[$style.btn, $style.usedBtn]">已兑换</button>
                <button v-else-if="exhcangeStatus === 5" :class="[$style.btn, $style.usedBtn]">已赠课</button>
                <button v-else-if="exhcangeStatus === 3" :class="[$style.btn, $style.disabledBtn]">未开售</button>
                <button v-else-if="isMaxLimit || isExpired" :class="[$style.btn, $style.disabledBtn]">不可兑换</button>
                <button v-else :class="$style.btn" @click.stop="receive">立即兑换</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductItem',
    props: {
        // 商品Id
        id: {
            type: String,
            default: ''
        },
        // 商品类型 1商品  2 单课 3 系列课
        productType: {
            type: Number,
            default: 1
        },
        // 课程图片
        coverImg: {
            type: String,
            default: ''
        },
        // 课程名称
        productName: {
            type: String,
            default: ''
        },
        // 主讲人
        lecturerName: {
            type: String,
            default: ''
        },
        // 售价
        sellingPrice: {
            type: [Number, String],
            default: 0
        },
        // 原价
        originPrice: {
            type: [Number, String],
            default: 0
        },
        // 兑换状态 : 1-已购买 2-已兑换 3-未开售 4-立即兑换 5-已赠课
        exhcangeStatus: {
            type: Number,
            default: 1
        },
        // 兑换码已达到最大兑换次数
        isMaxLimit: {
            type: Boolean,
            default: false
        },
        // 兑换码是否已过期
        isExpired: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        goDetail () {
            // 单课+系列课
            this.$router.push({ name: 'Curriculum', params: { productId: this.id } })
        },
        receive () {
            this.$emit('receive', this.id)
        }
    }
}
</script>

<style module lang="scss">
  .item {
    display: flex;
    margin-bottom: 16px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #FFF;
  }

  .icon {
    position: relative;
    &.isSingleCourse:before {
      content: '单课';
    }

    &.isSeriesCourse:before {
      content: '系列课';
    }
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width:100px;
      border-radius:20px 0px 20px 0px;
      background-color:#F2B036;
      line-height:42px;
      text-align: center;
      font-size:24px;
      color: #fff;
    }
  }

  .coverImg {
    width: 280px;
    height: 186px;
    object-fit: cover;
    vertical-align: middle;
  }

  .desc {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    margin-left: 24px;

    .title {
      width: calc(100vw - 280px - 96px - 10px);
      font-size:28px;
      color:#373737;
      @include elps();
    }

    .lecturer {
      width: calc(100vw - 280px - 96px - 10px);
      @include elps();
      font-size:22px;
      color:#666;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      padding-right: 24px;
      .price {
        max-width: 200px;
        > b {
          font-size:32px;
          color: #FE7700;
          &:before {
            content: '￥';
            font-size:20px;
            font-weight:normal;
          }
        }
        > span {
          font-size:32px;
          color: #FE7700;
        }
        .del {
          margin-left: 6px;
          font-size:20px;
          color: #999;
          &:before {
            content: '￥';
            font-size:20px;
          }
        }
      }
      .btn {
        height: 48px;
        min-width: 124px;
        border-radius:8px;
        padding: 0 10px;
        line-height: 48px;
        font-size:26px;
        background-color:#FE7700;
        color:#FFF;
        &.usedBtn{
          background-color: #F2B036;
        }
        &.disabledBtn{
          opacity:0.48;
        }
      }
    }
  }
</style>
