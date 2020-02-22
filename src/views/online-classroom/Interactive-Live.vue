<template>
  <div :class="$style.interactiveLive">
    <load-more
      ref="LiveLoadMore"
      :form="form"
      :request-methods="requestMethods"
      :loading.sync="loading"
      @refresh="refreshNowLiveHandler"
      icon="icon-no-content-sleep"
    >
      <template>
        <div v-if="nowLive.length">
          <div :class="$style.title">
            <pl-svg name="icon-live-a8210" width="36" />
            正在直播
            <span>({{ nowLive.length }})</span>
          </div>
          <ul :class="$style.nowLiveList">
            <li v-for="(item, index) of nowLive" :key="index" :class="$style.nowLiveItem">
              <img :src="item.coverImg" alt="">
              <div :class="$style.itemBottom">
                <div :class="$style.desc">
                  <div :class="$style.liveName" v-text="item.name" />
                  <div :class="$style.text1">直播时间： {{ item.liveStartTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
                  <div :class="$style.text1">主讲讲师： {{ item.lecturer }}</div>
                </div>

                <div :class="$style.right">
                  <span v-if="item.actuallyPaidAmount" :class="$style.price" v-text="item.actuallyPaidAmount" />
                  <span :class="$style.free" v-else>免费</span>
                  <pl-button type="primary" size="middle" @click="$router.push({ name: 'LiveRoom' })">去看直播</pl-button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="futureLive.length">
          <div :class="$style.title">
            <pl-svg name="icon-time-866c0" width="36" />
            即将开始
            <span>({{ futureLive.length }})</span>
          </div>
          <ul :class="$style.list">
            <li v-for="(item, index) of futureLive" :key="index" :class="$style.item">
              <img :src="item.coverImg" alt="">
              <div :class="$style.desc">
                <div :class="$style.liveTitle">{{ item.name }}</div>
                <div :class="$style.text2">直播时间： {{ moment(item.liveStartTime).format('YYYY-MM-DD HH:mm') }}</div>
                <div :class="$style.text2">主讲讲师： {{ item.lecturer }}</div>
                <div :class="$style.bottom">
                  <span :class="$style.price" v-if="item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                  <span :class="$style.free" v-else>免费</span>
                  <pl-button
                    type="primary"
                    size="middle"
                    v-if="item.isMin && !nowLiveList.length"
                    @click="$router.push({ name: 'LiveRoom' })"
                  >
                    去看直播
                  </pl-button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="pastLive.length">
          <div :class="$style.title">
            <pl-svg name="icon-tv-76530" width="36" />
            往期直播
            <span>({{ pastLive.length }})</span>
          </div>
          <ul :class="$style.list">
            <li v-for="(item, index) of pastLive" :key="index" :class="$style.item">
              <img :src="item.coverImg" alt="">
              <div :class="$style.desc">
                <div :class="$style.liveTitle">{{ item.name }}</div>
                <div :class="$style.text2">已结束： {{ moment(item.liveEndTime).format('YYYY-MM-DD HH:mm') }}</div>
                <div :class="$style.text2">主讲讲师： {{ item.lecturer }}</div>
                <div :class="$style.bottom">
                  <span :class="$style.price" v-if="item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                  <span :class="$style.free" v-else>免费</span>
                  <pl-button
                    type="warning"
                    size="middle"
                    v-if="item.videoLibId !== '0'"
                    @click="$router.push({ name: 'LivePlayBack', params :{ activityId: item.id, id: item.videoLibId, payCount: item.actuallyPaidAmount } })"
                  >
                    看回放
                  </pl-button>
                  <pl-button v-else type="primary" size="middle">不支持回放</pl-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </load-more>
    <!--<div v-if="!nowLiveList.length && !futureLiveList.length && !pastLiveList.length" class="no-content">
      <pl-svg name="icon-no-content-sleep" width="100px" />
      <div> 暂无直播 </div>
    </div>-->
  </div>
</template>
<script>
import { getLiveList } from '../../apis/online-classroom.js'
import LoadMore from '../../components/common/Load-More.vue'
import moment from 'moment'
export default {
  name: 'InteractiveLive',
  components: {
    LoadMore
  },
  async activated () {
    this.refresh()
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if (from.name !== 'LivePlayBack') {
  //       vm.refresh()
  //     }
  //   })
  // },
  data () {
    return {
      moment,
      form: {
        current: 1,
        size: 10,
        type: ''
      },
      // nowLiveForm: {
      //   current: 1,
      //   size: 10,
      //   type: ''
      // },
      // nowLiveList: [],
      // loadingNowLive: false,
      // pastLiveForm: {
      //   current: 1,
      //   size: 10,
      //   type: 'PAST'
      // },
      // pastLiveList: [],
      // loadingPastLive: false,
      // futureLiveForm: {
      //   current: 1,
      //   size: 10,
      //   type: 'FUTURE'
      // },
      // futureLiveList: [],
      list: [],
      loading: false,
      requestMethods: getLiveList
    }
  },
  computed: {
    // 正在直播
    nowLive () {
      return this.list.filter(item => {
        const {
          liveStartTime,
          liveEndTime
        } = item
        const now = Date.now()
        return now > moment(liveStartTime).valueOf() && now < moment(liveEndTime).valueOf()
      })
    },
    // 即将开始
    futureLive () {
      return this.list.filter(item => {
        const { liveStartTime } = item
        const now = Date.now()
        return now < moment(liveStartTime).valueOf()
      })
    },
    // 往期直播
    pastLive () {
      return this.list.filter(item => {
        const { liveEndTime } = item
        const now = Date.now()
        return now > moment(liveEndTime).valueOf()
      })
    }
  },
  methods: {
    async refresh () {
      try {
        await this.$refs.LiveLoadMore.refresh()
      } catch (e) {
        throw e
      }
    },
    // 列表刷新事件
    refreshNowLiveHandler (list) {
      this.list = list
    }
  }
}
</script>
<style lang="scss" module>
  .interactive-live {
    padding: 0 20px;
  }

  .title {
    margin: 32px 0 20px;
    line-height: 42px;
    font-size: 32px;
    font-weight: bold;
    > svg {
      margin-right: 5px;
      vertical-align: -6px;
    }
    > span {
      font-size: 24px;
      font-weight: bold;
      color: #999;
    }
  }

  .now-live-list {
  }

  .now-live-item {
    width: 100%;
    border-radius: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    background-color: #F8F8F8;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    > img {
      width: 100%;
      height: 474px;
    }
    .desc {
      flex: 1;
      .live-name {
        width: 490px;
        margin-bottom: 12px;
        font-size: 30px;
        font-weight: bold;
        @include elps();
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      > .price {
        margin-bottom: 18px;
        color: #FE7700;
        font-size: 48px;
        &:before {
          content: '¥';
          font-size: 24px;
        }
      }
      > .free {
        margin-bottom: 32px;
        color: #FE7700;
        font-size: 30px;
      }
    }
  }
  .item-bottom {
    display: flex;
    padding: 20px 24px;
  }
  .text1 {
    margin-bottom: 4px;
    font-size: 26px;
    color: #828282;
    vertical-align: middle;
  }
  .text2 {
    font-size: 22px;
    color: #666;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    > .item {
      width: 340px;
      overflow: hidden;
      margin-right: 30px;
      &:nth-of-type(2n) {
        margin-right: 0;
      }
      > img {
        width: 100%;
        height: 228px;
        object-fit: cover;
        border-radius: 20px;
      }
      .desc {
        margin-top: 16px;
      }
      .live-title {
        margin-bottom: 4px;
        font-size: 24px;
        color: #000;
        font-weight: bold;
        @include elps();
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 16px;
      }
      .price {
        font-size: 32px;
        color: #FE7700;
        font-weight: bold;
        &:before {
          content: '¥';
          font-size: 20px;
        }
      }
      .free {
        font-size: 28px;
        color: #FE7700;
      }
    }
  }
</style>
