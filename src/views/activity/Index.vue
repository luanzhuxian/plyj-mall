<template>
  <div :class="$style.activity">
    <div :class="$style.background">
      <!-- <div :class="$style.wrapper"> -->
      <div :class="$style.container">
        <div :class="$style.btnTop" />
        <TemplateFengqiang
          :data="modules"
          :type="type"
        />
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
// import Search from './components/Search.vue'
// import { mapGetters } from 'vuex'
// import moment from 'moment'
import { getTemplate } from '../../apis/home'
import TemplateFengqiang from './Template-Fengqiang.vue'
export default {
  name: 'Activity',
  components: {
    TemplateFengqiang
  },
  data () {
    return {
      loaded: false,
      type: 0,
      modules: {}
    }
  },
  async created () {
    try {
      // await this.getTemplate()
    } catch (e) {
      throw e
    }
  },
  computed: {
    // ...mapGetters(['mallId'])
  },
  methods: {
    async getTemplate () {
      try {
        const { result } = await getTemplate()
        if (!result) {
          this.noFinish = true
          this.$alert('商城还在装修中哦，请您先看看我们都有哪些商品吧 😘')
            .finally(() => {
              this.$router.replace({ name: 'Classify' })
            })
          return
        }
        const { moduleModels } = result
        let { type } = result
        let modules
        if (type === 3) {
          modules = {
            BANNER: null,
            POPULAR: null,
            YUYUE: null,
            PINGXUAN: null,
            CLASS: null,
            RECOMMEND: null
          }
          modules.BANNER = moduleModels[0]
          modules.POPULAR = moduleModels[1]
          modules.YUYUE = moduleModels[2]
          modules.PINGXUAN = moduleModels[3]
          modules.CLASS = moduleModels[4]
          modules.RECOMMEND = moduleModels[5]
        }
        if (type === 4) {
          modules = {
            BANNER: null,
            ADV: null,
            POPULAR: null,
            YUYUE: null,
            PINGXUAN: null,
            CLASS: null,
            RECOMMEND: null
          }
          modules.BANNER = moduleModels[0]
          modules.ADV = moduleModels[1]
          modules.POPULAR = moduleModels[2]
          modules.YUYUE = moduleModels[3]
          modules.PINGXUAN = moduleModels[4]
          modules.CLASS = moduleModels[5]
          modules.RECOMMEND = moduleModels[6]
        }
        this.modules = modules
        this.loaded = true
        this.type = type
      } catch (e) {
        throw e
      }
    }
  }
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if (vm.noFinish) {
  //       vm.$alert('商城还在装修中哦，请您先看看我们都有哪些商品吧 😘')
  //         .finally(() => {
  //           vm.$router.replace({ name: 'Classify' })
  //         })
  //     }
  //   })
  // }
}
</script>
<style module lang="scss">
  .activity {
    position: relative;
    background: #C5010B;
    .background {
      min-height: 900px;
      background: url("../../assets/images/activity/activity-bg.png") no-repeat center top;
      background-size: 100% auto;
    }
    .container {
      padding: 320px 24px 24px;
    }
    .btn-top {
      width: 520px;
      height: 78px;
      background: url("../../assets/images/activity/button-top.png") no-repeat center center;
      background-size: 100% auto;
      border-radius: 70px;
      box-shadow: 18px 6px 25px #800F0F;
      margin: 0 auto 28px;
    }
  }
</style>
