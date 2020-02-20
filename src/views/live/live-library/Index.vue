<template>
  <div :class="$style.liveLibrary">
    <div :class="$style.head">
      <div :class="$style.tabs" @click="$router.push({name:'MyLive'})">
        <div>我的直播</div>
        <div :class="{[$style.line]:true,[$style.lineFocus]:$route.name === 'MyLive'}" />
      </div>
      <div :class="$style.tabs" @click="$router.push({name:'MyCourses'})">
        <div>我的课程</div>
        <div :class="{[$style.line]:true,[$style.lineFocus]:$route.name !== 'MyLive'}" />
      </div>
    </div>
    <div v-if="$route.name !== 'MyLive'" :class="$style.studyTabs">
      <div :class="{[$style.focus]:$route.params.learnStatus === '1'}" @click="$router.push({name:'CourseLearning',params:{learnStatus:'1'}})">未学习</div>
      <div :class="{[$style.focus]:$route.params.learnStatus === '2'}" @click="$router.push({name:'CourseLearning',params:{learnStatus:'2'}})">学习中</div>
      <div :class="{[$style.focus]:$route.params.learnStatus === '3'}" @click="$router.push({name:'CourseLearning',params:{learnStatus:'3'}})">已学完</div>
    </div>
    <div :class="$style.description">
      <span v-if="$route.name === 'MyLive'">仅可支持查看已观看过的可回放直播</span>
      <span v-else>仅支持观看已成功购买的线上视频课程</span>
    </div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'LiveLibrary'
}
</script>

<style module lang='scss'>

    .live-library {
      min-height: 100vh;
      background-color: #FFFFFF;
      > .head {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 1px;
        font-size: 30px;
        color: #222222;
        background-color: #FFFFFF;
        > .tabs {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          padding: 24px 15px 0px 15px;
          > div:nth-of-type(1) {
            width: 100%;
            text-align: center;
          }
          > .line {
            width: 40px;
            height: 8px;
            margin-top: 16px;
            border-radius: 222px;
          }
          > .line-focus {
            background: linear-gradient(90deg,rgba(243,173,60,1) 0%,rgba(247,207,84,1) 100%);
          }
        }
      }
      > .study-tabs {
        display: flex;
        width: 100%;
        padding: 18px 28px;
        box-sizing: border-box;
        background-color: #FFFFFF;
        > div {
          margin-right: 30px;
          padding: 6px 32px;
          border: 1px solid #fff;
          border-radius: 128px;
          font-size: 22px;
          text-align: center;
          color: #666666;
        }
        > .focus {
          border-color: #F3AD3C;
          color: #F3AD3C;
        }
      }
      > .description {
        padding: 14px 28px;
        box-sizing: border-box;
        font-size: 28px;
        background-color: #FFFFFF;
      }
    }

</style>
