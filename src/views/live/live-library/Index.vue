<template>
  <div :class="{[$style.liveLibrary]: true, [$style.myLive]: $route.name === 'MyLive'}">
    <div :class="$style.nav">
      <div :class="$style.head">
        <div :class="$style.tabs" @click="$router.push({name:'MyLive'})">
          <div :class="{[$style.tabFocus]:$route.name === 'MyLive'}">我的直播</div>
          <div :class="{[$style.line]:true,[$style.lineFocus]:$route.name === 'MyLive'}" />
        </div>
        <div :class="$style.tabs" @click="$router.push({name:'MyCourses'})">
          <div :class="{[$style.tabFocus]:$route.name !== 'MyLive'}">我的课程</div>
          <div :class="{[$style.line]:true,[$style.lineFocus]:$route.name !== 'MyLive'}" />
        </div>
      </div>
      <div v-if="$route.name !== 'MyLive'" :class="$style.studyTabs">
        <div :class="{[$style.focus]:$route.params.learnStatus === '1'}" @click="$router.push({name:'CourseLearning',params:{learnStatus:'1'}})">未学习</div>
        <div :class="{[$style.focus]:$route.params.learnStatus === '2'}" @click="$router.push({name:'CourseLearning',params:{learnStatus:'2'}})">学习中</div>
        <div :class="{[$style.focus]:$route.params.learnStatus === '3'}" @click="$router.push({name:'CourseLearning',params:{learnStatus:'3'}})">已过期</div>
      </div>
      <div v-if="$route.params.learnStatus === '3'" :class="$style.description">
        已过期课程不支持观看
      </div>
      <div v-else-if="$route.name !== 'MyLive' && $route.params.learnStatus !== '3'" :class="$style.description">
        仅支持观看已成功购买的线上视频课程
      </div>
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
      padding-top: 220px;
      min-height: 100vh;
      background-color: #FFFFFF;
      &.my-live {
        padding-top: 115px;
      }
      > .nav {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        background-color: #FFFFFF;
        > .head {
          display: flex;
          justify-content: center;
          width: 100%;
          border-bottom: 2px solid #e6e6e6;
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
            > .tab-focus {
              color: #F2B036;
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
            background-color: #fcf5ea;
          }
        }
        > .description {
          padding: 14px 28px;
          box-sizing: border-box;
          font-size: 24px;
          color: #666666;
          background-color: #FFFFFF;
        }
      }
    }

</style>
