<template>
    <div :class="$style.crunchies">
        <div :class="$style.head">
            <div :class="$style.user">
                <img :src="$store.getters.avatar" alt="">
            </div>
            <div :class="$style.accumulatedPrice">
                <div>{{ amounts }}元</div>
                <div>我累积捐赠的公益金</div>
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style.item" v-for="(item,index) in list" :key="index">
                <div :class="$style.customer">
                    <img :src="item.headImgUrl" alt="">
                    <div>{{ item.name.split('')[0] }}**</div>
                </div>
                <div :class="$style.price">
                    <div :class="$style.publicBenefit">
                        <PlSvg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zongzi.png" width="30" />
                        <span>贡献{{ item.donationAmount }}元公益金</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Crunchies',
    props: {
        amounts: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default () {
                return []
            }
        }
    }
}
</script>

<style module lang='scss'>

.crunchies {
    > .head {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: space-between;
        box-sizing: border-box;
        padding: 32px;
        background-color: #dcfbff;
        > .user {
            width: 228px;
            height: 160px;
            background: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/公益行动者.png') 100%/100% no-repeat;
            > img {
                position: relative;
                top: 22px;
                width: 96px;
                height: 96px;
                border-radius: 50%;
            }
        }
        > .accumulated-price {
            width: 100%;
            margin-top: 34px;
            font-size: 24px;
            color: #999;
            > div:nth-of-type(1) {
                font-size: 36px;
                font-weight: bold;
                color: #333;
            }
        }
    }
    > .content {
        box-sizing: border-box;
        padding: 0 20px;
        max-height: 620px;
        overflow-y: auto;
        background-color: #fff;
        > .item {
            display: flex;
            justify-content: space-between;
            padding: 20px 0;
            border-bottom: 1px solid #ededed;
            &:nth-last-of-type(1) {
                border: none;
            }
            > .customer {
                display: flex;
                align-items: center;
                font-size: 24px;
                color: #333;
                > img {
                    width: 62px;
                    height: 62px;
                    margin-right: 16px;
                    border-radius: 50%;
                    overflow: hidden;
                }
            }
            > .price {
                display: flex;
                font-size: 24px;
                color: #666;
                > .public-benefit {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    > span {
                        color: #ffa300;
                        margin-left: 5px;
                    }
                }
            }
        }
    }
}

</style>
