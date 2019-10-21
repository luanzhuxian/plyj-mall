<template>
  <div :class="$style.templateFanchang">
    <!-- 直播-->
    <Broadcast
      v-if="$attrs.live && $attrs.live.statue === 1"
      :class="$style.broadcast"
      v-bind="$attrs"
    />
    <Maisong
      v-if="MAI_SONG.values && MAI_SONG.values.length"
      :data="MAI_SONG"
      :type="type"
    />
    <Pintuan
      v-if="PIN_TUAN.values && PIN_TUAN.values.length"
      :data="PIN_TUAN"
    />
    <Fengqiang
      v-if="FENG_QIANG.values && FENG_QIANG.values.length"
      :data="FENG_QIANG"
      :type="type"
    />
    <BestRecommend
      v-if="RECOMMEND.values && RECOMMEND.values.length"
      :data="RECOMMEND"
    />
  </div>
</template>

<script>
import Broadcast from './components/Broadcast.vue'
import Pintuan from './components/Pintuan.vue'
import Maisong from './components/Maisong.vue'
import Fengqiang from './components/Fengqiang.vue'
import BestRecommend from './components/Best-Recommend.vue'

export default {
  name: 'HomeTemplateB',
  components: {
    Broadcast,
    Pintuan,
    Maisong,
    Fengqiang,
    BestRecommend
  },
  data () {
    return {}
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: Number,
      default: 0
    }
  },
  computed: {
    MAI_SONG () {
      return this.data.MAI_SONG || {}
    },
    MIAO_SHA () {
      return this.data.MIAO_SHA || {}
    },
    PIN_TUAN () {
      return this.data.PIN_TUAN || { values: [] }
    },
    FENG_QIANG () {
      return this.data.FENG_QIANG || {}
    },
    RECOMMEND () {
      return this.data.RECOMMEND || { values: [] }
    }
  }
}
</script>

<style module lang="scss">
  .template-fanchang {
    .broadcast {
      margin: 0 24px 16px;
    }
  }
</style>
