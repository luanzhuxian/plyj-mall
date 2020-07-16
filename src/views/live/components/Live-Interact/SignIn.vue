<template>
    <div :class="[$style.lump, $style.signIn]" @click="showInfo">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/签到.png" alt="">
        <span :class="$style.title">签到</span>
    </div>
</template>

<script>
export default {
    name: 'SignIn',
    inheritAttrs: false,
    props: {
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
            checkinId: ''
        }
    },
    methods: {
        async init () {
            try {
                await this.$nextTick()
                console.log('签到初始化')

                this.socket.off('message', this.signIn)
                this.socket.off('message', this.stopSignIn)

                this.socket.on('message', this.signIn)
                this.socket.on('message', this.stopSignIn)
            } catch (e) { throw e }
        },
        signIn (data) {
            const { EVENTS: { SIGN_IN } } = window.PolyvLiveSdk
            data = JSON.parse(data)

            if (data.EVENT.toUpperCase() === SIGN_IN.toUpperCase()) {
                console.log('收到签到：', data)
                this.checkinId = data.data.checkinId
                this.roomId = data.roomId
                this.showInfo()
            }
        },
        stopSignIn (data) {
            const { EVENTS: { STOP_SIGN_IN } } = window.PolyvLiveSdk
            data = JSON.parse(data)

            if (data.EVENT.toUpperCase() === STOP_SIGN_IN.toUpperCase()) {
                this.checkinId = ''
            }
        },
        async showInfo () {
            try {
                if (!this.checkinId) {
                    this.$alert({
                        useDangersHtml: true,
                        message: this.createNodeTemplate('主播暂未发起签到~')
                    })
                    return
                }

                await this.$alert({
                    useDangersHtml: true,
                    message: this.createNodeTemplate('主播邀请您签到~'),
                    confirmText: '立即签到'

                })

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
                this.checkinId = ''
            } catch (e) { throw e }
        },
        createNodeTemplate (message) {
            const { warnInfo, title, content } = this.$style

            return `<div class=${ warnInfo }>
                        <div class=${ title }>签到</div>
                        <div class=${ content }>
                            <div>${ message }</div>
                        </div>
                    </div>`
        }
    }
}
</script>

<style lang='scss' module>

@import './common.scss';

</style>
