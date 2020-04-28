<template>
    <!-- 春耘计划礼品组件 -->
    <div :class="[$style.springPloughingGiftItem, $style[color]]">
        <div :class="$style.imageWrapper" v-if="isCoupon">
            <pl-svg name="icon-coupon-default-32cbf" width="120" height="81" />
        </div>
        <img v-imgError :src="data.giftImage" alt="" v-else>
        <div :class="$style.right">
            <p :class="$style.name" v-text="data.giftName" />
            <p :class="$style.desc" v-text="data.giftBrief" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpringPloughingGiftItem',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        color: {
            type: String,
            default: 'green'
        }
    },
    computed: {
        isCoupon () {
            return this.data.giftType === 0
        }
    }
}
</script>

<style module lang="scss">
.spring-ploughing-gift-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    margin-bottom: 20px;
    padding-right: 20px;
    background-color: #26601f;
    box-shadow: 0 0 0 2px #124e0b inset;
    border-radius: 60px;
    box-sizing: border-box;
    > img,
    .image-wrapper {
        width: 168px;
        height: 112px;
        object-fit: cover;
        margin: 4px;
        border: 2px solid #a3d816;
        border-radius: 56px;
    }
    .image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fbefd7;
    }
}
.right {
    flex: 1;
    margin-left: 26px;
    padding: 14px 0;
    font-size: 28px;
    @include elps();
}
.name {
    margin-bottom: 4px;
    color: #d1e42c;
    @include elps();
}
.desc {
    color: #fff;
    @include elps();
}
// 黄色
.yellow {
    background-color: #f5c36c;
    box-shadow: none;
    > img,
    .image-wrapper {
        border: 2px solid #c94828;
    }
    .name {
        color: #c94828;
    }
    .desc {
        color: #663a15;
    }
}

</style>
