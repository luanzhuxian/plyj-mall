<template>
    <div
        :class="{
            [$style.infoItem]: true,
            [$style.lessonError]: lessonErrorId === product.skuCode1
        }"
    >
        <div :class="$style.content" @click="selectStudent">
            <span :class="$style.itemLabel">学员信息</span>
            <div :class="$style.lessonErrorTip" v-if="lessonErrorId === product.skuCode1">
                <pl-svg name="icon-warning" fill="#F24724" height="36" width="36" />
                <span v-text="lessonErrorTip" />
            </div>
            <div v-if="!students.length">
                <span>请选择</span>
                <pl-svg
                    :class="{ [$style.rightArrow]: true }"
                    name="icon-right" fill="#ccc" height="24"
                />
            </div>
            <div v-else>
                <span>已选{{ students.length }}人</span>
                <pl-svg :class="$style.rightArrow" name="icon-right" fill="#ccc" height="24" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StudentInline',
    props: {
        product: {
            type: Object,
            default () {
                return {}
            }
        },
        students: {
            type: Array,
            default () {
                return []
            }
        },
        lessonErrorId: {
            type: String,
            default: ''
        },
        lessonErrorTip: {
            type: String,
            default: ''
        },
        count: {
            type: Number,
            default: 0
        }
    },
    watch: {
        lessonErrorTip (val) {
            if (val) {
                this.$nextTick(() => {
                    const errorEl = document.querySelector(`.${ this.$style.lessonError }`)
                    errorEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    })
                })
            }
        }
    },
    methods: {
        selectStudent () {
            const { product } = this
            sessionStorage.setItem('SELECT_STUDENT_FROM', JSON.stringify({
                name: this.$route.name,
                query: this.$route.query,
                params: this.$route.params
            }))
            this.$router.push({
                name: 'StudentList',
                query: {
                    select: 'YES',
                    sku: product.skuCode1 + product.skuCode2,
                    count: product.count
                }
            })
        }
    }
}
</script>

<style module lang="scss">
  .infoItem {
    line-height: 88px;
    font-size: 24px;
    border: 2px solid #fff;
    &.lessonError {
      animation: bordrFlicker .15s ease;
      animation-iteration-count: 5;
      border: 2px solid #F24724;
      .lessonErrorTip {
        flex: 1;
        display: inline-flex;
        align-items: center;
        margin-left: 22px;
        color: #F24724;
        > svg {
          vertical-align: -4px;
        }
      }
    }
  }
  .rightArrow {
    margin-left: 10px;
    vertical-align: -4px;
    transition: transform .2s linear;
  }
  .list {
    padding: 0 24px 0 88px;
    background-color: #F8F8F8;
    max-height: 296px;
    overflow: hidden;
    transition: max-height .2s linear;
    > li {
      display: flex;
      flex: 1;
      justify-content: space-between;
      line-height: 116px;
      .rightArrow {
        transform: rotate(0);
      }
    }
  }
  .content {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-left: 68px;
    padding-right: 28px;
  }

  @keyframes bordrFlicker {
      0% { border-color: #F24724 }
      50% { border-color: transparent }
      100% { border-color: #F24724 }
  }
</style>
