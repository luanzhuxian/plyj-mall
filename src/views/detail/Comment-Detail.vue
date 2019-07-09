<template>
  <div :class="$style.commentDetail" v-if="detail">
    <div :class="$style.top">
      <img :src="detail.headUrl" alt="">
      <div :class="$style.topRight">
        <div :class="$style.nickname" v-text="detail.nickName" />
        <div class="fz-24">
          评分 <Grade class="ml-10" size="mini" :grade="detail.goodsScore" />
        </div>
      </div>
    </div>
    <p :class="$style.time" v-text="detail.createTime" />
    <div :class="$style.content">
      <div :class="$style.text" v-text="detail.content" />
      <div :class="$style.imgs">
        <img v-for="(item, i) of detail.mediaInfoEntityList" :key="i" :src="item.mediaUrl" v-imger:comment alt="">
      </div>
      <div :class="$style.reply" v-if="detail.childs.length">
        <span>商家回复：</span>
        {{ detail.childs[0].content }}
      </div>
    </div>

    <div :class="$style.product">
      <div :class="$style.sku">
        {{ detail.orderProductREntity.attribute1 }} “{{ detail.orderProductREntity.skuName }}”
        <template v-if="detail.orderProductREntity.skuName2">
          ，{{ detail.orderProductREntity.attribute2 }} “{{ detail.orderProductREntity.skuName2 }}”
        </template>
      </div>
      <div :class="$style.detail">
        <img v-img-error :src="detail.orderProductREntity.productImg" alt="">
        <div>
          <p :class="$style.name" v-text="orderProductREntity.productName" />
          <p :class="$style.price" v-text="orderProductREntity.price" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Grade from '../../components/Grade.vue'
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
  computed: {
    orderProductREntity () {
      return this.detail.orderProductREntity
    }
  },
  methods: {
    getDetail () {
      let detail = JSON.parse(sessionStorage.getItem('comment'))
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
