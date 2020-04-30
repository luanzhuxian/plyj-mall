<template>
    <div :class="$style.rule">
        <div :class="$style.title">活动规则</div>
        <ul :class="$style.progress">
            <template v-for="(item, i) of progress">
                <li :key="'item' + i" :class="$style.item">
                    <div :class="$style.imgWrapper">
                        <pl-svg type="img" :name="item.icon" :width="item.width" />
                    </div>
                    <div :class="{
                        [$style.text]: true,
                        [$style.active]: item.active
                    }">
                        <p
                            v-for="(text, j) of item.text"
                            :key="j"
                        >
                            {{ text }}
                        </p>
                    </div>
                </li>
                <li :key="'line-' + i" :class="$style.line" v-if="i !== (progress.length - 1)" />
            </template>
        </ul>
        <ol :class="$style.detail">
            <li
                v-for="(item, index) of detail"
                :key="index"
            >
                {{ item }}
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    name: 'Rule',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            progress: [{
                icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/bag.png',
                text: ['选择参与', '公益的商品'],
                width: 46,
                active: false
            }, {
                icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zongzi.png',
                text: ['贡献公益金'],
                width: 54,
                active: true

            }, {
                icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/share.png',
                text: ['分享好友', '一起参与'],
                width: 46,
                active: false

            }, {
                icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/check (1).png',
                text: ['活动结束', '捐献公益金'],
                width: 46,
                active: false

            }],
            detail: [
                '1.任何人均可参团，每个人开团数和参团数不得超过最高设定',
                '2.选择参团科目（每个团只能选择一个科目），填写报名基本信息',
                '3.提交报名信息，完成线上支付预定名额',
                '4.活动分享给好友，邀请好友加入你的团，一起赢优惠'
            ]
        }
    }
}
</script>

<style lang="scss" module>
.rule {
    padding: 28px 24px;
    background-color: #fff;
}
.title {
    font-size: 32px;
    font-weight: bold;
    line-height: 44px;
    color: #000;
}
.progress {
    display: flex;
    justify-content: center;
    padding: 28px 0 32px;
    color: #333;
    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 120px;
    }
    .img-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 74px;
        height: 74px;
        border: 2px solid #ccc;
        border-radius: 50%;
    }
    .text {
        margin-top: 12px;
        font-size: 24px;
        line-height: 30px;
        text-align: center;
        &.active {
            color: #ffa300;
        }
    }
    .line {
        box-sizing: border-box;
        width: 70px;
        height: 2px;
        background: #e7e7e7;
        margin: 36px 0;
    }
}
.detail {
    padding: 40px 0 20px;
    font-size: 28px;
    line-height: 48px;
    color: #666;
    border-top: 2px solid #e7e7e7;
    list-style: unset !important;
    list-style-type: decimal;
    > li {
        list-style-position: outside;
    }
}

</style>
