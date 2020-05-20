<template>
    <div>
        <!--顶部tab栏-->
        <template>
            <pl-tab
                :class="$style.tabBar"
                size="small"
                :tabs="tabs"
                :active-id.sync="form.status"
                @change="onTabChange"
            >
                <div
                    v-for="(item, i) of tabs"
                    :class="$style.tabPane"
                    :key="i"
                    :slot="'tab-pane-' + i"
                />
            </pl-tab>
            <div :class="$style.management" @click="management">管理</div>
        </template>
        <!--兑换码列表-->
        <div :class="$style.list">
            <LoadMore
                ref="loadMore"
                no-icon
                :form="form"
                :loading.sync="loading"
                :request-methods="getRedemptionList"
                @refresh="onRefresh"
                @more="onRefresh"
            >
                <template>
                    <div name="icon" :class="$style.noIcon" v-if="!codeList.length">
                        <pl-svg
                            type="img"
                            name="https://mallcdn.youpenglai.com/static/mall/icons/olds/newCouponIcon.png"
                            width="400" />
                        <div>
                            您还没有添加激活码哦~
                            <br>
                            添加激活码，快速兑换商品
                        </div>
                    </div>
                    <template v-else>
                        <div v-for="item in codeList"
                             :key="item.id"
                             :class="[$style.codeItemWapper, isManagementState ? $style.checkBox : '']"
                             @click="selectedChange(item.id)"
                        >
                            <span v-if="isManagementState">
                                <pl-svg v-if="!item.checked" name="icon-weixuanzhong1" width="40" />
                                <pl-svg v-if="item.checked" name="icon-xuanzhong" width="40" />
                            </span>
                            <CodeItem
                                :id="item.id"
                                :name="item.name"
                                :product-total="item.productTotal"
                                :use-total="item.useTotal"
                                :total="item.useTotal + item.stock"
                                :start-time="item.startTime"
                                :end-time="item.endTime"
                                :current-time="item.currentTime"
                                :instruction="item.activituRule"
                                :is-used="item.isUsed"
                                :is-expired="item.isExpired"
                                :button-text="item.buttonText"
                                @codeItemClick="codeItemClick"
                            />
                        </div>
                    </template>
                </template>
            </LoadMore>
        </div>
        <!--底部按钮-->
        <template>
            <pl-button
                v-if="!isManagementState"
                type="warning"
                size="huge"
                :class="$style.button"
                @click="activateCode"
            >
                激活兑换码
            </pl-button>
            <pl-button
                v-else
                type="warning"
                size="huge"
                :class="$style.button"
                :disabled="!deleteIdList.length"
                @click="deleteCode"
            >
                删除
            </pl-button>
        </template>
    </div>
</template>

<script>
import LoadMore from '../../../../components/common/Load-More.vue'
import CodeItem from './components/Code-Item'
import ReceiveCode from './components/Receive-Code'
import moment from 'moment'
import {
    getRedemptionList,
    deleteRedemptionByIds
} from '../../../../apis/my-redemption'
import PlButton from '../../../../components/penglai-ui/Button'

export default {
    name: 'Redemption',
    components: {
        PlButton,
        LoadMore,
        CodeItem
    },
    props: {
        status: {
            type: String,
            default: null
        }
    },
    data () {
        return {
            tabs: [
                { name: '全部', id: 'ALL' },
                { name: '待使用', id: 'WAIT_USE' },
                { name: '已过期', id: 'EXIRED' },
                { name: '已使用', id: 'USED' }
            ],
            form: {
                current: 1,
                size: 10,
                status: ''
            },
            loading: false,
            $refresh: null,
            getRedemptionList,
            codeList: [
                {
                    id: '1213',
                    // 活动名称
                    name: '龙门节兑换码',
                    // 可兑换商品个数
                    productTotal: 12,
                    // 有效期开始时间
                    startTime: '2020.12.13 12:30:00',
                    // 有效期结束时间
                    endTime: '2020.12.24 12:30:00',
                    // 服务器当前时间
                    currentTime: '2020.12.23 12:30:00',
                    // 使用说明
                    activituRule: '骄傲打开大苏打撒旦',
                    // 已使用次数
                    useTotal: 12,
                    // 可使用次数
                    stock: 23
                },
                {
                    id: '122313',
                    name: '龙门节兑换码',
                    productTotal: 12,
                    startTime: '2020.12.18 12:30:00',
                    endTime: '2020.12.20 12:30:00',
                    currentTime: '2020.12.23 12:30:00',
                    activituRule: '骄傲打开大苏打撒旦',
                    useTotal: 12,
                    stock: 23
                }
            ],
            isManagementState: false
        }
    },
    computed: {
        deleteIdList () {
            return this.codeList.filter(item => item.checked).map(item => item.id)
        }
    },
    mounted () {
        this.$refresh = this.$refs.loadMore.refresh
    },
    activated () {
        this.form.status = this.status
        this.$refresh()
    },
    methods: {
        onTabChange (item) {
            this.$nextTick(() => {
                this.$router.replace({ name: 'MyRedemption', params: { status: item.id || null } })
                this.$refresh()
            })
        },
        onRefresh (list, total) {
            // TODO.数据
            list = this.codeList
            list.forEach(item => {
                item.isUsed = !item.stock
                item.isExpired = moment(item.currentTime).valueOf() >= moment(item.endTime).valueOf()
                item.buttonText = item.isUsed ? '已使用' : item.isExpired ? '已过期' : '去使用'
                item.checked = false
            })
            this.codeList = list
        },
        findIndexById (id) {
            return this.codeList.findIndex(item => item.id === id)
        },
        management () {
            this.isManagementState = !this.isManagementState
            if (!this.isManagementState) {
                this.codeList = this.codeList.map(item => {
                    item.checked = false
                    return item
                })
            }
        },
        selectedChange (codeId) {
            const index = this.findIndexById(codeId)
            if (index < 0) return
            const currentCoupon = this.codeList.splice(index, 1)[0]
            currentCoupon.checked = !currentCoupon.checked
            this.codeList.splice(index, 0, currentCoupon)
        },
        codeItemClick (codeId) {
            const index = this.findIndexById(codeId)
            if (index < 0) return
            const detail = this.codeList[index]
            if (detail.isUsed || detail.isExpired) return
            this.$router.push({ name: 'RedemptionCenter', params: { codeId } })
        },
        async activateCode () {
            const h = this.$createElement
            try {
                await this.$confirm({
                    slot: h(ReceiveCode)
                })
            } catch (e) {
                throw e
            }
        },
        async deleteCode () {
            try {
                await deleteRedemptionByIds(this.deleteIdList)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style module lang="scss">
  /*tab栏 start*/
  .tab-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2999;
    padding-right: 160px;
  }

  .tab-pane {
    position: absolute;
    top: 5px;
    right: -45px;
    width: 56px;
    height: 56px;
    line-height: 54px;
    font-size: 32px;
    transform: scale(.5);
    transform-origin: 0 0;
    color: #fff;
  }
  .management {
    position: fixed;
    top: 0;
    right: 30px;
    z-index: 3000;
    line-height: 80px;
    font-size:32px;
    color:#333;
  }
  /*tab栏 end*/

  .list {
    min-height: calc(100vh - 90px - 148px);
    margin-top: 90px;
    margin-bottom: 148px;
    background-color: #F1F4F5;
  }
  /*没有兑换码时*/
  .no-icon {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 300px;
    margin-bottom: -200px;
    > div {
      margin-top: 36px;
      text-align: center;
      line-height: 48px;
      font-size:32px;
      color: #999;
    }
  }

  /*兑换码外部样式*/
  .code-item-wapper {
    overflow: hidden;
    position: relative;
    padding-right: 24px;
    padding-left: 24px;

    > span {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 32px;
    }

    > div {
      transition: marginLeft 1s linear;
    }
  }

  .check-box {
    > div {
      margin-left: 100px;
    }
  }

  /*底部按钮*/
  .button {
    position: fixed;
    bottom: 40px;
    width: calc(100% - 24px - 24px);
    margin: 0 24px;
  }
</style>
