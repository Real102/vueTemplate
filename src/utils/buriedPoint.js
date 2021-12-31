/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2021-08-02 12:03:25
 * @modify date 2021-10-25 11:30:49
 * @desc 数据埋点
 */

/**
 * @desc 提交数据埋点方法
 * @param {string} signId 菜单标识（页面名称或按钮名称，后端定义，需要用映射表映射对应值），参见接口文档
 * @param {number} type 埋点类型，分为页面访问(value = 1，default)和按钮点击(value = 2)
 * @param {string} userId 用户id
 * @param {number} terminalType 用户终端，指移动端(value = 2)、pc端(value = 1)
 * @param {string} browser 浏览器中文名
 * @param {string} url 页面地址
 * @use 通过全局方法使用：this.$submitBuriedPoint(signId, type)；或者单独import后使用submitBuriedPoint(signId, type)
 */
export const submitBuriedPoint = (signId, type = 'page') => {
  const url = signId
  signId = mappingList[signId] || signId
  const ua = navigator.userAgent
  const userId = 0
  const isMobile =
    ua.match(
      /iphone|android|phone|mobile|wap|netfront|x11|java|opera mobi|opera mini|ucweb|windows ce|symbian|symbianos|series|webos|sony|blackberry|dopod|nokia|samsung|palmsource|xda|pieplus|meizu|midp|cldc|motorola|foma|docomo|up.browser|up.link|blazer|helio|hosin|huawei|novarra|coolpad|webos|techfaith|palmsource|alcatel|amoi|ktouch|nexian|ericsson|philips|sagem|wellcom|bunjalloo|maui|smartphone|iemobile|spice|bird|zte-|longcos|pantech|gionee|portalmmm|jig browser|hiptop|benq|haier|^lct|320x320|240x320|176x220/i
    ) != null
  const terminalType = isMobile ? 2 : 1
  const browser = getUA(ua)
  // TODO: 数据埋点服务是单独一个服务的，因此URL跟其他的需要区分开单独处理
  // 按项目实际情况做调整
  const targetUrl =
    process.env.VUE_APP_ENV === 'stage'
      ? 'cmic-event-tracking-test/tracking/add'
      : 'cmic-event-tracking/tracking/add'
  const formData = new FormData()
  formData.append('signId', signId)
  formData.append('type', type)
  formData.append('userId', userId)
  formData.append('terminalType', terminalType)
  formData.append('browser', browser)
  formData.append('url', url)
  // sendBeacon不兼容IE浏览器，因此需要做一层处理
  if (navigator.sendBeacon) {
    // sendBeacon优势：在浏览器关闭前发送的请求仍可到达后端，而xhr不能
    navigator.sendBeacon(targetUrl, formData)
  } else {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', targetUrl)
    xhr.send(formData)
  }
}

function getUA(e) {
  // 数据来源：https://www.zhihu.com/question/264919130
  if (e.match(/FireFox\/([^\s]+)/gi)) {
    return '火狐浏览器'
  } else if (e.match(/Edg([\d]*)\/([^\s]+)/gi)) {
    return 'Edge浏览器'
  } else if (e.match(/Maxthon([\d]*)\/([^\s]+)/gi)) {
    return 'Maxthon'
  } else if (e.match(/BIDUBrowser([\d]*)\/([^\s]+)/gi)) {
    return '百度浏览器'
  } else if (e.match(/UBrowser([\d]*)\/([^\s]+)/gi)) {
    return 'UC浏览器'
  } else if (e.match(/UCBrowser([\d]*)\/([^\s]+)/gi)) {
    return 'UC浏览器'
  } else if (e.match(/MetaSr/gi)) {
    return '搜狗浏览器'
  } else if (e.match(/2345Explorer/gi)) {
    return '2345王牌浏览器'
  } else if (e.match(/2345chrome/gi)) {
    return '2345加速浏览器'
  } else if (e.match(/LBBROWSER/gi)) {
    return '猎豹安全浏览器'
  } else if (e.match(/MicroMessenger\/([^\s]+)/gi)) {
    return '微信内置浏览器'
  } else if (e.match(/QQBrowser\/([^\s]+)/gi)) {
    return 'QQ浏览器'
  } else if (e.match(/QQ\/([^\s]+)/gi)) {
    return 'QQ浏览器'
  } else if (e.match(/MiuiBrowser\/([^\s]+)/gi)) {
    return '小米浏览器'
  } else if (e.match(/Chrome([\d]*)\/([^\s]+)/gi)) {
    return '谷歌浏览器'
  } else if (e.match(/safari\/([^\s]+)/gi)) {
    return 'Safari浏览器'
  } else if (e.match(/Opera[\s|/]([^\s]+)/gi)) {
    return 'Opera浏览器'
  } else if (e.match(/Trident\/7.0/gi)) {
    return 'IE浏览器'
  } else if (e.match(/MSIE\s([^\s|;]+)/gi)) {
    return 'IE浏览器'
  } else {
    return '其他浏览器'
  }
}

const mappingList = {
  // TODO: 路由守卫提交的埋点
  // 映射list，根据项目需求做相应调整
  '/home': 'home_page_html',
  '/person': 'my_center_page_html',
  '/5g-innovate/1': 'ai_power_page_html',
  '/5g-innovate/2': 'ct_power_page_html',
  '/5g-innovate/3': 'chatbot_power_page_html',
  '/5g-innovate/4': 'pay_power_page_html',
  '/subscriptions': 'tool_page_html',
  '/login': 'login_page_html',
  '/reset': 'account_validation',
  '/appeal': 'account_appeal',
  '/register': 'accounts_register',
  '/about': 'about_us_page_html',
  '/pending': '',
  '/blankpage': '',
  '/404': ''
}

export default {
  install(Vue) {
    Vue.prototype.$submitBuriedPoint = (signId = '', type = 1) => {
      submitBuriedPoint(signId, type)
    }
  }
}
