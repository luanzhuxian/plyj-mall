<!-- 新人有礼首页弹框提示 -->
<template>
    <router-link
        tag="div"
        :class="$style.newUserHomeBtn"
        :to="{ name: 'Newcomers', params: { id } }"
    />
</template>

<script>
export default {
    name: 'NewUserHomeBtn',
    props: {
        show: Boolean,
        id: {
            type: String,
            default: ''
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module lang="scss">
    .newUserHomeBtn {
        position: fixed;
        right: -10px;
        bottom: 164px;
        width: 120px;
        height: 120px;
        transform-style: preserve-3d;
        perspective: 500px;
        background: url("https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser-btn.png") no-repeat center center;
        background-size: 100%;
        /*animation: ball 5s infinite;*/
        z-index: 2;
        &:after {
            position: absolute;
            bottom: -10px;
            left: 50%;
            backface-visibility: hidden;
            transform: translateX(-50%) rotateX(45deg);
            width: 80px;
            height: 20px;
            border-radius: 50%;
            background-image: radial-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
            filter: blur(5px);
            /*animation: ball-shadow 5s infinite;*/
            z-index: 1;
        }
    }
    @keyframes ball {
        0% { transform: translateY(0) }
        5% { transform: translateY(-30px) }
        12% { transform: translateY(0) }
        17% { transform: translateY(-12px) }
        21% { transform: translateY(0) }
        24% { transform: translateY(-4px) }
        26% { transform: translateY(0) }
        100% { transform: translateY(0) }
    }
    @keyframes ball-shadow {
        0% { transform: translateX(-50%) rotateX(45deg) translateY(0) }
        5% { transform: translateX(-50%) rotateX(45deg) translateY(30px) }
        12% { transform: translateX(-50%) rotateX(45deg) translateY(0) }
        17% { transform: translateX(-50%)  rotateX(45deg)translateY(12px) }
        21% { transform: translateX(-50%) rotateX(45deg) translateY(0) }
        24% { transform: translateX(-50%) rotateX(45deg) translateY(4px) }
        26% { transform: translateX(-50%) rotateX(45deg) translateY(0) }
        100% { transform: translateX(-50%) translateY(0) }
    }
</style>
