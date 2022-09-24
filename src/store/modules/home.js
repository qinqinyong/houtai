import mockRequest from '@/utils/mockRequest'

const state = {
    list:{}
}
 

const mutations = {
    RECEIVE_LIST(state,list){
        state.list=list
    }
}

const actions = {
  async getData({commit}){
    let result = await mockRequest.get('/home/list')
    if (result.code===20000) {
        commit('RECEIVE_LIST',result.data)
    }
  }
}

export default {
  state,
  mutations,
  actions
}

