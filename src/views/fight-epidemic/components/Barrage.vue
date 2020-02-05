<template>
  <div ref="container" :class="$style.barrageContainer" v-if="list.length">
    <div :class="$style.barrageList" ref="wrap" />
  </div>
</template>

<script>
import { promise } from '../../../assets/js/util'
export default {
  name: 'Barrage',
  props: {
    // 弹幕列表
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    this.index = 0 // 子弹位置
    this.taoValueIndex = 0
    this.reloadSpeed = Math.random() * 100 + 1801 // 装填速度，装一发，发射一次
    return {
      /**
       * 弹夹，存放单个弹幕对象
       * {
       *   name,
       *   signinDays,
       *   content,
       *   userImg,
       *   speed
       * }
       */
      magazine: []
    }
  },
  computed: {
    wrap () {
      return this.$refs.wrap
    }
  },
  async mounted () {
    if (this.list.length) {
      this.fire()
    }
  },
  methods: {
    // 开火！
    async fire () {
      let info = this.list[this.index]
      if (!info) {
        this.index = 0
        info = this.list[this.index]
        // 等待全部弹幕都出去以后，再开始下一波
        await promise.timeout(Number.parseInt(this.magazine.slice(-1)[0].speed) * 1000 - this.reloadSpeed - 1000)
      }
      this.wrap.appendChild(this.createBullet(info))
      this.magazine[this.index] = info
      await promise.timeout(this.reloadSpeed)
      this.reloadSpeed = Math.random() * 100 + 1801
      this.index++
      this.fire()
    },
    // 生产子弹
    createBullet (info) {
      const topValue = [0, 100]
      const $style = this.$style
      const speed = info.speed = Number.parseInt(Math.random() * 3 + 6) + 's' // 速度是 3 ~ 6
      const top = topValue[this.taoValueIndex] / 7.5 + 'vw' // 速度是 3 ~ 6
      this.taoValueIndex = this.taoValueIndex === 0 ? 1 : 0
      const itemHtml = `
      <div
        class="${$style.item}"
        style="--speed: ${speed}; --top: ${top};"
      >
        <img src="${info.userImg}" alt="">
        <div class="${$style.right}">
          <div class="${$style.name}">
            ${info.name} 抗击疫情第${info.signinDays}天
          </div>
          <div class="${$style.slogn}">
             ${info.content}
           </div>
        </div>
      </div>`
      let wrap = document.createElement('div')
      wrap.innerHTML = itemHtml
      let item = wrap.querySelector('.' + $style.item)
      item.addEventListener('animationend', this.animationend)
      return item
    },
    animationend (e) {
      this.wrap.removeChild(e.target)
    }
  }
}
</script>

<style module lang='scss'>
  .barrage-container {
    padding: 26px 0;
    box-sizing: border-box;
  }
  .barrage-list {
    position: relative;
    height: 184px;
    overflow: hidden;
    box-sizing: border-box;
    > .item {
      position: absolute;
      right: 0;
      top: var(--top);
      display: inline-flex;
      align-items: center;
      height: 84px;
      padding: 0 10px;
      background-color: rgba(255, 255, 255, .2);
      border-radius: 42px;
      transform: translateX(100%);
      animation: moving var(--speed) linear;
      > img {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        object-fit: cover;
      }
      > .right {
        display: inline-flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        height: 64px;
        margin: 0 10px;
        > .name {
          font-size: 24px;
          color: rgba(255, 255, 255, .6);
        }
        > .slogn {
          font-size: 24px;
          color: #fff;
        }
      }
    }
  }
  @keyframes moving {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-200%); }
  }
</style>
