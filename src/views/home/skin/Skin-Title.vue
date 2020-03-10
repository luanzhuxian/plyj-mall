<template>
  <div :class="$style.skinTitle">
    <title-xmas v-if="skinId === 1" :data="data" />
    <title-yuan-dan v-if="skinId === 2" :data="data" />
    <title-new-year v-if="skinId === 3" :data="data" />
    <title-xiao-nian v-if="skinId === 4" :data="data" />
    <title-yuan-xiao v-if="skinId === 5" :data="data" />
    <title-women-day v-if="skinId === 6" :data="data" />
    <title-campaign v-if="skinId === 99" :data="data" />
  </div>
</template>

<script>
import TitleXmas from './Title-Xmas.vue'
import TitleYuanDan from './Title-Yuan-Dan.vue'
import TitleNewYear from './Title-New-Year.vue'
import TitleXiaoNian from './Title-Xiao-Nian.vue'
import TitleYuanXiao from './Title-Yuan-Xiao.vue'
import TitleWomenDay from './Title-Women-Day.vue'
import TitleCampaign from './Title-Campaign.vue'

export default {
  name: 'SkinTitle',
  components: {
    TitleXmas,
    TitleYuanDan,
    TitleNewYear,
    TitleXiaoNian,
    TitleYuanXiao,
    TitleWomenDay,
    TitleCampaign
  },
  props: {
    data: {
      type: String,
      default: ''
    },
    skinId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" module>
.skin-title {}
</style>
