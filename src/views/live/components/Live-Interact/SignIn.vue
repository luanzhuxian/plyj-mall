<template>
    <div :class="$style.signIn" @click="showInfo">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/签到.png" alt="">
        <span :class="$style.title">签到</span>
    </div>
</template>

<script>
export default {
    name: 'SignIn',
    props: {
        liveSdk: {
            type: Object,
            default: null
        },
        appId: {
            type: String,
            default: ''
        },
        channelId: {
            type: [String, Number],
            default: ''
        },
        signStr: {
            type: String,
            default: ''
        },
        userName: {
            type: String,
            default: ''
        },
        userId: {
            type: String,
            default: ''
        },
        socket: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            // 签到 ID
            checkinId: '',
            isStop: false
        }
    },
    methods: {
        async init () {
            try {
                await this.$nextTick()
                const { EVENTS: { SIGN_IN, STOP_SIGN_IN } } = window.PolyvLiveSdk

                this.liveSdk.on(SIGN_IN, (event, data) => {
                    this.checkinId = data.data.checkinId
                    this.roomId = data.roomId
                    this.showInfo()
                })
                this.liveSdk.on(STOP_SIGN_IN, (event, data) => {
                    this.isStop = true
                })
            } catch (e) { throw e }
        },
        async showInfo () {
            try {
                if (!this.checkinId) {
                    this.$alert('主播暂未发起签到~')
                    return
                }

                await this.$alert('主播邀请您签到')
                if (this.isStop) {
                    this.$alert('签到已经结束')
                    return
                }

                const { channelId, checkinId, userName, userId, socket } = this
                socket.emit('message', JSON.stringify({
                    EVENT: 'TO_SIGN_IN',
                    roomId: `${ channelId }`,
                    checkinId,
                    user: {
                        nick: userName,
                        userId
                    }
                }))
                this.$success('签到成功')
            } catch (e) { throw e }
        }
    }
}
</script>

<style lang='scss' module>
.sign-in {
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
}

</style>
