<template>
    <div :class="$style.courses">
        <div :class="$style.item" v-for="(item,index) in list" :key="index" @click="target(item)">
            <div :class="$style.img">
                <img :src="item.img" alt="">
                <div :class="$style.tag"> {{ item.type }} </div>
            </div>
            <div :class="$style.goodsInfo">
                <div :class="$style.name">{{ item.name }}</div>
                <div :class="$style.price">
                    <span>公益价</span>
                    <span>{{ item.price }}元</span>
                </div>
                <div :class="$style.description">购买将捐赠{{ item.donationAmount }}元公益金</div>
                <div :class="$style.buy">
                    <div :class="$style.button" v-if="activityStatus === 2 && item.activityStock > 0">立即购买</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Courses',
    props: {
        activityId: {
            type: String,
            default: ''
        },
        // 1未开始，2进行中，3已过期，4已结束
        activityStatus: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default () {
                return []
            }
        }
    },
    methods: {
        target ({ productType, productId }) {
            if (this.activityStatus !== 2) {
                return
            }

            // 商品为 1 课程为 2
            const name = productType === 1 ? 'Product' : 'Curriculum'
            this.$router.push({
                name,
                params: { productId },
                query: {
                    currentProductStatus: 7,
                    activityId: this.activityId
                }
            })
        }
    }
}
</script>

<style module lang='scss'>

.courses {
    max-height: 950px;
    box-sizing: border-box;
    padding: 32px 16px;
    overflow-y: auto;
    background-color: #c0d5fe;
    > .item {
        display: flex;
        margin-bottom: 16px;
        height: 214px;
        border-radius: 20px;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0 6px 12px rgba(0,0,0,.16);
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
        > .img {
            position: relative;
            flex: 1;
            > img {
                width: 100%;
                height: 100%;
            }
            > .tag {
                position: absolute;
                top: 0;
                left: 0;
                padding: 0 14px;
                border-radius: 20px 0 20px 0;
                line-height: 40px;
                font-size: 24px;
                color: #fff;
                background-color: #75a4ff;
            }
        }
        > .goods-info {
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            align-content: space-between;
            box-sizing: border-box;
            padding: 16px;
            text-align: left;
            > div {
                width: 100%;
            }
            > .name {
                width: 320px;
                font-size: 28px;
                font-weight: 800;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                color: #222;
            }
            > .price {
                > span {
                    font-size: 32px;
                    color: #fe7700;
                }
                > span:nth-of-type(1) {
                    display: inline-block;
                    margin-right: 8px;
                    padding: 3px;
                    font-size: 20px;
                    color: #56d98d;
                    border: 1px solid #56d98d;
                    border-radius: 4px;
                }
            }
            > .description {
                font-size: 20px;
                color: #999;
            }
            > .buy {
                display: flex;
                justify-content: flex-end;
                min-height: 50px;
                > .button {
                    width: 152px;
                    line-height: 50px;
                    border-radius: 10px;
                    text-align: center;
                    font-size: 24px;
                    color: #fff;
                    background-color: #75a4ff;
                }
            }
        }
    }
}

</style>
