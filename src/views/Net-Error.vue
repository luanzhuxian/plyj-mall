<template>
    <div :class="$style.netError">
        <div>
            <span>您的网络不稳定哦，请重试~</span>
            <span @click="retry">重新尝试</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NetError',
    data () {
        return {
            back: null
        }
    },
    beforeRouteEnter (to, from, next) {
        if (navigator.onLine) {
            next({ name: 'Home' })
            return
        }
        next(vm => {
            vm.back = from
        })
    },
    methods: {
        retry () {
            const { back } = this
            this.$router.push({
                name: back.name,
                query: back.query,
                params: back.params
            })
        }
    }
}
</script>

<style module lang="scss">
    .netError {
        width: 100%;
        height: 1000px;
        text-align: center;
        background: url(https://mallcdn.youpenglai.com/static/mall/404.png) no-repeat center center;
        background-size: 60% auto;
        overflow: hidden;

        > div {
            display: flex;
            flex-direction: column;
            margin-top: 700px;
            font-size: 28px;
            line-height: 45px;

            > span:nth-of-type(2) {
                color: #9cbaf7;
                text-decoration: underline;
            }
        }
    }
</style>
