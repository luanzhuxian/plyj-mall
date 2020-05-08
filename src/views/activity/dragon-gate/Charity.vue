<template>
    <panel :custom-class="$style.charityPanel" :title="panelTitle" button="更多公益活动" @click="handleClick">
        <div :class="$style.charity">
            <p :class="$style.charityJoin">
                已加入<b>{{ statistics.orderNo || 0 }}</b>人
            </p>
            <p :class="$style.charityText">
                累计公益金
            </p>
            <div :class="$style.charityTotal">
                <b v-for="(number, index) of integer" :key="'integer-' + index">{{ number }}</b>
                <template v-if="Number(decimal)">
                    <i>.</i>
                    <b v-for="(number, index) of decimal" :key="'decimal-' + index">{{ number }}</b>
                </template>
            </div>
            <router-link
                :class="$style.charityProduct"
                v-for="(item, index) of productList"
                :key="index"
                tag="div"
                :to="{
                    name: ('courseType' in item) ? 'Curriculum' : 'Product',
                    params: { productId: item.productId },
                    query: {
                        currentProductStatus: 7,
                        activityId
                    }
                }"
            >
                <label>{{ item.productTypeDesc }}</label>
                <div :class="$style.imgWrapper">
                    <img :src="item.productImage + '?x-oss-process=style/thum-middle'">
                </div>
                <div :class="$style.info">
                    <h4>{{ item.productName }}</h4>
                    <p :class="$style.price">
                        <label>公益价</label>
                        <span>
                            {{ item.activityPrice }}元
                        </span>
                    </p>
                    <p :class="$style.rule">
                        {{ `购买将捐赠${item.donationAmount}元公益金` }}
                    </p>
                    <div :class="$style.button">
                        立即购买
                    </div>
                </div>
            </router-link>
        </div>
    </panel>
</template>

<script>
import Panel from './Panel.vue'

export default {
    name: 'Charity',
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
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/ngyzxd.png',
                width: 368,
                height: 80
            }
        }
    },
    computed: {
        activityId () {
            return this.data.values.length ? this.data.values[0].id : ''
        },
        productList () {
            const { data } = this
            if (!data.values.length) {
                return []
            }
            const { productModels = [], courseModels = [] } = data.values[0]
            return [...productModels, ...courseModels].slice(0, 1)
        },
        statistics () {
            const { data } = this
            return data.values.length ? data.values[0].statisticsDetail : {}
        },
        integer () {
            const { donationAmount = 0 } = this.statistics
            return parseInt(donationAmount).toString()
        },
        decimal () {
            const { donationAmount = 0 } = this.statistics
            return donationAmount ? donationAmount.toString().split('.')[1] : '0'
        }
    },
    methods: {
        handleClick () {
            if (this.data.values.length) {
                this.$router.push({
                    name: 'LongmenAction',
                    params: { id: this.activityId }
                })
            }
        }
    }
}
</script>

<style lang="scss" module>
.charity-panel {
    padding-top: 60px;
}
.charity {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    &-text {
        font-size: 36px;
        font-family: PingFang SC;
        font-weight: 800;
    }
    &-join {
        margin-bottom: 16px;
        font-size: 24px;
        > b {
            padding: 0 8px;
            font-size: 36px;
            color: #10fe72;
        }
    }
    &-total {
        margin-top: 10px;
        color: #10fe72;
        font-size: 44px;
        font-family: PingFang SC;
        font-weight: 800;
        > b {
            display: inline-block;
            margin: 0 5px;
            width: 52px;
            height: 62px;
            line-height: 58px;
            text-align: center;
            border: 4px solid #10fe72;
            border-radius: 4px;
        }
        > i {
            vertical-align: bottom;
        }
        &::after {
            content: '元';
            margin-left: 10px;
            font-size: 32px;
            color: #fff;
        }
    }
    &-product {
        position: relative;
        display: flex;
        margin-top: 56px;
        width: 100%;
        background-color: #fff;
        border: 4px solid #222;
        border-radius: 20px;
        overflow: hidden;
        > label {
            position: absolute;
            top: 0;
            left: 0;
            width: 110px;
            line-height: 36px;
            text-align: center;
            background-color: #75a4ff;
            border-radius: 0 0 20px 0;
            font-size: 24px;
            color: #fff;
        }
        .img-wrapper {
            width: 320px;
            height: 214px;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            width: 0;
            padding: 16px;
            font-size: 20px;
            color: #999;
            > h4 {
                margin-bottom: 4px;
                font-size: 28px;
                font-family: PingFang SC;
                font-weight: 800;
                line-height: 40px;
                color: #222;
                @include elps();
            }
            .price {
                margin-bottom: 2px;
                font-size: 32px;
                line-height: 48px;
                color: #fe7700;
                @include elps();
                > label {
                    margin-right: 8px;
                    width: 68px;
                    height: 32px;
                    border: 2px solid #56d98d;
                    border-radius: 4px;
                    font-size: 20px;
                    line-height: 28px;
                    color: #56d98d;
                }
            }
            .rule {
                @include elps();
            }
            .button {
                margin-top: auto;
                margin-left: auto;
                width: 152px;
                line-height: 50px;
                text-align: center;
                background-color: #75a4ff;
                border-radius: 10px;
                font-size: 24px;
                color: #fff;
            }
        }
    }
}

</style>
