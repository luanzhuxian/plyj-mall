<template>
  <div :class="$style.shareItem" @click="buyNow">
    <img v-lazy="img" :key="img" class="radius-20" alt="">
    <div :class="$style.content + ' radius-20'">
      <div :class="$style.contentBox">
        <div>
          <h3 v-text="title" />
          <p :class="$style.desc" v-text="desc" />
          <Grade size="mini" :grade="grade" />
        </div>
        <div>
          <Price size="middle" :price="price" />
          <pl-button shadow type="warning" size="middle" @click="buyNow">立即购买</pl-button>
        </div>
        <pl-svg :class="$style.share" name="share"></pl-svg>
      </div>
    </div>
  </div>
</template>

<script>
import Grade from '../Grade'
import Price from '../Price.vue'
import { createBrokerShare } from '../../apis/product'
export default {
  name: 'Share-Item',
  components: {
    Grade,
    Price
  },
  props: {
    price: [String, Number],
    title: String,
    desc: String,
    grade: Number,
    img: String,
    id: String
  },
  methods: {
    async buyNow () {
      if (this.id) {
        let { result } = await createBrokerShare(this.id)
        if (result) {
          this.$router.push({ name: 'Lesson', params: { productSeq: this.id, brokerId: result.sequenceNbr } })
        } else {
          this.$router.push({ name: 'Lesson', params: { productSeq: this.id } })
        }
      }
    }
  }
}
</script>

<style module lang="scss">
  .share-item {
    position: relative;
    margin-top: 28px;
    img {
      width: 480px;
      height: 318px;
      object-fit: cover;
    }
  }
  .content {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    padding: 28px 20px;
    background-color: #fff;
  }
  .content-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 342px;
    height: 202px;
    h3 {
      font-size: 28px;
      font-weight: bold;
      @include elps;
    }
    > div:nth-of-type(1) {
      width: 280px;
    }
    > div:nth-of-type(2) {
      display: inline-flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    .share {
      position: absolute;
      right: 0;
      top: 0;
      width: 60px;
    }
    .desc {
      font-size: 20px;
      margin-top: 8px;
      color: #999;
      @include elps;
    }
  }
</style>
