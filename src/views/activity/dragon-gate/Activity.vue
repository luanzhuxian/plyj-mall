<template>
    <panel :custom-class="$style.activityPanel" :title="panelTitle" hide-button>
        <ul :class="$style.activityList">
            <router-link
                v-if="isSignShow"
                tag="li"
                :to="{
                    name: 'LongmenSignIn',
                    params: { id: currentSign.id }
                }"
            >
                <div :class="$style.imgWrapper">
                    <img :class="$style.first" :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/activity-present.png' + '?x-oss-process=style/thum-middle'">
                </div>
                <p>粽粽有礼 端午安康</p>
                <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/jinru-yellow.png" style="width: 15.47vw; height: 10.4vw;" alt="">
            </router-link>
            <router-link
                v-if="isPlayShow"
                tag="li"
                :to="{
                    name: 'LongmenLottery',
                    params: { id: currentLottery.id }
                }"
            >
                <div :class="$style.imgWrapper">
                    <img :class="$style.second" :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/activity-play.png' + '?x-oss-process=style/thum-middle'">
                </div>
                <p>龙门抽大奖 有粽你就来</p>
                <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/jinru-yellow.png" style="width: 15.47vw; height: 10.4vw;" alt="">
            </router-link>
        </ul>
    </panel>
</template>

<script>
import { mapGetters } from 'vuex'
import Panel from './Panel.vue'

export default {
    name: 'Activity',
    components: {
        Panel
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {
            panelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/rmhd.png',
                width: 326,
                height: 80
            }
        }
    },
    computed: {
        ...mapGetters(['currentSign', 'currentLottery']),
        isSignShow () {
            if (!this.data.values.length) {
                return false
            }
            return this.data.values[0].haveSigninActivity
        },
        isPlayShow () {
            if (!this.data.values.length) {
                return false
            }
            return this.data.values[0].haveLuckDrawActivity
        }
    }
}
</script>

<style lang="scss" module>
.activity-panel {
    padding: 28px 32px 16px;
    background-color: #01237a;
}
.activity-list {
    > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32px 0;
        border-bottom: 2px dashed rgba(64, 118, 204, .5);
        &:nth-last-of-type(1) {
            border: none;
        }
        .img-wrapper {
            display: flex;
            justify-content: center;
            width: 152px;
        }
        img {
            display: block;
            width: auto;
            height: 136px;
        }
        > p {
            flex: 1;
            width: 0;
            font-size: 32px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #fff;
            text-align: center;
        }
    }
}

</style>
