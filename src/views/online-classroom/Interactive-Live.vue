<template>
    <div>
        <div :class="$style.interactiveLive">
            <load-more
                ref="LiveLoadMore"
                :form="form"
                :request-methods="requestMethods"
                :loading.sync="loading"
                :before-refresh="beforeRefresh"
                @refresh="refreshed"
                @more="more"
                icon="icon-no-content-sleep"
            >
                <template>
                    <div v-if="nowLive.length">
                        <div :class="$style.title">
                            <pl-svg name="icon-live-a8210" width="36" />
                            正在直播
                            <span>({{ totals.NOW }})</span>
                        </div>
                        <ul>
                            <li
                                v-for="(item, index) of nowLive"
                                :key="index"
                                :class="$style.nowLiveItem"
                                @click.capture="$router.push({ name: 'LiveRoom', params: { id: item.roomValue } })"
                            >
                                <img :src="item.coverImg + '?x-oss-process=style/thum-small'" alt="">
                                <div :class="$style.itemBottom">
                                    <div :class="$style.desc">
                                        <div :class="$style.liveName" v-text="item.name" />
                                        <div :class="$style.text1">直播时间： {{ item.liveStartTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
                                        <div :class="$style.text1" v-if="item.lecturer">主讲人： {{ item.lecturer }}</div>
                                    </div>

                                    <div :class="$style.right">
                                        <span v-if="(item.isPay !== 0) && item.actuallyPaidAmount" :class="$style.price" v-text="item.actuallyPaidAmount" />
                                        <span :class="$style.free" v-else>免费</span>
                                        <pl-button type="primary">去看直播</pl-button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div v-if="futureLive.length">
                        <div :class="$style.title">
                            <pl-svg name="icon-time-866c0" width="36" />
                            即将开始
                            <span>({{ totals.FUTURE }})</span>
                        </div>
                        <ul>
                            <li
                                v-for="(item, index) of futureLive"
                                :key="index"
                                :class="$style.nowLiveItem"
                                @click.capture="$router.push({ name: 'LiveRoom', params: { id: item.roomValue } })"
                            >
                                <img :src="item.coverImg + '?x-oss-process=style/thum-small'" alt="">
                                <div :class="$style.itemBottom">
                                    <div :class="$style.desc">
                                        <div :class="$style.liveName">{{ item.name }}</div>
                                        <div :class="$style.text1">直播时间： {{ item.liveStartTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
                                        <div :class="$style.text1" v-if="item.lecturer">主讲人： {{ item.lecturer }}</div>
                                    </div>
                                    <div :class="$style.right">
                                        <span :class="$style.price" v-if="(item.isPay !== 0) && item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                                        <span :class="$style.free" v-else>免费</span>
                                        <pl-button type="primary">
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
                            <span>({{ totals.PAST }})</span>
                        </div>
                        <ul :class="$style.list">
                            <li
                                v-for="(item, index) of pastLive"
                                :key="index"
                                :class="$style.item"
                                @click.capture="() => { item.videoLibId !== '0' ? $router.push({ name: 'LivePlayBack', params:{ id: item.videoLibId, activityId: item.id, isValidateEndTime: '0' } }) : '' }"
                            >
                                <img :src="item.coverImg + '?x-oss-process=style/thum-small'" alt="">
                                <div :class="$style.desc">
                                    <div :class="$style.liveTitle">{{ item.name }}</div>
                                    <div :class="$style.text2">已结束： {{ item.liveStartTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
                                    <div :class="$style.text2" v-if="item.lecturer">主讲人： {{ item.lecturer }}</div>
                                    <div :class="$style.bottom">
                                        <span :class="$style.price" v-if="(item.isPay !== 0) && item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                                        <span :class="$style.free" v-else>免费</span>
                                        <pl-button
                                            type="warning"
                                            v-if="item.videoLibId !== '0'"
                                        >
                                            看回放
                                        </pl-button>
                                        <span v-else :class="$style.notSupport">不支持回放</span>
                                    </div>
                                </div>
                            </li>
                            <li v-if="totals.PAST % 2 === 1" :class="[$style.item, $style.noContent]">
                                <img src="https://mallcdn.youpenglai.com/static/admall/2.9.0/no-live.png?x-oss-process=style/thum-small" alt="">
                                <div :class="$style.desc">敬请期待</div>
                            </li>
                        </ul>
                    </div>
                </template>
            </load-more>
        </div>
    </div>
</template>
<script>
import { getLiveList } from '../../apis/online-classroom.js'
import LoadMore from '../../components/common/Load-More.vue'
import { promise } from '../../assets/js/util'
export default {
    name: 'InteractiveLive',
    components: {
        LoadMore
    },
    data () {
        return {
            form: {
                current: 1,
                size: 10,
                type: ''
            },

            /**
       * 所有类型字段的迭代器，['NOW', 'FUTURE', 'PAST'][Symbol.iterator]()
       * 第一次加载迭代NOW，即正在直播，当正在直播加载完毕以后，自动迭代到FUTURE，依此类推
       */
            type: null,
            list: {
                NOW: [],
                PAST: [],
                FUTURE: []
            },
            totals: {
                NOW: 0,
                PAST: 0,
                FUTURE: 0
            },
            loading: false,
            requestMethods: getLiveList
        }
    },
    async mounted () {
        try {
            this.init()
            await this.getData()
        } catch (e) {
            throw e
        }
    },
    computed: {
        // 正在直播
        nowLive () {
            return this.formatPaidAmount(this.list.NOW)
        },
        // 即将开始
        futureLive () {
            return this.formatPaidAmount(this.list.FUTURE)
        },
        // 往期直播
        pastLive () {
            return this.formatPaidAmount(this.list.PAST)
        }
    },
    methods: {
        init () {
            this.type = ['NOW', 'FUTURE', 'PAST'][Symbol.iterator]()
            this.form.type = this.type.next().value
        },
        async getData () {
            try {
                await this.$nextTick()
                await promise.timeout(650)
                await this.$refs.LiveLoadMore.refresh()
            } catch (e) {
                throw e
            }
        },
        formatPaidAmount (list) {
            // 后台返回的paidAmount单位为分，要转换为元
            list.forEach(item => {
                item.actuallyPaidAmount = Number(Number(item.paidAmount / 100).toFixed(2))
            })
            return list
        },

        // 手动刷新前恢复参数到最初状态
        beforeRefresh () {
            this.init()
            return true
        },

        // 列表刷新事件
        refreshed (list, total) {
            this.totals[this.form.type] = total
            this.list[this.form.type] = list

            // 按顺序请求列表，先请求正在直播的列表，如果正在直播列表加载完毕，就请求下一个列表
            if (list.length < this.form.size) {
                const type = this.type.next().value
                if (type) {
                    this.form.type = type
                    this.getData()
                }
            }
        },

        // 加载更多事件
        more (oldList, total, newList) {
            if (newList.length === 0) {
                const type = this.type.next().value
                if (type) {
                    this.form.type = type
                    this.getData()
                } else {
                    this.init()
                }
            }
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
        width: calc(100vw - 320px);
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
          margin-right: 4px;
          font-size: 24px;
          vertical-align: 3px;
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
  .notSupport {
    font-size: 22px;
    color: #666;
    margin-right: 20px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    > .item {
      width: 340px;
      margin-bottom: 32px;
      margin-right: 30px;
      overflow: hidden;
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
        min-height: 60px;
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
      .free {
        font-size: 28px;
        color: #FE7700;
      }
    }
  }
  .noContent {
    box-sizing: border-box;
    padding: 10px;
    border-radius: 20px;
    text-align: center;
    @include skeAnimation(#eee);
    > img {
      object-fit: contain!important;
    }
    > .desc {
      padding-top: 20px;
      letter-spacing: 3px;
      font-size: 32px;
      color: #bbb;
    }
  }
</style>
