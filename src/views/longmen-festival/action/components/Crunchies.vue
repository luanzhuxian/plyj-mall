<template>
    <div :class="$style.crunchies">
        <div :class="$style.head">
            <div :class="$style.user">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/弹窗.png" alt="">
            </div>
            <div :class="$style.accumulatedPrice">
                <div>50元</div>
                <div>我累积捐赠的公益金</div>
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style.item" v-for="item in 3" :key="item">
                <div :class="$style.customer">
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/弹窗.png" alt="">
                    <div>叶良辰</div>
                </div>
                <div :class="$style.price">
                    <div>购买亲子教育家庭教育</div>
                    <div :class="$style.publicBenefit">
                        <PlSvg name="icon-zongzi-03e21" width="30" />
                        <span>贡献20元公益金</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Crunchies'
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
            background-color: #DCFBFF;
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
                color: #999999;
                > div:nth-of-type(1) {
                    font-size: 36px;
                    font-weight: bold;
                    color: #333333;
                }
            }
        }
        > .content {
            box-sizing: border-box;
            padding: 0 20px;
            max-height: 620px;
            overflow-y: auto;
            background-color: #FFFFFF;
            > .item {
                display: flex;
                justify-content: space-between;
                padding: 20px 0;
                border-bottom: 1px solid #EDEDED;
                &:nth-last-of-type(1) {
                    border: none;
                }
                > .customer {
                    display: flex;
                    align-items: center;
                    font-size: 24px;
                    color: #333333;
                    > img {
                        width: 62px;
                        height: 62px;
                        margin-right: 16px;
                        border-radius: 50%;
                        overflow: hidden;
                    }
                }
                > .price {
                    font-size: 24px;
                    color: #666666;
                    > .public-benefit {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        > span {
                            color: #FFA300;
                            margin-left: 5px;
                        }
                    }
                }
            }
        }
    }

</style>
