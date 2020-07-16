<template>
    <div :class="[$style.lump, $style.answer]" @click="showData(data)">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/答题.png" alt="">
        <span :class="$style.title">答题</span>
    </div>
</template>

<script>
import CheckGroup from './components/Check-Group'

export default {
    name: 'Answer',
    inheritAttrs: false,
    props: {
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
            singleAnswer: '',
            multipleAnswer: [],
            // 提交答案集合
            answers: new Map(),
            data: null
        }
    },
    methods: {
        async init () {
            try {
                await this.$nextTick()
                this.socket.off('message', this.getQuestion)
                this.socket.off('message', this.getQuestionResult)

                this.socket.on('message', this.getQuestion)
                this.socket.on('message', this.getQuestionResult)
            } catch (e) { throw e }
        },
        getQuestion (data) {
            const { EVENTS: { GET_TEST_QUESTION_CONTENT } } = window.PolyvLiveSdk
            data = JSON.parse(data)

            if (data.EVENT.toUpperCase() === GET_TEST_QUESTION_CONTENT.toUpperCase()) {
                this.showData(data)
            }
        },
        getQuestionResult (data) {
            const { EVENTS: { GET_TEST_QUESTION_RESULT } } = window.PolyvLiveSdk
            data = JSON.parse(data)

            if (data.EVENT.toUpperCase() === GET_TEST_QUESTION_RESULT.toUpperCase()) {
                this.getResult(data)
            }
        },
        getOptions (data) {
            let index = 1
            let key = `option${ index }`
            const options = []
            const choice = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
            while (data.hasOwnProperty(key) && data[key] !== null) {
                options.push({
                    label: data[key],
                    value: choice[index]
                })
                key = `option${ ++index }`
            }
            return options
        },
        async showData (data) {
            if (!data) {
                this.$alert({
                    message: '答题',
                    viceMessage: '主播暂未发起答题~'
                })
                return
            }
            // itemType 答题类型，1表示快速问答，0表示答题卡
            // type 题目类型，R表示单选，C表示多选，V表示投票，S表示评分（快速问答无此类型题目）
            const { itemType, type, name, questionId } = data
            const isQuick = itemType === 1
            const isMultiple = type === 'C'
            this.data = data

            const customValidate = () => {
                if (isMultiple) {
                    if (!this.multipleAnswer.length) this.$warning('请选择答案')
                    return this.multipleAnswer.length
                }

                if (!this.singleAnswer) this.$warning('请选择答案')
                return this.singleAnswer
            }

            const change = val => {
                isMultiple ? this.multipleAnswer = val : this.singleAnswer = val
            }

            await this.$propmt({
                hasCancelButton: false,
                hasDefaultInput: false,
                useDangersHtml: true,
                message: '答题',
                viceMessage: `【${ isMultiple ? '多选' : '单选' }】 ${ isQuick ? '请选择你的答案' : name }`,
                confirmText: '提交答案',
                slot: this.$createElement(CheckGroup, {
                    props: {
                        isResult: false,
                        isSingle: !isMultiple,
                        isQuick,
                        value: isMultiple ? this.multipleAnswer : this.singleAnswer,
                        data: this.getOptions(data)
                    },
                    on: {
                        change
                    }
                }),
                customValidate
            })

            this.answers.set(questionId, isMultiple ? this.multipleAnswer : this.singleAnswer)
            const answer = isMultiple ? this.sortMultipleAnswer.join('') : this.singleAnswer
            this.send(answer, data.questionId)
            this.clear()
        },
        getResult (data) {
            if (['V', 'S'].includes(data.content.type)) {
                return
            }

            const answer = this.answers.get(data.content.questionId)
            if (!answer) {
                return
            }

            const { itemType, type, name, answer: rightAnswers } = data.content
            const isQuick = itemType === 1
            const isMultiple = type === 'C'
            this.$propmt({
                hasCancelButton: false,
                hasDefaultInput: false,
                useDangersHtml: true,
                message: '答题结果',
                viceMessage: name,
                slot: this.$createElement(CheckGroup, {
                    props: {
                        rightAnswers: rightAnswers.split(''),
                        isResult: true,
                        isSingle: !isMultiple,
                        isQuick,
                        value: answer,
                        data: this.getOptions(data.content)
                    }
                })
            })
        },
        send (option, questionId) {
            const { channelId, userName: nick, userId } = this
            const data = {
                EVENT: 'ANSWER_TEST_QUESTION',
                roomId: `${ channelId }`,
                nick,
                userId,
                option,
                questionId
            }
            this.socket.emit('message', JSON.stringify(data))
        },
        clear () {
            this.singleAnswer = ''
            this.multipleAnswer = []
            this.data = null
        }
    },
    computed: {
        sortMultipleAnswer () {
            const answers = JSON.parse(JSON.stringify(this.multipleAnswer || []))
            const templates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
            const options = new Map(templates.map((item, index) => [item, index]))

            return answers.sort((n, p) => options.get(n) - options.get(p))
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
