<template>
  <div :class="$style.loadMore"
       v-on:touchmove="touchMove"
       v-on:touchstart="touchstart"
       v-on:touchend="touchend"
       refs="loadMore">
    <div :class="$style.pullLoading"
         ref="pullLoading"
         :style="{ '--top': `${top / 7.5}vw`, '--rotate': `${rotate}deg` }">
      <svg :class="$style.pullLoadingIcon"
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 32 32"
           width="32"
           height="32"
           fill="#fe7700">
        <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
        <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
          <animateTransform v-if="loading" attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
    <div class="load-more-container" ref="container">
      <slot v-bind:list="list" v-bind:total="total"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Load-More2',
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
    // 请求参数
    options: {
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
    offsetTop: function () {
      return this.$el.offsetTop
    },
    offsetHeight: function () {
      return this.$el.offsetHeight
    },
    pullLoading: function () {
      return this.$refs.pullLoading
    },
    container: function () {
      return this.$refs.container
    }
  },
  data () {
    return {
      total: 0,
      list: [],
      startY: 0,
      defaultTop: -90, // 固定值
      top: -90, // 动态变化的
      pulling: false, // 正在向下拉动
      loading: false,
      timer: 0,
      rotate: 0 // 记录loading旋转的角度
    }
  },
  async created () {
    this.top = 20
    this.list = await this.getData()
  },
  mounted () {
    this.pullLoading.addEventListener('transitionend', () => {
      this.pullLoading.style.transition = null
      this.rotate = 0
    })
  },
  methods: {
    getData () {
      return new Promise(async (resolve, reject) => {
        try {
          this.loading = true
          let { result } = await this.requestMethods(this.options)
          resolve(result.records)
          this.total = result.total
        } catch (e) {
          reject(e)
        } finally {
          this.loaded()
        }
      })
    },
    loaded () {
      this.pulling = false
      clearTimeout(this.timer)
      if (this.defaultTop === this.top) {
        this.loading = false
        return
      }
      // 让loading多转一会
      this.timer = setTimeout(() => {
        this.loading = false
        this.pullLoading.style.transition = 'top linear .5s'
        this.top = this.defaultTop
      }, 1000)
    },
    touchstart (e) {
      this.startY = e.touches[0].clientY
    },
    touchend (e) {
      this.startY = 0
      this.getData()
    },
    touchMove (e) {
      // if (this.pulling) {
      //   e.preventDefault()
      // }
      // console.log(this.container.scrollTop)
      if (window.scrollY === 0) {
        this.pulling = true
        let top = e.touches[0].clientY - this.startY
        this.top = this.defaultTop + top
        this.rotate = top
      }
    }
  }
}
</script>

<style module lang="scss">
  .loadMore {
    position: relative;
    overflow: hidden;
  }
  .container {
  }
  .pullLoading {
    position: absolute;
    left: 50%;
    top: var(--top);
    transform: translate(-50%) rotate(var(--rotate));
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
</style>
