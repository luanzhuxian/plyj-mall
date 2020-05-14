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
                <img v-imgError
                     v-img-error
                     :src="productImg + '?x-oss-process=style/thum'"
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
                    @alert="alert"
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
import TopText from '../../../components/common/Top-Text.vue'
import Grade from '../../../components/common/Grade.vue'
import { submitComment } from '../../../apis/comment'
import { resetForm } from '../../../assets/js/util'
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'Comment',
    components: {
        TopText,
        Grade
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
    data () {
        return {
            loading: false,
            productInfo: {},
            form: {
                orderId: '',
                productId: '',
                goodsScore: 5,
                content: '',
                mediaInfoModels: [],
                skuCode1: '',
                skuCode2: ''
            },
            productImg: '',
            images: [],
            maxLength: 100
        }
    },
    computed: {
        ...mapGetters(['openId', 'orderActionMap'])
    },
    watch: {
        images (val) {
            this.form.mediaInfoModels = []
            for (const url of val) {
                const obj = {
                    mediaType: 'image',
                    mediaFilename: url.split('/').splice(-1, 1)[0],
                    mediaUrl: url
                }
                this.form.mediaInfoModels.push(obj)
            }
        }
    },
    activated () {
        this.form.orderId = this.orderId
        this.form.productId = this.productId
        this.form.skuCode1 = this.$route.query.skuCode1 || ''
        this.form.skuCode2 = this.$route.query.skuCode2 || ''
        this.productImg = this.$route.query.productImg || ''
    },
    deactivated () {
        resetForm(this.form, {
            goodsScore: 5
        })
        this.images = []
    },
    methods: {
        ...mapMutations(['setOrderOperatedList']),
        alert () {
            this.$toast(`最多输入${ this.maxLength }个字`)
        },
        async confirm () {
            if (!this.form.content.trim()) return this.$warning('请输入评价内容')

            try {
                this.loading = true
                const { form: { skuCode2, ...rest } } = this
                const params = {
                    ...rest,
                    ...(skuCode2 ? { skuCode2 } : null)
                }
                await submitComment(this.openId, params)
                this.loading = false
                this.$success('评价成功')
                this.$store.commit('setOrderOperatedList', { id: this.orderId, action: this.orderActionMap.comment })
                setTimeout(() => {
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
