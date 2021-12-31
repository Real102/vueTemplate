// 方法一：存储在cookie
// import Cookies from 'js-cookie'
// import { TOKEN_KEY } from '@/setting.js'

// export function getToken() {
//  return Cookies.get(TOKEN_KEY)
// }

// export function setToken(token) {
//   return Cookies.set(TOKEN_KEY, token)
// }

// export function removeToken() {
//   return Cookies.remove(TOKEN_KEY)
// }

// 方法二：存储在localstorage
import { TOKEN_KEY } from '@/setting.js'
const storage = window.localStorage
export function getToken() {
  return storage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  return storage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  return storage.removeItem(TOKEN_KEY)
}
