import Cookies from 'js-cookie'  //js-cookie第三方库，可以简化cookies的操作

const TokenKey = 'vue_admin_template_token'

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
