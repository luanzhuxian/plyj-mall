import { axios } from '../assets/js/axios'

export const getProduct = ({ categoryId, subCategoryId, current, size }) => axios.get(`/apis/v1/product/public/productPageByCategoryWithOutHidden?categoryId=${ categoryId }&subCategoryId=${ subCategoryId }&current=${ current }&size=${ size }`)

// 获取所有分类
// export const getCategories = params => axios.get('/apis/v1/product/category/agent/public/list', { params })

// GET 指定商城的树形分类信息
export const getCategoryTree = () => axios.get(`/apis/v1/product/category/tree/platform`)

// GET 商户端-根据商品分类查询商品
// export const getProductsByCategory = (categoryCode, mallSeq) => axios.get(`/apis/v1/product/category/page/category/products?categoryCode=${categoryCode}&mallSeq=${mallSeq}`)
