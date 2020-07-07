<template>
    <div>
        <Tabs
            :tabs="tabs"
            v-model="tab"
        >
            <DetailInfo
                v-show="tab === 1"
                :content="detail.detail || '暂无详情'"
            />
            <ul :class="$style.list" v-show="tab === 2">
                <li :class="$style.item">
                    <div :class="$style.pdf">
                        <pl-svg name="icon-pdf-887fd" width="40" />
                        <i>舞蹈考级教程说明</i>
                        <span>.pdf</span>
                    </div>
                    <div :class="$style.state">
                        购买后可查看
                    </div>
                </li>
                <li :class="$style.item">
                    <div :class="$style.pdf">
                        <pl-svg name="icon-pdf-887fd" width="40" />
                        <i>舞蹈考级教程说明</i>
                        <span>.pdf</span>
                    </div>
                    <div :class="$style.state">
                        购买后可查看
                    </div>
                </li>
            </ul>
        </Tabs>
    </div>
</template>

<script>
import Tabs from './components/Tabs.vue'
import DetailInfo from './components/Detail.vue'
export default {
    name: 'ImageTextDetail',
    components: {
        Tabs,
        DetailInfo
    },
    data () {
        return {
            tabs: [
                {
                    label: '详情介绍',
                    value: 1
                },
                {
                    label: '图文资料',
                    value: 2
                }
            ],
            tab: 2,
            detail: {}
        }
    }
}
</script>

<style module lang="scss">
    .list {
        padding: 0 48px 38px 48px;
        > .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 122px;
            border-bottom: 1px solid #e7e7e7;
            font-size: 24px;
            color: #666;
            &:nth-last-of-type(1) {
                border-bottom: none;
            }
            > .pdf {
                width: 356px;
                > svg {
                    margin-right: 14px;
                }
                > i {
                    display: inline-block;
                    max-width: 300px;
                    @include elps();
                }
                > span {
                    display: inline-block;
                    vertical-align: 2px;
                }
            }
        }
    }
</style>
