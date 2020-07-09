<template>
    <div :class="$style.notice" @click="showInfo">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/公告.png" alt="">
        <span :class="$style.title">公告</span>
        <div v-if="message" :class="$style.tip" />
    </div>
</template>

<script>
export default {
    name: 'Notice',
    props: {
        liveSdk: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            message: ''
        }
    },
    methods: {
        init () {
            const { EVENTS: { BULLETIN } } = window.PolyvLiveSdk
            this.liveSdk.on(BULLETIN, (event, data) => {
                this.message = data.content
                this.showInfo()
            })
        },
        showInfo () {
            if (!this.message) {
                this.$alert('暂无公告')
                return
            }

            this.$alert({
                confirmText: '我知道了',
                useDangersHtml: true,
                message: this.message
            })
        }
    }
}
</script>

<style lang='scss' module>

.notice {
    position: relative;
    > .icon {
        width: 102px;
        height: 102px;
    }
    > .title {
        display: block;
        margin-top: 16px;
        text-align: center;
        font-size: 24px;
    }
    > .tip {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #f00;
    }
}

</style>
