<template>
  <div :class="$style.loadMore">
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :autoFill="false"
      ref="loadmore">
      <slot v-bind:list="list" v-bind:total="total"></slot>
    </mt-loadmore>
    <p :class="$style.loading" v-if="loading">
      <pl-svg name="btn-loading"></pl-svg>
      <span>努力加载中...</span>
    </p>
    <NoContent :icon="icon" v-if="list.length === 0 && !loading" :text="noContentTip" />
    <div :class="$style.allLoaded" v-if="allLoaded">我是有底线的哦~</div>
  </div>
</template>

<script>
import NoContent from '../components/No-Content.vue'

export default {
  name: 'LoadMore',
  components: {
    NoContent
  },
  data () {
    return {
      list: [],
      allLoaded: false,
      loading: false,
      total: 0,
      form: {}
    }
  },
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
  created () {
    this.form = JSON.parse(JSON.stringify(this.options || {}))
    this.loadTop()
  },
  computed: {
    loadmore: function () {
      return this.$refs.loadmore
    }
  },
  watch: {
    options: {
      handler: function () {
        this.form = JSON.parse(JSON.stringify(this.options || {}))
        this.loadTop()
      },
      deep: true
    }
  },
  methods: {
    async loadTop () {
      this.loading = true
      this.form.current = 1
      try {
        const { result } = await this.requestMethods(this.form)
        this.list = result.records
        this.allLoaded = false
        this.total = result.total
        this.loadmore.onTopLoaded()
        this.loading = false
      } catch (e) {
        this.loadmore.onTopLoaded()
        this.total = 0
        this.list = []
        this.loading = false
        throw e
      } finally {
        this.$emit('refresh', this.list, this.total)
      }
    },
    async loadBottom () {
      this.form.current++
      try {
        this.loading = true
        const data = await this.requestMethods(this.form)
        const records = data.result.records
        for (let d of records) {
          this.list.push(d)
        }
        if (records.length === 0) {
          this.allLoaded = true
        } else {
          this.allLoaded = false
        }
        this.loadmore.onBottomLoaded()
        /*
        * list： 列表中的所有数据
        * total：列表数量
        * records 当前这一页的列表数据
        * */
        this.$emit('more', this.list, this.total, records)
        this.loading = false
      } catch (e) {
        this.loading = false
        this.list = []
        this.loadmore.onBottomLoaded()
        throw e
      }
    },
    // 刷新，并保留当前数据
    async refresh () {
      let _opt = JSON.parse(JSON.stringify(this.form))
      _opt.size = this.list.length
      if (_opt.size < this.form.size) {
        _opt.size = this.form.size
      }
      _opt.current = 1
      try {
        this.loading = true
        const { result } = await this.requestMethods(_opt)
        this.list = result.records
        this.loading = this.allLoaded = false
        this.total = result.total
      } catch (e) {
        this.total = 0
        this.loading = false
        this.list = []
        throw e
      } finally {
        this.$emit('refresh', this.list, this.total)
      }
    }
  }
}
</script>

<style module lang="less">
  .load-more {
    position: relative;
  }
  .allLoaded {
    height: 100px;
    line-height: 70px;
    font-size: 26px;
    text-align: center;
    background-color: transparent;
  }
  .loading {
    position: absolute;
    top: 30vh;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 150px;
    padding: 0 40px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, .8);
    z-index: 99;
    svg {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      fill: currentColor;
      animation: rotate 1s linear infinite;
    }
  }
  @keyframes rotate {
    from { transform: rotate(0deg) }
    to { transform: rotate(180deg) }
  }
</style>
