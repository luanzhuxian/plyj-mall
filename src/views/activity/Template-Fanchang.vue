<template>
  <div :class="$style.templateFanchang">
    <!-- 直播-->
    <broadcast
      v-if="$attrs.live && ($attrs.live.statue === 4 || ($attrs.live.statue === 2 && $attrs.live.hasNotice))"
      :class="$style.broadcast"
      v-bind="$attrs"
    />
    <maisong
      v-if="MAI_SONG.values && MAI_SONG.values.length"
      :data="MAI_SONG"
      :type="type"
    />
    <miaosha-small
      v-if="MIAO_SHA.values && MIAO_SHA.values.length && MIAO_SHA.values[0].goodsInfo"
      :data="MIAO_SHA"
      v-bind="$attrs"
    />
    <pintuan
      v-if="PIN_TUAN.values && PIN_TUAN.values.length"
      :data="PIN_TUAN"
      v-bind="$attrs"
    />
    <fengqiang
      v-if="FENG_QIANG.values && FENG_QIANG.values.length"
      :data="FENG_QIANG"
      :type="type"
    />
    <best-recommend
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
import MiaoshaSmall from './components/Miaosha-Small.vue'

export default {
  name: 'HomeTemplateB',
  components: {
    Broadcast,
    Pintuan,
    Maisong,
    Fengqiang,
    BestRecommend,
    MiaoshaSmall
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
