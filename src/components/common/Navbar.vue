<template>
    <nav
        :class="{
            [$style.navbar]: true,
            [$style.skinXmas]: skinId === 1,
            [$style.skinYuanDan]: skinId === 2,
            [$style.skinNewYear]: skinId === 3,
            [$style.skinXiaoNian]: skinId === 4,
            [$style.skinYuanXiao]: skinId === 5,
            [$style.skinWomenDay]: skinId === 6,
            [$style.skinNianNianFan]: skinId === 7,
            [$style.skinEarthDay]: skinId === 8,
            [$style.skinLabourDay]: skinId === 9,
            [$style.skinCampaign]: skinId === 99
        }"
    >
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
                <img :src="homeActive ? skinMap[skinId].homeActive : skinMap[skinId].home">
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
                <img :src="classifyActive ? skinMap[skinId].classifyActive : skinMap[skinId].classify">
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
                v-if="isD12Show"
                :class="$style.iconD12"
                src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/d12-tabbar.png"
            >
            <img
                v-if="isXinChunShow"
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
                <img :src="shoppingChartActive ? skinMap[skinId].shoppingChartActive : skinMap[skinId].shoppingChart">
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
                <img :src="myActive ? skinMap[skinId].myActive : skinMap[skinId].my">
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
            skinMap: {
                1: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/239b454f-454c-4ca5-93e7-a51bbd65a85a.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/ca59969d-77ed-48a0-964b-46ebc21401e1.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/b7e2cc35-63a7-4e84-8b35-7d487ccff31f.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/8821569b-35de-4a65-8e2d-60017edb6f1c.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/e476c8f8-8b5c-4772-9afc-67e68e678cda.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/665c6191-c62d-4ede-a10b-8cbfab239240.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/b036f6b9-0b78-424b-b1f1-94a240d5c1ff.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/f1d79dbd-1756-449f-ae9a-d5ba092459ce.png'
                },
                2: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d164934f-0da6-49e2-a5bb-f057abab1831.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d2275816-8002-4ada-bb49-495e7202ed76.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/ddd9128a-9193-4df4-ad5f-74d8ed2a0a0c.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/c349a743-3c97-4b20-a1c4-e981701d171b.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d164934f-0da6-49e2-a5bb-f057abab1831.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d2275816-8002-4ada-bb49-495e7202ed76.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/2f0c5143-0ee6-4e07-b57e-287506b503d2.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/f6b46a80-9624-467a-a46f-d92716e55789.png'
                },
                3: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ed448ad5-d03d-445c-92dd-26e47a345d0f.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ca40f2d6-03c8-43e2-ac61-1a3d8cb312dd.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/524bb459-1629-476a-87a5-2c87c4e88629.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/12c032c0-a345-47e4-950f-8e750314492f.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ec9ab607-450c-4b0a-8fc8-a8f48ef18ea2.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/f62c7aea-7a94-4810-8e50-71af4b64747a.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/12d8a7da-d145-4394-876f-3452e6111818.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/5506a573-d1de-4388-ae48-5f616865bfbe.png'
                },
                4: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/59d33c43-0c92-4188-8bd1-7262d3f22e6f.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/78b43fa6-6a94-4d8e-a6cf-3593eb466d2e.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/370856d4-8bf8-4c8c-a16b-8b6023adb347.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/c7caf9d7-23e8-4fc7-bf5d-feae82e60c12.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/0ae4ba75-10e9-45ca-8338-009d8079c12f.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/ced7151b-9366-4050-95eb-3b46ef11bbee.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/e8ed38d7-ca0c-440d-9f17-d67edd4e54ce.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/515a432b-738b-4517-b20b-b0f96d054b09.png'
                },
                5: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/86b85967-0b8e-4949-992c-5cd5f83d8c51.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/93845c73-12ba-4627-acd0-d5dfe29cffc7.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/231fb96b-75b0-4957-afed-16069aeae381.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/bf6cfe7c-fb87-4f00-a56f-aed22d8bc0b9.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/6de53dcc-e94d-47ae-a1da-3dbe919b842f.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/a0597aa9-d126-4c7b-8fad-999d52c9dffd.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/6cee4a1f-4a99-4199-88d1-0746f0597d1d.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/8638a408-644e-4ab6-962a-3338aac2b09a.png'
                },
                6: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/home.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/home-active.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/classify.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/classify-active.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/cart.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/cart-active.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/my.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/my-active.png'
                },
                7: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/home.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/home.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/classify.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/classify.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/cart.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/cart.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/my.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/my.png'
                },
                8: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/home.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/home.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/classify.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/classify.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/cart.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/cart.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/my.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/my.png'
                },
                9: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/homt.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/homt.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/classify.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/classify.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/cart.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/cart.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/my.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/my.png'
                },
                99: {
                    home: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/98e32f2b-679b-485d-8a9a-6e62659f91b1.png',
                    homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/98e32f2b-679b-485d-8a9a-6e62659f91b1.png',
                    classify: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/0961a842-6724-45d2-b804-33bf81278b54.png',
                    classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/0961a842-6724-45d2-b804-33bf81278b54.png',
                    shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/f3f17e23-c82d-405f-848f-e7ba14b49d43.png',
                    shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/f3f17e23-c82d-405f-848f-e7ba14b49d43.png',
                    my: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/8a291b28-fb88-4292-968b-c1f02de91e03.png',
                    myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/8a291b28-fb88-4292-968b-c1f02de91e03.png'
                }
            }
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
            return ~[1, 2, 3, 4, 5, 6, 7, 8, 99].indexOf(this.skinId)
        },
        isD12Show () {
            return ~[5, 6, 7].indexOf(this.activityId)
        },
        isXinChunShow () {
            return this.activityId === 8
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
