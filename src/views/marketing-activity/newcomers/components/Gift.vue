<template>
    <div :class="{ [$style.gift]: true, [$style.one]: count === 1 }">
        <img :src="image" alt="">
        <div>
            <div :class="$style.name" class="fz-24" v-text="name" />
            <div :class="$style.time" class="fz-20 gray-3">{{ start | dateFormat('YYYY.M.D') }}-{{ end | dateFormat('YYYY.M.D') }}可兑换</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gift',
    props: {
        image: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        start: {
            type: String,
            default: ''
        },
        end: {
            type: String,
            default: ''
        },
        // 礼品数量
        count: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style module lang="scss">
    .gift {
        display: inline-block;
        width: 292px;
        height: 404px;
        margin-right: 16px;
        font-size: 0;
        border-radius: 20px 20px 0 0;
        overflow: hidden;
        background-color: #FFEAE1;
        > img {
            display: block;
            width: 292px;
            height: 292px;
        }
        > div {
            padding: 26px 12px;
            > .name {
                margin-bottom: 18px;
                @include elps-wrap(1);
            }
        }
        &.one {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 180px;
            width: 614px;
            margin-right: 0;
            box-sizing: border-box;
            border-radius: 20px;
            > img {
                width: 180px;
                height: 180px;
            }
            > div {
                padding: 28px 32px;
                > .name {
                    margin-bottom: 20px;
                    font-weight: bold;
                    font-size: 30px;
                    @include elps-wrap(1);
                }
            }
        }
    }
</style>
