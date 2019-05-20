<template>
  <div :class="$style.search">
    <div :class="$style.searchBar">
      <div :class="$style.searchBox">
        <pl-svg name="search" />
        <input
          v-model.trim="searachContent"
          type="search"
          placeholder="搜索商品"
          @search="search(searachContent)"
        >
      </div>
      <button @click="cancel">
        取消
      </button>
    </div>

    <div :class="$style.content">
      <load-more
        v-show="seached"
        :form="form"
        :request-methods="searchProduct"
        ref="loadMore"
        no-content-tip="抱歉，没有相关商品"
        icon="no-search"
        @refresh="refreshHandler"
      >
        <template v-slot="{ list }">
          <lesson-item
            border
            v-for="item of list"
            :key="item.sequenceNbr"
            :title="item.productName"
            :desc="item.productDesc"
            :img="item.mediaInfoModel[0].mediaUrl"
            :price="item.productPriceModel[0].price"
            :original-price="item.productPriceModel[0].originPrice"
            :id="item.contentId"
          />
        </template>
      </load-more>
    </div>

    <div
      v-show="!seached"
      :class="{ [$style.searchSelect]: true, [$style.border]: true }"
    >
      <div :class="$style.top">
        <span>热门搜索</span>
      </div>
      <ul :class="$style.keyWordList">
        <li
          class="fz-28 gray-2"
          v-for="item of hot"
          v-text="item"
          :key="item"
          @click="search(item)"
        />
      </ul>
    </div>

    <div
      v-show="!seached"
      :class="$style.searchSelect"
    >
      <div :class="$style.top">
        <span>历史搜索</span>
        <pl-svg
          @click="deleteHistory"
          name="delete"
        />
      </div>
      <ul :class="$style.keyWordList">
        <li
          class="fz-28 gray-2"
          v-for="(item, i) of history"
          v-text="item"
          :key="`${item}_${i}`"
          @click="search(item)"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import {
  searchProduct,
  getHotKeyword,
  getHistoryKeyword,
  deleteHistoryKeyword
} from '../../apis/search'
import { mapGetters } from 'vuex'
import LessonItem from '../../components/item/Lesson-Item.vue'
import LoadMore from '../../components/Load-More.vue'
export default {
  name: 'Search',
  components: {
    LessonItem,
    LoadMore
  },
  data () {
    return {
      searachContent: '',
      form: {
        searachContent: '',
        current: 1,
        size: 10
      },
      searchProduct,
      hot: [],
      history: [],
      seached: false, // 标记是否搜索过
      $refresh: null
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.getHotKeyword()
    this.getHistory()
  },
  methods: {
    async search (keyword) {
      if (!keyword) return this.$toast('请输入要搜索的内容')
      if (keyword) {
        this.searachContent = this.form.searachContent = keyword
      }
      this.seached = true
      this.$refresh()
    },
    async getHotKeyword () {
      try {
        let { result } = await getHotKeyword()
        this.hot = result
      } catch (e) {
        throw e
      }
    },
    async getHistory () {
      try {
        let { result } = await getHistoryKeyword(this.userId)
        this.history = result
      } catch (e) {
        throw e
      }
    },
    async deleteHistory () {
      try {
        let { result } = await deleteHistoryKeyword(this.userId)
        if (result) {
          this.getHistory()
        }
      } catch (e) {
        throw e
      }
    },
    cancel () {
      if (!this.form.searachContent && !this.searachContent) {
        return this.$router.push({ name: 'Classify' })
      }
      this.form.searachContent = ''
      this.searachContent = ''
      this.seached = false
    },
    refreshHandler () {
      this.getHistory()
    }
  }
}
</script>

<style module lang="scss">
  .search {
    height: 100vh;
    overflow: auto;
    background-color: #fff;
  }
  .search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 92px;
    padding: 0 40px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
    button {
      font-size: 28px;
      color: #1890FF;
    }
  }
  .search-box {
    display: flex;
    align-items: center;
    width: 574px;
    background-color: #f5f5f8;
    border-radius: 30px;
    height: 60px;
    svg {
      width: 32px;
      height: 32px;
      margin-left: 30px;
      vertical-align: -5px;
    }
    input {
      width: 500px;
      padding: 0 15px;
      font-size: 28px;
      font-weight: bold;
      overflow: hidden;
      background-color: transparent;
      &::placeholder {
        color: #BCBCBC;
        letter-spacing: 3px;
      }
    }
  }
  .content {
    padding-left: 40px;
    margin-top: 40px;
  }
  .search-select {
    position: relative;
    width: 670px;
    margin: 0 auto;
    padding-bottom: 50px;
    &.border:after {
      @include border-half-bottom(#e7e7e7);
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 96px;
      font-size: 26px;
      color: #666;
      svg {
        width: 26px;
        height: 28px;
      }
    }
  }
  .key-word-list {
    display: flex;
    flex-wrap: wrap;
    li {
      margin-right: 20px;
      margin-bottom: 24px;
      padding: 4px 25px;
      background: #f5f5f5;
      border-radius: 10px;
    }
  }
</style>
