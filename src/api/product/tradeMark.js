import request from '@/utils/request'
// 获取品牌管理的数据的模块

// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET'
})

// 1.添加品牌的接口
// /admin/product/baseTrademark/save   POST   参数：品牌名称、品牌logo
// 对于新增的品牌，不需要传递id，因为id是由服务器生成的
// 2.修改品牌的接口
// /admin/product/baseTrademark/update  PUT   参数：id、品牌名称、品牌logo
// 对于修改品牌的操作，前端要带上id，告诉服务器要修改哪个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 携带id，说明是修改
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data: tradeMark
    })
  } else {
    // 不带id，是新增
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'POST',
      data: tradeMark
    })
  }
}

// 删除品牌的接口
// /admin/product/baseTrademark/remove/{id}  DELETE
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'DELETE'
})