<template>
  <div :class="$style.search">
    <div :class="$style.searchBar">
      <div :class="$style.searchBox">
        <pl-svg name="search" />
        <input
          v-model.trim="searchContent"
          type="search"
          placeholder="你想要的应有尽有"
          @search="search(searchContent)"
          ref="input"
        >
      </div>
      <button @click="cancel">
        取消
      </button>
    </div>

    <div :class="$style.content">
      <load-more
        ref="loadMore"
        v-show="seached"
        :form="form"
        :request-methods="searchProduct"
        icon="no-search"
        no-content-tip="抱歉，没有相关商品"
        @refresh="refreshHandler"
        @more="refreshHandler"
      >
        <template v-slot="{ list }">
          <lesson-item
            border
            v-for="(item, index) of prodList"
            :key="index"
            :id="item.id"
            :title="item.productName"
            :desc="item.productDesc"
            :img="item.productMainImage + '?x-oss-process=style/thum-middle'"
            :price="item.productSkuModels.length && item.productSkuModels[0].price"
            :original-price="item.productSkuModels.length && item.productSkuModels[0].originalPrice"
            :data="item"
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
import LessonItem from '../../components/item/Lesson-Item.vue'
import LoadMore from '../../components/Load-More.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Search',
  components: {
    LessonItem,
    LoadMore
  },
  data () {
    return {
      searchContent: '',
      form: {
        searchContent: '',
        current: 1,
        size: 10
      },
      hot: [],
      history: [],
      prodList: [],
      seached: false, // 标记是否搜索过
      $refresh: null,
      searchProduct
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
    this.$refs.input.focus()
  },
  methods: {
    async search (keyword) {
      if (!keyword) return this.$warning('请输入要搜索的内容')
      this.searchContent = this.form.searchContent = keyword
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
        let { result } = await getHistoryKeyword()
        this.history = [...new Set(result)]
      } catch (e) {
        throw e
      }
    },
    async deleteHistory () {
      try {
        let { result } = await deleteHistoryKeyword()
        if (result) this.history = []
      } catch (e) {
        throw e
      }
    },
    cancel () {
      if (!this.form.searchContent && !this.searchContent) {
        // return this.$router.push({ name: 'Classify' })
        return this.$router.go(-1)
      }
      this.searchContent = this.form.searchContent = ''
      this.seached = false
    },
    refreshHandler (list) {
      for (let item of list) {
        item.productSkuModels.sort((a, b) => {
          return a.price - b.price
        })
      }
      this.prodList = list
      this.getHistory()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.seached = false
    this.searchContent = ''
    next()
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
    border-bottom: 1px solid #f7f7f7;
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
    border-bottom: 1px solid #f7f7f7;
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
