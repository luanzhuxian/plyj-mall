<template>
    <div :class="$style.container">
        <div :class="$style.wrap" v-if="list.length">
            <div :class="$style.barrageList" :style="{ '--state': state }" />
        </div>
    </div>
</template>

<script>

// import { promise } from '../../../assets/js/util'
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
        // 子弹位置
        this.index = 0
        this.taoValueIndex = 0
        // 装填速度，装一发，发射一次
        this.reloadSpeed = Math.random() * 100 + 1801
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
            magazine: [],
            items: [],
            state: 'running'
        }
    },
    watch: {
        async list (val, old) {
            if (val.length === 1) {
                // 子弹位置
                this.index = 0
                this.taoValueIndex = 0
                // 装填速度，装一发，发射一次
                this.reloadSpeed = Math.random() * 100 + 1801
                this.magazine = []
            } else if (val.length > 1) {
                this.index++
            }
        }
    },
    computed: {
    },
    async mounted () {
    },
    activated () {
        setTimeout(() => {
            this.wrap = document.getElementsByClassName(this.$style.barrageList)[0]
            this.state = 'running'
            this.fire()
        }, 1000)
    },
    deactivated () {
        if (this.wrap) {
            for (const item of this.items) {
                try {
                    this.wrap.removeChild(item)
                } catch (e) {}
            }
        }
        clearTimeout(this.t1)
        clearTimeout(this.t2)
        clearTimeout(this.t3)
        this.items = []
        this.state = 'paused'
    },
    methods: {
        clean () {
        },

        // 开火！
        async fire () {
            let info = this.list[this.index]
            if (!info) {
                this.index = 0
                info = this.list[this.index]

                // 等待全部弹幕都出去以后，再开始下一波
                this.t1 = setTimeout(async () => {
                    this.wrap.appendChild(this.createBullet(info))
                    this.magazine[this.index] = info
                    this.t2 = setTimeout(() => {
                        this.reloadSpeed = Math.random() * 100 + 1801
                        this.index++
                        this.fire()
                    }, this.reloadSpeed)
                }, Number.parseInt(this.magazine.slice(-1)[0].speed) * 1000 - this.reloadSpeed - 1000)
            } else {
                this.wrap.appendChild(this.createBullet(info))
                this.magazine[this.index] = info
                this.t3 = setTimeout(() => {
                    this.reloadSpeed = Math.random() * 100 + 1801
                    this.index++
                    this.fire()
                }, this.reloadSpeed)
            }
        },

        // 生产子弹
        createBullet (info) {
            const topValue = [0, 100]
            const { $style } = this
            // 速度是 3 ~ 6
            const speed = `${ Number.parseInt(Math.random() * 3 + 6) }s`
            info.speed = speed
            // 速度是 3 ~ 6
            const top = `${ topValue[this.taoValueIndex] / 7.5 }vw`
            this.taoValueIndex = this.taoValueIndex === 0 ? 1 : 0
            info.name = this.formatName(info.name)
            const itemHtml = `
      <div
        class="${ $style.item }"
        style="--speed: ${ speed }; --top: ${ top };"
      >
        <img src="${ info.userImg }" alt="">
        <div class="${ $style.right }">
          <div class="${ $style.name }">
            ${ info.name } 抗击疫情第${ info.signinDays }天
          </div>
          <div class="${ $style.slogn }">
             ${ info.content }
           </div>
        </div>
      </div>`
            const wrap = document.createElement('div')
            wrap.innerHTML = itemHtml
            const item = wrap.querySelector(`.${ $style.item }`)
            item.addEventListener('animationend', this.animationend)
            this.items.push(item)
            return item
        },
        animationend (e) {
            this.wrap.removeChild(e.target)
        },
        formatName (name) {
            if (name.length <= 1) {
                return '*'
            }
            return `${ name[0] }${ '*'.repeat(name.length - 1) }`
        }
    }
}
</script>

<style module lang='scss'>
  .container {
    padding: 26px 0;
  }
  .wrap {
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
      animation-play-state: var(--state);
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
