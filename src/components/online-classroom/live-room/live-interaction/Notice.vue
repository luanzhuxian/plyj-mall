<template>
    <div :class="[$style.lump, $style.notice]" @click="showInfo">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/公告.png" alt="">
        <span :class="$style.title">公告</span>
        <div v-if="message" :class="$style.tip" />
    </div>
</template>

<script>
export default {
    name: 'Notice',
    inheritAttrs: false,
    props: {
        socket: {
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
            try {
                this.socket.off('message', this.receiveMessage)

                this.socket.on('message', this.receiveMessage)
            } catch (e) { throw e }
        },
        receiveMessage (data) {
            const { EVENTS: { BULLETIN } } = window.PolyvLiveSdk
            data = JSON.parse(data)

            if (data.EVENT.toUpperCase() === BULLETIN.toUpperCase()) {
                this.message = data.content
                this.showInfo()
            }
        },
        showInfo () {
            if (!this.message) {
                this.$alert({
                    useDangersHtml: true,
                    message: this.createNodeTemplate('主播暂未发布任何公告~')
                })
                return
            }

            this.$alert({
                confirmText: '我知道了',
                useDangersHtml: true,
                message: this.createNodeTemplate(this.message)
            })
        },
        createNodeTemplate (message) {
            const { warnInfo, title, content } = this.$style

            return `<div class=${ warnInfo }>
                        <div class=${ title }>直播公告</div>
                        <div class=${ content }>
                            <div>${ message }</div>
                        </div>
                    </div>`
        }
    }
}
</script>

<style lang='scss' module>

@import 'common';

.notice {
    position: relative;
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
