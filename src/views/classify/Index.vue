<template>
  <div :class="$style.classify">
    <div :class="$style.search">
      <router-link
        tag="div"
        :class="$style.searchBox"
        :to="{ name: 'Search' }"
      >
        <pl-svg name="search" />
        <input
          type="text"
          placeholder="搜索商品"
        >
      </router-link>
    </div>

    <main :class="$style.classifyMain">
      <ul :class="$style.classifyList">
        <li
          v-for="(item, index) of classifyList"
          :class="{[$style.classifyActive]: item.sequenceNbr === currentClassify.sequenceNbr}"
          :key="index"
          @click="classifyClick(item)"
        >
          <span
            :class="$style.classifyText"
            v-text="item.categoryName"
          />
        </li>
      </ul>

      <div :class="$style.content">
        <div
          :class="$style.banner"
          v-if="currentClassify.parentCode && currentClassify.categoryPic"
        >
          <img :src="currentClassify.categoryPic">
        </div>
        <template v-if="currentClassify.childs && currentClassify.childs.length">
          <div :class="$style.classifyList2">
            <classify-item
              :cid="item.sequenceNbr"
              :img="item.categoryPic"
              :text="item.categoryName"
              v-for="item of currentClassify.childs"
              :key="item.sequenceNbr"
              @click="subClassifyClick"
            />
          </div>
        </template>
        <div
          :class="$style.title"
          v-text="currentClassify.subCategoryName || currentClassify.categoryName"
        />
        <load-more
          :request-methods="getProduct"
          :form="form"
          ref="loadMore"
          :loading.sync="loading"
          no-content-tip="此分类下还没有商品"
        >
          <template v-slot="{ list }">
            <div :class="$style.productList">
              <goods-item
                v-for="item of list"
                :key="item.sequenceNbr"
                :id="item.sequenceNbr"
                :title="item.productName"
                :desc="item.productDesc"
                :price="item.productOptions[0].price"
                :img="item.productImage[0].mediaUrl"
              />
            </div>
          </template>
        </load-more>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GoodsItem from '../../components/item/Goods-Item.vue'
import ClassifyItem from '../../components/item/Classify-Item.vue'
import LoadMore from '../../components/Load-More.vue'
import {
  getCategoryTree,
  getProduct
} from '../../apis/classify'
export default {
  name: 'Classify',
  components: {
    GoodsItem,
    ClassifyItem,
    LoadMore
  },
  props: {
    optionId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      currentClassify: {
        sequenceNbr: '',
        categoryName: '全部',
        subCategoryName: ''
      },
      classifyList: [{
        categoryName: '全部',
        sequenceNbr: ''
      }],
      form: {
        categoryCode: '',
        subCategory: '',
        current: 1,
        size: 10,
        productStatus: 'ON_SALE'
      },
      getProduct,
      $refresh: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['mallSeq'])
  },
  created () {
    this.getCategoryTree()
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    if (this.classifyList.length > 1 && this.optionId) {
      this.classifyClick(this.classifyList.find(item => item.sequenceNbr === this.optionId))
    }
  },
  methods: {
    classifyClick (classify) {
      if (this.loading || classify === this.currentClassify) return
      if (classify) {
        this.currentClassify = classify
        this.currentClassify.subCategoryName = ''
        this.form.categoryCode = classify.sequenceNbr
        this.form.subCategory = ''
        this.form.current = 1
        this.$refresh()
      }
    },
    subClassifyClick ({ cid, name }) {
      if (this.loading) return
      this.currentClassify.subCategoryName = name
      this.form.categoryCode = this.currentClassify.sequenceNbr
      this.form.subCategory = cid
      this.form.current = 1
      this.$refresh()
    },
    async getCategoryTree () {
      try {
        const { result } = await getCategoryTree(this.mallSeq)
        this.classifyList = this.classifyList.concat(result)
        this.classifyClick(this.classifyList.find(item => item.sequenceNbr === (this.optionId || '')))
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
.classify {
  position: relative;
  padding-bottom: 88px;
  background-color: #f1f4f5;
}
.search {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  height: 92px;
  width: 100%;
  align-items: center;
  padding: 0 40px;
  background-color: #fff;
  box-sizing: border-box;
  z-index: 9;
  &:after {
    @include border-half-bottom(#e7e7e7);
  }
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  text-align: center;
  background-color: #f5f5f8;
  border-radius: 30px;
  box-sizing: border-box;
  svg {
    width: 32px;
    height: 32px;
    margin-right: 15px;
    vertical-align: -5px;
  }
  input {
    width: 125px;
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    background-color: transparent;
    &::placeholder {
      color: #BCBCBC;
      letter-spacing: 3px;
    }
  }
}
.classifyMain {
  min-height: calc(100vh - 92px);
  padding: 92px 0;
  background-color: #fff;
  box-sizing: border-box;
}
.classify-list {
  position: fixed;
  height: calc(100vh - 180px);
  background-color: #f1f4f5;
  overflow: auto;
  z-index: 2;
  > li {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    min-height: 88px;
    padding: 10px 20px;
    font-size: 26px;
    text-align: center;
    white-space: pre-wrap;
    &:nth-last-of-type(1) {
      margin-bottom: 108px;
      &:after {
        display: none;
      }
    }
    &:after {
      @include border-half-bottom(#fff);
    }
    transition: background-color .2s linear, color .2s linear;
  }
  .classify-active {
    background-color: #fff;
    color: #aaaabb;
  }
  .classifyText {
    line-height: 36px;
  }
}
.classify-list2 {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding-top: 32px;
  border-bottom: 1px solid #F0F0F0;
}
.content {
  margin-left: 160px;
  padding: 0 20px;
  background-color: #fff;
  z-index: 1;
}
.banner{
  width: 548px;
  height: 180px;
  margin-top: 20px;
  &>img{
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: contain;
  }
}
.productList {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.title{
  margin: 32px 0 20px 0;
  color: #2E2E2E;
  font-size: 28px;
  font-weight: bolder;
}
</style>
