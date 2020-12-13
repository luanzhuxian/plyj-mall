<template>
    <div :class="$style.templateFanchang">
        <!-- 直播-->
        <Live :class="$style.live" v-if="isLiveShow" :data="parent.liveInfo" />
        <Maisong
            v-if="Maisong.values && Maisong.values.length"
            :data="Maisong"
            :type="type"
        />
        <Miaosha
            v-if="Miaosha.values && Miaosha.values.length && Miaosha.values[0].goodsInfo"
            :data="Miaosha"
        />
        <Pintuan
            v-if="Pintuan.values && Pintuan.values.length"
            :data="Pintuan"
        />
        <Fengqiang
            v-if="Fengqiang.values && Fengqiang.values.length"
            :data="Fengqiang"
            :type="type"
        />
        <div :class="$style.recommend" v-if="Recommend.values && Recommend.values.length">
            <div :class="$style.btnBottom" />
            <Recommend :data="Recommend" />
        </div>
    </div>
</template>

<script>
import Live from '../../double-12-2019/Live.vue'
import Pintuan from '../../double-12-2019/Pintuan.vue'
import Maisong from '../../double-12-2019/Maisong.vue'
import Fengqiang from '../../double-12-2019/Fengqiang.vue'
import Miaosha from '../../double-12-2019/Miaosha-Small.vue'
import Recommend from '../../../home/components/Recommend.vue'

export default {
    name: 'HomeTemplateB',
    inject: ['parent'],
    components: {
        Live,
        Pintuan,
        Maisong,
        Fengqiang,
        Miaosha,
        Recommend
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
    data () {
        return {}
    },
    computed: {
        Maisong () {
            return this.data.Maisong || {}
        },
        Miaosha () {
            return this.data.Miaosha || {}
        },
        Pintuan () {
            return this.data.Pintuan || {}
        },
        Fengqiang () {
            return this.data.Fengqiang || {}
        },
        Recommend () {
            return this.data.Recommend || {}
        },
        isLiveShow () {
            const { liveInfo } = this.parent
            if (!liveInfo.liveModel || !liveInfo.liveModel.length) {
                return false
            }
            const list = liveInfo.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
            return !!list.length
        }
    }
}
</script>

<style module lang="scss">
.live {
    margin: 0 0 16px;
}
.btn-bottom {
    width: 520px;
    height: 78px;
    background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-bottom.png') no-repeat center center;
    background-size: 100% auto;
    border-radius: 70px;
    margin: 48px auto 32px;
}

</style>
