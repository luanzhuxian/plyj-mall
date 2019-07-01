<template>
  <div :class="$style.comment + ' radius-20'" v-if="listTemp.length > 0">
    <div :class="$style.header">
      <pl-button size="small" type="primary" round plain>
        全部
      </pl-button>
      <pl-button size="small" type="primary" round plain>
        最新
      </pl-button>
      <pl-button size="small" type="primary" round plain>
        有图
      </pl-button>
    </div>
    <div :class="$style.commentItem" v-for="item of listTemp" :key="item.sequenceNbr">
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
          <span>颜色“白色”，版本“55寸 4核处理器”</span>
        </div>
        <!-- 内容 -->
        <div :class="$style.commentContent" v-text="item.content" />
        <!-- 图片 -->
        <div :class="$style.imgs + ' radius-20'" v-if="item.mediaInfoModels.length > 0">
          <img
            v-for="(img, j) of item.mediaInfoModels"
            :key="j"
            v-img-error
            :src="img.mediaUrl + '?x-oss-process=style/thum'"
            v-imger:comment="img.mediaUrl"
            alt=""
          >
        </div>
        <!-- 回复 -->
        <div :class="$style.reply" v-if="item.childs.length">
          <span>商家回复：</span>
          {{ item.childs[0].content }}
        </div>
      </div>
    </div>
    <p :class="$style.noComments" v-if="listTemp.length === 0 && productId">
      <span>暂无评论</span>
    </p>
    <router-link
      v-if="this.productId && total > 3"
      tag="div"
      :to="{ name: 'Comments', params: { productId } }"
      :class="$style.seeMore"
    >
      <span>查看全部评论（{{ total }}）</span>
      <pl-svg name="right" />
    </router-link>
  </div>
</template>
<script>
import Grade from '../Grade.vue'
import { getComments } from '../../apis/comment'
export default {
  name: 'Comment',
  components: {
    Grade
  },
  data () {
    return {
      form: {
        current: 1,
        size: '',
        productId: ''
      },
      listTemp: [],
      timer: 0,
      total: 0
    }
  },
  props: {
    // 如果没有传入size和productId，则需要传入评论列表
    // 这样做是为了方便在商品详情和评论专区形成通用性
    // 评论专区有刷新和请求全部列表的需求，而商品详情只需要3条评论，且不需要刷新评论
    // 因此，传入size和productId将更方便，因为无需额外在商品详情中请求评论列表
    size: {
      type: Number,
      default: 3
    },
    productId: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  activated () {
    this.form.productId = this.productId
    this.form.size = this.size
  },
  watch: {
    productId: {
      handler  (val) {
        this.form.productId = val
        console.log(123)
        this.getList()
      },
      immediate: true
    },
    list (val) {
      if (val.length > 0) {
        this.listTemp = val
      }
    }
  },
  methods: {
    getList () {
      console.log(this.productId && this.size)
      if (this.productId && this.size) {
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          try {
            this.clear()
            console.log(123123)
            let { result } = await getComments(this.form)
            this.total = result.total
            for (let item of result.records) {
              this.listTemp.push(item)
            }
          } catch (e) {
            throw e
          }
        }, 500)
      }
    },
    clear () {
      this.listTemp.splice(0, this.listTemp.length)
    }
  }
}
</script>

<style module lang="scss">
  .comment {
    /*min-height: 500px;*/
    margin-top: 28px;
    /*padding: 0 40px;*/
    background-color: #fff;
    font-size: 24px;
    overflow: scroll;
  }
  .header {
    display: flex;
    align-items: center;
    height: 120px;
    padding: 0 30px;
    border-bottom: 1px solid #f0f0f0;
    > button {
      margin-right: 20px;
    }
  }
  .comment-item {
    position: relative;
    display: flex;
    padding: 30px;
    margin-bottom: 32px;
    border-bottom: 1px solid #e7e7e7;
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
    margin-top: 20px;
    padding-right: 30px;
    font-size: 28px;
    word-break: break-all;
  }
  .imgs {
    display: grid;
    padding-right: 30px;
    grid-template-columns: repeat(auto-fill, 162px);
    grid-template-rows: repeat(auto-fill, 162px);
    justify-content: space-between;
    grid-row-gap: 10px;
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
  }
}
.noComments {
  display: flex;
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
    margin-top: 10px;
    margin-right: 30px;
    padding: 20px 24px;
    background-color: #f6f6f6;
    border-radius: 16px;
    font-size: 24px;
    span {
      font-weight: bold;
    }
  }
</style>
