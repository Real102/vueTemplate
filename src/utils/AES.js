import CryptoJS from 'crypto-js'
/**
 * 说明：在使用的地方 import AES from "@/scripts/utils/AES.js";
 */
export default {
  // 随机生成指定数量的16进制key
  generatekey(num) {
    const library = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let key = ''
    for (let i = 0; i < num; i++) {
      const randomPoz = Math.floor(Math.random() * library.length)
      key += library.substring(randomPoz, randomPoz + 1)
    }
    return key
  },

  // 加密
  encrypt(word, keyStr) {
    keyStr = keyStr || '65a8ef43384c4dd7' // 判断是否存在ksy，不存在就用定义好的key
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString()
  },
  // 解密
  decrypt(word, keyStr) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    keyStr = keyStr || '65a8ef43384c4dd7'
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const decrypt = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  }
}
