<template>
  <div
    class="comment"
    :class="$style.comment"
  >
    <top-text
      title="发表评论"
      tip="说说您本次购买的感受吧"
    />
    <main class="radius-20 bg-white mt-28">
      <div :class="$style.grade">
        <img
          v-img-error
          :src="img + '?x-oss-process=style/thum'"
          alt=""
        >
        <span class="fz-26 gray-2">本次感受</span>
        <Grade
          size="middle"
          :grade.sync="form.goodsScore"
          selectable
        />
      </div>
      <div :class="$style.content">
        <pl-input
          v-model="form.content"
          type="textarea"
          :maxlength="maxLength"
          placeholder="产品满足你的期待吗？说说它的优点和缺点吧"
          :min-rows="8"
        />
      </div>
      <div :class="$style.images">
        <pl-upload-img
          :count="9"
          :size="0.8"
          v-model="images"
          multiple
        />
      </div>
    </main>
    <div :class="$style.footer">
      <pl-button
        size="larger"
        type="warning"
        :loading="loading"
        :disabled="loading"
        @click="confirm"
      >
        发布评论
      </pl-button>
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import Grade from '../../../components/Grade.vue'
import { getOrderDetail } from '../../../apis/order-manager'
import { submitComment } from '../../../apis/comment'
import { resetForm } from '../../../assets/js/util'
import { mapGetters } from 'vuex'

export default {
  name: 'Comment',
  components: {
    TopText,
    Grade
  },
  data () {
    return {
      loading: false,
      productInfo: {},
      form: {
        orderId: '',
        productId: '',
        goodsScore: 5,
        content: '',
        mediaInfoModels: []
      },
      img: '',
      images: [],
      maxLength: 100
    }
  },
  props: {
    orderId: {
      type: String,
      default: null
    },
    productId: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['openId'])
  },
  watch: {
    'form.content' (value) {
      if (value.length === this.maxLength) {
        this.$toast(`最多输入${this.maxLength}个字`)
      }
    },
    images (val) {
      this.form.mediaInfoModels = []
      for (let url of val) {
        let obj = {
          mediaType: 'image',
          mediaFilename: url.split('/').splice(-1, 1)[0],
          mediaUrl: url
        }
        this.form.mediaInfoModels.push(obj)
      }
    }
  },
  activated () {
    this.getOrderDetail()
  },
  deactivated () {
    resetForm(this.form, {
      goodsScore: 5
    })
    this.images = []
  },
  methods: {
    async getOrderDetail () {
      try {
        let { result } = await getOrderDetail(this.orderId)
        this.productInfo = result.productInfoModel.productDetailModels.filter(product => product.productId === this.productId)[0] || {}
        this.img = this.productInfo.productImg
        this.form.orderId = this.orderId
        this.form.productId = this.productId
      } catch (e) {
        throw e
      }
    },
    async confirm () {
      if (!this.form.content.trim()) return this.$warning('请输入评价内容')
      try {
        this.loading = true
        await submitComment(this.openId, this.form)
        this.loading = false
        this.$success('评价成功')
        setTimeout(() => {
          // this.$router.replace({ name: 'OrderDetail', params: { orderId: this.orderId } })
          this.$router.history.current.meta.commentOId = this.orderId
          this.$router.history.current.meta.commentPId = this.productId
          this.$router.go(-1)
        }, 2000)
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style module lang="scss">
  .comment {
    padding: 28px 40px 140px;
    main {
      overflow: hidden;
      padding-bottom: 28px;
    }
  }
  .grade {
    position: relative;
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0 28px;
    border-bottom: 1px solid #e7e7e7;
    img {
      width: 80px;
      height: 80px;
      margin-right: 15px;
      object-fit: cover;
    }
    > span {
      margin-right: 30px;
    }
  }
  .content {
    margin-bottom: 20px;
  }
  .images {
    padding: 0 28px;
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px 24px;
    background-color: #FFF;
  }
</style>
<style lang="scss">
.comment {
  .pl-textarea_box {
    > .pl-input-textarea {
      &::-webkit-input-placeholder {
        font-size: 28px;
        color: #CCCCCC;
        line-height: 38px;
      }
    }
    > .pl-input__word-count {
      color: #CCCCCC !important;
      > i {
        color: #CCCCCC !important;
      }
    }
  }
}
</style>
