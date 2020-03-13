<template>
    <div :class="$style.schoolShow">
        <div :class="$style.moduleTitle">
            <pl-svg :class="$style.moduleIcon" name="icon-school_show" height="36" />
            <span :class="$style.title" v-text="data.titleName" />
        </div>
        <p v-for="(item, i) of data.mediaDetailModelList" :key="i">
            <img v-imger:schoolShow="item.mediaUrl" :src="item.mediaUrl + '?x-oss-process=style/thum-middle'" alt="">
        </p>
    </div>
</template>

<script>
import { getData } from '../../apis/appointment'
export default {
    name: 'SchoolShow',
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
                this.data = result.mallBrandingRequestModels.find(item => item.type === 1)
            } catch (e) {
                throw e
            }
        } else {
            this.data = data.find(item => item.type === 1)
        }
    }
}
</script>

<style module lang="scss">
  .school-show {
    padding: 32px 24px;
    background-color: #fff;
    img {
      width: 100%;
      margin-bottom: 20px;
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
