// 获取品牌属性管理的数据的模块

import request from '@/utils/request'

// 获取一级分类数据的接口
// /admin/product/getCategory1  GET
export const reqCategory1 = () => request({
  url: '/admin/product/getCategory1',
  method: 'GET'
})

// 获取二级分类数据的接口
// /admin/product/getCategory2/{category1Id}  GET
export const reqCategory2 = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'GET'
})

// 获取三级分类数据的接口
// /admin/product/getCategory3/{category2Id}  GET
export const reqCategory3 = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: 'GET'
})

// 获取商品基础属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  GET
export const reqAttrList = ({ category1Id, category2Id, category3Id }) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'GET'
})

// 保存商品属性与属性值的接口
// /admin/product/saveAttrInfo  POST
// 参数：
// {
//   "attrName": "string",  属性名
//   "attrValueList": [     属性值
//     {
//       "attrId": 0,       属性的id
//       "valueName": "string"
//     }
//   ],
//   "categoryId": 0,       category3Id
//   "categoryLevel": 3,
// }
export const reqAddOrUpdateAttr = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'POST',
  data
})

// 删除属性接口
// /admin/product/deleteAttr/{attrId}  DELETE
export const reqDeleteAttr = (attrId) => request({
  url: `/admin/product/deleteAttr/${attrId}`,
  method: 'DELETE'
})