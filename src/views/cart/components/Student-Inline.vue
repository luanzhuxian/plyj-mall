<template>
    <div :class="$style.content" @click="selectStudent">
        <div v-if="!students.length">
            <span>请选择</span>
            <pl-svg
                :class="{ [$style.rightArrow]: true }"
                name="icon-right" fill="#ccc" height="24"
            />
        </div>
        <div v-else>
            <span
                v-for="(stu, i) of students"
                :key="i"
                v-text="stu.stuName + (i === students.length - 1 ? '' : ',')"
            />
            <pl-svg :class="$style.rightArrow" name="icon-right" fill="#ccc" height="24" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'StudentInline',
    data () {
        return {
            students: []
        }
    },
    props: {
        product: {
            type: Object,
            default () {
                return {}
            }
        },
        count: {
            type: Number,
            default: 0
        }
    },
    mounted () {
        const CHECKED_STUDENT = JSON.parse(sessionStorage.getItem('CHECKED_STUDENT')) || {}
        const { sku1, sku2 } = this.product
        this.students = CHECKED_STUDENT[sku1 + sku2] || []
        this.$emit('inited', this.students.map(item => ({
            name: item.stuName,
            mobile: item.stuMobile
        })))
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
                    sku: product.sku1 + product.sku2,
                    count: product.count
                }
            })
        }
    }
}
</script>

<style module lang="scss">
  .rightArrow {
    margin-left: 10px;
    vertical-align: -4px;
    transition: transform .2s linear;
  }
  .content {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-left: 68px;
  }

  @keyframes bordrFlicker {
      0% { border-color: #F24724 }
      50% { border-color: transparent }
      100% { border-color: #F24724 }
  }
</style>
