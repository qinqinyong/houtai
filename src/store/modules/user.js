import { login, logout, getInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

import { resetRouter, constantRoutes, allAsyncRoutes, anyRoute } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

//创建一个方法，从所有的异步路由中筛选出用户拥有的异步路由
//利用返回的异步路由名称数组
function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  let asyncRoutes = allAsyncRoutes.filter((item) => {
    // 先过滤父路由
    if (routeNames.indexOf(item.name) !== -1) {
      // 再过滤子路由  子路由存在，且大于0
      if (item.children && item.children.length) {
        //过滤出子路由把原本的子路由替换掉 因此传参时要深克隆，才不会影响下次登录菜单
        item.children = filterAsyncRoutes(item.children, routeNames)
      }
      return true
    }
  })
  return asyncRoutes
}


const getDefaultState = () => {
  return {
    token: getToken(),  //登录后的token先从cookies中获取，获取不到再登录第一次设置
    name: '', //获取用户信息后储存用户的名称
    avatar: '',//获取用户信息后储存用户的头像

    roles: [], //保存用户角色身份权限信息
    buttons: [],//保存按钮操作权限信息
    asyncRoutes: [],//保存用户异步路由
    routes: [] //最终用户要使用的所有路由包括 常量，异步，任意 最终形成展示菜单

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    //  Object.assign() 方法是合并复制 把第二个参数对象的属性 复制合并到第一个参数对象当中
    Object.assign(state, getDefaultState())
  },
  // 存储用户token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 获取用户信息后设置用户信息
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name
    state.avatar = userInfo.avatar

    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
  },

  // 用户的异步路由
  SET_ROUTES(state, asyncRoutes) {
    //1. 用户的异步路由
    state.asyncRoutes = asyncRoutes

    // 2.用户最终的路由: 把常量路由和用户的异步路由以及其它路由拼接  形成展示菜单
    state.routes = constantRoutes.concat(asyncRoutes, anyRoute)

    //3.路由器当中目前还是只有常量路由，那么我们需要动态的给路由器当中添加路由
    //动态给路由器添加路由，参数必须是符合路由器配置的数组
    //利用路由器的方法 (异步路由数组元素是多个对象必须展开，其它路由只是一个对象)
    router.addRoutes([...asyncRoutes, anyRoute])

    // 4.在getters.js中添加 roles buttons routes
  }

}

const actions = {

  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token) //提交第一次设置token
  //       setToken(data.token)  //存储token到cookies当中
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      let token = result.data.token
      commit('SET_TOKEN', token) //提交第一次设置token
      setToken(token) //存储token到cookies当中
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // 获取用户信息
  async getInfo({ commit }) {
    const result = await getInfo()
    if (result.code === 20000) {
      const data = result.data
      commit('SET_USERINFO', data)
      commit('SET_ROUTES', filterAsyncRoutes(cloneDeep(allAsyncRoutes), data.routes))
    }else {
      return Promise.reject(new Error('failed'))
    }
  },


  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }
  //       // const { name, avatar } = data
  //       // commit('SET_NAME', name)
  //       // commit('SET_AVATAR', avatar)

  //       commit('SET_USERINFO', data)
  //       // commit('SET_ROUTES',data.routes) //这个数组保存的只是名称的字符串，不是真正的路径
  //       // 因为filterAsyncRoutes函数把原本异步路由过滤了一部分，原本的子路由不在了，
  //       //你拿到的是一份残缺的子路由，和上次登录的用户是一样的
  //       //所以在过滤的时候，必须把所有的异步路由做深拷贝，然后再操作，这样就不会影响原有的
  //       commit('SET_ROUTES',filterAsyncRoutes(cloneDeep(allAsyncRoutes), data.routes) ) 
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },


  // user 退出登录
 
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

