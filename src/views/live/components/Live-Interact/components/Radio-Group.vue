<template>
    <div :class="$style.radioGroup">
        <label v-for="(item,index) in data" :key="index" :class="$style.radio">
            <div :class="{ [$style.option]: true, [$style.active]: item === val }">{{ item }}</div>
            <input type="radio" name="radio" @change="change(item)" :value="item">
        </label>
    </div>
</template>

<script>
export default {
    name: 'RadioGroup',
    props: {
        value: {
            type: String,
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
            val: ''
        }
    },
    methods: {
        change (val) {
            this.$emit('change', this.val = val)
        }
    }
}
</script>

<style lang='scss' module>

.radio-group {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0 130px;
    > .radio {
        box-sizing: border-box;
        &:nth-of-type(2n - 1) {
            margin-right: 80px;
        }
        > input {
            width: 0;
            height: 0;
        }
        > .option {
            box-sizing: border-box;
            margin-bottom: 40px;
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
        }
    }
}

</style>
