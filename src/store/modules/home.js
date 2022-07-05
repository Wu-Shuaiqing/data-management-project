import mockRequest from '@/utils/mockRequest'

const state = {
  list: {}
};
const mutations = {
  GETDATA(state, payload) {
    state.list = payload
  }
};
const actions = {
  // 发请求获取首页的mock数据
  async getData(context) {
    let result = await mockRequest.get('/home/list')
    if (result.code === 20000) {
      context.commit('GETDATA', result.data)
    }
  }
};
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters
}