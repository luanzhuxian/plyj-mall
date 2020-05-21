/* 处理提交订单页面再多个页面都需要使用的数据 */
const CHECKED_STUDENT = JSON.parse(localStorage.getItem('CHECKED_STUDENT')) || {}
const ORDER_PRODUCTS = JSON.parse(sessionStorage.getItem('CONFIRM_LIST')) || []
const INVOICE_PRODUCTS = JSON.parse(sessionStorage.getItem('APPLY_INVOICE')) || []
const INVOICE_FROM_ROUTE = JSON.parse(sessionStorage.getItem('APPLY_INVOICE_FROM')) || {}
const INVOICE_INFO = JSON.parse(sessionStorage.getItem('INVOICE_MODEL')) || []
export const submitOrder = {
    // 开启命名空间
    namespaced: true,
    state: {
        checkedStudents: CHECKED_STUDENT,
        orderProducts: ORDER_PRODUCTS,
        invoiceProducts: INVOICE_PRODUCTS,
        invoiceFromRoute: INVOICE_FROM_ROUTE,
        invoiceInfo: INVOICE_INFO
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
        },
        clearStudent: state => {
            localStorage.removeItem('CHECKED_STUDENT')
            state.checkedStudents = []
        },

        /**
         * 设置要申请发票的商品
         * @param state
         * @param product {Array} 商品列表
         * @param fromRoute {Object} 设置完发票
         */
        setInvoiceProducts: (state, { products, fromRoute }) => {
            const invoiceProducts = JSON.stringify(products)
            const invoiceFromRoute = JSON.stringify(fromRoute)
            sessionStorage.setItem('APPLY_INVOICE', invoiceProducts)
            sessionStorage.setItem('APPLY_INVOICE_FROM', invoiceFromRoute)
            state.invoiceProducts = JSON.parse(invoiceProducts)
            state.invoiceFromRoute = JSON.parse(invoiceFromRoute)
        },

        /**
         * 设置发票数据
         * @param state
         * @param payload
         */
        setInvoiceInfo: (state, payload) => {
            const invoiceInfo = JSON.stringify(payload)
            sessionStorage.setItem('INVOICE_MODEL', invoiceInfo)
            state.invoiceInfo = JSON.parse(invoiceInfo)
        },
        removeInvoiceInfo: state => {
            sessionStorage.removeItem('INVOICE_MODEL')
            state.invoiceInfo = []
        },
        removeInvoiceProducts: state => {
            sessionStorage.removeItem('APPLY_INVOICE')
            sessionStorage.removeItem('APPLY_INVOICE_FROM')
            state.invoiceProducts = []
            state.invoiceFromRoute = {}
        },
        // isCart: 'NO',
        // activeProduct: this.activeProduct || 1,
        // preActivity: this.preActivity || '',
        // activityId: this.activityProductModel ? this.activityProductModel.activityId || '' : ''
        /**
         * 设置提交订单使用的商品
         * @param state
         * @param {Object} params - 商品数据
         * @param {String} params.activeProduct - 商品参与的活动类型 * 1 正常商品 2 团购 3 秒杀 4 预购 5 春耘 6 组合课
         * @param {String} params.preActivity - 活动状态
         * @param {String} params.activityId - 活动id
         * @param {Array} products - 活动id
         * @param {string} products[].productId - 商品id
         * @param {number} products[].count - 商品数量
         * @param {string} products[].skuCode1 - 规格1
         * @param {string} products[].skuCode2 - 规格2
         * @param {number} products[].price - 价格
         * @param {string} products[].agentUser - helper id, store.getters.shareId, 如果不传，会自动填充
         * @param {string} products[].productType - 商品类型  store.getters.orderTypeKeyMap 种的值
         */
        setOrderProducts (state, { params, products }) {
            for (const item of products) {
                item.agentUser = this.state.SHARE_ID
            }
            const orderProducts = JSON.stringify({ params, products }) || []
            sessionStorage.setItem('CONFIRM_LIST', orderProducts)
            state.orderProducts = JSON.parse(orderProducts)
        },
        removeOrderProducts: state => {
            sessionStorage.removeItem('CONFIRM_LIST')
            state.orderProducts = []
        }
    },
    getters: {
        checkedStudents: state => state.checkedStudents,
        orderProducts: state => state.orderProducts,
        invoiceProducts: state => state.invoiceProducts,
        invoiceFromRoute: state => state.invoiceFromRoute,
        invoiceInfo: state => state.invoiceInfo
    }
}
