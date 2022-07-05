import request from '@/utils/request'

// 获取spu列表数据
// /admin/product/{page}/{limit}    GET   参数page、limit、category3Id
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'GET',
  params: { category3Id }
})

// 获取某一个spu信息的接口
// /admin/product/getSpuById/{spuId}  GET
export const reqSpu = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'GET'
})

// 获取品牌数据
// /admin/product/baseTrademark/getTrademarkList  GET
export const reqTradeMarkList = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'GET'
})

// 获取SPU图片
// /admin/product/spuImageList/{spuId}   GET
export const reqSpuImgList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'GET'
})

// 获取平台全部的销售属性（一共3个）
// /admin/product/baseSaleAttrList   GET
export const reqBaseSaleAttrList = () => request({
  url: "/admin/product/baseSaleAttrList",
  method: "GET"
})

// 修改spu/添加spu的接口，他们的参数大致一样，唯一的区别是参数中是否带id
export const reqAddOrUpadteSpu = (spuInfo) => {
  if (spuInfo.id) {
    // 携带的参数带有id-----修改spu
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'POST',
      data: spuInfo
    })
  } else {
    // 携带的参数没有id-----添加spu
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'POST',
      data: spuInfo
    })
  }
}

// 删除spu的接口
// /admin/product/deleteSpu/{spuId}   DELETE
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'DELETE'
})

// 获取spu的销售属性
// /admin/product/spuSaleAttrList/{spuId}  GET
export const reqSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method: 'GET'
})

// 保存sku
// /admin/product/saveSkuInfo  POST
export const reqSaveSku = (skuInfo) => request({
  url: '/admin/product/saveSkuInfo',
  method: 'POST',
  data: skuInfo
})

// 获取sku列表
// /admin/product/findBySpuId/{spuId}  GET
export const reqSkuList = (spuId) => request({
  url: `/admin/product/findBySpuId/${spuId} `,
  method: 'GET'
})