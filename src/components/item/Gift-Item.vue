<template>
    <!-- 礼品组件 -->
    <div :class="$style.giftItem">
        <div :class="$style.image" :style="{ '--image': `url('${ giftImage }')` }" />
        <div :class="$style.right">
            <div :class="$style.name" v-text="name" />
            <div :class="$style.activeText" v-text="activeDesc" />
            <div :class="$style.validateDate">
                有效期：{{ startTime }} ~ {{ endTime }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GiftItem',
    props: {
        giftImage: {
            type: String,
            default: '',
            required: true
        },
        name: {
            type: String,
            default: '',
            required: true
        },
        startTime: {
            type: String,
            default: '',
            required: true
        },
        endTime: {
            type: String,
            default: '',
            required: true
        },
        // 领取礼品的活动描述
        activeDesc: {
            type: String,
            default: ''
        }
    }
}
</script>

<style module lang="scss">
    .giftItem {
        position: relative;
        display: flex;
        padding: 6px 16px;
        background-color: #fff;
        overflow: hidden;
        border-radius: 10px;
    }
    .image {
        width: 84px;
        height: 84px;
        padding-right: 16px;
        border-right: 2px dashed #d6565c;
        background: var(--image) no-repeat 0 center;
        background-size: 84px;
        background-clip: content-box;
        &::after, &::before {
            content: '';
            position: absolute;
            left: 110px;
            width: 13px;
            height: 13px;
            border-radius: 6.5px;
            background-color: #d6565c;
        }
        &::after {
            bottom: -6px;
        }
        &::before {
            top: -6px;
        }
    }
    .right {
        flex: 1;
        padding-left: 16px;
    }
    .name {
        margin-top: 4px;
        line-height: 26px;
        font-size: 18px;
        font-weight: bold;
        @include elps-wrap(1);
    }
    .activeText {
        margin-top: 2px;
        font-size: 16px;
        line-height: 16px;
        color: #E1622D;
        @include elps-wrap(1);
    }
    .validateDate {
        margin-top: 8px;
        font-size: 14px;
        color: #999;
    }
</style>
