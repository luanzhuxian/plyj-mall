<template>
    <div :class="[$style.lump, $style.answer]">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/答题.png" alt="">
        <span :class="$style.title">答题</span>
    </div>
</template>

<script>
import RadioGroup from './components/Radio-Group'

export default {
    name: 'Answer',
    inheritAttrs: false,
    props: {
        liveSdk: {
            type: Object,
            default: null
        },
        socket: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            answer: ''
        }
    },
    created () {
        this.$propmt({
            hasCancelButton: false,
            hasDefaultInput: false,
            closeOnClickMask: false,
            useDangersHtml: true,
            message: '答题',
            viceMessage: '答题',
            slot: this.$createElement(RadioGroup, {
                props: {
                    value: this.answer,
                    data: ['A', 'B', 'C']
                },
                on: {
                    change: val => {
                        this.answer = val
                    }
                }
            }),
            customValidate: () => this.answer
        })
    },
    methods: {
        init () {
            const { EVENTS: { GET_TEST_QUESTION_CONTENT, STOP_TEST_QUESTION } } = window.PolyvLiveSdk
            this.liveSdk.on(GET_TEST_QUESTION_CONTENT, this.receive)
            this.liveSdk.on(STOP_TEST_QUESTION, this.end)
            this.liveSdk.on(STOP_TEST_QUESTION, this.getResult)
        },
        receive (event, data) {
            // itemType 答题类型，1表示快速问答，0表示答题卡
            // type 题目类型，R表示单选，C表示多选，S表示评分（快速问答无此类型题目）
            console.log(data)
        },
        getResult (event, data) {
            console.log(data)
        },
        send () {
            this.socket.emit('message', JSON.stringify({
                EVENT: 'ANSWER_TEST_QUESTION',
                roomId: ``,
                nick: '',
                userId: '',
                option: '',
                questionId: ''
            }))
        },
        end (event, data) {

        },
        createElement () {

        }
    }
}
</script>

<style lang='scss' module>

@import './common.scss';

.answer {
    //
}

</style>
