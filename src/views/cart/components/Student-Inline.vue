<template>
    <div :class="$style.studentInline" @click="selectStudent">
        <span v-if="!students.length">请选择</span>
        <div :class="$style.studentList" v-else>
            <span
                v-for="(stu, i) of students"
                :key="i"
                v-text="stu.stuName + (i === students.length - 1 ? '' : ',')"
            />
        </div>
        <pl-svg :class="$style.rightArrow" name="icon-right" fill="#ccc" height="24" />
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
    .student-inline {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
    }

    .rightArrow {
        vertical-align: -4px;
    }

    .studentList {
        width: 400px;
        text-align: right;
        @include elps();
    }
</style>
