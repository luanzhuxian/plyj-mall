<template>
    <div>
        <load-more
            ref="loadMore"
            :form="form"
            :request-methods="getBurseList"
            @refresh="e => { refreshList(e), checkList = [] }"
            @more="refreshList"
            no-content-tip="暂无数据"
            :no-icon="true"
        >
            <!-- <img style="width: 400px;" slot="icon" src="https://mallcdn.youpenglai.com/static/admall/f20994d7-316b-43e9-be44-4f78dc6fc295.png" alt=""> -->
            <burse-item @select="select" v-bind="$attrs" :is-edit="isEdit" is-watch :item="item" v-for="(item,index) in burseList" :key="index" />
        </load-more>
        <div :class="$style.btn">
            <span v-if="isEdit" @click="deletes">删除</span>
            <span v-else @click="$router.push({name:'MyBurse'})">返回我的奖学金</span>
        </div>
    </div>
</template>

<script>
import BurseItem from './Burse-Item.vue'
import LoadMore from '../../common/Load-More.vue'
import { getBurseList, deleteBurse } from '../../../apis/my-burse.js'
export default {
    name: 'BurList',
    inheritAttrs: false,
    components: {
        BurseItem,
        LoadMore
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        status: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            $refresh: null,
            getBurseList,
            form: {
                //  奖学金状态 0：待领取；1：待使用； 2：已使用； 3：已过期 ； 4：已失效； 5：已删除
                status: 0,
                current: 1,
                size: 10
            },
            // 列表
            burseList: [],
            // 选中的列表
            checkList: []
        }
    },
    async mounted () {
        this.form.status = this.status
        await this.$nextTick()
        this.$refresh = this.$refs.loadMore.refresh
        this.$refresh()
    },
    methods: {
        refreshList (list) {
            for (const item of list) {
                item.checked = false
            }
            this.burseList = JSON.parse(JSON.stringify(list))
        },

        // 点击选中或取消
        select () {
            this.checkList = this.burseList.filter(({ checked }) => checked) || []
        },
        async deletes () {
            if (this.checkList.length === 0) {
                this.$error('请至少选中一项')
            } else {
                try {
                    const ids = this.checkList.map(({ id }) => id)
                    await deleteBurse(ids)
                    this.$success('删除成功')
                    this.$refresh()
                } catch (e) { throw e }
            }
        }
    }
}
</script>

<style lang="scss" module scoped>
  .btn {
    position: fixed;
    bottom: 28px;
    left: 0;
    width: 100%;
    text-align: center;
    > span {
      display: inline-block;
      width: 700px;
      text-align: center;
      font-size: 32px;
      font-weight: 400;
      color: #FFFFFF;
      background: #F2B036;
      padding: 22px 0;
      border-radius: 10px;
    }
  }
</style>
