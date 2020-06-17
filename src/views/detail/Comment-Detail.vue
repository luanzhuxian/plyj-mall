<template>
    <div :class="$style.commentDetail" v-if="detail">
        <div :class="$style.top">
            <img v-imgError :src="detail.headUrl" alt="">
            <div :class="$style.topRight">
                <div :class="$style.nickname" v-text="detail.nickName" />
                <div class="fz-24">
                    评分 <Grade class="ml-10" size="mini" :grade="detail.goodsScore" />
                </div>
            </div>
        </div>
        <p :class="$style.time" v-text="detail.createTimeText" />
        <div :class="$style.content">
            <div :class="$style.text" v-text="detail.content" />
            <div :class="$style.imgs">
                <img v-imgError v-for="(item, i) of detail.url" :key="i" :src="item" v-imger:comment alt="">
            </div>
            <div :class="$style.reply" v-if="detail.child.length">
                <span>商家回复：</span>
                {{ detail.child[0].content }}
            </div>
        </div>

        <div :class="$style.product">
            <div :class="$style.sku">
                {{ detail.attribute }} “{{ detail.skuCode1Name }}”
                <template v-if="detail.skuCode2Name">
                    ，{{ detail.subAttribute }} “{{ detail.skuCode2Name }}”
                </template>
            </div>
            <div :class="$style.detail">
                <img v-imgError v-img-error :src="detail.productImg" alt="">
                <div>
                    <p :class="$style.name" v-text="detail.productName" />
                    <p :class="$style.price">{{ detail.productPrice || 0 | formatAmount }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Grade from '../../components/common/Grade.vue'
export default {
    name: 'CommentDetail',
    components: {
        Grade
    },
    data () {
        return {
            detail: null
        }
    },
    activated () {
        this.getDetail()
    },
    deactivated () {
        sessionStorage.removeItem('comment')
    },
    methods: {
        getDetail () {
            const detail = JSON.parse(sessionStorage.getItem('comment'))
            if (detail) {
                this.detail = detail
            } else {
                this.$router.replace({ name: 'Home' })
            }
        }
    }
}
</script>

<style module lang="scss">
  .commentDetail {
    padding: 30px;
    background-color: #fff;
  }
  .top {
    display: flex;
    > img {
      width: 80px;
      height: 80px;
      margin-right: 24px;
      border-radius: 40px;
      object-fit: cover;
    }
  }
  .nickname {
    margin-bottom: 8px;
    font-size: 28px;
    color: #446889;
  }
  .time {
    margin-top: 32px;
    font-size: 24px;
    color: #999999;
  }
  .content {
    margin-top: 24px;
    border-bottom: 1px solid #e7e7e7;
  }
  .text {
    font-size: 28px;
  }
  .imgs {
    margin-top: 16px;
    > img {
      width: 100%;
      margin-bottom: 24px;
    }
  }
  .reply {
    margin-bottom: 24px;
    padding: 20px;
    background-color: #F8F8F8;
    font-size: 24px;
    line-height: 34px;
    word-break: break-all;
  }
  .product {
    margin-top: 24px;
  }
  .sku {
    font-size: 24px;
    color: #999;
  }
  .detail {
    display: flex;
    margin-top: 20px;
    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px 0;
    }
    > img {
      width: 164px;
      height: 164px;
      margin-right: 18px;
      border-radius: 10px;
    }
    .name {
      font-size: 24px;
      color: #000;
    }
    .price {
      font-size: 40px;
      color: #FE7700;
      &:before {
        content: '¥';
        font-size: 28px;
        color: #FE7700;
      }
    }
  }
</style>
