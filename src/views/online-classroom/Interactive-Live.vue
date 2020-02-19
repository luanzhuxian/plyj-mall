<template>
  <div class="interactive-live">
    <div class="now-live" v-show="nowLiveList.length">
      <div class="title">
        <pl-svg name="icon-live-a8210" width="30" />
        正在直播
        <span>({{ nowLiveList.length }})</span>
      </div>
      <div class="content">
        <load-more
          ref="nowLiveLoadMore"
          :form="nowLiveForm"
          :request-methods="requestMethods"
          :loading.sync="loadingNowLive"
          @refresh="refreshNowLiveHandler"
        >
          <template>
            <div v-for="(item, index) of nowLiveList" :key="index" class="live-item-type1">
              <img :src="item.coverImg" alt="">
              <div class="desc">
                <h5>{{ item.name }}</h5>
                <span class="time">直播时间： {{ item.liveStartTime }}</span>
                <span v-if="item.lecturer">主讲讲师： {{ item.lecturer }}</span>
                <div class="price">
                  <template v-if="item.paidAmount">
                    <span>￥</span>{{ item.paidAmount }}
                  </template>
                  <template v-else>免费</template>
                </div>
                <button @click="$router.push({ name: 'LiveRoom' })">去看直播</button>
              </div>
            </div>
          </template>
        </load-more>
      </div>
    </div>
    <div class="future-live" v-show="futureLiveList.length">
      <div class="title">
        <pl-svg name="icon-time-866c0" width="30" />
        即将开始
        <span>({{ futureLiveList.length }})</span>
      </div>
      <div class="content">
        <load-more
          ref="futureLiveLoadMore"
          :form="futureLiveForm"
          :request-methods="requestMethods"
          :loading.sync="loadingFutureLive"
          @refresh="refreshFutureLiveHandler"
        >
          <template>
            <div v-for="(item, index) of futureLiveList" :key="index" class="live-item-type1">
              <img :src="item.coverImg" alt="">
              <div class="desc">
                <h5>{{ item.name }}</h5>
                <span class="time">直播时间： {{ item.liveStartTime }}</span>
                <span v-if="item.lecturer">主讲讲师： {{ item.lecturer }}</span>
                <div class="price">
                  <template v-if="item.paidAmount">
                    <span>￥</span>{{ item.paidAmount }}
                  </template>
                  <template v-else>免费</template>
                </div>
                <button v-if="item.isMin && !nowLiveList.length" @click="$router.push({ name: 'LiveRoom' })">去看直播</button>
              </div>
            </div>
          </template>
        </load-more>
      </div>
    </div>
    <div class="past-live" v-show="pastLiveList.length">
      <div class="title">
        <pl-svg name="icon-tv-76530" width="30" />
        往期直播
        <span>({{ pastLiveList.length }})</span>
      </div>
      <div class="content">
        <load-more
          ref="pastLiveLoadMore"
          :form="pastLiveForm"
          :request-methods="requestMethods"
          :loading.sync="loadingPastLive"
          @refresh="refreshPastLiveHandler"
        >
          <template>
            <div v-for="(item, index) of pastLiveList" :key="index" class="live-item-type2">
              <img :src="item.coverImg" alt="">
              <div class="desc">
                <h5>{{ item.name }}</h5>
                <span class="time">直播时间： {{ item.liveStartTime }}</span>
                <span v-if="item.lecturer">主讲讲师： {{ item.lecturer }}</span>
                <div class="price">
                  <template v-if="item.paidAmount">
                    <span>￥</span>{{ item.paidAmount }}
                  </template>
                  <template v-else>免费</template>
                </div>
                <button v-if="item.videoLibId!=='0'" @click="$router.push({name:'LivePlayBack',params:{id: item.videoLibId, activityId: item.id}})">看回放</button>
                <button v-else class="not-support">不支持回放</button>
              </div>
            </div>
          </template>
        </load-more>
      </div>
    </div>
    <div v-if="!nowLiveList.length && !futureLiveList.length && !pastLiveList.length" class="no-content">
      <pl-svg name="icon-no-content-sleep" width="100px" />
      <div> 暂无直播 </div>
    </div>
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
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'LivePlayBack') {
        vm.refresh()
      }
    })
  },
  data () {
    return {
      nowLiveForm: {
        current: 1,
        size: 10,
        type: 'NOW'
      },
      nowLiveList: [],
      loadingNowLive: false,
      pastLiveForm: {
        current: 1,
        size: 10,
        type: 'PAST'
      },
      pastLiveList: [],
      loadingPastLive: false,
      futureLiveForm: {
        current: 1,
        size: 10,
        type: 'FUTURE'
      },
      futureLiveList: [],
      loadingFutureLive: false,
      requestMethods: getLiveList
    }
  },
  methods: {
    refresh () {
      try {
        this.$refs.nowLiveLoadMore.refresh()
        this.$refs.futureLiveLoadMore.refresh()
        this.$refs.pastLiveLoadMore.refresh()
      } catch (e) {
        throw e
      }
    },
    refreshNowLiveHandler (list) {
      this.nowLiveList = list
    },
    refreshPastLiveHandler (list) {
      this.pastLiveList = list
    },
    refreshFutureLiveHandler (list) {
      let minIndex = 0
      for (let i = 0; i < list.length - 1; i++) {
        let curTime = moment(list[i].liveStartTime)
        let minTime = moment(list[minIndex].liveStartTime)
        minIndex = curTime.isBefore(minTime) ? i : minIndex
      }
      list[minIndex].isMin = true
      this.futureLiveList = list
    }
  }
}
</script>
<style lang="scss" scoped>
  .no-content {
    height: calc(100vh - 300px);
    padding-top: 200px;
    text-align: center;
    > div{
      margin-top: 60px;
      font-size: 40px;
      letter-spacing: 5px;
      color: #666;
    }
  }

  .title {
    height: 30px;
    padding: 10px 0;
    font-size:16px;
    font-weight:bold;
    line-height: 30px;
    color:#333;
    > svg {
      vertical-align: middle;
    }
    >span {
      font-size:12px;
      font-weight:bold;
      color:#999;
    }
  }

  .live-item-type1 {
    width: 100%;
    img {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }
    .desc {
      position: relative;
      padding: 10px 12px 16px;
      background:#F8F8F8;
      border-radius:0px 0px 10px 10px;
      >h5{
        width:160px;
        font-size:16px;
        color:#222;
        @include elps-wrap(1);
      }
      >span {
        font-size:14px;
        color:#828282;
        &.time {
          display: block;
          padding: 6px 0;
        }
      }
      .price {
        position: absolute;
        top: 3px;
        right: 12px;
        font-size:16px;
        color:#FE7700;
        span {
          font-weight:400;
          font-size:10px;
        }
      }
      > button {
        position: absolute;
        bottom: 16px;
        right: 12px;
        width:80px;
        height:30px;
        background:#FE7700;
        border-radius:4px;
        font-size:16px;
        line-height:30px;
        color:#FFF;
      }
    }
  }

  .live-item-type2 {
    margin: 1%;
    display: inline-block;
    width: 48%;
    img {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }
    .desc {
      position: relative;
      padding: 10px 12px 16px;
      background:#F8F8F8;
      border-radius:0px 0px 10px 10px;
      >h5{
        width:160px;
        font-size:16px;
        color:#222;
        @include elps-wrap(1);
      }
      >span {
        font-size:14px;
        color:#828282;
        &.time {
          display: block;
          padding: 6px 0;
        }
      }
      .price {
        margin-top: 10px;
        font-size:16px;
        color:#FE7700;
        span {
          font-weight:400;
          font-size:10px;
        }
      }
      > button {
        position: absolute;
        bottom: 16px;
        right: 12px;
        width:80px;
        height:30px;
        background-color:#FE7700;
        border-radius:4px;
        font-size:16px;
        line-height:30px;
        color:#FFF;
        &.not-support {
          width:100px;
          background-color: rgba(254, 119, 0, 0.3);
        }
      }
    }
  }
</style>
