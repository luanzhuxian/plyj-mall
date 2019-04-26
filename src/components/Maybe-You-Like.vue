<template>
  <div
    :class="$style.maybeYouLike"
    v-if="maybeLike.length"
  >
    <module-title
      size="middle"
      :title="title"
    />
    <lesson-item
      v-for="item of maybeLike"
      :key="item.sequenceNbr"
      :id="item.contentId"
      :title="item.productName"
      :count="item.salesVolume"
      :desc="item.productDesc"
      border
      :img="item.mediaInfoModel[0].mediaUrl"
      :price="item.productPriceModel[0].price"
      :original-price="item.productPriceModel[0].originPrice"
    />
  </div>
</template>

<script>
import { getYouLikeData } from '../apis/base-api'
import ModuleTitle from './Module-Title.vue'
import LessonItem from './item/Lesson-Item.vue'
import { mapGetters } from 'vuex'
import { DelayExec } from '../assets/js/util'
let delay = new DelayExec(1000)
export default {
  name: 'MaybeYouLike',
  components: {
    ModuleTitle,
    LessonItem
  },
  data () {
    return {
      maybeLike: []
    }
  },
  props: {
    productId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '猜你喜欢'
    },
    // 显示的条数
    count: {
      type: Number,
      default: 5
    }
  },
  computed: {
    ...mapGetters(['agencyCode', 'userId'])
  },
  watch: {
    productId () {
      this.getList()
    },
    agencyCode () {
      this.getList()
    },
    userId () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      await delay.exec()
      if (!this.agencyCode || !this.userId) return
      try {
        let { result } = await getYouLikeData({
          agencyCode: this.agencyCode,
          userId: this.userId,
          productSeq: this.productId
        })
        for (let item of result) {
          // 按照价格从低到高排序
          item.productPriceModel.sort((a, b) => {
            return a.price - b.price
          })
        }
        this.maybeLike = result.splice(0, this.count)
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .maybeYouLike {
    display: grid;
    grid-row-gap: 28px;
  }
</style>
