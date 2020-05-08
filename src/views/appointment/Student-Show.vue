<template>
    <div :class="$style.studentShow">
        <div :class="$style.moduleTitle">
            <pl-svg :class="$style.moduleIcon" type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/five_pointed.png" height="36" />
            <span :class="$style.title" v-text="data.titleName" />
        </div>
        <ul :class="$style.studentList">
            <li v-for="(item, i) of data.mediaDetailModelList" :key="i">
                <img v-imgError v-imger:studentShow="item.mediaUrl" :src="item.mediaUrl + '?x-oss-process=style/thum-mini'" alt="">
            </li>
        </ul>
    </div>
</template>

<script>
import { getData } from '../../apis/appointment'
export default {
    name: 'StudentShow',
    data () {
        return {
            data: {}
        }
    },
    async mounted () {
        const data = JSON.parse(sessionStorage.getItem('PIN_XUAN'))
        if (!data) {
            try {
                const { result } = await getData()
                sessionStorage.setItem('PIN_XUAN', JSON.stringify(result.mallBrandingRequestModels))
                this.data = result.mallBrandingRequestModels.find(item => item.type === 2)
            } catch (e) {
                throw e
            }
        } else {
            this.data = data.find(item => item.type === 2)
        }
    }
}
</script>

<style module lang="scss">
  .student-show {
    width: 100vw;
    height: 100vh;
    padding: 32px 24px;
    box-sizing: border-box;
    overflow: auto;
    background-color: #fff;
  }
  .student-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      margin-bottom: 22px;
    }
    img {
      width: 220px;
      height: 220px;
      object-fit: cover;
      border-radius: 20px;
    }
  }

  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    > .module-icon {
      width: 36px;
      margin-right: 12px;
    }
    > .title {
      flex: 1;
      font-size: 36px;
      font-weight: bold;
    }
  }
</style>
