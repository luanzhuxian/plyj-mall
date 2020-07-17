<template>
    <div :class="$style.checkGroup">
        <label v-for="(item,index) in data" :key="index" :class="{ [$style.radio]: true, [$style.card]: !isQuick }">
            <div
                :class="{
                    [$style.option]: true,
                    [$style.active]: isActive(item.value),
                    [$style.right]: isResult && !isQuick && isRight(item.value),
                    [$style.error]: isResult && !isQuick && isError(item.value)
                }"
            >
                <div :class="{ [$style.val]: true, [$style.isResult]: isResult}">{{ item.label }}</div>

                <template v-if="isResult && !isQuick">
                    <PlSvg v-if="isRight(item.value)" fill="#fff" name="icon-right-aa76e" width="28" />
                    <PlSvg v-if="isError(item.value)" fill="#fff" name="icon-close" width="24" />
                </template>
            </div>

            <input v-if="isSingle" type="radio" name="radio" @change="change(item.value)" :value="item.value">
            <input v-else type="checkbox" name="checkbox" @change="change(item.value,$event)" :value="item.value">

        </label>
    </div>
</template>

<script>
export default {
    name: 'CheckGroup',
    props: {
        rightAnswers: {
            type: Array,
            default () {
                return []
            }
        },
        // 是否是答题结果
        isResult: Boolean,
        // 是否快速选择
        isQuick: Boolean,
        // 单选
        isSingle: Boolean,
        value: {
            type: [String, Array],
            default: ''
        },
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            val: '',
            vals: []
        }
    },
    methods: {
        isError (val) {
            if (this.isSingle) {
                return !this.rightAnswers.includes(val) && this.value === val
            }
            return !this.rightAnswers.includes(val) && this.value.includes(val)
        },
        isRight (val) {
            if (this.isSingle) {
                return this.rightAnswers.includes(val) && this.value === val
            }
            return this.rightAnswers.includes(val) && this.value.includes(val)
        },
        isActive (val) {
            if (this.isSingle) {
                return val === this.val
            }
            return this.vals.indexOf(val) !== -1
        },
        change (val, e) {
            if (this.isResult) {
                return
            }

            if (this.isSingle) {
                this.$emit('change', this.val = val)
                return
            }

            const { checked } = e.target
            if (checked) {
                this.vals.push(val)
            } else {
                const index = this.vals.indexOf(val)
                this.vals.splice(index, 1)
            }
            this.$emit('change', this.vals)
        }
    }
}
</script>

<style lang='scss' module>

.check-group {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0 90px;
    > .radio {
        box-sizing: border-box;
        margin-bottom: 40px;
        &:nth-of-type(2n - 1) {
            margin-right: 158px;
        }
        > input {
            width: 0;
            height: 0;
        }
        > .option {
            position: relative;
            box-sizing: border-box;
            width: 100px;
            line-height: 100px;
            border: 2px solid #999;
            border-radius: 50%;
            text-align: center;
            font-size: 34px;
            background-color: #ececec;
            &.active {
                color: #fff;
                border-color: #f2b036;
                background-color: #f2b036;
            }
            &.right {
                background-color: #9cc94e;
                border-color: #9cc94e;
                color: #fff;
            }
            &.error {
                background-color: #ff4848;
                border-color: #ff4848;
                color: #fff;
            }
            > svg {
                position: absolute;
                right: 32px;
                top: 22px;
            }
        }
    }
    > .card {
        width: 100%;
        margin-right: 0 !important;
        margin-bottom: 20px;
        > .option {
            display: flex;
            justify-content: center;
            width: 360px;
            padding: 0 14px;
            border-radius: 40px;
            font-size: 30px;
            > .val {
                display: inline-block;
                max-width: 360px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 70px;
                &.is-result {
                    max-width: 280px;
                }
            }
        }
    }
}

</style>
