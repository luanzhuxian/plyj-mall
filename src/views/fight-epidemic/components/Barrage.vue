<template>
  <div ref="container" class="container">
    <div class="runway" v-for="item in runwayNum" :key="item" />
  </div>
</template>

<script>
export default {
  name: 'Barrage',
  data () {
    return {
      runwayNum: 2,
      runwayList: [],
      runnerMes: [
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李***',
          description: '3244444444444444444444444444啊实打实'
        },
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李***',
          description: '3244444444444444444444444444啊实打实'
        },
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李***',
          description: '3244444444444444444444444444啊实打实'
        },
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李***',
          description: '3244444444444444444444444444啊实打实'
        }
      ]
    }
  },
  async mounted () {
    await this.getRunway()
    this.running()
    setTimeout(_ => {
      this.runnerMes.push({
        img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
        name: '李***',
        description: '3244444444444444444444444444啊实打实'
      })
      this.running()
    }, 10000)
  },
  methods: {
    // 获得弹幕跑道
    async getRunway () {
      await this.$nextTick()
      let barrageList = this.$refs.container.getElementsByClassName('runway')
      for (let el of barrageList) {
        this.runwayList.push({
          el,
          runner: []
        })
      }
    },
    // 跑者跑步
    running () {
      // 先跑空赛道
      for (let runway of this.runwayList) {
        if (!runway.runner.length) {
          this.createRunner(runway, 0, this.runnerMes)
        }
      }
    },
    // 创造跑者
    createRunner (runway, index, runnerMes) {
      if (!runnerMes.length) return
      let width = runway.el.offsetWidth
      let startPoint = runway.el.offsetLeft + width
      let duration = 5
      let runner = document.createElement('div')
      runner.style.position = 'absolute'
      runner.style.top = '0px'
      runner.style.left = `${startPoint}px`
      runner.style.background = 'pink'
      let currentRunnerMes = runnerMes.shift()
      runner.innerHTML = `<img src=${currentRunnerMes.img}><div><div>${currentRunnerMes.name} 抗击疫情第三天</div><div>${currentRunnerMes.description}</div></div>`
      runway.el.appendChild(runner)
      runway.runner.push(runner)
      let runnerWidth = runner.offsetWidth
      // 跑者速度
      let speed = (width + runnerWidth) / duration
      let keyframes = `
        @keyframes ani${index}{
            form{
                left:${startPoint}px;
            }
            to{
                left:${(-runnerWidth)}px;
            }
        }`
      let head = document.getElementsByTagName('head')[0]
      head.innerHTML += `<style type='text/css'>${keyframes}</style>`
      runner.style.animation = `ani${index} ${duration}s linear`
      // 动画结束删除dom
      runner.addEventListener('animationend', () => {
        runner.remove()
        runway.runner.shift()
      })
      // 完全身体出现时间,叫下一个
      let time = runnerWidth / speed
      setTimeout(() => {
        if (this.runnerMes.length) {
          this.createRunner(runway, index + 1, this.runnerMes)
        }
      }, time * 1000)
    }
  }
}
</script>

<style lang='scss'>
    .container {
        > .runway {
            position: relative;
            margin: 26px 0;
            height: 84px;
            > div {
                position: absolute;
                padding: 12px;
                display: flex;
                border-radius: 52px;
                background: rgba(0,0,0,0.2);
                white-space: nowrap;
                > img {
                    margin-right: 10px;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                }
                > div {
                    > div {
                        font-size: 24px;
                        color: blue;
                    }
                    > div:nth-of-type(2) {
                        color: #FFFFFF;
                    }
                }
            }
        }
    }
</style>
