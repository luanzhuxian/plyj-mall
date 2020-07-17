<template>
    <!-- 首次进入商城，请求未返回时，skinId 为 null，此时不显示图标，避免接口返回后切换皮肤图标，视觉体验不好 -->
    <nav :class="[$style.navbar, $style[skinClassNameMap[skinId]]]" v-if="skinId !== null">

        <!-- 首页 -->
        <router-link :class="[$style.route, homeActive ? $style.active : '']" tag="div" :to="{ name: 'Home' }">
            <img
                v-if="isSkinShow"
                v-imgError
                :src="homeActive ? skinNavMap[skinId].homeActive : skinNavMap[skinId].home"
            >
            <img
                v-else
                :class="$style.icon"
                :src="homeActive ? iconMap.homeActive : iconMap.home"
                style="width: 6.2vw; height: 5.73vw;"
            >
            <div :class="$style.tabName">首页</div>
        </router-link>

        <!-- 分类 -->
        <router-link :class="[$style.route, classifyActive ? $style.active : '']" tag="div" :to="{ name: 'Classify' }">
            <img
                v-if="isSkinShow"
                v-imgError
                :src="classifyActive ? skinNavMap[skinId].classifyActive : skinNavMap[skinId].classify"
            >
            <img
                v-else
                :class="$style.icon"
                :src="classifyActive ? iconMap.classifyActive : iconMap.classify"
                style="width: 5.33vw; height: 5.73vw;"
            >
            <div :class="$style.tabName">分类</div>
        </router-link>

        <!-- 中间的活动button -->
        <router-link
            v-if="isActivityAuth"
            :class="[$style.route, $style.mainCenter]"
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
        <router-link :class="[$style.route, shoppingCartActive ? $style.active : '']" tag="div" :to="{ name: 'ShoppingCart' }">
            <img
                v-if="isSkinShow"
                v-imgError
                :src="shoppingCartActive ? skinNavMap[skinId].shoppingCartActive : skinNavMap[skinId].shoppingCart"
            >
            <img
                v-else
                :class="$style.icon"
                :src="shoppingCartActive ? iconMap.shoppingCartActive : iconMap.shoppingCart"
                style="width: 5.84vw; height: 6vw;"
            >
            <div :class="$style.tabName">购物车</div>
        </router-link>

        <!-- 我的 -->
        <router-link :class="[$style.route, myActive ? $style.active : '']" tag="div" :to="{ name: 'My' }">
            <img
                v-if="isSkinShow"
                v-imgError
                :src="myActive ? skinNavMap[skinId].myActive : skinNavMap[skinId].my"
            >
            <img
                v-else
                :class="$style.icon"
                :src="myActive ? iconMap.myActive : iconMap.my"
                style="width: 5.33vw; height: 6.4vw;"
            >
            <div :class="$style.tabName">我的</div>
            <div v-if="noticeStatus === 2" :class="$style.alertMessage" />
        </router-link>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Get_ADUIT_NOTICE } from '../../store/mutation-type'
import { skinClassNameMap, skinNavMap } from '../../views/home/skin/map'

const iconMap = {
    home: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/home.png',
    homeActive: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/home-active.png',
    classify: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/classify.png',
    classifyActive: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/classify-active.png',
    shoppingCart: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/shopping-cart.png',
    shoppingCartActive: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/shopping-cart-active.png',
    my: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/my.png',
    myActive: 'https://mallcdn.youpenglai.com/static/mall/icons/navbar/my-active.png'
}

export default {
    name: 'Navbar',
    data () {
        return {
            timer: 0,
            showNavbar: [
                'Home',
                'Classify',
                'ShoppingCart',
                'My',
                'WhatsHelper'
            ],
            skinClassNameMap,
            skinNavMap,
            iconMap
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
        shoppingCartActive () {
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
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 8px 0 4px;
    height: 88px;
    font-size: 18px;
    color: #666;
    &.main-center {
        padding: 0;
        justify-content: center;
    }
    > .icon {
        width: 71px;
        height: 62px;
        &.active {
            color: #f2b036;
        }
    }
}
.alert-message {
    position: absolute;
    top: 10px;
    right: 40px;
    width: 10px;
    height: 10px;
    background-color: #d2524c;
    border-radius: 50%;
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
    top: -20px;
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
