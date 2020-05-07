<template>
    <div
        v-if="needStudentList.length"
        :class="$style.itemSelector"
        @click.capture="selectStudent"
    >
        <pl-fields
            size="middle"
            text="学员信息"
            icon="icon-name-card"
            :icon-gap="12"
            show-right-icon
            :right-text="CHECKED_STUDENT.length ? `已选择${ CHECKED_STUDENT.length }位` : '未选择'"
            left-text-weight="bold"
        >
            <ul :class="$style.studentList">
                <li :class="$style.studentItem" v-for="(item, i) of CHECKED_STUDENT" :key="i">
                    <p :class="$style.studentName">
                        <span>姓名</span>
                        <span v-text="item.stuName" />
                    </p>
                    <p :class="$style.studentPhone">
                        <span>电话</span>
                        <span v-text="item.stuMobile" />
                    </p>
                </li>
            </ul>
        </pl-fields>
    </div>
</template>

<script>
export default {
    name: 'SubmitOrderStudent',
    data () {
        return {
            CHECKED_STUDENT: []
        }
    },
    props: {
        products: {
            type: Array,
            default () {
                return []
            }
        }
    },
    mounted () {
        this.CHECKED_STUDENT = JSON.parse(sessionStorage.getItem('CHECKED_STUDENT')) || []
        this.$emit('selected', this.CHECKED_STUDENT)
    },
    computed: {
        needStudentList () {
            return this.products.filter(item => item.needStudents)
        }
    },
    methods: {
        selectStudent () {
            sessionStorage.setItem('SELECT_STUDENT_FROM', JSON.stringify({
                name: this.$route.name,
                query: this.$route.query,
                params: this.$route.params
            }))
            this.$router.push({
                name: 'StudentList',
                query: {
                    select: 'YES',
                    count: this.needStudentList.map(item => item.count).reduce((t, a) => t + a)
                }
            })
        }
    }
}
</script>

<style module lang="scss">
    .item-selector {
        margin-bottom: 20px;
        padding-left: 24px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
    }
    .student-list {
        background-color: #fff;
        padding-right: 24px;
        .student-item {
            padding: 24px 0;
            font-size: 28px;
            line-height: 40px;
            border-bottom: 1px solid #e7e7e7;
            &:nth-last-of-type(1) {
                border-bottom: none;
            }
            > .student-name {
                display: flex;
                justify-content: space-between;
                margin-bottom: 26px;
            }
            > .student-phone {
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>
