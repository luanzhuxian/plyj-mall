<template>
  <div :class="$style.templateFanchang">
    <!-- 直播-->
    <broadcast
      v-if="parent.liveInfo && (parent.liveInfo.statue === 4 || (parent.liveInfo.statue === 2 && parent.liveInfo.hasNotice))"
      :class="$style.broadcast"
    />
    <maisong
      v-if="MAI_SONG.values && MAI_SONG.values.length"
      :data="MAI_SONG"
      :type="type"
    />
    <miaosha-small
      v-if="MIAO_SHA.values && MIAO_SHA.values.length && MIAO_SHA.values[0].goodsInfo"
      :data="MIAO_SHA"
    />
    <pintuan
      v-if="PIN_TUAN.values && PIN_TUAN.values.length"
      :data="PIN_TUAN"
    />
    <fengqiang
      v-if="FENG_QIANG.values && FENG_QIANG.values.length"
      :data="FENG_QIANG"
      :type="type"
    />
    <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
      <best-recommend :data="RECOMMEND">
        <div :class="$style.btnBottom" slot="title" />
      </best-recommend>
    </div>
  </div>
</template>

<script>
import Broadcast from './components/Broadcast.vue'
import Pintuan from './components/Pintuan.vue'
import Maisong from './components/Maisong.vue'
import Fengqiang from './components/Fengqiang.vue'
import BestRecommend from '../home/components/Best-Recommend.vue'
import MiaoshaSmall from './components/Miaosha-Small.vue'

export default {
  name: 'HomeTemplateB',
  inject: ['parent'],
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
      return this.data.PIN_TUAN || {}
    },
    FENG_QIANG () {
      return this.data.FENG_QIANG || {}
    },
    RECOMMEND () {
      return this.data.RECOMMEND || {}
    }
  }
}
</script>

<style module lang="scss">
  .broadcast {
    margin: 0 24px 16px;
  }
  .btn-bottom {
    width: 520px;
    height: 78px;
    background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-bottom.png") no-repeat center center;
    background-size: 100% auto;
    border-radius: 70px;
    margin: 48px auto 32px;
  }
</style>
