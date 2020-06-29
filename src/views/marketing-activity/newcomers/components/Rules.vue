<template>
    <div :class="$style.rules">
        <div :class="$style.entry" @click="show = true">活动规则</div>
        <pl-popup
            :show.sync="show"
            title="活动细则"
            append-body
        >
            <ol :class="$style.content">
                <li>
                    <span>活动时间：{{ startTime | dateFormat('YYYY.MM.DD') }} 至 {{ endTime | dateFormat('YYYY.MM.DD') }}</span>
                </li>
                <li>
                    <span>活动对象：新注册会员</span>
                </li>
                <li>
                    <span>活动说明：</span>
                    <pre v-text="activityBrief" />
                </li>
            </ol>
        </pl-popup>
    </div>
</template>

<script>
export default {
    name: 'Poster',
    data () {
        return {
            show: false
        }
    },
    props: {
        startTime: {
            type: Number,
            default: 0
        },
        endTime: {
            type: Number,
            default: 0
        },
        activityBrief: {
            type: String,
            default: ''
        }
    }
}
</script>

<style module lang="scss">
    .rules {
        position: absolute;
        right: 0;
        top: 210px;
        > .entry {
            width: 128px;
            line-height: 50px;
            color: #fff;
            font-size: 24px;
            text-align: center;
            border-radius: 25px 0 0 25px;
            background-color: #FA8E59;
        }
    }
    .content {
        padding: 24px 24px 60px;
        font-size: 26px;
        line-height: 56px;
        counter-reset: on 0;
        > li {
            counter-increment: on;
            &:before {
                content: counters(on, '-') '. '; /* 形如：3-1.  */
            }
            > pre {
                padding: 0 24px;
                word-break: break-all;
                white-space: pre-wrap;
            }
        }
    }
</style>
