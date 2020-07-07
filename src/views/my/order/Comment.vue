<template>
    <div
        class="comment"
        :class="$style.comment"
    >
        <top-text title="发表评论" tip="说说您本次购买的感受吧" />
        <main class="radius-20 bg-white mt-28">
            <div :class="$style.grade">
                <img v-img-error :src="productImg + '?x-oss-process=style/thum'">
                <span class="fz-26 gray-2">本次感受</span>
                <Grade
                    size="middle"
                    :grade.sync="form.score"
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

// eslint-disable-next-line func-style
function getProductImg () {
    return sessionStorage.getItem('commentProductImg') || ''
}
// eslint-disable-next-line func-style
function switchProductImg (productImg) {
    if (productImg) {
        return sessionStorage.setItem('commentProductImg', productImg)
    }
    sessionStorage.removeItem('commentProductImg')
}

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
        }
    },
    data () {
        return {
            loading: false,
            productInfo: {},
            productImg: '',
            form: {
                orderId: '',
                score: 5,
                content: '',
                url: []
            },
            images: [],
            maxLength: 100
        }
    },
    computed: {
        ...mapGetters(['orderActionMap'])
    },
    watch: {
        images (val) {
            this.form.url = []
            for (const url of val) {
                this.form.url.push(url)
            }
        }
    },
    activated () {
        this.form.orderId = this.orderId
        this.productImg = this.$route.params.productImg || getProductImg() || ''
        switchProductImg(this.productImg)
    },
    deactivated () {
        resetForm(this.form, {
            score: 5
        })
        switchProductImg()
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
                const params = JSON.parse(JSON.stringify(this.form))
                params.score = params.score * 2
                await submitComment(params)
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
