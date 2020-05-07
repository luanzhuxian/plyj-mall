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
            <pl-svg
                v-else-if="skinId !== null"
                :name="homeActive ? 'icon-find-active' : 'icon-find'"
                width="44"
                height="68"
                :key="0"
            />
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
            <pl-svg
                v-else-if="skinId !== null"
                :name="classifyActive ? 'icon-classify-active' : 'icon-classify'"
                width="60"
                height="72"
                :key="1"
            />
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
            <pl-svg
                v-else-if="skinId !== null"
                width="64"
                height="76"
                :key="2"
                :name="shoppingChartActive ? 'icon-cart-active' : 'icon-cart'"
            />
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
            <pl-svg
                v-else-if="skinId !== null"
                :name="myActive ? 'icon-my-active' : 'icon-my'"
                width="44"
                height="74"
                :key="3"
            />
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
            return !!this.skinId
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
    overflow: hidden;
}
.route {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
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

/****************** 皮肤 start ******************/
.skin-xmas,
.skin-yuan-dan,
.skin-new-year,
.skin-xiao-nian,
.skin-yuan-xiao,
.skin-women-day,
.skin-nian-nian-fan,
.skin-earth-day,
.skin-labour-day,
.skin-mothers-day,
.skin-campaign {
    .route {
        box-sizing: border-box;
        &.active > .tab-name {
            color: #c81819;
        }
        img {
            width: 71px;
            height: 62px;
        }
    }
    .tab-name {
        margin-top: 1px;
        padding-bottom: 4px;
        line-height: 18px;
        font-size: 18px;
        font-family: Adobe Heiti Std;
        color: #242424;
        text-align: center;
    }
    .icon {
        margin-bottom: 0 !important;
    }
}

.skin-xmas {
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/xmas/83295b48-251d-40a0-9e07-e3fb9eb95138.png') no-repeat center;
    background-size: 100%;
}
.skin-new-year {
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/new-year/00b470fc-1ba0-4c3a-a039-177d6564eb0e.png') no-repeat center;
    background-size: 100%;
}
.skin-yuan-xiao {
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/0172699a-7d24-45ae-8e27-46d0a88dfb39.png') no-repeat center;
    background-size: 101%;
    .route {
        .tab-name {
            color: #fff;
        }
        &.active > .tab-name {
            color: #fff;
        }
    }
}
.skin-women-day {
    .route {
        .tab-name {
            margin-top: 0;
            color: #999;
        }
        &.active > .tab-name {
            color: #fb908f;
        }
    }
}
.skin-earth-day {
    .route {
        &.active > .tab-name {
            color: #19b47b;
        }
    }
}
.skin-labour-day {
    .route {
        &.active > .tab-name {
            color: #ce4c32;
        }
    }
}
.skin-mothers-day {
    .route {
        &.active > .tab-name {
            color: #fb908f;
        }
    }
}
.skin-campaign {
    background: url('https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/0ab57391-3717-43c2-bc47-549f7b1a94a3.png') no-repeat center;
    background-size: 100%;
    .route {
        .tab-name {
            color: #fff;
        }
        &.active > .tab-name {
            color: #ad0f02;
        }
    }
}
/****************** 皮肤 end ******************/

</style>
<style lang="scss">
  .router-link-active {
    color: $--warning-color;
  }

</style>
