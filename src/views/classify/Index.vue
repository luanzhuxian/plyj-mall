<template>
  <div :class="$style.classify">
    <div :class="$style.search">
      <router-link
        tag="div"
        :class="$style.searchBox"
        :to="{ name: 'Search' }"
      >
        <pl-svg name="search"></pl-svg>
        <input type="text" placeholder="搜索商品">
      </router-link>
    </div>

    <main :class="$style.classifyMain">
      <ul :class="$style.classifyList">
        <li
          v-for="(item, index) of classifyList"
          :class="{[$style.classifyActive]: item.sequenceNbr === currentClassify.sequenceNbr}"
          :key="index"
          v-text="item.categoryName"
          @click="classifyClick(item)"
        />
      </ul>

      <div :class="$style.content">
        <!--<div :class="$style.tip">全部</div>-->
        <!--<div :class="$style.classifyList2">
          <classify-item img="//gw.alicdn.com/tps/TB1Sl1ea4rI8KJjy0FpSuv5hVXa.jpg_140x10000Q75.jpg_.webp" text="手机" />
          <classify-item img="//gw.alicdn.com/tps/O1CN01s4LwGN1wddyf7vsrj_!!2497896331.jpg_140x10000Q75.jpg_.webp" text="手机保护壳" />
          <classify-item img="//gw.alicdn.com/tps/TB2uX59ehAlyKJjSZFyXXbm_XXa_!!2970158389-0-beehive-scenes.jpg_140x10000Q75.jpg_.webp" text="笔记本电脑" />
          <classify-item img="//gw.alicdn.com/tps/TB247WlX2AkyKJjy0FfXXaxhpXa_!!2302025017.jpg_140x10000Q75.jpg_.webp" text="智能手环" />
          <classify-item img="//gw.alicdn.com/tps/TB2oFzffhhmpuFjSZFyXXcLdFXa_!!558893385-0-beehive-scenes.jpg_140x10000Q75.jpg_.webp" text="显示器" />
          <classify-item img="//gw.alicdn.com/tps/O1CN01HoU6GR1Oli1OYGPbk_!!2960761746-2-beehive-scenes.png_140x10000.jpg_.webp" text="平板电脑" />
        </div>-->
        <div :class="$style.tip" v-text="currentClassify.categoryName"></div>
        <load-more :request-methods="getProduct" :form="form" ref="loadMore" :loading.sync="loading" no-content-tip="此分类下还没有商品">
          <template v-slot="{ list }">
            <div :class="$style.productList">
              <lesson-item
                v-for="item of list"
                :key="item.sequenceNbr"
                size="small"
                :id="item.sequenceNbr"
                :title="item.productName"
                :desc="item.productDesc"
                :price="item.productOptions[0].price"
                :img="item.productImage[0].mediaUrl"
                :border="true"
              />
            </div>
          </template>
        </load-more>
      </div>
    </main>
  </div>
</template>

<script>
import LessonItem from '../../components/item/Lesson-Item.vue'
// import ClassifyItem from '../../components/Classify-Item.vue'
import LoadMore from '../../components/Load-More.vue'
import {
  getCategoryTree,
  getProduct
} from '../../apis/classify'
export default {
  name: 'Classify',
  components: {
    LessonItem,
    // ClassifyItem,
    LoadMore
  },
  data () {
    return {
      currentClassify: {
        sequenceNbr: '',
        categoryName: '全部'
      },
      classifyList: [{
        categoryName: '全部',
        sequenceNbr: ''
      }],
      form: {
        categoryCode: '',
        current: 1,
        size: 10,
        productStatus: 'ON_SALE'
      },
      getProduct,
      $refresh: null,
      loading: false
    }
  },
  props: ['optionId'],
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
      if (this.loading) return
      if (classify) {
        this.currentClassify = classify
        this.form.categoryCode = classify.sequenceNbr
        this.form.current = 1
        this.$refresh()
      }
    },
    async getCategoryTree () {
      try {
        const { result } = await getCategoryTree()
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
      color: #01C2C3;
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
  li {
    position: relative;
    width: 160px;
    font-size: 26px;
    text-align: center;
    line-height: 108px;
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
}
.classify-list2 {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.content {
  padding-left: 180px;
  background-color: #fff;
  z-index: 1;
}
.productList {
  display: grid;
  grid-row-gap: 24px;
}
.tip {
  position: relative;
  margin-top: 36px;
  margin-bottom: 40px;
  text-align: center;
  font-size: 24px;
  &:before, &:after {
    position: absolute;
    top: 50%;
    transform: (-50%);
    width: 54px;
    height: 1px;
    content: '';
    background-color: #e7e7e7;
  }
  &:before {
    left: 132px;
  }
  &:after {
    right: 132px;
  }
}
</style>
