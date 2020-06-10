<template>
    <nav :class="[$style.navbar, $style[skinClassNameMap[skinId]]]">
        <!-- 首页 -->
        <router-link
            :class="{
                [$style.route]: true,
                [$style.active]: homeActive
            }"
            tag="div"
            :to="{ name: 'Home' }"
        >

            <template v-if="isSkinShow">
                <img :src="homeActive ? skinNavMap[skinId].homeActive : skinNavMap[skinId].home">
                <div :class="$style.tabName">首页</div>
            </template>
            <template v-else-if="skinId !== null">
                <img
                    :class="$style.icon"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/find.png"
                    style="width: 5.86vw; height: 9.06vw;"
                    alt=""
                >
                <img
                    :class="{ [$style.icon]: true, [$style.active]: true, [$style.show]: homeActive }"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/find (1).png"
                    style="width: 5.86vw; height: 9.06vw;"
                    alt=""
                >
            </template>
        </router-link>
        <!-- 分类 -->
        <router-link
            :class="{
                [$style.route]: true,
                [$style.active]: classifyActive
            }"
            tag="div"
            :to="{ name: 'Classify' }"
        >
            <template v-if="isSkinShow">
                <img :src="classifyActive ? skinNavMap[skinId].classifyActive : skinNavMap[skinId].classify">
                <div :class="$style.tabName">分类</div>
            </template>
            <template v-else-if="skinId !== null">
                <img
                    :class="$style.icon"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/classify (1).png"
                    style="width: 5.86vw; height: 9.06vw;"
                    alt=""
                >
                <img
                    :class="{ [$style.icon]: true, [$style.active]: true, [$style.show]: classifyActive }"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/classify.png"
                    style="width: 5.86vw; height: 9.06vw;"
                    alt=""
                >
            </template>
        </router-link>
        <!-- 中间的活动button -->
        <router-link
            v-if="isActivityAuth"
            :class="$style.route"
            tag="div"
            :to="{ name: 'Activity' }"
        >
            <img
                v-if="~[5, 6, 7].indexOf(this.activityId)"
                :class="$style.iconD12"
                src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/d12-tabbar.png"
            >
            <img
                v-if="activityId === 8"
                :class="$style.iconXinchun"
                src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/87033906-c3d9-412f-b504-e9f777f334d4.png"
            >
            <img
                v-if="activityId === 10"
                :class="$style.iconDragonGate"
                src="https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/main-icon.png"
            >
        </router-link>
        <!-- 购物车 -->
        <router-link
            :class="{
                [$style.route]: true,
                [$style.active]: shoppingChartActive
            }"
            tag="div"
            :to="{ name: 'ShoppingCart' }"
        >
            <template v-if="isSkinShow">
                <img v-imgError :src="shoppingChartActive ? skinNavMap[skinId].shoppingChartActive : skinNavMap[skinId].shoppingChart">
                <div :class="$style.tabName">购物车</div>
            </template>
            <template v-else-if="skinId !== null">
                <img
                    :class="$style.icon"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/cart (1).png"
                    style="width: 8.53vw; height: 10.13vw;"
                    alt=""
                >
                <img
                    :class="{ [$style.icon]: true, [$style.active]: true, [$style.show]: shoppingChartActive }"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/cart.png"
                    style="width: 8.53vw; height: 10.13vw;"
                    alt=""
                >
            </template>

        </router-link>
        <!-- 我的 -->
        <router-link
            :class="{
                [$style.route]: true,
                [$style.active]: myActive
            }"
            tag="div"
            :to="{ name: 'My' }"
        >
            <template v-if="isSkinShow">
                <img v-imgError :src="myActive ? skinNavMap[skinId].myActive : skinNavMap[skinId].my">
                <div :class="$style.tabName">我的</div>
            </template>
            <template v-else-if="skinId !== null">
                <img
                    :class="$style.icon"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/my.png"
                    style="width: 5.87vw; height: 9.87vw;"
                    alt=""
                >
                <img
                    :class="{ [$style.icon]: true, [$style.active]: true, [$style.show]: myActive }"
                    src="https://mallcdn.youpenglai.com/static/mall/icons/olds/my (1).png"
                    style="width: 5.87vw; height: 9.87vw;"
                    alt=""
                >
            </template>
            <div v-if="noticeStatus === 2" :class="$style.alertMessage" />
        </router-link>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Get_ADUIT_NOTICE } from '../../store/mutation-type'
import { skinClassNameMap, skinNavMap } from '../../views/home/skin/map'

export default {
    name: 'Navbar',
    data () {
        this.timer = 0
        return {
            showNavbar: [
                'Home',
                'Classify',
                'ShoppingCart',
                'My',
                'WhatsHelper'
            ],
            skinClassNameMap,
            skinNavMap
        }
    },
    computed: {
        ...mapGetters(['agentUser', 'isAdmin', 'noticeStatus', 'isActivityAuth', 'activityId', 'skinId', 'userId']),
        homeActive () {
            return this.$route.matched.some(val => val.name === 'Home')
        },
        classifyActive () {
            return this.$route.matched.some(val => val.name === 'Classify')
        },
        shoppingChartActive () {
            return this.$route.path.indexOf('cart') > -1
        },
        myActive () {
            return this.$route.matched.some(val => val.name === 'My')
        },
        isSkinShow () {
            return skinClassNameMap.has(this.skinId)
        }
    },
    watch: {
        $route: {
            async handler (to) {
                clearTimeout(this.timer)
                if (this.showNavbar.includes(to.name)) {
                    if (this.userId) {
                        this.timer = setTimeout(() => {
                            this.getAuditNotice()
                        }, 2000)
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions({
            getAuditNotice: Get_ADUIT_NOTICE
        })
    }
}
</script>

<style module lang="scss">
@import '../../views/home/skin/navbar.scss';

.navbar {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    background-color: #fff;
    z-index: 9;
    // overflow: hidden;
}
.route {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    height: 88px;
    .alertMessage {
        background-color: #d2524c;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        top: 10px;
        right: 60px;
    }
    > .icon {
        width: 71px;
        height: 62px;
        &.active {
            position: absolute;
            top: 50%;
            left: 50%;
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: opacity .3s;
            &.show {
                opacity: 1;
            }
        }
    }
}
.icon-d12 {
    box-sizing: content-box;
    padding-bottom: 10px;
    width: 76px !important;
    height: auto !important;
}
.icon-xinchun {
    width: 105px !important;
    height: auto !important;
}
.icon-dragon-gate {
    position: relative;
    top: -22px;
    display: block;
    width: 125px !important;
    height: 104px !important;
}

</style>
<style lang="scss">
.router-link-active {
    color: #f2b036;
}

</style>
