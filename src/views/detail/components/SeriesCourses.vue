<template>
    <div :class="$style.seriesCourses">
        <div :class="$style.top">
            <span>知识内容(20)</span>
            <span :class="$style.lighter">持续更新中...</span>
        </div>
        <ul :class="$style.list">
            <li :class="$style.listItem" v-for="n of 20" :key="n">
                <product-card
                    :image="'https://mallcdn.youpenglai.com/static/admall/mall-management/active/prod-default.png'"
                    :label="'视频课'"
                    :top="'【第一节】张三三老师带您体课张三三老师带您体课张三三老师带您体课张三三老师带您体课...'"
                    :sub-top="`主讲人：王老师`"
                    :bottom-left="'视频课'"
                    :button-text="flag ? '试看' : ''"
                    round
                >
                    <template slot="bottom" v-if="false">
                        <span :class="$style.warn">{{ `暂未开始   敬请期待` }}</span>
                    </template>
                    <template slot="bottomLeft" v-else>
                        <span>20分钟</span>
                        <span>231人观看</span>
                        <span :class="$style.progress" v-if="!flag">学习20%</span>
                    </template>
                </product-card>
            </li>
            <li :class="$style.listBottom">
                <p>课程内容订购后即可学习~</p>
                <p>{{ `课程内容2020.3.20已更新，请及时查看学习~` }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import ProductCard from '../components/Product-Card.vue'

export default {
    name: 'SeriesCourses',
    components: {
        ProductCard
    },
    props: {},
    data () {
        return {
            flag: true
        }
    },
    methods: {
        jump () {

        }
    }
}
</script>

<style lang="scss" module>

.top {
    padding: 0 24px;
    line-height: 80px;
    background: #fff;
    font-size: 26px;
    color: #666;
    > span {
        margin-right: 36px;
    }
    .lighter {
        color: #999;
    }
}
.list {
    margin-top: 20px;
    padding: 28px 24px;
    background: #fff;
    &-item {
        padding: 26px 0 36px;
        border-bottom: 2px solid #e7e7e7;
        &:nth-of-type(1) {
            padding-top: 0;
        }
        .progress {
            margin-left: 32px;
        }
        .warn {
            margin-top: auto;
            font-size: 26px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #f2b036;
        }
    }
    &-bottom {
        padding: 26px 0;
        font-size: 24px;
        line-height: 34px;
        color: #828282;
        text-align: center;
    }
}

</style>
