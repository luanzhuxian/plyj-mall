<template>
  <!-- 使用前必须保证滚动容器是window -->
  <div :class="$style.loadMore"
       v-on:touchmove="touchMove"
       v-on:touchstart="touchstart"
       v-on:touchend="touchend"
       ref="loadMore">
    <div :class="$style.pullLoading"
         ref="pullLoading"
         :style="{ '--top': `${top / 7.5}vw`, '--rotate': `${rotate}deg`}">
      <svg :class="$style.pullLoadingIcon"
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 32 32"
           width="32"
           height="32"
           fill="#fe7700">
        <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
        <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
          <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" :dur="loading ? '0.8s' : '999999999s'" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
    <div :class="$style.loadMoreContainer" ref="container">
      <slot v-bind:list="list" v-bind:total="total"></slot>
      <svg :class="$style.bottomLoadingIcon"
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 32 32"
           v-if="bottomLoading"
           width="32"
           height="32"
           style="display: block;"
           fill="#fe7700">
        <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
        <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
          <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
        </path>
      </svg>
      <p v-if="allLoaded && list.length > 0" :class="$style.noMore">没有更多了~</p>
      <div :class="$style.noContent" v-if="list.length === 0 && !loading">
        <pl-svg :class="$style.noContentIcon" :name="icon"></pl-svg>
        <p :class="$style.noContentTip" v-text="noContentTip"></p>
      </div>
    </div>
  </div>
</template>

<script>
// import infiniteScroll from 'vue-infinite-scroll'
export default {
  name: 'Load-More',
  props: {
    isSearch: {
      type: Boolean,
      default: false
    },
    // 请求方法
    requestMethods: {
      type: Function,
      required: true
    },
    /*
    * 请求参数
    * 必须包含：current: 页码
    * */
    form: {
      type: Object,
      required: true
    },
    noContentTip: {
      type: String,
      default: '暂无内容'
    },
    icon: {
      type: String,
      default: 'no-content'
    }
  },
  computed: {
    innerHeight: function () {
      return window.innerHeight
    },
    pullLoading: function () {
      return this.$refs.pullLoading
    },
    container: function () {
      return this.$refs.container
    }
  },
  watch: {
    form: {
      handler: async function () {
        this.options = JSON.parse(JSON.stringify(this.form))
        this.refresh()
      },
      deep: true
    }
  },
  data () {
    return {
      options: null,
      total: 0,
      list: [],
      startY: 0,
      defaultTop: -90, // 固定值
      top: -90, // 动态变化的
      pulling: false, // 正在向下拉动
      loading: false,
      bottomLoading: false,
      allLoaded: false, // 已全部加载完毕
      timer: 0,
      offsetHeight: 0,
      rotate: 0, // 记录loading旋转的角度
      scrollHandler: null
    }
  },
  async created () {
    this.scrollHandler = throttle(this.infiniteScroll, 300)
    this.options = JSON.parse(JSON.stringify(this.form))
    this.refresh()
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandler)
  },
  methods: {
    getData () {
      return new Promise(async (resolve, reject) => {
        try {
          this.loading = true
          let { result } = await this.requestMethods(this.options)
          if (result.records.length === 0) {
            this.allLoaded = true
          }
          resolve(result.records)
          this.total = result.total
        } catch (e) {
          reject(e)
        } finally {
          this.loaded()
        }
      })
    },
    async loadMore () {
      this.options.current++
      await this.getData()
    },
    // 本次请求完成，设置loading的位置为初始状态，并重新求得列表的高度
    loaded () {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.pullLoading.style.transition = 'top linear .5s'
          this.loading = false
          this.top = this.defaultTop
          this.offsetHeight = this.$el.offsetHeight
          // 如果因为一些原因过渡没有被取消，0.6s后强行取消
          setTimeout(() => {
            this.pullLoading.style.transition = null
            this.rotate = 0
          }, 600)
        })
      })
    },
    resetState () {
      this.options.current = 1
      this.allLoaded = false
      this.pulling = false
      this.pulling = false
      this.bottomLoading = false
      this.top = 100
      window.scrollTo(0, 0)
    },
    touchstart (e) {
      this.startY = e.touches[0].clientY
    },
    // 刷新
    async refresh () {
      this.resetState()
      this.list = await this.getData()
      this.$emit('refresh', this.list, this.total)
    },
    // 本次下拉动作结束
    async touchend (e) {
      this.startY = 0
      if (this.pulling) {
        // 重置页码为1
        this.options.current = 1
        // allLoaded 全部加载完成设置为false，以便下次加载更多
        this.allLoaded = false
        // 表示下拉动作结束
        this.pulling = false
        // 为顶部loading设置过渡
        this.pullLoading.style.transition = 'top linear .5s'
        // 只有在loading完成出现在视野中时，松开才发起请求
        if (this.top > 50) {
          this.list = await this.getData()
          this.$emit('refresh', this.list, this.total)
        } else {
          this.loaded()
        }
      }
    },
    touchMove (e) {
      if (this.pulling) {
        e.preventDefault()
      }
      this.pulling = false
      if (window.scrollY === 0) {
        this.pulling = true
        let top = e.touches[0].clientY - this.startY
        this.top = this.defaultTop + top
        this.rotate = top
      }
    },
    async infiniteScroll () {
      if (this.offsetHeight - window.scrollY - this.innerHeight <= 0 && !this.loading && !this.allLoaded) {
        this.options.current++
        try {
          this.bottomLoading = true
          let list = await this.getData()
          for (let item of list) {
            this.list.push(item)
          }
          this.$emit('more', this.list, this.total, list)
          this.bottomLoading = false
        } catch (e) {
          this.bottomLoading = false
        }
      }
    }
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollHandler)
  }
}
// fn是我们需要包装的事件回调, delay是时间间隔的阈值
function throttle (fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0; let timer = null
  // 将throttle处理结果当作函数返回

  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}
</script>

<style module lang="scss">
  .loadMore {
    position: relative;
    overflow: hidden;
  }
  .pullLoading {
    position: absolute;
    left: 50%;
    top: var(--top);
    transform: translate(-50%, -50%) rotate(var(--rotate));
    width: 70px;
    height: 70px;
    background-color: #fff;
    border-radius: 35px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    z-index: 9;
    .pullLoadingIcon {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 50px;
      height: 50px;
      transform: translate(-50%, -50%);
    }
  }
  .loadMoreContainer {
    min-height: 200px;
    .bottomLoadingIcon {
      margin: 30px auto 30px;
    }
  }
  .noMore {
    line-height: 60px;
    font-size: 28px;
    color: #999;
    text-align: center;
  }
  .noContent {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .noContentIcon {
    width: 80%;
  }
  .noContentTip {
    margin-top: 20px;
    font-size: 32px;
    color: #999;
  }
</style>
