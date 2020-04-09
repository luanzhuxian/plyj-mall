<template>
    <div :class="$style.search">
        <div :class="$style.searchBar">
            <div :class="$style.searchBox">
                <pl-svg name="icon-search" width="30" />
                <input
                    v-model.trim="searchContent"
                    ref="input"
                    type="search"
                    placeholder="你想要的应有尽有"
                    @search="search(searchContent)"
                >
            </div>
            <button @click="cancel">
                取消
            </button>
        </div>

        <div :class="$style.content" v-if="searched">
            <search-list
                ref="searchList"
                :query="searchContent"
                @refresh="getHistory"
            />
        </div>

        <div
            v-show="!searched"
            :class="{
                [$style.searchSelect]: true,
                [$style.border]: true
            }"
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
            v-show="!searched"
            :class="$style.searchSelect"
        >
            <div :class="$style.top">
                <span>历史搜索</span>
                <pl-svg
                    @click="deleteHistory"
                    name="icon-delete"
                    width="25"
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
import SearchList from './components/Search-List.vue'
import {
    getHotKeyword,
    getHistoryKeyword,
    deleteHistoryKeyword
} from '../../apis/search'

export default {
    name: 'Search',
    components: {
        SearchList
    },
    data () {
        return {
            searchContent: '',
            hot: [],
            history: [],
            // 标记是否搜索过
            searched: false
        }
    },
    activated () {
        this.getHotKeyword()
        this.getHistory()
        this.$refs.input.focus()
    },
    methods: {
        async search (keyword) {
            if (!keyword) return this.$warning('请输入要搜索的内容')
            this.searchContent = keyword
            this.searched = true
            this.$nextTick(() => this.$refs.searchList.refresh(keyword))
        },
        async getHotKeyword () {
            try {
                const { result } = await getHotKeyword()
                this.hot = result
            } catch (e) {
                throw e
            }
        },
        async getHistory () {
            try {
                const { result } = await getHistoryKeyword()
                this.history = [...new Set(result)]
            } catch (e) {
                throw e
            }
        },
        async deleteHistory () {
            try {
                const { result } = await deleteHistoryKeyword()
                if (result) this.history = []
            } catch (e) {
                throw e
            }
        },
        cancel () {
            if (!this.searchContent) {
                return this.$router.go(-1)
            }
            this.searchContent = ''
            this.searched = false
        }
    },
    beforeRouteLeave (to, from, next) {
        this.searched = false
        this.searchContent = ''
        next()
    }
}
</script>

<style module lang="scss">
  .search {
    box-sizing: border-box;
    padding-top: 93px;
    height: 100vh;
    overflow: hidden;
    background-color: #fff;
  }
  .search-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    height: 92px;
    background-color: #fff;
    border-bottom: 1px solid #f7f7f7;
    z-index: 999;
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
  .search-select {
    position: relative;
    padding: 0 40px 50px;
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
