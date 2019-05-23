<template>
  <div
    :class="$style.comment + ' radius-20'"
    v-show="listTemp.length > 0"
  >
    <div
      :class="$style.commentItem"
      v-for="item of listTemp"
      :key="item.sequenceNbr"
    >
      <!-- 头像 -->
      <img
        v-img-error
        :src="item.headUrl || ''"
        alt=""
      >
      <div :class="$style.content">
        <div
          :class="$style.name"
          v-text="item.nickName"
        />
        <!-- 评分 -->
        <div :class="$style.grade">
          评分 <Grade
            size="mini"
            :grade="item.goodsScore"
          />
        </div>
        <!-- 内容 -->
        <div
          :class="$style.commentContent"
          v-text="item.content"
        />
        <!-- 图片 -->
        <div :class="$style.imgs + ' radius-20'">
          <!-- 只在评论专区页面显示全部图片，其他显示 3 张 -->
          <template v-for="(img, j) of item.mediaInfoModels">
            <img
              v-if="j < 3"
              :key="j"
              v-img-error
              :src="img.mediaUrl"
              v-gallery="item.sequenceNbr"
              alt=""
            >
          </template>
        </div>
        <!-- 回复 -->
        <div
          :class="$style.reply"
          v-if="item.childs.length"
        >
          <span>商家回复：</span>
          {{ item.childs[0].content }}
        </div>
      </div>
    </div>
    <p
      :class="$style.noComments"
      v-if="listTemp.length === 0 && productSeq"
    >
      <span>暂无评论</span>
    </p>
    <router-link
      v-if="this.productSeq && total > 3"
      tag="div"
      :to="{ name: 'Comments', params: { productSeq } }"
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
        productSeq: ''
      },
      listTemp: [],
      timer: 0,
      total: 0
    }
  },
  props: {
    // 如果没有传入size和productSeq，则需要传入评论列表
    // 这样做是为了方便在商品详情和评论专区形成通用性
    // 评论专区有刷新和请求全部列表的需求，而商品详情只需要3条评论，且不需要刷新评论
    // 因此，传入size和productSeq将更方便，因为无需额外在商品详情中请求评论列表
    size: {
      type: Number,
      default: 3
    },
    productSeq: {
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
    this.form.productSeq = this.productSeq
    this.form.size = this.size
    this.getList()
  },
  watch: {
    productSeq (val) {
      this.form.productSeq = val
      this.getList()
    },
    list (val) {
      if (val.length > 0) {
        this.listTemp = val
      }
    }
  },
  methods: {
    getList () {
      if (this.productSeq && this.size) {
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          try {
            this.clear()
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
    padding: 30px 0 30px 30px;
    background-color: #fff;
    font-size: 24px;
    overflow: scroll;
  }
  .comment-item {
    position: relative;
    display: flex;
    padding-bottom: 28px;
    margin-bottom: 32px;
    img {
      width: 80px;
      height: 80px;
      margin-right: 24px;
      object-fit: cover;
      border-radius: 50%;
    }
    &:after {
      @include border-half-bottom(#e7e7e7);
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
  .comment-content {
    margin-top: 16px;
    padding-right: 30px;
    font-size: 28px;
  }
  .imgs {
    width: fit-content;
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-right: -10px;
    overflow: hidden;
    flex-wrap: wrap;
    img {
      width: 162px;
      height: 162px;
      border-radius: 0;
      margin: 0 10px 10px 0;
      object-fit: cover;
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
