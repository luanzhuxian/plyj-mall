<template>
    <div :class="$style.questions" @click="showQuestions">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/提问.png" alt="">
        <span :class="$style.title">提问</span>

        <div :class="{ [$style.chat]: true, [$style.show]: show }">
            <div :class="$style.head">
                <span>提问</span>
                <PlSvg @click.stop="close" name="icon-close" width="26" fill="#999999" />
            </div>

            <div :class="$style.contents" ref="contents">
                <div
                    v-for="(item,index) in data"
                    :key="index"
                    :class="{ [$style.message]: true, [$style.right]: item.user.userType !== 'teacher' && item.user.userId === userId }"
                >
                    <img :src="item.user.userType !== 'teacher' ? item.user.pic : 'https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/老师.png'" alt="">
                    <div :class="$style.content">
                        <div :class="$style.val">{{ item.content }}</div>
                    </div>
                </div>
            </div>

            <div :class="$style.foot">
                <div :class="$style.inputBox">
                    <pl-input
                        v-model.trim="message"
                        placeholder=""
                        type="text"
                    />
                    <pl-button :class="$style.sendBtn" @click.stop="send">提问</pl-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQuestionList } from './../../../../apis/live'
export default {
    name: 'Questions',
    props: {
        liveSdk: {
            type: Object,
            default: null
        },
        socket: {
            type: Object,
            default: null
        },
        channelId: {
            type: [String, Number],
            default: ''
        },
        userName: {
            type: String,
            default: ''
        },
        userId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            show: false,
            message: '',
            data: []
        }
    },
    methods: {
        async init () {
            try {
                const { EVENTS: { T_ANSWER } } = window.PolyvLiveSdk
                this.liveSdk.on(T_ANSWER, this.receive)
                await this.getQuestions()
            } catch (e) { throw e }
        },
        async getQuestions () {
            try {
                const { result: { data } } = await getQuestionList(this.channelId)
                this.data = (data && data.reverse()) || []
                await this.scroll()
            } catch (e) { throw e }
        },
        async receive (event, data) {
            try {
                this.data.push(data)
                await this.scroll()
            } catch (e) { throw e }
        },
        async send () {
            try {
                if (!this.message) {
                    return this.$warning('请输入内容')
                }

                const data = {
                    EVENT: 'S_QUESTION',
                    roomId: `${ this.channelId }`,
                    user: {
                        nick: this.userName,
                        pic: this.avatar,
                        userId: this.userId,
                        userType: 'student'
                    },
                    content: this.message
                }
                this.socket.emit('message', JSON.stringify(data))
                this.message = ''
                this.data.push(data)

                await this.scroll()
            } catch (e) { throw e }
        },
        showQuestions () {
            this.show = true
            this.$emit('close')
        },
        close () {
            this.show = false
        },
        async scroll () {
            try {
                await this.$nextTick()
                const { contents } = this.$refs
                contents.scrollBy(0, contents.scrollHeight)
            } catch (e) { throw e }
        }
    },
    computed: {
        ...mapGetters(['avatar'])
    }
}
</script>

<style lang='scss' module>

.questions {
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
    > .chat {
        position: fixed;
        left: 0;
        bottom: -700px;
        box-sizing: border-box;
        width: 100%;
        height: 700px;
        padding-bottom: 120px;
        border-radius: 40px 40px 0 0;
        background-color: #fff;
        transition: transform .4s ease-in-out;
        &.show {
            transform: translateY(-100%);
        }
        > .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 32px 52px;
            font-size: 34px;
            font-weight: bold;
        }
        > .contents {
            box-sizing: border-box;
            width: calc(100% - 104px);
            max-height: 460px;
            margin: 0 auto;
            overflow-y: auto;
            > .message {
                display: flex;
                margin-bottom: 18px;
                font-size: 26px;
                text-align: left;
                color: #000;
                > img {
                    width: 80px;
                    height: 80px;
                    margin: 0 22px 0 0;
                    border-radius: 50%;
                }
                > .content {
                    box-sizing: border-box;
                    max-width: calc(100% - 194px);
                    > .val {
                        position: relative;
                        margin-top: 10px;
                        padding: 16px;
                        border-radius: 10px;
                        background-color: #f2f2f2;
                        &::before {
                            content: '';
                            display: inline-block;
                            position: absolute;
                            left: -24px;
                            top: 16px;
                            width: 0;
                            height: 0;
                            border: 12px solid transparent;
                            border-right-color: #f2f2f2;
                        }
                    }
                }
                &.right {
                    flex-direction: row-reverse;
                    > img {
                        margin: 0 0 0 22px;
                    }
                    > .content {
                        > .val {
                            &::before {
                                left: 100%;
                                border-right-color: transparent;
                                border-left-color: #f2f2f2;
                            }
                        }
                    }
                }
            }
        }
        > .foot {
            position: absolute;
            bottom: 0;
            box-sizing: border-box;
            width: 100%;
            padding: 22px 28px;
            border-top: 2px solid #eee;
            .input-box {
                position: relative;
                display: inline-flex;
                align-items: center;
                width: 100%;
                height: 74px;
                padding: 0 140px 0 16px;
                line-height: 74px;
                background-color: #f7f7f7;
                border: 1px solid #eee;
                border-radius: 8px;
                box-sizing: border-box;
                > input {
                    display: inline-block;
                    width: 100%;
                    font-size: 26px;
                    line-height: 36px;
                    background-color: transparent;
                }
            }
            .send-btn {
                position: absolute;
                right: 0;
                width: 124px;
                line-height: 76px;
                text-align: center;
                color: #fff;
                font-size: 28px;
                border-radius: 0 8px 8px 0;
                background-color: #f2b036;
            }
        }
    }
}

</style>
