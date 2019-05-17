import axios from 'axios'

export const getProduct = ({ categoryCode, subCategory, current, size, productStatus }) =>
  axios.get(`/apis/v1/product/productinfo/public/page?categoryCode=${categoryCode}&subCategory=${subCategory}&current=${current}&productStatus=${productStatus}&size=${size}`)

// 获取所有分类
// export const getCategories = params => axios.get('/apis/v1/product/category/agent/public/list', { params })
// GET 指定商城的树形分类信息
export const getCategoryTree = mallSeq => axios.get(`/apis/v1/product/category/tree/platform?mallSeq=${mallSeq}`)
// GET 商户端-根据商品分类查询商品
// export const getProductsByCategory = (categoryCode, mallSeq) => axios.get(`/apis/v1/product/category/page/category/products?categoryCode=${categoryCode}&mallSeq=${mallSeq}`)
