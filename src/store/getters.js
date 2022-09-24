const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
//4.在getters.js中添加 roles buttons routes
  roles: state => state.user.roles,  ////保存用户角色身份权限信息
  buttons: state => state.user.buttons, ////保存按钮操作权限信息
  routes: state => state.user.routes //最终形成展示菜单
  //5.在侧边栏 layout文件夹下Sidbar组件里的index.vue文件中修改
}
export default getters


