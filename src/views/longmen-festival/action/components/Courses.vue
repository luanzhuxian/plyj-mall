<template>
    <div :class="$style.courses">
        <div :class="$style.item" v-for="item in 10" :key="item">
            <div :class="$style.img">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/public-goods-title.png" alt="">
                <div :class="$style.tag"> 系列课 </div>
            </div>
            <div :class="$style.goodsInfo">
                <div :class="$style.name">线上欢乐营 名师伴我学师伴我学名师伴我学师伴我学</div>
                <div :class="$style.price">
                    <span>公益价</span>
                    <span>1000元</span>
                </div>
                <div :class="$style.description">购买将捐赠5元公益金</div>
                <div :class="$style.buy">
                    <div :class="$style.button">立即购买</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Courses'
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
