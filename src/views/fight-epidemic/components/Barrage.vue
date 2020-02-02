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
      duration: 10, // 移动完毕时长
      runnerMes: [
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李111***',
          description: '3244444444444444444444444444啊实打实'
        },
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李22***',
          description: '3244444444444444444444444444啊实打实'
        },
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李333***',
          description: '3244444444444444444444444444啊实打实'
        },
        {
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580536912480&di=9528760983dec6b1ee99ee9a1a6ca0f1&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F03%2F44%2Fb8566b309936.jpg',
          name: '李444***',
          description: '3244444444444444444444444444啊实打实'
        }
      ],
      runnerMesCopy: []
    }
  },
  async mounted () {
    this.runnerMesCopy = JSON.parse(JSON.stringify(this.runnerMes))
    await this.getRunway()
    this.running()
    // 拷贝获取的弹幕信息
    // 不断注入弹幕,
    this.keepRunning()
    this.joinRunner()
  },
  methods: {
    // 作为真实弹幕逻辑，把之前的弹幕信息copy当作新弹幕导入
    keepRunning () {
      setTimeout(() => {
        let runnerMes = JSON.parse(JSON.stringify(this.runnerMesCopy))
        this.runnerMes.push(...runnerMes)
        this.keepRunning()
      }, 15000)
    },
    // 加入跑者
    joinRunner () {
      setTimeout(() => {
        this.running()
        this.joinRunner()
      }, 10000)
    },
    // 获得弹幕跑道
    async getRunway () {
      await this.$nextTick()
      let barrageList = this.$refs.container.getElementsByClassName('runway')
      for (let el of barrageList) {
        this.runwayList.push({
          el,
          status: true, // 跑道是否允许跑步
          runner: []
        })
      }
    },
    // 准备跑步
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
      if (!runnerMes.length && !runway.status) return
      let width = runway.el.offsetWidth
      let startPoint = runway.el.offsetLeft + width
      let duration = this.duration
      let runner = document.createElement('div')
      runner.style.position = 'absolute'
      runner.style.top = '0px'
      runner.style.left = `${startPoint}px`
      let currentRunnerMes = runnerMes.shift()
      runner.innerHTML = `<img src=${currentRunnerMes.img}><div><div>${currentRunnerMes.name} 抗击疫情第三天</div><div>${currentRunnerMes.description}</div></div>`
      runway.el.appendChild(runner)
      runway.runner.push(runner)
      runway.status = false
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
          runway.status = true
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
                        color: #b3bbfd;
                    }
                    > div:nth-of-type(2) {
                        color: #dde1f9;
                    }
                }
            }
        }
    }
</style>
