<template>
  <div :class="$style.activity">
    123
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import moment from 'moment'
// import 'swiper/dist/css/swiper.css'
import { getTemplate } from '../../apis/home'
// import TemplateA from './Template-A.vue'
export default {
  name: 'Activity',
  components: {
    // TemplateA
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
        if (type === 3 || type === 4) {
          modules = {
            YUYUE: null,
            PINGXUAN: null,
            BANNER: null,
            POPULAR: null,
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
    padding-bottom: 88px;
  }
</style>
