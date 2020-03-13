<template>
    <div :class="$style.rebateList">
        <LoadMore
            :request-methods="getBrokerageList"
            :form="form"
            ref="loadMore"
            @more="more"
            @refresh="refreshHandler"
            icon="icon-no-content2"
        >
            <template>
                <ul class="mt-40">
                    <li
                        v-for="item of formatList"
                        :key="item.timestamp"
                    >
                        <span class="fz-28 gray-3">{{ item.year }}年{{ item.month }}月</span>
                        <ul :class="$style.list + ' mt-28'">
                            <li
                                v-for="(pro, j) of item"
                                :key="j"
                                :class="{ [$style.item]: true, partition: j < item.length }"
                            >
                                <div :class="$style.mainContent">
                                    <img
                                        :class="$style.listItemImg"
                                        v-img-error
                                        :src="pro.mediaInfoModels[0]"
                                        alt=""
                                    >
                                    <div :class="$style.itemRight">
                                        <div :class="$style.titlePrice">
                                            <p
                                                class="fz-28"
                                                v-text="pro.productName"
                                            />
                                            <p class="fz-34 bold">
                                                + ¥<i v-text="pro.price" />
                                            </p>
                                        </div>
                                        <p class="gray-2 fz-24">
                                            数量：<i v-text="pro.count" />
                                        </p>
                                        <div :class="$style.timeStatus">
                                            <span class="fz-22 gray-3">{{ pro.createTime }}</span>
                                            <span
                                                :class="{'fz-26': true, [$style.statusActive]: pro.status === 'AWAIT' }"
                                                v-text="status[pro.status]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div :class="$style.rebateFrom">
                                    <p>
                                        <span :class="$style.title">姓名：</span>
                                        <span v-text="pro.purchaser" />
                                    </p>
                                    <p>
                                        <span :class="$style.title">电话：</span>
                                        <span>
                                            {{ pro.purchaserMobile | formatAccount }}
                                        </span>
                                    </p>
                                </div>
                            </li>
                            <!--<li v-for="(pro, j) of item"-->
                            <!--:key="j"-->
                            <!--:class="{ [$style.item]: true, partition: j < item.length - 1 }" >-->
                            <!--<img v-img-error :src="pro.mediaInfoModels[0].mediaUrl" alt="">-->
                            <!--<div :class="$style.itemRight">-->
                            <!--<div :class="$style.titlePrice">-->
                            <!--<p class="fz-28" v-text="pro.productName" />-->
                            <!--<p class="fz-34 bold">+ <i v-text="pro.price" /></p>-->
                            <!--</div>-->
                            <!--<p class="gray-2 fz-24">数量：<i v-text="pro.count" /></p>-->
                            <!--<div :class="$style.timeStatus">-->
                            <!--<span class="fz-22 gray-3" v-text="pro.createTime"></span>-->
                            <!--<span :class="{'fz-26': true, [$style.statusActive]: pro.status === 'AWAIT' }" v-text="status[pro.status]"></span>-->
                            <!--</div>-->
                            <!--</div>-->
                            <!--</li>-->
                        </ul>
                    </li>
                </ul>
            </template>
        </LoadMore>
    </div>
</template>

<script>
import { getBrokerageList } from '../../../apis/money'
import { mapGetters } from 'vuex'
import LoadMore from '../../../components/common/Load-More.vue'
export default {
    name: 'RebateListVue',
    components: {
        LoadMore
    },
    data () {
        return {
            getBrokerageList,
            form: {
                current: 1,
                size: 10,
                userId: '',
                status: ''
            },
            status: {
                AWAIT: '待入账',
                PASS: '已入账',
                REJECT: '已驳回'
            },
            list: [],
            formatList: []
        }
    },
    computed: {
        ...mapGetters(['userId', 'agencyCode'])
    },
    created () {
        this.form.userId = this.userId
    },
    mounted () {
        this.$refs.loadMore.refresh()
    },
    activated () {
        this.$refs.loadMore.refresh()
    },
    methods: {
        refreshHandler (list) {
            this.formatList = []
            this.list = []
            this.batching(list)
        },
        more (allList, total, currentList) {
            this.batching(currentList)
        },

        // 批处理数据，增加年月属性
        batching (list) {
            list.sort((i, j) => j.timestamp - i.timestamp)
            for (const item of list) {
                item.timestamp = Number(item.timestamp)
                const date = new Date(item.timestamp)
                item.month = date.getMonth() + 1
                item.year = date.getFullYear()
                item.yearMoneth = item.year + item.month
            }
            this.list = [...this.list, ...list]
            if (this.list.length === 0) return
            this.sortUserTime()
        },

        // 按时间排序
        sortUserTime () {
            this.list.sort((i, j) => j.timestamp - i.timestamp)
            this.format()
        },

        // 按年月分组
        format () {
            this.formatList = []
            const listTemp = [...this.list]
            let m = listTemp[0].month
            let y = listTemp[0].year
            while (!this.foramtListLength()) {
                const filter = this.list.filter(item => m === item.month && item.year === y)
                filter.month = m
                filter.year = y
                this.formatList.push(filter)

                // 删除已经过滤出来的项
                for (const item of filter) {
                    const index = listTemp.indexOf(item)
                    listTemp.splice(index, 1)
                }
                if (listTemp.length === 0) {
                    break
                }
                m = listTemp[0].month
                y = listTemp[0].year
            }
        },

        // 判断已经格式化的数量是否等于总数
        foramtListLength () {
            let len = 0
            for (const item of this.formatList) {
                len += item.length
            }
            return len === this.list.length
        }
    }
}
</script>

<style module lang="scss">
  .rebate-list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .list {
    width: 680px;
    margin-bottom: 56px;
    border-radius: 20px;
    overflow: hidden;
  }
  .item {
    background-color: #fff;
    > .main-content {
      padding: 30px 30px 16px 30px;
      display: flex;
      .listItemImg {
        width: 82px;
        height: 82px;
        margin-top: 4px;
        margin-right: 26px;
        object-fit: cover;
        border-radius: $--radius2;
      }
    }
    > .rebate-from {
      margin-left: 30px;
      padding-top: 24px;
      padding-bottom: 27px;
      padding-right: 30px;
      font-size: 24px;
      border-top: 1px solid #e7e7e7;
      > p {
        display: flex;
        justify-content: space-between;
        > .title {
          color: #666;
        }
        &:nth-last-of-type(1) {
          margin-top: 16px;
        }
      }
    }
  }
  .item-right {
    display: inline-flex;
    flex-direction: column;
    flex: 1;
  }
  .title-price {
    display: inline-flex;
    justify-content: space-between;
    margin-bottom: 8px;
    line-height: 40px;
    p {
      &:nth-of-type(1) {
        width: 350px;
        @include elps
      }
    }
  }
  .time-status {
    display: inline-flex;
    justify-content: space-between;
    margin-top: 14px;
    span {
      align-self: flex-end;
      &.status-active {
        color: $--primary-color;
      }
    }
  }
</style>
