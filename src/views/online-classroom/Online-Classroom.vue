<template>
    <div :class="$style.onlineClassroom">
        <!--TODO.暂时不显示分类-->
        <div
            v-if="false"
            :class="{
                [$style.classifyMain]: true,
                [$style.showAll]: isShowAll
            }"
        >
            <ul :class="$style.classifyList">
                <li
                    v-for="(item, index) in classifyList"
                    :class="{
                        [$style.active]: form.category1 === item.category1 && form.category2===item.category2
                    }"
                    :key="index"
                    @click="classifyClick(item)"
                >
                    {{ item.categoryName }}
                </li>
                <li :class="$style.close" v-if="isShowAll">
                    <pl-svg
                        name="icon-close"
                        fill="#fff"
                        width="36"
                        @click="isShowAll = false"
                    />
                </li>
            </ul>
            <transition name="fade">
                <div :class="$style.controlWrap" v-if="classifyList.length">
                    <div :class="$style.control">
                        <pl-svg
                            v-show="!isShowAll"
                            name="icon-group"
                            width="24"
                            fill="#484848"
                            @click="isShowAll = true"
                        />
                    </div>
                </div>
            </transition>
        </div>
        <load-more
            ref="loadMore"
            :form="form"
            :request-methods="requestMethods"
            :loading.sync="loading"
            @refresh="refreshHandler"
            no-content-tip="此分类下还没有课程"
        >
            <template>
                <ul :class="$style.courseList">
                    <li
                        v-for="(item, index) of courseList"
                        :key="index"
                        :class="{
                            [$style.courseItem]: true,
                            [$style.hadBuy]: item.orderId
                        }"
                        @click.capture="study(item)"
                    >
                        <div :class="$style.img">
                            <img :src="item.courseImg + '?x-oss-process=style/thum-small'" alt="">
                            <div :class="$style.countDown">
                                <count-down
                                    :endtime="item.regularSaleTime"
                                    theme="black"
                                    @done="$refresh"
                                />
                            </div>
                        </div>
                        <div :class="$style.desc">
                            <div :class="$style.title" v-text="item.courseName" />
                            <div :class="[$style.text1, item.lecturer? '' : $style.noLecturer]">
                                <span v-if="item.lecturer">主讲人： {{ item.lecturer }}</span>
                            </div>
                            <div :class="$style.bottom">
                                <template>
                                    <span v-if="item.priceType === 1" :class="$style.priceZoom">
                                        <span :class="$style.price" v-text="item.sellingPrice" />
                                        <del v-if="item.originalPrice" :class="$style.original" v-text="item.originalPrice" class="rmb" />
                                    </span>
                                    <span v-else :class="$style.free">免费</span>
                                </template>
                                <template>
                                    <pl-button :class="$style.notStart" v-if="item.isNotStart" type="primary">暂未开始</pl-button>
                                    <pl-button v-else-if="item.isGive" type="primary">已赠课</pl-button>
                                    <pl-button v-else-if="item.orderId || (item.isGive && item.isWatch)" type="warning">学习中</pl-button>
                                    <pl-button v-else type="primary">订购中</pl-button>
                                </template>
                            </div>
                        </div>
                    </li>
                </ul>
            </template>
        </load-more>
    </div>
</template>
<script>
import { getServerTime } from '../../apis/base-api'
import { getCourse } from '../../apis/online-classroom.js'
import { getCategoryTree } from '../../apis/classify'
import LoadMore from '../../components/common/Load-More.vue'
import CountDown from '../../components/product/Courses-Count-Down.vue'
export default {
    name: 'OnlineClassroom',
    components: {
        LoadMore,
        CountDown
    },
    data () {
        return {
            form: {
                category1: '',
                category2: '',
                courseType: 1,
                current: 1,
                size: 10
            },
            isShowAll: false,
            classifyList: [],
            requestMethods: getCourse,
            loading: false,
            $refresh: null,
            courseList: [],
            // 当前本地时间与服务器时间的差值
            duration: 0
        }
    },
    async activated () {
        try {
            // TODO.暂时没有分类
            /* if (!this.classifyList.length) { // 有分类且有默认值才设置默认分类
                await this.getCategoryTree()
              } */
            this.$refresh = this.$refs.loadMore.refresh

            // 解决因刷新浏览器后，在beforeRouteEnter无法获取到dom信息，导致无法正常调用refresh问题
            if (!this.courseList.length) {
                this.$refresh()
            }
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        this.isShowAll = false
    },
    beforeRouteEnter (to, from, next) {
        next(async vm => {
            await vm.getServerTime()
            if (from.name !== 'Curriculum') {
                vm.$refs.loadMore.refresh()
            }
        })
    },
    methods: {
        async getCategoryTree () {
            try {
                const { result } = await getCategoryTree()
                const classifyList = [{
                    category1: '',
                    category2: '',
                    categoryName: '全部'
                }]
                if (result.length) {
                    for (const i in result) {
                        const item = result[i]

                        if (item.childs) {
                            for (const j in item.childs) {
                                const classifyItem = {}
                                classifyItem.category1 = item.id
                                const subItem = item.childs[j]
                                classifyItem.category2 = subItem.id
                                classifyItem.categoryName = subItem.categoryName
                                classifyList.push(classifyItem)
                            }
                        } else {
                            const classifyItem = {}
                            classifyItem.category1 = item.id
                            classifyItem.category2 = ''
                            classifyItem.categoryName = item.categoryName
                            classifyList.push(classifyItem)
                        }
                    }
                }
                this.classifyList = classifyList
            } catch (e) {
                throw e
            }
        },
        async classifyClick (item) {
            try {
                this.form.current = 1
                this.form.category1 = item.category1
                this.form.category2 = item.category2
                this.isShowAll = false
                this.$refresh()
            } catch (e) {
                throw e
            }
        },
        async getServerTime (difference = 0) {
            try {
                const now = Date.now()
                const { result: time } = await getServerTime()
                const end = Date.now()
                // 返回的时间加上请求时间
                const serverTime = Number(time) + (end - now) + difference
                this.duration = new Date(serverTime).valueOf() - new Date().valueOf()
            } catch (e) {
                throw e
            }
        },
        refreshHandler (list) {
            this.courseList = this.addAtrToItem(list)
        },
        addAtrToItem (list) {
            const currentTimeStamp = new Date().valueOf() + this.duration
            for (const item of list) {
                item.isNotStart = new Date(item.regularSaleTime).valueOf() > currentTimeStamp
            }
            return list
        },
        study (item) {
            this.$router.push({ name: 'Curriculum', params: { productId: item.id } })
        }
    }
}
</script>
<style lang="scss" module>
  .online-classroom {
    /*padding: 14vw 20px 20px;*/
    padding: 20px;
    min-height: 50vh;
    background-color: #fff;
  }
  .classify-main {
    position: fixed;
    top: 91px;
    left: 0;
    min-height: 105px;
    width: 100vw;
    padding: 0 74px 0 28px;
    box-sizing: border-box;
    overflow-x: scroll;
    overflow-y: hidden;
    background-color: #fff;
    z-index: 10;
  }
  .control-wrap {
    position: fixed;
    top: 117px;
    right: 0;
    padding-left: 20px;
    overflow-y: hidden;
  }
  .control {
    width: 70px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    background-color: #FFF;
    box-shadow: -3px 0 6px rgba(0, 0, 0, .2);
    > svg {
      margin-left: 18px;
    }
  }
  .classify-list {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: max-content;
    padding-right: 90px;
    padding-top: 26px;
    background-color: #fff;
    box-sizing: border-box;
    > li {
      display: inline-block;
      padding: 0 15px;
      line-height: 42px;
      text-align: center;
      font-size: 22px;
      color: #666666;
      word-break: keep-all;
      white-space : nowrap;
      &.active {
        background: #FDF5E7;
        border: 1px solid #F3AD3C;
        border-radius: 22px;
        color: #F3AD3C;
      }
    }
    .close {
      position: absolute;
      bottom: -70px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .show-all {
    padding: 0;
    height: calc(100vh - 178px);
    box-shadow: 0 5px 5px rgba(0, 0, 0, .1);
    background-color: rgba(0, 0, 0, .3);
    .classify-list {
      width: 100%;
      flex-wrap: wrap;
      padding-right: 28px;
      padding-left: 28px;
    }
    .control {
      display: none;
    }
  }
  .course-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
  .course-item {
    position: relative;
    width: calc(50% - 15px);
    margin-bottom: 32px;
    &.had-buy:before {
      content: '已购';
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width:100px;
      border-radius:20px 0px 20px 0px;
      background:#FE7700;
      line-height:42px;
      text-align: center;
      font-size:24px;
      color: #fff;
    }
    > .img {
      position: relative;
      width: 340px;
      height: 228px;
      margin-bottom: 16px;
      border-radius: 20px;
      overflow: hidden;
      .count-down{
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 52px;
        border-radius: 0 0 12px 12px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 18px;
    .price-zoom {
      max-width: 200px;
    }
    .price {
      font-size: 32px;
      color: #FE7700;
      font-weight: bold;
      &:before {
        content: '¥';
        margin-right: 4px;
        font-size: 20px;
        vertical-align: 3px;
      }
    }
    .original {
      display: block;
      font-size: 20px;
      color: #999;
    }
    .free {
      font-size: 28px;
      color: #FE7700;
    }
    .not-start {
      background-color: rgba(254,119,0,0.3);
    }
  }
  .title {
    width: 340px;
    margin-bottom: 4px;
    font-size: 24px;
    color: #000;
    font-weight: bold;
    @include elps();
  }
  .noLecturer {
    margin-bottom: 45px;
  }
  .text1 {
    width: 340px;
    font-size: 22px;
    color: #666;
    @include elps();
  }
</style>
