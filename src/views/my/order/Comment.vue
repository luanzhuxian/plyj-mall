<template>
  <div :class="$style.comment">
    <top-text
      title="发表评论"
      tip="说说您本次购买的感受吧"
    />
    <main class="radius-20 bg-white mt-28">
      <div :class="$style.grade">
        <img
          v-img-error
          :src="img"
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
          :maxlength="500"
          placeholder="产品满足你的期待吗？说说它的优点和缺点吧"
          :min-rows="5"
          :max-rows="10"
        />
      </div>
      <div :class="$style.images">
        <pl-upload-img
          :count="6"
          :size="0.5"
          :images="images"
          @success="uploaded"
          @remove="removeImg"
        />
      </div>
      <div :class="'mt-28 '+$style.submit">
        <pl-button
          :loading="loading"
          round
          plain
          type="warning"
          @click="submit"
        >
          发布评论
        </pl-button>
      </div>
    </main>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import Grade from '../../../components/Grade.vue'
import { getOrderDetail } from '../../../apis/order-manager'
import { mapGetters } from 'vuex'
import { submitComment } from '../../../apis/comment'

export default {
  name: 'Comment',
  components: {
    TopText,
    Grade
  },
  data () {
    return {
      loading: false,
      form: {
        mallSeq: '',
        agencyCode: '',
        orderSn: '',
        productSeq: '',
        goodsScore: 5,
        serviceScore: 5,
        timeScore: 5,
        content: '',
        mediaInfoModels: []
      },
      images: [],
      relationModel: {},
      img: ''
    }
  },
  props: {
    orderId: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['mallSeq', 'agencyCode', 'openId'])
  },
  activated () {
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail () {
      try {
        let { result } = await getOrderDetail(this.orderId)
        const { relationModel } = result
        this.relationModel = relationModel
        this.form.orderSn = this.orderId
        this.form.mallSeq = this.mallSeq
        this.form.agencyCode = this.agencyCode
        this.form.productSeq = relationModel[0].orderProductRelationModel.productSeq
        this.img = relationModel[0].mediaInfoModels[0].mediaUrl
      } catch (e) {
        throw e
      }
    },
    uploaded (res) {
      let obj = {
        mediaType: 'image',
        mediaFilename: res.name.split('/').splice(-1, 1)[0],
        mediaUrl: res.url
      }
      this.form.mediaInfoModels.push(obj)
      this.images.push(res.url)
    },
    removeImg (index) {
      this.images.splice(index, 1)
      this.form.mediaInfoModels.splice(index, 1)
    },
    async submit () {
      if (!this.form.content.trim()) return this.$toast('请输入评价内容')
      try {
        this.loading = true
        await submitComment(this.openId, this.form)
        this.loading = false
        this.$router.replace({ name: 'OrderDetail', params: { orderId: this.orderId } })
      } catch (e) {
        this.loading = false
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .comment {
    padding: 28px 40px;
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
    &:after { @include border-half-bottom(#e7e7e7); }
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
  .images {
    padding: 28px;
  }
  .submit {
    display: flex;
    justify-content: flex-end;
    position: relative;
    &:after { @include border-half-top(#e7e7e7); }
    padding-top: 28px;
    padding-right: 28px;
    margin-left: 28px;
  }
</style>
