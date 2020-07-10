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
                    this.$alert({
                        useDangersHtml: true,
                        message: this.createNodeTemplate('主播暂未发起签到~')
                    })
                    return
                }

                if (this.isStop) {
                    this.$alert('签到已经结束')
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
