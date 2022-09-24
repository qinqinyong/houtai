import store from "@/store";

// 判断按钮是否有权限相关的字符串

//按钮的权限在菜单管理的权限值那列已经提前设置
//用户有了这个按钮的权，那么这个用户返回的buttons就包括这个权限字符串
export function hasBtnPermission(str){
    // 先从vuex拿到后台返回的buttons数据
    let buttons = store.getters.buttons
    return buttons.indexOf(str) !== -1
}

// 最后在main.js文件中把方法挂载在vue原型上