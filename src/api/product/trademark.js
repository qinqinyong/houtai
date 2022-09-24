import request from '@/utils/request'

export default {

  // POST /admin/product/baseTrademark/save   //添加新的品牌
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update  //修改品牌
  // 修改BaseTrademark
  // 增加品牌和修改品牌 最终都需要传递这样一个对象 请求体参数
  // {
  //   "id": 0,   // 以后增加新的品牌是不需要id的  而修改一个品牌是需要id的
  //   "logoUrl": "string",
  //   "tmName": "string"
  // }

  addOrUpdate(trademark) {
    //根据id来决定这个请求函数是添加还是修改
    if (trademark.id) {
      return request.put('/admin/product/baseTrademark/update', trademark)  //改
    } else {
      return request.post('/admin/product/baseTrademark/save', trademark)   //添加
    }
  },


  // 查  获取分页列表
  reqPageList(page, limit) {
    return request({
      url: `/admin/product/baseTrademark/${page}/${limit}`,
      method: 'get'
    })
  },



  // 删
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  ///GET admin/product/baseTrademark/getTrademarkList   获取所有的品牌列表
  getList() {
    return request.get('admin/product/baseTrademark/getTrademarkList')
  }


}