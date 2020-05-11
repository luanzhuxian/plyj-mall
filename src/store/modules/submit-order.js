/* 处理提交订单页面再多个页面都需要使用的数据 */
const CHECKED_STUDENT = JSON.parse(localStorage.getItem('CHECKED_STUDENT')) || {}
export const submitOrder = {
    // 开启命名空间
    namespaced: true,
    state: {
        checkedStudents: CHECKED_STUDENT
    },
    mutations: {

        /**
         * 设置选中的学员
         * @param state
         * @param sku {String} 设置学员时对应的商品sku id
         * @param student {Object | Array} 要添加的学员
         * @param count {Number} 要添加的学员数量
         */
        // 添加学员至已选列表
        setCheckedStudent: (state, { sku, student, count }) => {
            // 对当前已选学员信息进行浅拷贝
            const checkedStudents = { ...state.checkedStudents }
            if (Array.isArray(student)) {
                checkedStudents[sku] = student
                state.checkedStudents = checkedStudents
                localStorage.setItem('CHECKED_STUDENT', JSON.stringify(checkedStudents))
                return
            }
            // 检查当前商品是否已经选择过学员
            const checked = checkedStudents[sku] || []
            const finded = checked.find(item => item.id === student.id)
            // 当前选择的学员已存在
            if (finded) {
                Object.assign(finded, student)
            } else if (student.defaultStatus === 1) {
                // 编辑的不是已选择的，但是是默认的
                const def = checked.find(item => item.defaultStatus === 1)
                // 如果原来选中的里边有默认的，就替换这个默认的
                if (def) {
                    Object.assign(def, student)
                } else if (checked.length < count) {
                    checked.push(student)
                } else {
                    checked.splice(-1, 1, student)
                }
            } else if (checked.length < count) {
                // 编辑的不是选中的，且选中的数量不超过最大选中数量
                checked.push(student)
            } else {
                // 编辑的不是选中的，且选中的数量等于最大选中数量，则替换最后一个
                checked.splice(-1, 1, student)
            }
            state.checkedStudents = checkedStudents
            localStorage.setItem('CHECKED_STUDENT', JSON.stringify(checkedStudents))
        },
        // 删除学员时，需要同步更新缓存的学员
        removeStudent: (state, { sku, studentId }) => {
            const checkedData = { ...state.checkedStudents }
            if (checkedData[sku]) {
                const index = checkedData[sku].findIndex(item => item.id === studentId)
                if (index > -1) {
                    checkedData[sku].splice(index, 1)
                }
            }
            state.checkedStudents = checkedData
            localStorage.setItem('CHECKED_STUDENT', JSON.stringify(checkedData))
        }
    },
    getters: {
        checkedStudents: state => state.checkedStudents
    }
}
