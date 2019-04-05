<template>
  <div :class="$style.rebateList">
    <LoadMore :requestMethods="getBrokerageList"
              :form="form"
              ref="loadMore"
              @more="more"
              @refresh="refreshHandler"
              icon="no-content2">
      <template>
        <ul>
          <li v-for="item of formatList" :key="item.timestamp">
            <span class="fz-28 gray-3">{{item.year}}年{{item.month}}月</span>
            <ul :class="$style.list + ' mt-28'">
              <li v-for="(pro, j) of item"
                  :key="j"
                  :class="{ [$style.item]: true, partition: j < item.length }" >
                <img v-img-error :src="pro.mediaInfoModels[0].mediaUrl" alt="">
                <div :class="$style.itemRight">
                  <div :class="$style.titlePrice">
                    <p class="fz-28" v-text="pro.productName" />
                    <p class="fz-34 bold">+ <i v-text="pro.price" /></p>
                  </div>
                  <p class="gray-2 fz-24">数量：<i v-text="pro.count" /></p>
                  <div :class="$style.timeStatus">
                    <span class="fz-22 gray-3" v-text="pro.createTime"></span>
                    <span :class="{'fz-26': true, [$style.statusActive]: pro.status === 'AWAIT' }" v-text="status[pro.status]"></span>
                  </div>
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
import LoadMore from '../../../components/Load-More.vue'
export default {
  name: 'Rebate-List.vue',
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
        status: '',
        agencyCode: ''
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
    this.form.agencyCode = this.agencyCode
  },
  mounted () {
    this.$refs.loadMore.refresh()
  },
  methods: {
    refreshHandler (list) {
      this.formatList = []
      this.batching(list)
    },
    more (allList, total, currentList) {
      this.batching(currentList)
    },
    // 批处理数据，增加年月属性
    batching (list) {
      list.sort((i, j) => {
        return i.timestamp < j.timestamp
      })
      for (let item of list) {
        item.timestamp = Number(item.timestamp)
        let date = new Date(item.timestamp)
        item.month = date.getMonth() + 1
        item.year = date.getFullYear()
        item.yearMoneth = item.year + item.month
      }
      this.list = [...list]
      this.format()
    },

    // 按年月分组
    format () {
      if (this.list.length === 0) return
      let list = this.list
      // 每次取出list中的第一个作为标准
      let warp = [list[0]]
      warp.year = list[0].year
      warp.month = list[0].month
      // 然后删除list中的第一个
      list.splice(0, 1)
      // 用wrap中的第一个与list中的其他做比较，去除年月相同的项目放入warp中
      for (let item of list) {
        if (item.yearMoneth === warp[0].yearMoneth) {
          warp.push(item)
        }
      }
      // 从list中删除存在与warp中的项
      for (let item of warp) {
        let index = list.indexOf(item)
        if (index !== -1) {
          list.splice(index, 1)
        }
      }
      // 此时已经按年月分号了一组数据，放入formatList中
      this.formatList.push(warp)
      // 进行尾递归，直到list中没有数据
      return this.format()
    }
  }
}
</script>

<style module lang="scss">
  .rebate-list {
    padding: 40px;
  }
  .list {
    margin-bottom: 56px;
    border-radius: 20px;
    overflow: hidden;
  }
  .item {
    display: flex;
    padding: 30px;
    background-color: #fff;
    img {
      width: 82px;
      height: 82px;
      margin-right: 26px;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .item-right {
    display: inline-flex;
    width: 100%;
    flex-direction: column;
  }
  .title-price {
    display: inline-flex;
    justify-content: space-between;
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
    margin-top: 18px;
    span {
      align-self: flex-end;
      &.status-active {
        color: var(--primary-color);
      }
    }
  }
</style>
