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
          placeholder="你想要的应有尽有"
        >
      </router-link>
    </div>

    <main :class="$style.classifyMain">
      <ul :class="$style.classifyList">
        <li
          v-for="(item, index) of classifyList"
          :class="{[$style.classifyActive]: item.id === currentClassify.id}"
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
          v-if="currentClassify.parentCode && currentClassify.bannerPic && currentClassify.id !== '1'"
        >
          <img :src="currentClassify.bannerPic">
        </div>
        <div
          :class="$style.banner"
          v-if="currentClassify.id === '1'"
        >
          <img
            src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/helperBanner.png"
          >
        </div>
        <template v-if="currentClassify.childs && currentClassify.childs.length">
          <div :class="$style.classifyList2">
            <classify-item
              v-for="item of currentClassify.childs"
              :key="item.id"
              :cid="item.id"
              :img="item.categoryPic + '?x-oss-process=style/thum-small'"
              :text="item.categoryName"
              @click="subClassifyClick"
            />
          </div>
        </template>
        <div
          :class="$style.title"
          v-text="currentClassify.subCategoryIdName || currentClassify.categoryName"
          v-show="!isEmpty && currentClassify.childs && currentClassify.childs.length"
        />
        <div
          :class="$style.title"
          style="text-align: center;"
          v-show="!isEmpty && currentClassify.categoryName && currentClassify.categoryName === '全部'"
        >
          全部商品
        </div>
        <div
          :class="$style.title"
          v-show="!isEmpty && currentClassify.id && currentClassify.id === '1'"
        >
          热门推荐
        </div>

        <load-more
          ref="loadMore"
          :form="form"
          :request-methods="requestMethods"
          :loading.sync="loading"
          no-content-tip="此分类下还没有商品"
          @listState="isEmpty = $event"
          @refresh="refreshHandler"
          @more="refreshHandler"
          :style="`margin-top: ${20/7.5}vw;`"
        >
          <template v-slot="{ list }">
            <div :class="$style.productList">
              <goods-item
                v-for="(item, index) of prodList"
                :key="index"
                :id="item.id"
                :img="item.productMainImage + '?x-oss-process=style/thum-small'"
                :title="item.productName"
                :price="item.productSkuModels.length && item.productSkuModels[0].price"
                :rebate="currentClassify.id === '1' ? item.realRebate : ''"
              />
            </div>
          </template>
        </load-more>
      </div>
    </main>
  </div>
</template>

<script>
import GoodsItem from '../../components/item/Goods-Item.vue'
import ClassifyItem from '../../components/item/Classify-Item.vue'
import LoadMore from '../../components/Load-More.vue'
import { getCategoryTree, getProduct } from '../../apis/classify'
import { getActivityProduct } from '../../apis/broker'
import { mapGetters } from 'vuex'

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
        id: '',
        categoryName: '全部',
        subCategoryName: ''
      },
      classifyList: [{
        id: '',
        categoryName: '全部'
      }],
      classifyFormTemplate: {
        categoryId: '',
        subCategoryId: '',
        current: 1,
        size: 10
      },
      helperFormTemplate: {
        type: '',
        current: 1,
        size: 10
      },
      form: {},
      prodList: [],
      loading: false,
      isEmpty: false,
      agentShow: false,
      $refresh: null,
      requestMethods: getProduct
    }
  },
  computed: {
    ...mapGetters(['agentUser'])
  },
  created () {
    this.form = this.classifyFormTemplate
    this.getCategoryTree()
  },
  mounted () {
    // 去掉prop传参 refs调用
    // this.$refs.loadMore.setForm(this.form)
    // this.$refs.loadMore.setMethods(getProduct)
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.findDefault()
  },
  methods: {
    classifyClick (classify) {
      if (this.loading || classify === this.currentClassify) return
      if (classify && (classify.id === '1')) {
        // 点击的是helper专区
        this.agentShow = true
        this.currentClassify = classify
        this.requestMethods = getActivityProduct
        this.form = JSON.parse(JSON.stringify(this.helperFormTemplate))
        this.$router.push({ name: 'Classify', params: { optionId: '1' } })
        this.$refresh()
        return
      }
      if (classify) {
        // 点击分类
        this.agentShow = false
        this.currentClassify = classify
        this.currentClassify.subCategoryName = ''
        // if (!this.form.hasOwnProperty('categoryName')) {
        this.form = JSON.parse(JSON.stringify(this.classifyFormTemplate))
        this.requestMethods = getProduct
        // }
        this.form.categoryId = classify.id
        this.form.subCategoryId = ''
        this.$router.push({ name: 'Classify', params: { optionId: classify.id || null } })
        this.$refresh()
      }
    },
    subClassifyClick ({ cid, name }) {
      if (this.loading) return
      this.currentClassify.subCategoryName = name
      this.form.categoryId = this.currentClassify.id
      this.form.subCategoryId = cid
      this.form.current = 1
      this.$refresh()
    },
    async getCategoryTree () {
      try {
        const { result } = await getCategoryTree()
        this.classifyList = this.classifyList.concat(result)
        if (this.agentUser) {
          this.classifyList.push({
            categoryName: 'Helper专区',
            id: '1'
          })
        }
        this.findDefault()
      } catch (e) {
        throw e
      }
    },
    refreshHandler (list) {
      for (let item of list) {
        item.realRebate = 0
        item.productSkuModels.forEach(current => {
          item.realRebate = current.realRebate > item.realRebate ? current.realRebate : item.realRebate
        })
        item.productSkuModels.sort((a, b) => a.price - b.price)
      }
      this.prodList = list
    },
    findDefault () {
      if (this.classifyList.length > 1) {
        let finded = this.classifyList.find(item => item.id === this.optionId)
        if (finded) {
          this.classifyClick(finded)
        } else {
          finded = this.classifyList.find(item => item.id === '')
          this.classifyClick(finded)
        }
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
  border-bottom: 1px solid #f7f7f7;
}
.search-box {
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 60px;
  background-color: #f5f5f8;
  border-radius: 30px;
  box-sizing: border-box;
  svg {
    width: 28px;
    height: 28px;
    margin-right: 20px;
  }
  input {
    width: 566px;
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
    border-bottom: 1px solid #fff;
    &:nth-last-of-type(1) {
      margin-bottom: 108px;
      &:after {
        display: none;
      }
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
  margin-top: 32px;
  color: #2E2E2E;
  font-size: 28px;
  font-weight: bolder;
}
</style>
