<template>
    <div :class="$style.classify">
        <div :class="$style.search">
            <router-link
                tag="div"
                :class="$style.searchBox"
                :to="{ name: 'Search' }"
            >
                <pl-svg name="icon-search" width="30" />
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
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/helperBanner.png">
                </div>
                <template v-if="currentClassify.childs && currentClassify.childs.length">
                    <sub-classify
                        :children="currentClassify.childs"
                        @click="subClassifyClick"
                    />
                    <!--<div :class="$style.classifyList2">
                        &lt;!&ndash;<classify-item
                          v-for="item of currentClassify.childs"
                          :key="item.id"
                          :cid="item.id"
                          :img="item.categoryPic"
                          :text="item.categoryName"
                          @click="subClassifyClick"
                        />&ndash;&gt;
                      </div>-->
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
                            <template v-for="(item, index) of prodList">
                                <goods-item
                                    :key="index"
                                    :id="item.id"
                                    :img="item.productMainImage + '?x-oss-process=style/thum-middle'"
                                    :title="item.productName"
                                    :price="item.price"
                                    :product-type="item.productType"
                                    :data="item"
                                    :activity-product="item.activityProduct"
                                    :rebate="currentClassify.id === '1' ? item.rebate : ''"
                                />
                            </template>
                        </div>
                    </template>
                </load-more>
            </div>
        </main>
    </div>
</template>

<script>
import GoodsItem from '../../components/item/Goods-Item.vue'
import SubClassify from '../../components/item/Sub-Classify.vue'
import LoadMore from '../../components/common/Load-More.vue'
import { getCategoryTree, getProduct } from '../../apis/classify'
import { getActivityProduct } from '../../apis/broker'
import { getCourse } from '../../apis/online-classroom'
import { mapGetters } from 'vuex'
import share from '../../assets/js/wechat/wechat-share'

export default {
    name: 'Classify',
    components: {
        GoodsItem,
        SubClassify,
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
        ...mapGetters(['agentUser', 'appId', 'logoUrl', 'mallName', 'mallDesc']),
        currentClassifyData () {
            return this.classifyList.find(item => item.id === this.optionId)
        }
    },
    created () {
    },
    async mounted () {
        this.form = this.classifyFormTemplate
        await this.$nextTick()
        this.$refresh = this.$refs.loadMore.refresh
    },
    async activated () {
    // 去掉prop传参 refs调用
    // this.$refs.loadMore.setForm(this.form)
    // this.$refs.loadMore.setMethods(getProduct)
        if (this.classifyList.length > 1) {
            // 有分类且有默认值才设置默认分类
            if (this.optionId) {
                this.findDefault()
            }
        } else {
            // 没有分类列表时请求列表，然后设置默认值
            await this.getCategoryTree()
            this.findDefault()
        }
    },
    methods: {
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
        },
        // 切换主分类
        classifyClick (classify) {
            if (this.loading || classify === this.currentClassify) return
            if (classify && (classify.id === '2')) {
                // 点击知识课程
                this.currentClassify = classify
                this.$router.push({ name: 'Classify', params: { optionId: '2' } })
                this.getCourse()
                return
            }
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
                this.classifyList.push({
                    id: '2',
                    categoryName: '知识课程',
                    subCategoryName: '',
                    childs: null
                })
            } catch (e) {
                throw e
            }
        },
        refreshHandler (list) {
            if (this.requestMethods === getCourse) {
                // TODO: 谁也没想到要在分类页面请求知识课程，所以有如下骚操作
                // 知识课程的请求
                /*
                * :img="item.productMainImage + '?x-oss-process=style/thum-middle'"
                                    :title="item.productName"
                                    :price="item.price"
                                    :data="item"
                                    :activity-product="item.activityProduct"
                                    :rebate="currentClassify.id === '1' ? item.realRebate : ''"
                * */
                for (const item of list) {
                    item.productMainImage = item.courseImg
                    item.productName = item.courseName
                    item.price = item.priceType === 1 ? item.sellingPrice : '免费'
                    item.activityProduct = -1
                    item.productType = 'KNOWLEDGE_COURSE'
                }
                this.prodList = list
                return
            }
            // TODO: helper分区里要同时展示普通商品+知识课程
            if (this.currentClassify.id === '1') {
                for (const item of list) {
                    item.id = item.productId
                    item.productMainImage = item.productImg
                    item.price = item.price ? item.price : '免费'
                    // type 1-实体商品+虚拟商品+正式课程 2-知识课程
                    item.productType = item.type === 2 ? 'KNOWLEDGE_COURSE' : ''
                    item.activityProduct = -1
                }
                this.prodList = list
                return
            }
            for (const item of list) {
                // item.status: 0: 规格禁用 1: 规格启用
                const arr = item.productSkuModels.filter(item => item.status === 1)
                const priceList = arr.map(item => {
                    if (item.status === 1) {
                        return Number(item.price)
                    }
                    return 0
                })
                item.price = Math.min(...priceList) || 0
            }
            this.prodList = list
        },
        async getCourse () {
            this.requestMethods = getCourse
        },
        share () {
            const {
                appId,
                logoUrl,
                mallName,
                currentClassifyData = {}
            } = this
            const {
                categoryName,
                categoryPic,
                bannerPic
            } = currentClassifyData
            if (categoryName) {
                share({
                    appId,
                    title: `${ mallName }-${ categoryName }`,
                    desc: '好东西都在这里了~',
                    link: location.href,
                    imgUrl: categoryPic || bannerPic || logoUrl || 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5CU6yfkSWRHJcwP0BibLpr75V8Qc8bpjmP6FfSto1Mrog/0'
                })
            } else {
                share({
                    appId,
                    title: `${ mallName }-全部商品`,
                    desc: '好东西都在这里了~',
                    link: location.href,
                    imgUrl: categoryPic || bannerPic || logoUrl || 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5CU6yfkSWRHJcwP0BibLpr75V8Qc8bpjmP6FfSto1Mrog/0'
                })
            }
        }
    },
    async beforeRouteUpdate (to, from, next) {
        await next()
        await this.$nextTick()
        this.share()
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
