<template>
  <div :class="$style.comment + ' radius-20'" ref="comment">
    <div :class="$style.header" v-if="total > 0">
      <pl-button size="small" :type="form.flag ? 'default' : 'primary'" round plain @click="all">
        全部
      </pl-button>
      <pl-button v-if="assessmentPicCount > 0" size="small" :type="form.flag ? 'primary' : 'default'" round plain @click="hasImage">
        有图 <i>({{ assessmentPicCount }})</i>
      </pl-button>
    </div>
    <template v-if="list.length > 0">
      <div :class="$style.commentItem" v-for="(item, i) of list" :id="'item' + i" :key="item.id" @click="goDetail(item)">
        <!-- 头像 -->
        <img v-img-error :src="item.headUrl || ''" alt="">
        <div :class="$style.content">
          <div :class="$style.contentTop">
            <div :class="$style.name" v-text="item.nickName" />
            <div :class="$style.grade">
              评分 <Grade size="mini" :grade="item.goodsScore" />
            </div>
          </div>

          <!-- 时间  规格 -->
          <div :class="$style.itemSku">
            <span v-text="item.createTime.split(' ')[0]" />
            <i v-text="item.orderProductREntity.attribute1" />
            “<i v-text="item.orderProductREntity.skuName" />”
            <template v-if="item.orderProductREntity.skuName2">
              ，<i v-text="item.orderProductREntity.attribute2" />
              “<i v-text="item.orderProductREntity.skuName2" />”
            </template>
            <!--<span>颜色“白色”，版本“55寸 4核处理器”</span>-->
          </div>
          <!-- 内容 -->
          <div :class="$style.commentContent" v-text="item.content" />
          <!-- 图片 -->
          <div :class="$style.imgs + ' radius-20'" v-if="item.mediaInfoEntityList.length > 0">
            <img
              v-for="(img, j) of item.mediaInfoEntityList"
              :key="j"
              v-img-error
              :src="img.mediaUrl + '?x-oss-process=style/thum'"
              v-imger:comment="img.mediaUrl"
              alt=""
            >
          </div>
          <!-- 回复 -->
          <div :class="$style.reply" v-if="item.childs.length">
            <span v-text="item.childs[0].content" />
          </div>
        </div>
      </div>
    </template>
    <p :class="$style.noComments" v-if="length === 0 && productId">
      <span>暂无评论</span>
    </p>
  </div>
</template>

<script>
import Grade from '../../components/Grade.vue'
import { getComments } from '../../apis/comment'
import { resetForm } from '../../assets/js/util'
export default {
  name: 'Comments',
  components: {
    Grade
  },
  data () {
    return {
      form: {
        current: 1,
        size: 5,
        productId: '',
        flag: false // 有图
      },
      getComments,
      loading: false,
      list: [],
      total: 0
    }
  },
  props: {
    productId: {
      type: String,
      default: null
    },
    show: Boolean
  },
  computed: {
    length () {
      return this.list.length
    },
    assessmentPicCount () {
      return this.list[0] ? this.list[0].assessmentPicCount : 0
    }
  },
  activated () {
    this.reset()
    this.form.productId = this.productId
    this.getList()
  },
  deactivated () {
    this.total = 0
    this.list = []
  },
  watch: {
    show: {
      handler (val) {
        if (val) {
          this.reset()
          this.form.productId = this.productId
          this.getList()
        }
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scroll)
  },
  methods: {
    async getList () {
      try {
        this.loading = true
        const { result } = await getComments(this.form)
        this.list = []
        for (let item of result.records) {
          this.list.push(item)
        }
        this.total = result.total
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async more () {
      try {
        this.loading = true
        const { result } = await getComments(this.form)
        for (let item of result.records) {
          this.list.push(item)
        }
        this.total = result.total
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    reset () {
      resetForm(this.form, {
        current: 1,
        size: 5,
        productId: this.productId,
        flag: false
      })
    },
    goDetail (item) {
      sessionStorage.setItem('comment', JSON.stringify(item))
      this.$router.push({
        name: 'CommentDetail'
      })
    },
    scroll (e) {
      if (!this.show) return
      if (this.loading) return
      if (this.length === this.total) return
      let lastId = 'item' + (this.length - 1)
      if (document.getElementById(lastId).getBoundingClientRect().top - window.innerHeight < 0) {
        this.form.current++
        this.more()
      }
    },
    hasImage () {
      if (this.loading) return
      this.reset()
      this.form.flag = true
      this.getList()
    },
    all () {
      if (this.loading) return
      this.reset()
      this.form.flag = false
      this.getList()
    }
  }
}
</script>

<style module lang="scss">
  .comment {
    padding: 30px;
    background-color: #fff;
    font-size: 24px;
    overflow: scroll;
  }
  .header {
    display: flex;
    align-items: center;
    padding-bottom: 30px;
    border-bottom: 1px solid #f0f0f0;
    > button {
      margin-right: 20px;
    }
  }
  .comment-item {
    position: relative;
    display: flex;
    padding: 30px 0;
    border-bottom: 1px solid #e7e7e7;
    &:nth-last-of-type(1) {
      border: none;
    }
    > img {
      width: 80px;
      height: 80px;
      margin-right: 24px;
      object-fit: cover;
      border-radius: 50%;
    }
    &:nth-last-of-type(1) {
      margin-bottom: 0;
      &:after {
        display: none;
      }
    }
  }
  .content {
    flex: 1;
    .comment-content {
      margin-top: 22px;
      font-size: 28px;
      word-break: break-all;
      @include elps-wrap(3);
    }
    .imgs {
      display: grid;
      grid-template-columns: repeat(auto-fill, 162px);
      grid-template-rows: repeat(auto-fill, 162px);
      grid-gap: 10px;
      margin-top: 20px;
      overflow: hidden;
      img {
        width: 162px;
        height: 162px;
        border-radius: 0;
        object-fit: cover;
        background-color: #ccc;
        &:nth-last-of-type(1), &:nth-of-type(3n) {
          border-bottom-right-radius: 20px;
          border-top-right-radius: 20px;
        }
        &:nth-of-type(3n-2) {
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }
      }
    }
  }
  .contentTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      font-size: 28px;
      color: #446889;
    }
    .grade {
      margin-top: 8px;
      font-size: 24px;
      > div {
        vertical-align: -4px;
      }
    }
  }
  .itemSku {
    display: flex;
    margin-top: 8px;
    font-size: 24px;
    color: #999;
    > span {
      margin-right: 12px;
      &:nth-of-type(2) {
        width: 400px;
        margin-right: 0;
        @include elps();
      }
    }
  }
  .noComments {
    display: flex;
    margin: 32px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 24px;
    svg {
      margin-bottom: 20px;
      width: 200px;
    }
  }
  .see-more {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 30px;
    font-size: 24px;
    color: #000;
    svg {
      width: 18px;
      fill: #bbb;
    }
  }
  .reply {
    margin-top: 20px;
    margin-right: 30px;
    padding: 20px 24px;
    background-color: #f8f8f8;
    border-radius: 16px;
    font-size: 24px;
    color: #999999;
    span {
      display: inline-block;
      @include elps-wrap(3);
      word-break: break-all;
      &:before {
        content: '商家回复：';
      }
    }
  }
</style>
